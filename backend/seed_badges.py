import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.gamification.models import Badge

badges = [
    {
        'slug': 'first-steps',
        'title_en': 'First Steps',
        'title_uz': 'Birinchi Qadamlar',
        'title_ru': 'Первые Шаги',
        'description_en': 'Earn 100 XP to start your journey.',
        'description_uz': 'Sayohatni boshlash uchun 100 XP ishlang.',
        'description_ru': 'Заработайте 100 XP, чтобы начать путешествие.',
        'icon': '🚀',
        'rarity': 'common',
        'condition_type': 'xp_threshold',
        'condition_value': 100
    },
    {
        'slug': 'space-cadet',
        'title_en': 'Space Cadet',
        'title_uz': 'Kosmik Kadet',
        'title_ru': 'Космический Кадет',
        'description_en': 'Maintain a 3-day learning streak.',
        'description_uz': "3 kunlik o'qish seriyasini saqlang.",
        'description_ru': 'Поддерживайте серию обучения 3 дня.',
        'icon': '🔥',
        'rarity': 'common',
        'condition_type': 'streak',
        'condition_value': 3
    },
    {
        'slug': 'nova-explorer',
        'title_en': 'Nova Explorer',
        'title_uz': 'Nova Tadqiqotchisi',
        'title_ru': 'Исследователь Новы',
        'description_en': 'Reach 1,000 XP through your exploration.',
        'description_uz': 'Kashfiyotlaringiz orqali 1000 XP ga erishing.',
        'description_ru': 'Достигните 1000 XP благодаря своим исследованиям.',
        'icon': '🌌',
        'rarity': 'rare',
        'condition_type': 'xp_threshold',
        'condition_value': 1000
    },
    {
        'slug': 'orbital-master',
        'title_en': 'Orbital Master',
        'title_uz': 'Orbital Usta',
        'title_ru': 'Орбитальный Мастер',
        'description_en': 'Complete 10 lessons with perfect scores.',
        'description_uz': "10 ta darsni a'lo baholarga yakunlang.",
        'description_ru': 'Завершите 10 уроков с идеальным результатом.',
        'icon': '✨',
        'rarity': 'epic',
        'condition_type': 'lessons',
        'condition_value': 10
    },
    {
        'slug': 'galactic-legend',
        'title_en': 'Galactic Legend',
        'title_uz': 'Galaktik Afsona',
        'title_ru': 'Галактическая Легенда',
        'description_en': 'Accumulate 10,000 XP and become a true legend.',
        'description_uz': "10,000 XP to'plang va haqiqiy afsonaga aylaning.",
        'description_ru': 'Накопите 10 000 XP и станьте настоящей легендой.',
        'icon': '👑',
        'rarity': 'legendary',
        'condition_type': 'xp_threshold',
        'condition_value': 10000
    },
    {
        'slug': 'black-hole-survivor',
        'title_en': 'Black Hole Survivor',
        'title_uz': 'Qora Tuynukdan Omon Qolgan',
        'title_ru': 'Выживший в Чёрной Дыре',
        'description_en': 'Maintain an incredible 30-day streak.',
        'description_uz': 'Aql bovar qilmas 30 kunlik seriyani saqlab qoling.',
        'description_ru': 'Поддерживайте невероятную серию из 30 дней.',
        'icon': '💎',
        'rarity': 'exclusive',
        'condition_type': 'streak',
        'condition_value': 30
    }
]

for b in badges:
    obj, created = Badge.objects.update_or_create(slug=b['slug'], defaults=b)
    if created:
        print(f"Created badge: {b['title_en']} ({b['rarity']})")
    else:
        print(f"Updated badge: {b['title_en']} ({b['rarity']})")

print("Seeding complete.")
