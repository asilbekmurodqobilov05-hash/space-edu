"""Input contract for the AI tutor.

The view used to read `request.data.get(...)` directly with no validation at all,
so a malformed payload reached `msg.get()` and raised AttributeError -> 500, and
an unbounded `messages` list meant one request could bill an arbitrary number of
input tokens.
"""
from rest_framework import serializers

MAX_MESSAGES = 30
MAX_MESSAGE_CHARS = 4000
MAX_CONTEXT_CHARS = 200

MODES = ('explain', 'deep', 'quiz')


class ChatMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=('user', 'model', 'assistant'), default='user')
    text = serializers.CharField(
        max_length=MAX_MESSAGE_CHARS, allow_blank=False, trim_whitespace=True
    )


class AiChatSerializer(serializers.Serializer):
    messages = serializers.ListField(
        child=ChatMessageSerializer(), min_length=1, max_length=MAX_MESSAGES,
    )
    # Short on purpose. This is a topic label ("Kepler's laws"), not a place for
    # the caller to write instructions — see the note in views.build_contents.
    context = serializers.CharField(
        max_length=MAX_CONTEXT_CHARS, allow_blank=True, required=False, default='',
    )
    mode = serializers.ChoiceField(choices=MODES, default='explain')

    def validate_messages(self, value):
        total = sum(len(m['text']) for m in value)
        if total > MAX_MESSAGES * MAX_MESSAGE_CHARS // 3:
            raise serializers.ValidationError(
                'Conversation is too long. Start a new chat.'
            )
        return value
