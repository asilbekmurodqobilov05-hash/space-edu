"""Ticket B1 — the moderation floor for a chat used by 10-to-18-year-olds.

The app shipped a public room and private messaging with no screening, no
reporting, no blocking, no moderator delete, no rate limit and no consent step,
and any account could find any other by a two-character name search.

Every test here names the hole it closes. The list is the floor, not the
ceiling: none of this replaces a human reading the report queue.
"""
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import ChatMessage, ChatRoom, Conversation, DirectMessage, MessageReport, UserBlock
from .moderation import contains_profanity, find_profanity, normalise


def _client(user=None):
    client = APIClient()
    if user:
        client.force_authenticate(user)
    return client


class ProfanityFilterTests(TestCase):
    """There was no filter at all."""

    def test_it_catches_the_plain_case_in_three_languages(self):
        for text in ('you are a bitch', 'иди на хуй', 'jalab'):
            self.assertTrue(contains_profanity(text), text)

    def test_it_catches_spacing_and_punctuation_evasion(self):
        for text in ('f u c k you', 'f.u.c.k', 'b-i-t-c-h', 's h i t'):
            self.assertTrue(contains_profanity(text), text)

    def test_it_catches_character_substitution(self):
        for text in ('sh1t', 'b!tch', '$hit', '@sshole'):
            self.assertTrue(contains_profanity(text), text)

    def test_the_known_limit_is_a_swapped_vowel(self):
        """`f4ck` normalises to `fack`, and it is not caught.

        Catching it needs either a per-digit alternatives search or a
        consonant-skeleton match, and both cost false positives on ordinary
        Uzbek and Russian words — which in a children's product means telling a
        child they were abusive for writing something innocent. This test exists
        so the limit is a decision on the record rather than a surprise. The
        report queue is what covers what the filter misses.
        """
        self.assertFalse(contains_profanity('f4ck'))

    def test_it_catches_stretched_letters(self):
        self.assertTrue(contains_profanity('fuuuuuck'))

    def test_it_catches_a_stem_inside_a_longer_word(self):
        self.assertTrue(contains_profanity('fucking'))

    def test_ordinary_words_pass(self):
        for text in ('I assess the mass of Saturn',
                     'Kant wrote about the cosmos',
                     'the class starts at six',
                     'Konstantin Tsiolkovsky',
                     "bugun darsda nima o'rgandik"):
            self.assertFalse(contains_profanity(text), text)

    def test_normalise_does_not_collapse_ordinary_doubles(self):
        self.assertEqual(normalise('lesson'), 'lesson')

    def test_find_profanity_reports_the_stem_for_the_log(self):
        self.assertIn('shit', find_profanity('what a shitty lesson'))

    def test_an_empty_or_odd_value_does_not_raise(self):
        for value in ('', '   ', '😀😀😀', '12345'):
            self.assertFalse(contains_profanity(value))


class RoomMessageTests(TestCase):
    def setUp(self):
        cache.clear()
        self.room = ChatRoom.objects.create(slug='general', name='General')
        self.user = User.objects.create_user(username='aziz', email='a@e.com', password='x')
        self.other = User.objects.create_user(username='bek', email='b@e.com', password='x')
        self.staff = User.objects.create_user(
            username='mod', email='m@e.com', password='x', is_staff=True,
        )
        self.client = _client(self.user)

    def _post(self, content, client=None):
        return (client or self.client).post(
            f'/api/v1/chat/rooms/{self.room.slug}/messages/', {'content': content}, format='json',
        )

    def test_a_clean_message_posts(self):
        self.assertEqual(self._post('Salom, bugun darsda nima bor?').status_code,
                         status.HTTP_201_CREATED)

    def test_a_message_with_profanity_is_refused(self):
        r = self._post('you are a bitch')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(ChatMessage.objects.exists())

    def test_the_refusal_does_not_echo_the_word_back(self):
        """Echoing it makes the endpoint an oracle for probing the list, and
        quoting a slur back at a child has no good version."""
        r = self._post('you are a bitch')
        self.assertNotIn('bitch', str(r.data).lower())

    def test_a_hidden_message_disappears_from_the_room(self):
        self._post('this will be hidden')
        message = ChatMessage.objects.get()
        message.soft_delete(self.staff, 'test')
        r = self.client.get(f'/api/v1/chat/rooms/{self.room.slug}/messages/')
        self.assertEqual(r.data, [])

    def test_a_moderator_can_hide_someone_else_s_message(self):
        self._post('something to hide')
        message = ChatMessage.objects.get()
        r = _client(self.staff).delete(
            f'/api/v1/chat/rooms/{self.room.slug}/messages/{message.id}/',
        )
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        message.refresh_from_db()
        self.assertTrue(message.is_deleted)
        self.assertEqual(message.deleted_by, self.staff)

    def test_an_author_can_hide_their_own_message(self):
        self._post('my own message')
        message = ChatMessage.objects.get()
        r = self.client.delete(f'/api/v1/chat/rooms/{self.room.slug}/messages/{message.id}/')
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)

    def test_an_ordinary_user_cannot_hide_someone_else_s_message(self):
        self._post('not yours')
        message = ChatMessage.objects.get()
        r = _client(self.other).delete(
            f'/api/v1/chat/rooms/{self.room.slug}/messages/{message.id}/',
        )
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_deletion_is_soft_so_a_report_can_still_be_reviewed(self):
        """A hard delete would let the author erase the evidence against them."""
        self._post('something reportable')
        message = ChatMessage.objects.get()
        self.client.delete(f'/api/v1/chat/rooms/{self.room.slug}/messages/{message.id}/')
        self.assertTrue(ChatMessage.objects.filter(id=message.id).exists())

    def test_posting_is_rate_limited(self):
        """There was no limit, so one account could flood the room in a loop."""
        codes = [self._post(f'message number {i}').status_code for i in range(25)]
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codes)

    def test_reading_is_not_rate_limited_by_the_write_throttle(self):
        for _ in range(25):
            r = self.client.get(f'/api/v1/chat/rooms/{self.room.slug}/messages/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)


class BlockingTests(TestCase):
    def setUp(self):
        cache.clear()
        self.room = ChatRoom.objects.create(slug='general', name='General')
        self.me = User.objects.create_user(username='aziz', email='a@e.com', password='x')
        self.pest = User.objects.create_user(username='pest', email='p@e.com', password='x')
        self.client = _client(self.me)

    def _block(self):
        return self.client.post('/api/v1/chat/blocks/', {'user_id': self.pest.id}, format='json')

    def test_blocking_hides_their_messages_from_me(self):
        ChatMessage.objects.create(room=self.room, user=self.pest, content='hello there')
        self.assertEqual(self._block().status_code, status.HTTP_201_CREATED)
        r = self.client.get(f'/api/v1/chat/rooms/{self.room.slug}/messages/')
        self.assertEqual(r.data, [])

    def test_blocking_also_hides_my_messages_from_them(self):
        """A child should not have to explain themselves to make it stop, and a
        one-way block leaves the other party still reading."""
        ChatMessage.objects.create(room=self.room, user=self.me, content='my message')
        self._block()
        r = _client(self.pest).get(f'/api/v1/chat/rooms/{self.room.slug}/messages/')
        self.assertEqual(r.data, [])

    def test_everyone_else_still_sees_both(self):
        third = User.objects.create_user(username='c', email='c@e.com', password='x')
        ChatMessage.objects.create(room=self.room, user=self.pest, content='hello there')
        self._block()
        r = _client(third).get(f'/api/v1/chat/rooms/{self.room.slug}/messages/')
        self.assertEqual(len(r.data), 1)

    def test_blocking_twice_is_not_an_error(self):
        self.assertEqual(self._block().status_code, status.HTTP_201_CREATED)
        self.assertEqual(self._block().status_code, status.HTTP_200_OK)
        self.assertEqual(UserBlock.objects.count(), 1)

    def test_unblocking_brings_them_back(self):
        ChatMessage.objects.create(room=self.room, user=self.pest, content='hello there')
        self._block()
        r = self.client.delete(f'/api/v1/chat/blocks/{self.pest.id}/')
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            len(self.client.get(f'/api/v1/chat/rooms/{self.room.slug}/messages/').data), 1,
        )

    def test_you_cannot_block_yourself(self):
        r = self.client.post('/api/v1/chat/blocks/', {'user_id': self.me.id}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_an_unknown_user_is_404_not_500(self):
        r = self.client.post('/api/v1/chat/blocks/', {'user_id': 99999}, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_a_non_numeric_user_id_is_404_not_500(self):
        r = self.client.post('/api/v1/chat/blocks/', {'user_id': 'abc'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class ReportingTests(TestCase):
    def setUp(self):
        cache.clear()
        self.room = ChatRoom.objects.create(slug='general', name='General')
        self.author = User.objects.create_user(username='author', email='a@e.com', password='x')
        self.reporter = User.objects.create_user(username='rep', email='r@e.com', password='x')
        self.staff = User.objects.create_user(
            username='mod', email='m@e.com', password='x', is_staff=True,
        )
        self.message = ChatMessage.objects.create(
            room=self.room, user=self.author, content='something unpleasant',
        )
        self.client = _client(self.reporter)

    def _report(self, client=None, message_id=None):
        return (client or self.client).post(
            '/api/v1/chat/reports/',
            {'message_type': 'room', 'message_id': message_id or self.message.id,
             'reason': 'bullying', 'detail': 'he keeps doing this'},
            format='json',
        )

    def test_a_user_can_report_a_message(self):
        r = self._report()
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MessageReport.objects.count(), 1)

    def test_reporting_the_same_message_twice_is_refused(self):
        """A second click is not a second complaint, and counting it as one
        makes the queue useless."""
        self._report()
        self.assertEqual(self._report().status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(MessageReport.objects.count(), 1)

    def test_two_different_people_can_report_the_same_message(self):
        self._report()
        other = User.objects.create_user(username='o', email='o@e.com', password='x')
        self.assertEqual(self._report(client=_client(other)).status_code,
                         status.HTTP_201_CREATED)

    def test_reporting_an_unknown_message_is_404_not_500(self):
        self.assertEqual(self._report(message_id=99999).status_code, status.HTTP_404_NOT_FOUND)

    def test_a_bad_reason_is_rejected(self):
        r = self.client.post(
            '/api/v1/chat/reports/',
            {'message_type': 'room', 'message_id': self.message.id, 'reason': 'because'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_the_queue_is_staff_only(self):
        self._report()
        self.assertEqual(
            self.client.get('/api/v1/chat/reports/queue/').status_code, status.HTTP_403_FORBIDDEN,
        )

    def test_the_queue_shows_the_message_a_moderator_has_to_read(self):
        self._report()
        r = _client(self.staff).get('/api/v1/chat/reports/queue/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data[0]['content'], 'something unpleasant')
        self.assertEqual(r.data[0]['author_username'], 'author')

    def test_actioning_a_report_can_hide_the_message_in_one_step(self):
        self._report()
        report = MessageReport.objects.get()
        r = _client(self.staff).post(
            f'/api/v1/chat/reports/{report.id}/resolve/',
            {'action': 'actioned', 'delete_message': True}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.message.refresh_from_db()
        self.assertTrue(self.message.is_deleted)
        report.refresh_from_db()
        self.assertEqual(report.handled_by, self.staff)
        self.assertIsNotNone(report.handled_at)

    def test_dismissing_leaves_the_message_alone(self):
        self._report()
        report = MessageReport.objects.get()
        _client(self.staff).post(
            f'/api/v1/chat/reports/{report.id}/resolve/', {'action': 'dismissed'}, format='json',
        )
        self.message.refresh_from_db()
        self.assertFalse(self.message.is_deleted)

    def test_an_invalid_action_is_400(self):
        self._report()
        report = MessageReport.objects.get()
        r = _client(self.staff).post(
            f'/api/v1/chat/reports/{report.id}/resolve/', {'action': 'whatever'}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_an_ordinary_user_cannot_resolve(self):
        self._report()
        report = MessageReport.objects.get()
        r = self.client.post(
            f'/api/v1/chat/reports/{report.id}/resolve/', {'action': 'dismissed'}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)


@override_settings(DM_ENABLED=False)
class DirectMessagesOffTests(TestCase):
    """The flag has to close the endpoints, not just hide the tab. A flag that
    only hides UI leaves the API open to anyone with a browser console."""

    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(username='a', email='a@e.com', password='x')
        self.other = User.objects.create_user(username='b', email='b@e.com', password='x')
        self.client = _client(self.user)

    def test_every_dm_endpoint_is_refused(self):
        convo = Conversation.objects.create(initiator=self.user)
        convo.participants.add(self.user, self.other)
        calls = [
            ('get', '/api/v1/chat/dm/users/?q=someone'),
            ('get', '/api/v1/chat/dm/conversations/'),
            ('post', '/api/v1/chat/dm/conversations/start/'),
            ('get', f'/api/v1/chat/dm/conversations/{convo.id}/messages/'),
            ('post', f'/api/v1/chat/dm/conversations/{convo.id}/messages/'),
            ('post', f'/api/v1/chat/dm/conversations/{convo.id}/accept/'),
            ('post', f'/api/v1/chat/dm/conversations/{convo.id}/decline/'),
            ('get', '/api/v1/chat/dm/unread-count/'),
        ]
        for method, path in calls:
            r = getattr(self.client, method)(path)
            self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN, f'{method} {path}')

    def test_the_client_is_told_so_it_can_hide_the_tab(self):
        r = self.client.get('/api/v1/chat/settings/')
        self.assertFalse(r.data['dm_enabled'])

    def test_the_public_room_still_works(self):
        ChatRoom.objects.create(slug='general', name='General')
        r = self.client.post(
            '/api/v1/chat/rooms/general/messages/', {'content': 'salom'}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)


@override_settings(DM_ENABLED=True)
class DirectMessageConsentTests(TestCase):
    def setUp(self):
        cache.clear()
        self.sender = User.objects.create_user(
            username='sender', email='s@e.com', password='x',
            first_name='Aziz', last_name='Karimov',
        )
        self.recipient = User.objects.create_user(
            username='recipient', email='r@e.com', password='x',
            first_name='Bek', last_name='Toshev',
        )
        self.client = _client(self.sender)

    def _start(self):
        return self.client.post(
            '/api/v1/chat/dm/conversations/start/', {'user_id': self.recipient.id}, format='json',
        )

    def _send(self, convo_id, content='salom', client=None):
        return (client or self.client).post(
            f'/api/v1/chat/dm/conversations/{convo_id}/messages/', {'content': content},
            format='json',
        )

    def test_a_new_conversation_starts_pending(self):
        r = self._start()
        self.assertEqual(r.data['status'], Conversation.PENDING)

    def test_the_first_message_gets_through(self):
        convo_id = self._start().data['id']
        self.assertEqual(self._send(convo_id).status_code, status.HTTP_201_CREATED)

    def test_the_second_message_waits_for_consent(self):
        """Any account could previously find any other by a two-character search
        and fill their inbox. One message, then wait."""
        convo_id = self._start().data['id']
        self._send(convo_id)
        r = self._send(convo_id, 'and another')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(r.data['code'], 'awaiting_consent')
        self.assertEqual(DirectMessage.objects.count(), 1)

    def test_accepting_opens_it_up(self):
        convo_id = self._start().data['id']
        self._send(convo_id)
        r = _client(self.recipient).post(f'/api/v1/chat/dm/conversations/{convo_id}/accept/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(self._send(convo_id, 'now I can').status_code, status.HTTP_201_CREATED)

    def test_replying_counts_as_accepting(self):
        """Nobody should have to press a button to accept a conversation they
        have just answered."""
        convo_id = self._start().data['id']
        self._send(convo_id)
        self._send(convo_id, 'salom ham', client=_client(self.recipient))
        convo = Conversation.objects.get(id=convo_id)
        self.assertEqual(convo.status, Conversation.ACCEPTED)

    def test_declining_ends_it(self):
        convo_id = self._start().data['id']
        self._send(convo_id)
        _client(self.recipient).post(f'/api/v1/chat/dm/conversations/{convo_id}/decline/')
        r = self._send(convo_id, 'please answer')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_a_declined_conversation_cannot_be_restarted(self):
        convo_id = self._start().data['id']
        _client(self.recipient).post(f'/api/v1/chat/dm/conversations/{convo_id}/decline/')
        self.assertEqual(self._start().status_code, status.HTTP_403_FORBIDDEN)

    def test_a_declined_conversation_leaves_the_recipient_s_list(self):
        convo_id = self._start().data['id']
        self._send(convo_id)
        _client(self.recipient).post(f'/api/v1/chat/dm/conversations/{convo_id}/decline/')
        r = _client(self.recipient).get('/api/v1/chat/dm/conversations/')
        self.assertEqual(r.data, [])

    def test_the_sender_cannot_accept_on_the_recipient_s_behalf(self):
        convo_id = self._start().data['id']
        r = self.client.post(f'/api/v1/chat/dm/conversations/{convo_id}/accept/')
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_the_recipient_is_shown_that_a_decision_is_theirs(self):
        convo_id = self._start().data['id']
        self._send(convo_id)
        mine = self.client.get('/api/v1/chat/dm/conversations/').data[0]
        theirs = _client(self.recipient).get('/api/v1/chat/dm/conversations/').data[0]
        self.assertFalse(mine['awaiting_my_consent'])
        self.assertTrue(theirs['awaiting_my_consent'])


@override_settings(DM_ENABLED=True)
class DirectMessageModerationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.a = User.objects.create_user(
            username='aziz', email='a@e.com', password='x',
            first_name='Aziz', last_name='Karimov',
        )
        self.b = User.objects.create_user(username='bek', email='b@e.com', password='x')
        self.staff = User.objects.create_user(
            username='mod', email='m@e.com', password='x', is_staff=True,
        )
        self.convo = Conversation.objects.create(
            initiator=self.a, status=Conversation.ACCEPTED,
        )
        self.convo.participants.add(self.a, self.b)
        self.client = _client(self.a)

    def _send(self, content, client=None):
        return (client or self.client).post(
            f'/api/v1/chat/dm/conversations/{self.convo.id}/messages/', {'content': content},
            format='json',
        )

    def test_profanity_is_screened_in_private_too(self):
        """The filter applied to neither surface before; a private message to a
        child is the one that matters more."""
        self.assertEqual(self._send('you are a bitch').status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(DirectMessage.objects.exists())

    def test_blocking_stops_the_conversation_both_ways(self):
        UserBlock.objects.create(blocker=self.b, blocked=self.a)
        self.assertEqual(self._send('hello').status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self._send('hello', client=_client(self.b)).status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_a_blocked_person_cannot_open_a_new_conversation_either(self):
        UserBlock.objects.create(blocker=self.b, blocked=self.a)
        other = _client(self.a).post(
            '/api/v1/chat/dm/conversations/start/', {'user_id': self.b.id}, format='json',
        )
        self.assertEqual(other.status_code, status.HTTP_403_FORBIDDEN)

    def test_the_refusal_does_not_reveal_who_blocked_whom(self):
        UserBlock.objects.create(blocker=self.b, blocked=self.a)
        r = self._send('hello')
        self.assertNotIn('block', str(r.data).lower())

    def test_a_direct_message_can_be_reported(self):
        self._send('something unpleasant')
        message = DirectMessage.objects.get()
        r = _client(self.b).post(
            '/api/v1/chat/reports/',
            {'message_type': 'direct', 'message_id': message.id, 'reason': 'abuse'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

    def test_you_cannot_report_a_private_message_you_were_not_part_of(self):
        """404 rather than 403 — confirming a message exists lets someone walk
        the id space to learn who is talking to whom."""
        self._send('private')
        message = DirectMessage.objects.get()
        outsider = User.objects.create_user(username='nosy', email='n@e.com', password='x')
        r = _client(outsider).post(
            '/api/v1/chat/reports/',
            {'message_type': 'direct', 'message_id': message.id, 'reason': 'abuse'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_a_moderator_can_hide_a_direct_message(self):
        self._send('something to hide')
        message = DirectMessage.objects.get()
        r = _client(self.staff).delete(f'/api/v1/chat/dm/messages/{message.id}/')
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.client.get(
            f'/api/v1/chat/dm/conversations/{self.convo.id}/messages/',
        ).data, [])

    def test_a_stranger_cannot_hide_a_message_or_learn_it_exists(self):
        self._send('private')
        message = DirectMessage.objects.get()
        outsider = User.objects.create_user(username='nosy', email='n@e.com', password='x')
        r = _client(outsider).delete(f'/api/v1/chat/dm/messages/{message.id}/')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_hidden_messages_are_not_counted_as_unread(self):
        self._send('one')
        DirectMessage.objects.get().soft_delete(self.staff)
        r = _client(self.b).get('/api/v1/chat/dm/unread-count/')
        self.assertEqual(r.data['unread_count'], 0)

    def test_sending_is_rate_limited(self):
        codes = [self._send(f'message {i}').status_code for i in range(25)]
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codes)


@override_settings(DM_ENABLED=True)
class UserSearchTests(TestCase):
    """It was `icontains` across username, first and last name at two
    characters, which turns the membership list into something anyone can
    enumerate two letters at a time — for a site whose members are children."""

    def setUp(self):
        cache.clear()
        self.me = User.objects.create_user(username='searcher', email='s@e.com', password='x')
        self.target = User.objects.create_user(
            username='aziz2010', email='a@e.com', password='x',
            first_name='Aziz', last_name='Karimov',
        )
        User.objects.create_user(
            username='azamat', email='az@e.com', password='x', first_name='Azamat',
        )
        self.client = _client(self.me)

    def _search(self, q):
        return self.client.get(f'/api/v1/chat/dm/users/?q={q}').data

    def test_a_two_letter_fragment_returns_nothing(self):
        self.assertEqual(self._search('az'), [])

    def test_a_partial_name_no_longer_enumerates_users(self):
        self.assertEqual(self._search('azi'), [])

    def test_a_whole_username_finds_the_person(self):
        self.assertEqual([u['username'] for u in self._search('aziz2010')], ['aziz2010'])

    def test_a_whole_first_and_last_name_finds_the_person(self):
        self.assertEqual([u['username'] for u in self._search('Aziz Karimov')], ['aziz2010'])

    def test_a_first_name_alone_is_not_enough(self):
        self.assertEqual(self._search('Aziz'), [])

    def test_a_blocked_person_does_not_appear(self):
        UserBlock.objects.create(blocker=self.me, blocked=self.target)
        self.assertEqual(self._search('aziz2010'), [])

    def test_you_do_not_find_yourself(self):
        self.assertEqual(self._search('searcher'), [])


class SuspensionTests(TestCase):
    """The gap B1 left: a moderator could hide a message but not stop its author.

    Deleting removes what was said and does nothing about someone who keeps
    saying it. The alternative already on the User model is `is_active`, which
    is an account ban and takes the student's lessons with it — a child who was
    unkind in chat should lose the chat, not their education.
    """

    def setUp(self):
        cache.clear()
        self.room = ChatRoom.objects.create(slug='general', name='General')
        self.author = User.objects.create_user(username='author', email='a@e.com', password='x')
        self.reporter = User.objects.create_user(username='rep', email='r@e.com', password='x')
        self.staff = User.objects.create_user(
            username='mod', email='m@e.com', password='x', is_staff=True,
        )
        self.client = _client(self.author)

    def _post(self, content='salom', client=None):
        return (client or self.client).post(
            f'/api/v1/chat/rooms/{self.room.slug}/messages/', {'content': content}, format='json',
        )

    def _suspend(self, days=7):
        from django.utils import timezone

        from .models import ChatSuspension
        return ChatSuspension.objects.create(
            user=self.author,
            until=timezone.now() + timezone.timedelta(days=days),
            reason='bullying',
            created_by=self.staff,
        )

    def test_a_suspended_account_cannot_post_to_a_room(self):
        self._suspend()
        r = self._post()
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(r.data['code'], 'suspended')

    def test_the_refusal_says_when_it_ends(self):
        self._suspend()
        r = self._post()
        self.assertIn('until', r.data)
        self.assertEqual(r.data['reason'], 'bullying')

    def test_everyone_else_still_posts(self):
        self._suspend()
        self.assertEqual(self._post(client=_client(self.reporter)).status_code,
                         status.HTTP_201_CREATED)

    def test_reading_is_still_allowed(self):
        """A suspension is not an exclusion. They can still follow the room."""
        self._suspend()
        r = self.client.get(f'/api/v1/chat/rooms/{self.room.slug}/messages/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_an_expired_suspension_does_not_bite(self):
        from django.utils import timezone

        from .models import ChatSuspension
        ChatSuspension.objects.create(
            user=self.author, until=timezone.now() - timezone.timedelta(minutes=1),
        )
        self.assertEqual(self._post().status_code, status.HTTP_201_CREATED)

    def test_lifting_it_early_restores_posting(self):
        from django.utils import timezone

        suspension = self._suspend()
        suspension.lifted_at = timezone.now()
        suspension.save(update_fields=['lifted_at'])
        self.assertEqual(self._post().status_code, status.HTTP_201_CREATED)

    def test_the_client_is_told_so_the_box_can_explain_itself(self):
        self._suspend()
        r = self.client.get('/api/v1/chat/settings/')
        self.assertIsNotNone(r.data['suspension'])
        self.assertEqual(r.data['suspension']['reason'], 'bullying')

    def test_the_student_is_not_told_which_moderator(self):
        """Naming a moderator to the person they moderated invites exactly the
        situation the suspension was meant to end."""
        self._suspend()
        r = self.client.get('/api/v1/chat/settings/')
        self.assertNotIn('created_by', r.data['suspension'])

    def test_an_unsuspended_account_sees_nothing(self):
        r = self.client.get('/api/v1/chat/settings/')
        self.assertIsNone(r.data['suspension'])


class SuspendFromTheReportQueueTests(TestCase):
    def setUp(self):
        cache.clear()
        self.room = ChatRoom.objects.create(slug='general', name='General')
        self.author = User.objects.create_user(username='author', email='a@e.com', password='x')
        self.reporter = User.objects.create_user(username='rep', email='r@e.com', password='x')
        self.staff = User.objects.create_user(
            username='mod', email='m@e.com', password='x', is_staff=True,
        )
        self.message = ChatMessage.objects.create(
            room=self.room, user=self.author, content='something unpleasant',
        )
        self.report = MessageReport.objects.create(
            reporter=self.reporter, chat_message=self.message, reason='bullying',
        )

    def _resolve(self, **extra):
        payload = {'action': 'actioned'}
        payload.update(extra)
        return _client(self.staff).post(
            f'/api/v1/chat/reports/{self.report.id}/resolve/', payload, format='json',
        )

    def test_a_moderator_can_suspend_the_author_while_resolving(self):
        from .models import ChatSuspension

        r = self._resolve(delete_message=True, suspend_days=7)
        self.assertEqual(r.status_code, status.HTTP_200_OK)

        suspension = ChatSuspension.objects.get(user=self.author)
        self.assertTrue(suspension.is_active)
        self.assertIn('report #', suspension.reason)
        self.assertEqual(suspension.created_by, self.staff)

    def test_the_author_then_cannot_post(self):
        self._resolve(suspend_days=3)
        r = _client(self.author).post(
            f'/api/v1/chat/rooms/{self.room.slug}/messages/', {'content': 'again'}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_resolving_without_asking_suspends_nobody(self):
        from .models import ChatSuspension

        self._resolve(delete_message=True)
        self.assertFalse(ChatSuspension.objects.exists())

    def test_a_nonsense_length_is_refused(self):
        from .models import ChatSuspension

        for value in (0, -1, 91, 'forever'):
            r = self._resolve(suspend_days=value)
            self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST, value)
        self.assertFalse(ChatSuspension.objects.exists())

    def test_dismissing_a_report_never_suspends(self):
        from .models import ChatSuspension

        _client(self.staff).post(
            f'/api/v1/chat/reports/{self.report.id}/resolve/',
            {'action': 'dismissed', 'suspend_days': 7}, format='json',
        )
        self.assertFalse(ChatSuspension.objects.exists())

    def test_an_ordinary_user_cannot_suspend_anyone(self):
        from .models import ChatSuspension

        r = _client(self.reporter).post(
            f'/api/v1/chat/reports/{self.report.id}/resolve/',
            {'action': 'actioned', 'suspend_days': 7}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(ChatSuspension.objects.exists())
