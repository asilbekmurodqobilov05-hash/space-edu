"""
Seed MarketCategory + MarketItem tables with space-themed products.
Usage:  python manage.py seed_market
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.market.models import MarketCategory, MarketItem


class Command(BaseCommand):
    help = 'Populate marketplace with categories and items'

    def handle(self, *args, **options):
        self.stdout.write('Seeding market data...')
        now = timezone.now()

        # ── CATEGORIES ──
        cats = {}
        for slug, name_en, name_uz, icon, color in [
            ('spaceships',  'Spaceships',       'Kosmik kemalar',   'Rocket',    '#00e5ff'),
            ('badges',      'Badges & Medals',   'Nishonlar',       'Award',     '#fbbf24'),
            ('boosts',      'XP Boosts',         'XP kuchaytirgich','Zap',       '#4ade80'),
            ('books',       'Books & Courses',   'Kitoblar',        'BookOpen',  '#f472b6'),
            ('avatars',     'Avatars & Skins',   'Avatarlar',       'User',      '#a78bfa'),
            ('tools',       'Space Tools',       'Kosmik asboblar', 'Wrench',    '#fb923c'),
        ]:
            obj, _ = MarketCategory.objects.update_or_create(
                slug=slug, defaults=dict(name_en=name_en, name_uz=name_uz, name_ru=name_en, icon=icon, color=color)
            )
            cats[slug] = obj
        self.stdout.write(f'  {len(cats)} categories seeded')

        # ── ITEMS ──
        items_data = [
            # ── Spaceships ──
            dict(slug='falcon-9-model', category=cats['spaceships'], item_type='spaceship',
                 title_en='Falcon 9 Model', title_uz='Falcon 9 modeli', title_ru='Model Falcon 9',
                 description_en='Detailed 3D model of the SpaceX Falcon 9 rocket for your collection.',
                 description_uz='SpaceX Falcon 9 raketasining batafsil 3D modeli.',
                 description_ru='Detalnaya 3D model rakety SpaceX Falcon 9.',
                 price=45000, original_price=60000, discount_percent=25,
                 discount_start=now - timedelta(days=1), discount_end=now + timedelta(days=14),
                 cost_fuel=300, is_bestseller=True, tags='spacex,rocket,3d-model'),
            dict(slug='starship-model', category=cats['spaceships'], item_type='spaceship',
                 title_en='Starship Super Heavy', title_uz='Starship Super Heavy', title_ru='Starship Super Heavy',
                 description_en='The most powerful rocket ever built. Unlock this premium Starship model.',
                 description_uz='Eng kuchli raketa modeli. Premium Starship modelini oching.',
                 description_ru='Samaya moshchnaya raketa. Razblokiruyte premialnuyu model Starship.',
                 price=120000, cost_fuel=800, is_new=True, is_featured=True, tags='spacex,starship,premium'),
            dict(slug='soyuz-rocket', category=cats['spaceships'], item_type='spaceship',
                 title_en='Soyuz Rocket', title_uz='Soyuz raketasi', title_ru='Raketa Soyuz',
                 description_en='Classic Soyuz rocket model, workhorse of space exploration.',
                 description_uz='Klassik Soyuz raketa modeli.',
                 description_ru='Klassicheskaya model rakety Soyuz.',
                 price=35000, cost_fuel=200, tags='roscosmos,soyuz,classic'),
            dict(slug='electron-rocket', category=cats['spaceships'], item_type='spaceship',
                 title_en='Electron Rocket', title_uz='Electron raketasi', title_ru='Raketa Electron',
                 description_en='Rocket Lab Electron small satellite launcher.',
                 description_uz='Rocket Lab Electron kichik sun\'iy yo\'ldosh uchirish vositasi.',
                 description_ru='Nositel malyh sputnikov Electron ot Rocket Lab.',
                 price=25000, cost_fuel=150, is_new=True, tags='rocketlab,electron,smallsat'),

            # ── Badges ──
            dict(slug='pioneer-badge', category=cats['badges'], item_type='badge',
                 title_en='Space Pioneer Badge', title_uz='Kosmik Kashshof nishoni', title_ru='Znak Kosmicheskogo Pervoprohodtsa',
                 description_en='Awarded to true space pioneers. Shows your dedication.',
                 description_uz='Haqiqiy kosmik kashshoflarga beriladi.',
                 description_ru='Prisvaivayetsya nastoyashchim pervoprohodtsam kosmosa.',
                 price=15000, cost_fuel=100, is_bestseller=True, tags='badge,pioneer,achievement'),
            dict(slug='astronaut-wings', category=cats['badges'], item_type='badge',
                 title_en='Astronaut Wings', title_uz='Astronavt qanotlari', title_ru='Krylya Astronavta',
                 description_en='Prestigious astronaut wings badge for your profile.',
                 description_uz='Profilingiz uchun nufuzli astronavt qanotlari nishoni.',
                 description_ru='Prestizhniy znak krylev astronavta dlya vashego profilya.',
                 price=20000, original_price=30000, discount_percent=33,
                 discount_start=now, discount_end=now + timedelta(days=7),
                 cost_fuel=150, is_featured=True, tags='badge,astronaut,wings,premium'),
            dict(slug='mission-complete', category=cats['badges'], item_type='badge',
                 title_en='Mission Complete Medal', title_uz='Missiya bajarildi medali', title_ru='Medal Missiya vypolnena',
                 description_en='Gold medal for completing 50 lessons.',
                 description_uz='50 darsni tugatganlik uchun oltin medal.',
                 description_ru='Zolotaya medal za prohozhdenie 50 urokov.',
                 price=10000, cost_fuel=80, tags='badge,medal,achievement'),

            # ── XP Boosts ──
            dict(slug='double-xp-7d', category=cats['boosts'], item_type='boost',
                 title_en='Double XP (7 Days)', title_uz='Ikki baravar XP (7 kun)', title_ru='Dvoynoy XP (7 dney)',
                 description_en='Get double XP for all activities for 7 days!',
                 description_uz='7 kun davomida barcha faoliyatlar uchun ikki baravar XP oling!',
                 description_ru='Poluchite dvoynoy XP za vse deystviya na 7 dney!',
                 price=30000, original_price=50000, discount_percent=40,
                 discount_start=now, discount_end=now + timedelta(days=3),
                 cost_fuel=200, is_bestseller=True, is_limited=True, stock=100, tags='boost,xp,double,limited'),
            dict(slug='triple-xp-1d', category=cats['boosts'], item_type='boost',
                 title_en='Triple XP (24 Hours)', title_uz='Uch baravar XP (24 soat)', title_ru='Troynoy XP (24 chasa)',
                 description_en='Massive XP boost for a single day!',
                 description_uz='Bir kun uchun katta XP kuchaytirgich!',
                 description_ru='Ogromnyy buster XP na odin den!',
                 price=20000, cost_fuel=120, is_new=True, tags='boost,xp,triple'),
            dict(slug='fuel-refill-500', category=cats['boosts'], item_type='boost',
                 title_en='Fuel Refill +500', title_uz='Yoqilg\'i to\'ldirish +500', title_ru='Zapravka +500',
                 description_en='Instantly add 500 fuel to your tank.',
                 description_uz='Tankingizga darhol 500 yoqilg\'i qo\'shing.',
                 description_ru='Mgnovenno dobavte 500 topliva v bak.',
                 price=15000, cost_fuel=0, tags='boost,fuel,refill'),

            # ── Books ──
            dict(slug='cosmos-by-sagan', category=cats['books'], item_type='book',
                 title_en='Cosmos - Carl Sagan (Digital)', title_uz='Cosmos - Karl Sagan (Raqamli)', title_ru='Kosmos - Karl Sagan (Tsifrovoy)',
                 description_en='The classic book by Carl Sagan exploring the cosmos and our place in it.',
                 description_uz='Karl Saganning kosmosni o\'rganuvchi klassik kitobi.',
                 description_ru='Klassicheskaya kniga Karla Sagana o kosmose.',
                 price=25000, cost_fuel=180, is_featured=True, tags='book,sagan,cosmos,classic'),
            dict(slug='astrophysics-for-beginners', category=cats['books'], item_type='book',
                 title_en='Astrophysics for Young People', title_uz='Yoshlar uchun astrofizika', title_ru='Astrofizika dlya molodyozhi',
                 description_en='Beginner-friendly astrophysics guide by Neil deGrasse Tyson.',
                 description_uz='Neil deGrasse Taysonning boshlang\'ichlar uchun astrofizika qo\'llanmasi.',
                 description_ru='Nachalnoe rukovodstvo po astrofizike ot Nila deGrassa Taysona.',
                 price=18000, original_price=25000, discount_percent=28,
                 cost_fuel=120, is_new=True, tags='book,astrophysics,beginner,tyson'),

            # ── Avatars ──
            dict(slug='cosmonaut-avatar', category=cats['avatars'], item_type='avatar',
                 title_en='Cosmonaut Avatar', title_uz='Kosmonavt avatari', title_ru='Avatar Kosmonavta',
                 description_en='Classic Soviet-style cosmonaut avatar for your profile.',
                 description_uz='Profilingiz uchun klassik sovet uslubidagi kosmonavt avatari.',
                 description_ru='Klassicheskiy sovetskiy avatar kosmonavta.',
                 price=8000, cost_fuel=50, tags='avatar,cosmonaut,profile'),
            dict(slug='alien-commander', category=cats['avatars'], item_type='avatar',
                 title_en='Alien Commander', title_uz='Begona qo\'mondon', title_ru='Komandir Inoplanetyan',
                 description_en='Mysterious alien commander avatar. Limited edition!',
                 description_uz='Sirli begona qo\'mondon avatari. Cheklangan nashr!',
                 description_ru='Zagadochnyy avatar komandira inoplanetyan. Limitirovannaya seriya!',
                 price=50000, cost_fuel=350, is_limited=True, is_featured=True, stock=50, tags='avatar,alien,limited,premium'),

            # ── Tools ──
            dict(slug='telescope-pro', category=cats['tools'], item_type='tool',
                 title_en='Telescope Pro Unlock', title_uz='Teleskop Pro ochish', title_ru='Razblokir Teleskop Pro',
                 description_en='Unlock the Pro telescope for enhanced stargazing in the observatory.',
                 description_uz='Observatoriyada kengaytirilgan yulduz kuzatish uchun Pro teleskopni oching.',
                 description_ru='Razblokiruyte Pro teleskop dlya uluchshennogo nablyudeniya.',
                 price=40000, cost_fuel=250, is_new=True, tags='tool,telescope,observatory,pro'),
            dict(slug='star-map-deluxe', category=cats['tools'], item_type='tool',
                 title_en='Star Map Deluxe', title_uz='Yulduz xaritasi Deluxe', title_ru='Zvezdnaya karta Deluxe',
                 description_en='Deluxe interactive star map with 10,000+ objects.',
                 description_uz='10,000+ obyektli Deluxe interaktiv yulduz xaritasi.',
                 description_ru='Interaktivnaya zvezdnaya karta Deluxe s 10000+ obektami.',
                 price=35000, original_price=45000, discount_percent=22,
                 cost_fuel=220, is_bestseller=True, tags='tool,starmap,deluxe,interactive'),
        ]

        for item_data in items_data:
            obj, created = MarketItem.objects.update_or_create(
                slug=item_data['slug'], defaults=item_data,
            )
            status_str = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status_str}: {obj.title_en}')

        self.stdout.write(self.style.SUCCESS(f'\nSeeded {len(cats)} categories + {len(items_data)} items!'))
