"""Regression tests for findings from the 2026-08-22 audit."""
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import MarketItem, UserInventory


def _item(slug='ship', cost_fuel=50, **over):
    data = dict(
        slug=slug,
        title_en='Ship', title_uz='Kema', title_ru='Корабль',
        description_en='d', description_uz='d', description_ru='d',
        item_type='spaceship', price=1000, cost_fuel=cost_fuel,
    )
    data.update(over)
    return MarketItem.objects.create(**data)


class QueryParamValidationTests(TestCase):
    """Finding: int()/float() were applied to raw query params with no guard, so
    ?min_price=abc raised ValueError -> 500 on an anonymous request. Under the
    settings-fail-open bug this also rendered Django's debug page with SECRET_KEY."""

    def setUp(self):
        _item()
        self.anon = APIClient()

    def test_non_numeric_min_price_is_a_400_not_a_500(self):
        r = self.anon.get('/api/v1/market/items/?min_price=abc')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_integer_max_fuel_is_a_400_not_a_500(self):
        r = self.anon.get('/api/v1/market/items/?max_fuel=1.5')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_numeric_min_rating_is_a_400_not_a_500(self):
        r = self.anon.get('/api/v1/market/items/?min_rating=xyz')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_out_of_range_price_does_not_500(self):
        r = self.anon.get('/api/v1/market/items/?min_price=99999999999999999999')
        self.assertLess(r.status_code, 500)

    def test_valid_filters_still_work(self):
        r = self.anon.get('/api/v1/market/items/?min_price=10&max_price=5000')
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class ReviewRatingTests(TestCase):
    """Finding: ItemReview.rating was a PositiveSmallIntegerField documented as
    '1-5 stars' with no validator, and the write serializer passed it through, so
    an owner could set the public rating_avg to 32767."""

    def setUp(self):
        self.item = _item()
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        UserInventory.objects.create(user=self.user, item=self.item)
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def _review(self, rating):
        return self.client.post(
            f'/api/v1/market/items/{self.item.slug}/review/', {'rating': rating}, format='json'
        )

    def test_rating_above_five_is_rejected(self):
        self.assertEqual(self._review(32767).status_code, status.HTTP_400_BAD_REQUEST)
        self.item.refresh_from_db()
        self.assertEqual(self.item.rating_avg, 0.0)

    def test_rating_of_zero_is_rejected(self):
        self.assertEqual(self._review(0).status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_rating_is_accepted_and_cached(self):
        r = self._review(4)
        self.assertIn(r.status_code, (status.HTTP_200_OK, status.HTTP_201_CREATED))
        self.item.refresh_from_db()
        self.assertEqual(self.item.rating_avg, 4.0)
        self.assertEqual(self.item.rating_count, 1)

    def test_deleting_a_review_recomputes_the_cached_rating(self):
        """Finding: rating_avg was only recomputed in save(), so a deleted review
        kept dragging the public average."""
        from .models import ItemReview

        self._review(1)
        ItemReview.objects.filter(user=self.user, item=self.item).delete()
        self.item.refresh_from_db()
        self.assertEqual(self.item.rating_count, 0)
        self.assertEqual(self.item.rating_avg, 0.0)


class PurchaseTests(TestCase):
    """Finding: PurchaseView read the balance outside the lock and incremented
    sold_count with a read-modify-write."""

    def setUp(self):
        self.item = _item(cost_fuel=80)
        self.other = _item(slug='ship2', cost_fuel=80)
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        profile = self.user.gamification
        profile.fuel = 100
        profile.save(update_fields=['fuel'])
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_cannot_overspend_across_two_items(self):
        first = self.client.post(
            '/api/v1/market/purchase/', {'item_slug': 'ship'}, format='json'
        )
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        second = self.client.post(
            '/api/v1/market/purchase/', {'item_slug': 'ship2'}, format='json'
        )
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UserInventory.objects.filter(user=self.user).count(), 1)

    def test_sold_count_increments(self):
        self.client.post('/api/v1/market/purchase/', {'item_slug': 'ship'}, format='json')
        self.item.refresh_from_db()
        self.assertEqual(self.item.sold_count, 1)
