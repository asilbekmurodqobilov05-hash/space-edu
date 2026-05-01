"""
Admin API — exposes dashboard stats + CRUD endpoints for all major models.
All views require `is_staff` or `is_superuser`.
"""
from datetime import timedelta

from django.db.models import Count, Sum, Q, Max
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.courses.models import Sphere, Topic, TopicLesson, Problem
from apps.gamification.models import Badge, UserGamificationProfile, RewardProduct
from apps.market.models import MarketItem, MarketCategory
from apps.news.models import NewsArticle
from apps.events.models import SpaceEvent
from apps.challenges.models import ChallengeQuestion, DailyChallenge, UserChallengeResult
from apps.chat.models import ChatRoom, ChatMessage, Conversation, DirectMessage
from apps.progress.models import UserLessonProgress


# ═══════════════════════════════════════════════════════════════════
#  DASHBOARD STATS
# ═══════════════════════════════════════════════════════════════════
class DashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        total_users = User.objects.count()
        new_users_week = User.objects.filter(date_joined__gte=week_ago).count()
        new_users_month = User.objects.filter(date_joined__gte=month_ago).count()

        return Response({
            'users': {
                'total': total_users,
                'new_week': new_users_week,
                'new_month': new_users_month,
                'staff_count': User.objects.filter(is_staff=True).count(),
            },
            'content': {
                'spheres': Sphere.objects.count(),
                'topics': Topic.objects.count(),
                'lessons': TopicLesson.objects.count(),
                'problems': Problem.objects.count(),
                'challenge_questions': ChallengeQuestion.objects.count(),
            },
            'market': {
                'items': MarketItem.objects.count(),
                'categories': MarketCategory.objects.count(),
                'reward_products': RewardProduct.objects.count(),
            },
            'community': {
                'news_articles': NewsArticle.objects.count(),
                'space_events': SpaceEvent.objects.count(),
                'chat_rooms': ChatRoom.objects.count(),
                'chat_messages': ChatMessage.objects.count(),
                'dm_conversations': Conversation.objects.count(),
                'dm_messages': DirectMessage.objects.count(),
            },
            'gamification': {
                'badges': Badge.objects.count(),
                'challenges_completed_week': UserChallengeResult.objects.filter(
                    completed_at__gte=week_ago
                ).count(),
            },
            'recent_users': list(
                User.objects.order_by('-date_joined')[:10].values(
                    'id', 'username', 'first_name', 'last_name', 'email',
                    'date_joined', 'is_staff', 'is_active',
                )
            ),
        })


# ═══════════════════════════════════════════════════════════════════
#  GENERIC CRUD HELPER
# ═══════════════════════════════════════════════════════════════════
def _serialize_user(u):
    return {
        'id': u.id, 'username': u.username, 'first_name': u.first_name,
        'last_name': u.last_name, 'email': u.email, 'is_staff': u.is_staff,
        'is_active': u.is_active, 'date_joined': u.date_joined,
        'date_of_birth': u.date_of_birth, 'language': u.language,
        'astronaut_name': u.astronaut_name, 'bio': u.bio,
    }


class UsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        qs = User.objects.all().order_by('-date_joined')
        if q:
            qs = qs.filter(
                Q(username__icontains=q) | Q(first_name__icontains=q) |
                Q(last_name__icontains=q) | Q(email__icontains=q)
            )
        return Response([_serialize_user(u) for u in qs[:100]])


class UserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        try:
            u = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        data = _serialize_user(u)
        # Add gamification
        try:
            g = u.gamification
            data['gamification'] = {'xp': g.xp, 'level': g.level, 'fuel': g.fuel, 'streak': g.streak}
        except Exception:
            data['gamification'] = None
        return Response(data)

    def patch(self, request, pk):
        try:
            u = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        allowed = ['first_name', 'last_name', 'is_staff', 'is_active', 'astronaut_name', 'bio', 'language']
        for field in allowed:
            if field in request.data:
                setattr(u, field, request.data[field])
        u.save()
        return Response(_serialize_user(u))

    def delete(self, request, pk):
        try:
            u = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        if u.is_superuser:
            return Response({'detail': 'Cannot delete superuser.'}, status=400)
        u.delete()
        return Response(status=204)


# ═══════════════════════════════════════════════════════════════════
#  NEWS CRUD
# ═══════════════════════════════════════════════════════════════════
def _serialize_news(n):
    return {
        'id': n.id, 'title_en': n.title_en, 'title_uz': n.title_uz, 'title_ru': n.title_ru,
        'summary_en': n.summary_en, 'summary_uz': n.summary_uz, 'summary_ru': n.summary_ru,
        'content_en': n.content_en, 'content_uz': n.content_uz, 'content_ru': n.content_ru,
        'category': n.category, 'source': n.source, 'source_url': n.source_url,
        'is_published': n.is_published, 'published_at': n.published_at,
        'image': n.image.url if n.image else None,
    }


class NewsListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([_serialize_news(n) for n in NewsArticle.objects.all()[:100]])

    def post(self, request):
        d = request.data
        n = NewsArticle.objects.create(
            title_en=d.get('title_en', ''), title_uz=d.get('title_uz', ''), title_ru=d.get('title_ru', ''),
            summary_en=d.get('summary_en', ''), summary_uz=d.get('summary_uz', ''), summary_ru=d.get('summary_ru', ''),
            content_en=d.get('content_en', ''), content_uz=d.get('content_uz', ''), content_ru=d.get('content_ru', ''),
            category=d.get('category', 'science'), source=d.get('source', ''), source_url=d.get('source_url', ''),
            is_published=d.get('is_published', True),
        )
        return Response(_serialize_news(n), status=201)


class NewsDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            n = NewsArticle.objects.get(pk=pk)
        except NewsArticle.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        fields = ['title_en','title_uz','title_ru','summary_en','summary_uz','summary_ru',
                   'content_en','content_uz','content_ru','category','source','source_url','is_published']
        for f in fields:
            if f in request.data:
                setattr(n, f, request.data[f])
        n.save()
        return Response(_serialize_news(n))

    def delete(self, request, pk):
        NewsArticle.objects.filter(pk=pk).delete()
        return Response(status=204)


# ═══════════════════════════════════════════════════════════════════
#  EVENTS CRUD
# ═══════════════════════════════════════════════════════════════════
def _serialize_event(e):
    return {
        'id': e.id, 'title_en': e.title_en, 'title_uz': e.title_uz, 'title_ru': e.title_ru,
        'description_en': e.description_en, 'description_uz': e.description_uz, 'description_ru': e.description_ru,
        'event_date': e.event_date, 'event_type': e.event_type, 'event_time': e.event_time,
        'is_featured': e.is_featured, 'is_historical': e.is_historical,
        'source_url': e.source_url, 'visibility': e.visibility,
        'image': e.image.url if e.image else None,
    }


class EventsListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([_serialize_event(e) for e in SpaceEvent.objects.all()[:100]])

    def post(self, request):
        d = request.data
        e = SpaceEvent.objects.create(
            title_en=d.get('title_en',''), title_uz=d.get('title_uz',''), title_ru=d.get('title_ru',''),
            description_en=d.get('description_en',''), description_uz=d.get('description_uz',''), description_ru=d.get('description_ru',''),
            event_date=d.get('event_date'), event_type=d.get('event_type','discovery'),
            event_time=d.get('event_time',''), is_featured=d.get('is_featured', False),
            is_historical=d.get('is_historical', False), source_url=d.get('source_url',''),
        )
        return Response(_serialize_event(e), status=201)


class EventDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            e = SpaceEvent.objects.get(pk=pk)
        except SpaceEvent.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        fields = ['title_en','title_uz','title_ru','description_en','description_uz','description_ru',
                   'event_date','event_type','event_time','is_featured','is_historical','source_url','visibility']
        for f in fields:
            if f in request.data:
                setattr(e, f, request.data[f])
        e.save()
        return Response(_serialize_event(e))

    def delete(self, request, pk):
        SpaceEvent.objects.filter(pk=pk).delete()
        return Response(status=204)


# ═══════════════════════════════════════════════════════════════════
#  CHALLENGE QUESTIONS CRUD
# ═══════════════════════════════════════════════════════════════════
def _serialize_question(q):
    return {
        'id': q.id, 'category': q.category, 'difficulty': q.difficulty,
        'question': q.question, 'question_en': q.question_en, 'question_ru': q.question_ru,
        'options': q.options, 'correct_answer': q.correct_answer,
        'explanation': q.explanation, 'time_seconds': q.time_seconds,
        'is_active': q.is_active,
    }


class QuestionsListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = ChallengeQuestion.objects.all()
        cat = request.query_params.get('category')
        if cat:
            qs = qs.filter(category=cat)
        return Response([_serialize_question(q) for q in qs[:200]])

    def post(self, request):
        d = request.data
        q = ChallengeQuestion.objects.create(
            category=d.get('category','general'), difficulty=d.get('difficulty','medium'),
            question=d.get('question',''), question_en=d.get('question_en',''), question_ru=d.get('question_ru',''),
            options=d.get('options',[]), correct_answer=d.get('correct_answer',0),
            explanation=d.get('explanation',''), time_seconds=d.get('time_seconds',60),
            is_active=d.get('is_active',True),
        )
        return Response(_serialize_question(q), status=201)


class QuestionDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            q = ChallengeQuestion.objects.get(pk=pk)
        except ChallengeQuestion.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)
        fields = ['category','difficulty','question','question_en','question_ru',
                   'options','correct_answer','explanation','time_seconds','is_active']
        for f in fields:
            if f in request.data:
                setattr(q, f, request.data[f])
        q.save()
        return Response(_serialize_question(q))

    def delete(self, request, pk):
        ChallengeQuestion.objects.filter(pk=pk).delete()
        return Response(status=204)


# ═══════════════════════════════════════════════════════════════════
#  COURSES (Spheres / Topics / Lessons)
# ═══════════════════════════════════════════════════════════════════
class SpheresListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = []
        for s in Sphere.objects.prefetch_related('topics').all():
            data.append({
                'id': s.id, 'slug': s.slug, 'title': s.title, 'title_en': s.title_en,
                'is_active': s.is_active, 'order': s.order, 'color': s.color,
                'topics_count': s.topics.count(),
                'lessons_count': sum(t.lessons.count() for t in s.topics.all()),
            })
        return Response(data)

    def post(self, request):
        d = request.data
        order = d.get('order')
        if order is None or str(order).strip() == '':
            max_order = Sphere.objects.aggregate(Max('order'))['order__max']
            order = (max_order or 0) + 1
        else:
            order = int(order)
            
        s = Sphere.objects.create(
            slug=d.get('slug', ''), title=d.get('title', ''), title_en=d.get('title_en', ''),
            title_ru=d.get('title_ru', ''), description=d.get('description', ''), description_en=d.get('description_en', ''),
            color=d.get('color', '#a78bfa'), icon=d.get('icon', 'BookOpen'), link=d.get('link', ''),
            order=order, is_active=d.get('is_active', True)
        )
        return Response({'id': s.id, 'slug': s.slug, 'title': s.title, 'title_en': s.title_en, 'is_active': s.is_active, 'order': s.order, 'color': s.color}, status=201)

class SphereDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            s = Sphere.objects.get(pk=pk)
        except Sphere.DoesNotExist:
            return Response(status=404)
        for f in ['slug', 'title', 'title_en', 'title_ru', 'description', 'description_en', 'color', 'icon', 'link', 'order', 'is_active']:
            if f in request.data: setattr(s, f, request.data[f])
        s.save()
        return Response({'id': s.id, 'slug': s.slug, 'title': s.title, 'title_en': s.title_en, 'is_active': s.is_active, 'order': s.order, 'color': s.color})

    def delete(self, request, pk):
        Sphere.objects.filter(pk=pk).delete()
        return Response(status=204)

class TopicListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Topic.objects.all()
        sphere_id = request.query_params.get('sphere_id')
        if sphere_id: qs = qs.filter(sphere_id=sphere_id)
        return Response([{'id': t.id, 'sphere_id': t.sphere_id, 'title': t.title, 'title_en': t.title_en, 'order': t.order, 'color': t.color} for t in qs])

    def post(self, request):
        d = request.data
        order = d.get('order')
        if order is None or str(order).strip() == '':
            max_order = Topic.objects.filter(sphere_id=d.get('sphere_id')).aggregate(Max('order'))['order__max']
            order = (max_order or 0) + 1
        else:
            order = int(order)
            
        t = Topic.objects.create(
            sphere_id=d.get('sphere_id'), title=d.get('title', ''), title_en=d.get('title_en', ''),
            title_ru=d.get('title_ru', ''), color=d.get('color', ''), description=d.get('description', ''),
            order=order
        )
        return Response({'id': t.id, 'sphere_id': t.sphere_id, 'title': t.title, 'title_en': t.title_en, 'order': t.order, 'color': t.color}, status=201)

class TopicDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            t = Topic.objects.get(pk=pk)
        except Topic.DoesNotExist:
            return Response(status=404)
        for f in ['sphere_id', 'title', 'title_en', 'title_ru', 'color', 'description', 'order']:
            if f in request.data: setattr(t, f, request.data[f])
        t.save()
        return Response({'id': t.id, 'sphere_id': t.sphere_id, 'title': t.title, 'title_en': t.title_en, 'order': t.order, 'color': t.color})

    def delete(self, request, pk):
        Topic.objects.filter(pk=pk).delete()
        return Response(status=204)

class TopicLessonListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = TopicLesson.objects.all()
        topic_id = request.query_params.get('topic_id')
        if topic_id: qs = qs.filter(topic_id=topic_id)
        return Response([{'id': l.id, 'topic_id': l.topic_id, 'name': l.name, 'name_en': l.name_en, 'order': l.order, 'video_url': l.video_url} for l in qs])

    def post(self, request):
        d = request.data
        order = d.get('order')
        if order is None or str(order).strip() == '':
            max_order = TopicLesson.objects.filter(topic_id=d.get('topic_id')).aggregate(Max('order'))['order__max']
            order = (max_order or 0) + 1
        else:
            order = int(order)
            
        l = TopicLesson.objects.create(
            topic_id=d.get('topic_id'), name=d.get('name', ''), name_en=d.get('name_en', ''),
            name_ru=d.get('name_ru', ''), video_url=d.get('video_url', ''), content=d.get('content', ''),
            order=order
        )
        return Response({'id': l.id, 'topic_id': l.topic_id, 'name': l.name, 'name_en': l.name_en, 'order': l.order, 'video_url': l.video_url}, status=201)

class TopicLessonDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            l = TopicLesson.objects.get(pk=pk)
        except TopicLesson.DoesNotExist:
            return Response(status=404)
        for f in ['topic_id', 'name', 'name_en', 'name_ru', 'video_url', 'content', 'order']:
            if f in request.data: setattr(l, f, request.data[f])
        l.save()
        return Response({'id': l.id, 'topic_id': l.topic_id, 'name': l.name, 'name_en': l.name_en, 'order': l.order, 'video_url': l.video_url})

    def delete(self, request, pk):
        TopicLesson.objects.filter(pk=pk).delete()
        return Response(status=204)

# ═══════════════════════════════════════════════════════════════════
#  MARKET ITEMS CRUD
# ═══════════════════════════════════════════════════════════════════
def _serialize_market_item(m):
    return {
        'id': m.id, 'slug': m.slug, 'title_en': m.title_en, 'title_uz': m.title_uz,
        'item_type': m.item_type, 'price': m.price, 'cost_fuel': m.cost_fuel,
        'stock': m.stock, 'is_active': m.is_active, 'is_bestseller': m.is_bestseller
    }

class MarketItemListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([_serialize_market_item(m) for m in MarketItem.objects.all()[:100]])

    def post(self, request):
        d = request.data
        m = MarketItem.objects.create(
            slug=d.get('slug', ''), title_en=d.get('title_en', ''), title_uz=d.get('title_uz', ''),
            title_ru=d.get('title_ru', ''), description_en=d.get('description_en', ''),
            description_uz=d.get('description_uz', ''), description_ru=d.get('description_ru', ''),
            item_type=d.get('item_type', 'other'), price=int(d.get('price') or 0), cost_fuel=int(d.get('cost_fuel') or 0),
            stock=int(d.get('stock') or 0), is_active=d.get('is_active', True), is_bestseller=d.get('is_bestseller', False)
        )
        return Response(_serialize_market_item(m), status=201)

class MarketItemDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            m = MarketItem.objects.get(pk=pk)
        except MarketItem.DoesNotExist:
            return Response(status=404)
        fields = ['slug', 'title_en', 'title_uz', 'title_ru', 'description_en', 'description_uz', 'description_ru',
                  'item_type', 'price', 'cost_fuel', 'stock', 'is_active', 'is_bestseller']
        for f in fields:
            if f in request.data: setattr(m, f, request.data[f])
        m.save()
        return Response(_serialize_market_item(m))

    def delete(self, request, pk):
        MarketItem.objects.filter(pk=pk).delete()
        return Response(status=204)

class ChatRoomsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        rooms = ChatRoom.objects.annotate(msg_count=Count('messages'))
        return Response([
            {'id': r.id, 'slug': r.slug, 'name': r.name, 'is_global': r.is_global, 'messages': r.msg_count}
            for r in rooms
        ])

    def post(self, request):
        d = request.data
        r = ChatRoom.objects.create(
            slug=d.get('slug',''), name=d.get('name',''), is_global=d.get('is_global', True)
        )
        return Response({'id': r.id, 'slug': r.slug, 'name': r.name, 'is_global': r.is_global}, status=201)

# ═══════════════════════════════════════════════════════════════════
#  MISSIONS CRUD
# ═══════════════════════════════════════════════════════════════════
def _serialize_mission(m):
    return {
        'id': m.id, 'slug': m.slug, 'title_en': m.title_en, 'title_uz': m.title_uz, 'title_ru': m.title_ru,
        'description_en': m.description_en, 'description_uz': m.description_uz, 'description_ru': m.description_ru,
        'mission_type': m.mission_type, 'target_value': m.target_value, 'reward_xp': m.reward_xp, 'reward_fuel': m.reward_fuel,
        'is_active': m.is_active, 'is_daily': m.is_daily, 'order': m.order,
    }

class MissionsListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([_serialize_mission(m) for m in apps.gamification.models.Mission.objects.all().order_by('order')])

    def post(self, request):
        import apps.gamification.models as gm
        d = request.data
        m = gm.Mission.objects.create(
            slug=d.get('slug', ''), title_en=d.get('title_en', ''), title_uz=d.get('title_uz', ''), title_ru=d.get('title_ru', ''),
            description_en=d.get('description_en', ''), description_uz=d.get('description_uz', ''), description_ru=d.get('description_ru', ''),
            mission_type=d.get('mission_type', 'custom'), target_value=int(d.get('target_value') or 1),
            reward_xp=int(d.get('reward_xp') or 0), reward_fuel=int(d.get('reward_fuel') or 10),
            is_active=d.get('is_active', True), is_daily=d.get('is_daily', False), order=int(d.get('order') or 0)
        )
        return Response(_serialize_mission(m), status=201)

class MissionDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        import apps.gamification.models as gm
        try:
            m = gm.Mission.objects.get(pk=pk)
        except gm.Mission.DoesNotExist:
            return Response(status=404)
        fields = ['slug', 'title_en', 'title_uz', 'title_ru', 'description_en', 'description_uz', 'description_ru',
                  'mission_type', 'target_value', 'reward_xp', 'reward_fuel', 'is_active', 'is_daily', 'order']
        for f in fields:
            if f in request.data: setattr(m, f, request.data[f])
        m.save()
        return Response(_serialize_mission(m))

    def delete(self, request, pk):
        import apps.gamification.models as gm
        gm.Mission.objects.filter(pk=pk).delete()
        return Response(status=204)
