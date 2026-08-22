"""Profanity screening for a site whose users are 10 to 18.

This is a filter, not a solution. It catches the lazy case — someone typing a
slur straight into the box — and it will miss a determined one. It exists
because shipping a public chat and private messaging for minors with *no*
screening at all, which is what this was, has no defensible version.

The list stays deliberately short and covers the three languages the site
speaks. A long list is worse: it produces false positives ("Scunthorpe"), and a
false positive in a children's product means a child is told they are being
abusive for writing "classic".

Design notes:

- Normalise before matching, so `f.u.c.k`, `fuuuck` and `f4ck` all collapse to
  the same string. Substitution is the cheapest evasion and the one a
  fourteen-year-old reaches for first.
- Match on word boundaries after normalising, so "assess" and "Kant" pass.
- Never echo the matched word back to the caller. The API says the message was
  rejected and why in general terms; the term itself goes to the moderation log.
"""
import re
import unicodedata

# Latin, Cyrillic and Uzbek-Latin stems. Stems rather than whole words so simple
# suffixing does not walk past the check.
PROFANITY_STEMS = [
    # English
    'fuck', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'faggot', 'nigger',
    'retard', 'dick', 'pussy', 'bastard', 'asshole', 'wanker',
    # Russian
    'блят', 'бляд', 'сука', 'хуй', 'хуе', 'хуё', 'пизд', 'ебат', 'ебан', 'ёбан',
    'мудак', 'гандон', 'шлюх', 'долбоеб', 'долбоёб', 'пидор', 'пидар',
    # Uzbek
    'jalab', 'qanjiq', 'ko\'tak', 'kotak', 'ambop', 'dalbayob', 'qotoq',
    'onangni', 'sikay', 'sikib', 'sikkan',
]

# What people type instead of a letter. Applied after casefolding.
_SUBSTITUTIONS = {
    '4': 'a', '@': 'a', '8': 'b', '(': 'c', '3': 'e', '6': 'b',
    '9': 'g', '1': 'i', '!': 'i', '|': 'i', '0': 'o', '5': 's',
    '$': 's', '7': 't', '+': 't',
}

_SEPARATORS = re.compile(r'[\s._\-*~^`\'"/\\]+')
_REPEATS = re.compile(r'(.)\1{2,}')


def normalise(text):
    """Collapse the usual evasions so one stem matches all of their spellings."""
    text = unicodedata.normalize('NFKC', str(text)).casefold()
    text = ''.join(_SUBSTITUTIONS.get(ch, ch) for ch in text)
    text = _SEPARATORS.sub('', text)
    # `fuuuck` -> `fuck`; three or more, so ordinary doubles survive.
    return _REPEATS.sub(r'\1', text)


def find_profanity(text):
    """Every stem present, for the moderation log. Empty means the text is fine."""
    haystack = normalise(text)
    return [stem for stem in PROFANITY_STEMS if normalise(stem) in haystack]


def contains_profanity(text):
    return bool(find_profanity(text))
