from django.core.management.base import BaseCommand
from django.db import transaction

from apps.courses.models import Level, Lesson, LessonSection, QuizQuestion, Unit
from apps.gamification.models import Badge
from apps.market.models import MarketItem
from apps.chat.models import ChatRoom


class Command(BaseCommand):
    help = 'Seed database with demo content'

    @transaction.atomic
    def handle(self, *args, **options):
        self._seed_levels()
        self._seed_badges()
        self._seed_market()
        self._seed_chat()
        self.stdout.write(self.style.SUCCESS('Seed complete'))

    # ──────────────────────────────────────────────
    def _seed_levels(self):
        if Level.objects.exists():
            self.stdout.write('  Levels already seeded — skipping')
            return

        # ── Level 1: Solar System ──────────────────
        lv1 = Level.objects.create(
            slug='solar-system', order=1,
            title_en='Solar System',
            title_uz='Quyosh tizimi',
            title_ru='Солнечная система',
            description_en='Explore the planets, moons, and forces that shape our solar neighbourhood.',
            description_uz='Sayyoralar, oylar va Quyosh tizimini shakllantiruvchi kuchlarni o\'rganing.',
            description_ru='Изучите планеты, спутники и силы, формирующие нашу солнечную систему.',
            icon='Sun', color='yellow-500',
        )

        unit1 = Unit.objects.create(
            level=lv1, slug='inner-planets', order=1,
            title_en='Inner Planets', title_uz='Ichki sayyoralar', title_ru='Внутренние планеты',
            xp_reward=200, fuel_reward=80,
        )
        self._make_lesson(unit1, 'mercury-venus', 1,
            'Mercury & Venus', 'Merkuriy va Venera', 'Меркурий и Венера',
            'explanation', 60,
            en_text='Mercury is the smallest planet and closest to the Sun. Venus is the hottest planet due to its thick CO₂ atmosphere.',
            uz_text='Merkuriy eng kichik sayyora va Quyoshga eng yaqin. Venera qalin CO₂ atmosferasi tufayli eng issiq sayyoradir.',
            ru_text='Меркурий — самая маленькая планета, ближайшая к Солнцу. Венера — самая горячая планета благодаря плотной атмосфере CO₂.',
            questions=[
                ('What is the closest planet to the Sun?', 'Quyoshga eng yaqin sayyora qaysi?', 'Какая планета ближайшая к Солнцу?',
                 [('A','Mercury','Merkuriy','Меркурий'),('B','Venus','Venera','Венера'),('C','Earth','Yer','Земля'),('D','Mars','Mars','Марс')],
                 'A', 'Mercury orbits the Sun at an average distance of just 0.39 AU.', 'Merkuriy Quyoshdan o\'rtacha 0.39 AU masofada aylanadi.', 'Меркурий вращается вокруг Солнца на расстоянии 0,39 а.е.'),
                ('Which planet is hottest?', 'Qaysi sayyora eng issiq?', 'Какая планета самая горячая?',
                 [('A','Mercury','Merkuriy','Меркурий'),('B','Venus','Venera','Венера'),('C','Jupiter','Yupiter','Юпитер'),('D','Mars','Mars','Марс')],
                 'B', 'Venus traps heat via the greenhouse effect.', 'Venera issiqxona effekti orqali issiqlikni ushlab turadi.', 'Венера удерживает тепло благодаря парниковому эффекту.'),
            ]
        )
        self._make_lesson(unit1, 'earth-mars', 2,
            'Earth & Mars', 'Yer va Mars', 'Земля и Марс',
            'explanation', 50,
            en_text='Earth is the only known planet with life. Mars has the tallest volcano (Olympus Mons) and the longest canyon (Valles Marineris) in the solar system.',
            uz_text='Yer hayot mavjud bo\'lgan yagona ma\'lum sayyoradir. Marsda quyosh tizimidagi eng baland vulqon (Olimp tog\'i) va eng uzun kanon (Valles Marineris) mavjud.',
            ru_text='Земля — единственная известная планета с жизнью. На Марсе находится самый высокий вулкан (Олимп) и самый длинный каньон (Долины Маринер) в Солнечной системе.',
            questions=[
                ('What is the tallest volcano in the solar system?', 'Quyosh tizimidagi eng baland vulqon qaysi?', 'Какой самый высокий вулкан в Солнечной системе?',
                 [('A','Kilimanjaro','Kilimanjaro','Килиманджаро'),('B','Olympus Mons','Olimp tog\'i','Олимп'),('C','Mauna Kea','Mauna Kea','Мауна-Кеа'),('D','Everest','Everest','Эверест')],
                 'B', 'Olympus Mons on Mars is about 22 km high.', 'Marsdagi Olimp tog\'i taxminan 22 km balandlikda.', 'Олимп на Марсе имеет высоту около 22 км.'),
            ]
        )

        unit2 = Unit.objects.create(
            level=lv1, slug='outer-planets', order=2,
            title_en='Outer Planets', title_uz='Tashqi sayyoralar', title_ru='Внешние планеты',
            xp_reward=250, fuel_reward=100,
        )
        self._make_lesson(unit2, 'gas-giants', 1,
            'Gas Giants', 'Gaz gigantlari', 'Газовые гиганты',
            'explanation', 60,
            en_text='Jupiter and Saturn are gas giants. Jupiter is the largest planet; Saturn is famous for its stunning ring system.',
            uz_text='Yupiter va Saturn gaz gigantlaridir. Yupiter eng katta sayyora; Saturn o\'zining ajoyib halqalar tizimi bilan mashhur.',
            ru_text='Юпитер и Сатурн — газовые гиганты. Юпитер — крупнейшая планета; Сатурн знаменит своей кольцевой системой.',
            questions=[
                ('Which is the largest planet?', 'Qaysi sayyora eng katta?', 'Какая планета самая большая?',
                 [('A','Saturn','Saturn','Сатурн'),('B','Neptune','Neptun','Нептун'),('C','Jupiter','Yupiter','Юпитер'),('D','Uranus','Uran','Уран')],
                 'C', 'Jupiter is 11 times wider than Earth.', 'Yupiter Yerdan 11 marta kattaroq.', 'Юпитер в 11 раз шире Земли.'),
            ]
        )
        self._make_lesson(unit2, 'ice-giants', 2,
            'Ice Giants', 'Muz gigantlari', 'Ледяные гиганты',
            'explanation', 45,
            en_text='Uranus and Neptune are ice giants, made mostly of water, methane, and ammonia ices beneath thick atmospheres.',
            uz_text='Uran va Neptun muz gigantlari bo\'lib, asosan suv, metan va ammiak muzidan iborat.',
            ru_text='Уран и Нептун — ледяные гиганты, состоящие в основном из льдов воды, метана и аммиака.',
            questions=[
                ('Uranus rotates on its side. What is its axial tilt?', 'Uranning o\'q og\'ishi necha daraja?', 'Каков наклон оси Урана?',
                 [('A','23°','23°','23°'),('B','45°','45°','45°'),('C','82°','82°','82°'),('D','98°','98°','98°')],
                 'D', 'Uranus has an axial tilt of about 98°.', 'Uranning o\'q og\'ishi taxminan 98°.', 'Наклон оси Урана составляет около 98°.'),
            ]
        )

        # ── Level 2: Stars & Galaxies ──────────────
        lv2 = Level.objects.create(
            slug='stars-galaxies', order=2,
            title_en='Stars & Galaxies',
            title_uz='Yulduzlar va galaktikalar',
            title_ru='Звёзды и галактики',
            description_en='Journey beyond our solar system into the vast stellar nurseries and island universes.',
            description_uz='Quyosh tizimimizdan tashqariga — ulkan yulduz bulutlari va orol koinotlarga sayohat qiling.',
            description_ru='Путешествие за пределы нашей Солнечной системы в огромные звёздные туманности и галактики.',
            icon='Star', color='blue-400',
        )

        unit3 = Unit.objects.create(
            level=lv2, slug='stellar-life', order=1,
            title_en='Life of a Star', title_uz='Yulduz hayoti', title_ru='Жизнь звезды',
            xp_reward=300, fuel_reward=120,
        )
        self._make_lesson(unit3, 'star-birth', 1,
            'Star Birth', 'Yulduz tug\'ilishi', 'Рождение звезды',
            'explanation', 55,
            en_text='Stars form inside giant molecular clouds. Gravity pulls gas together until nuclear fusion ignites — turning hydrogen into helium.',
            uz_text='Yulduzlar ulkan molekulyar bulutlar ichida shakllanadi. Tortishish gazi birlashtiradi, natijada yadro sintezi yoqiladi — vodorod geliyga aylanadi.',
            ru_text='Звёзды образуются внутри гигантских молекулярных облаков. Гравитация сжимает газ, пока не запускается ядерный синтез — водород превращается в гелий.',
            questions=[
                ('What fuels nuclear fusion in a star?', 'Yulduzdagi yadro sintezini nima kuchaytiradi?', 'Что питает ядерный синтез в звезде?',
                 [('A','Oxygen','Kislorod','Кислород'),('B','Hydrogen','Vodorod','Водород'),('C','Carbon','Uglerod','Углерод'),('D','Iron','Temir','Железо')],
                 'B', 'Main-sequence stars fuse hydrogen into helium.', 'Asosiy ketma-ketlik yulduzlari vodorodni geliyga birlashtiradi.', 'Звёзды главной последовательности синтезируют водород в гелий.'),
            ]
        )
        self._make_lesson(unit3, 'star-death', 2,
            'Star Death', 'Yulduz o\'limi', 'Смерть звезды',
            'explanation', 60,
            en_text='How a star dies depends on its mass. Our Sun will become a red giant then a white dwarf. Massive stars explode as supernovae, sometimes leaving neutron stars or black holes.',
            uz_text='Yulduzning qanday o\'lishi uning massasiga bog\'liq. Quyoshimiz qizil gigantga, keyin oq mitti yulduzga aylanadi. Massiv yulduzlar supernova sifatida portlaydi.',
            ru_text='Смерть звезды зависит от её массы. Наше Солнце станет красным гигантом, затем белым карликом. Массивные звёзды взрываются как сверхновые.',
            questions=[
                ('What will our Sun become when it runs out of hydrogen?', 'Vodorod tugagach Quyoshimiz nimaga aylanadi?', 'Чем станет наше Солнце, когда иссякнет водород?',
                 [('A','Neutron star','Neytron yulduz','Нейтронная звезда'),('B','Black hole','Qora tuynuk','Чёрная дыра'),('C','Red giant','Qizil gigant','Красный гигант'),('D','Supernova','Supernova','Сверхновая')],
                 'C', 'The Sun will expand into a red giant in ~5 billion years.', 'Quyosh ~5 milliard yildan keyin qizil gigantga kengayadi.', 'Солнце расширится в красного гиганта через ~5 млрд лет.'),
            ]
        )

        unit4 = Unit.objects.create(
            level=lv2, slug='galaxies', order=2,
            title_en='Galaxies', title_uz='Galaktikalar', title_ru='Галактики',
            xp_reward=350, fuel_reward=150,
        )
        self._make_lesson(unit4, 'milky-way', 1,
            'The Milky Way', 'Somon yo\'li', 'Млечный Путь',
            'explanation', 50,
            en_text='Our galaxy contains 100–400 billion stars and is about 100,000 light-years across. The Sun sits about 26,000 light-years from the galactic centre.',
            uz_text='Bizning galaktikamizda 100-400 milliard yulduz bor va u taxminan 100,000 yorug\'lik yili kengligi. Quyosh galaktika markazidan taxminan 26,000 yorug\'lik yili masofada joylashgan.',
            ru_text='Наша галактика содержит 100–400 миллиардов звёзд и имеет около 100 000 световых лет в поперечнике. Солнце находится примерно в 26 000 световых лет от центра Галактики.',
            questions=[
                ('How many stars are in the Milky Way (approximate)?', 'Somon yo\'lida taxminan nechta yulduz bor?', 'Сколько примерно звёзд в Млечном Пути?',
                 [('A','10 million','10 million','10 миллионов'),('B','1 billion','1 milliard','1 миллиард'),('C','100–400 billion','100-400 milliard','100–400 миллиардов'),('D','1 trillion','1 trillion','1 триллион')],
                 'C', 'Estimates range from 100 to 400 billion stars.', 'Taxminlar 100 dan 400 milliard yulduzgacha.', 'По оценкам, от 100 до 400 миллиардов звёзд.'),
            ]
        )
        self._make_lesson(unit4, 'black-holes', 2,
            'Black Holes', 'Qora tuynuklar', 'Чёрные дыры',
            'explanation', 65,
            en_text='A black hole is a region of spacetime where gravity is so strong that nothing — not even light — can escape. The boundary is called the event horizon.',
            uz_text='Qora tuynuk — bu tortishish kuchi shunchalik kuchli bo\'lgan fazovaqt mintaqasiki, hech narsa — hatto yorug\'lik ham — qochib chiqolmaydi.',
            ru_text='Чёрная дыра — область пространства-времени, где гравитация настолько сильна, что ничто — даже свет — не может вырваться наружу.',
            questions=[
                ('What is the boundary of a black hole called?', 'Qora tuynukning chegarasi nima deb ataladi?', 'Как называется граница чёрной дыры?',
                 [('A','Photon sphere','Foton sferasi','Фотонная сфера'),('B','Event horizon','Hodisalar gorizonti','Горизонт событий'),('C','Singularity','Singularlik','Сингулярность'),('D','Accretion disk','Akkresiya diski','Аккреционный диск')],
                 'B', 'The event horizon is the point of no return.', 'Hodisalar gorizonti qaytib bo\'lmaydigan nuqtadir.', 'Горизонт событий — точка невозврата.'),
            ]
        )

        # ── Level 3: Space Exploration ─────────────
        lv3 = Level.objects.create(
            slug='space-exploration', order=3,
            title_en='Space Exploration',
            title_uz='Kosmosni tadqiq etish',
            title_ru='Исследование космоса',
            description_en='From Sputnik to the Moon, Mars rovers to the ISS — humanity\'s journey into the cosmos.',
            description_uz='Sputnikdan Oygacha, Mars roverlaridan XKS gacha — insoniyatning koinotga sayohati.',
            description_ru='От Спутника до Луны, марсоходов и МКС — путешествие человечества в космос.',
            icon='Rocket', color='purple-500',
        )

        unit5 = Unit.objects.create(
            level=lv3, slug='space-race', order=1,
            title_en='The Space Race', title_uz='Kosmik poyga', title_ru='Космическая гонка',
            xp_reward=400, fuel_reward=180,
        )
        self._make_lesson(unit5, 'sputnik-gagarin', 1,
            'Sputnik & Gagarin', 'Sputnik va Gagarin', 'Спутник и Гагарин',
            'explanation', 55,
            en_text='On 4 October 1957, the USSR launched Sputnik 1 — the first artificial satellite. On 12 April 1961, Yuri Gagarin became the first human in space.',
            uz_text='1957-yil 4-oktabrda SSSR birinchi sun\'iy yo\'ldosh — Sputnik 1 ni uchirdi. 1961-yil 12-aprelda Yuriy Gagarin kosmosga chiqqan birinchi inson bo\'ldi.',
            ru_text='4 октября 1957 года СССР запустил Спутник-1 — первый искусственный спутник. 12 апреля 1961 года Юрий Гагарин стал первым человеком в космосе.',
            questions=[
                ('When was Sputnik 1 launched?', 'Sputnik 1 qachon uchirildi?', 'Когда был запущен Спутник-1?',
                 [('A','1955','1955','1955'),('B','1957','1957','1957'),('C','1961','1961','1961'),('D','1969','1969','1969')],
                 'B', 'Sputnik 1 launched on October 4, 1957.', 'Sputnik 1 1957-yil 4-oktabrda uchirildi.', 'Спутник-1 запущен 4 октября 1957 года.'),
            ]
        )
        self._make_lesson(unit5, 'moon-landing', 2,
            'Moon Landing', 'Oyga qo\'nish', 'Посадка на Луну',
            'explanation', 60,
            en_text='On July 20, 1969, Apollo 11 landed on the Moon. Neil Armstrong became the first human to walk on the Moon, followed by Buzz Aldrin.',
            uz_text='1969-yil 20-iyulda Apollo 11 Oyga qo\'ndi. Neil Armstrong Oyda yurgan birinchi inson bo\'ldi, so\'ngra Buzz Oldrin.',
            ru_text='20 июля 1969 года «Аполлон-11» совершил посадку на Луну. Нил Армстронг стал первым человеком, ступившим на Луну, за ним — Базз Олдрин.',
            questions=[
                ('Who was the first human to walk on the Moon?', 'Oyda yurgan birinchi inson kim edi?', 'Кто первым ступил на Луну?',
                 [('A','Buzz Aldrin','Buzz Oldrin','Базз Олдрин'),('B','Michael Collins','Michael Collins','Майкл Коллинз'),('C','Neil Armstrong','Neil Armstrong','Нил Армстронг'),('D','Yuri Gagarin','Yuriy Gagarin','Юрий Гагарин')],
                 'C', 'Neil Armstrong stepped onto the Moon at 02:56 UTC on July 21, 1969.', 'Neil Armstrong 1969-yil 21-iyulda 02:56 UTC da Oyga qadam qo\'ydi.', 'Нил Армстронг ступил на Луну 21 июля 1969 года в 02:56 UTC.'),
            ]
        )

        unit6 = Unit.objects.create(
            level=lv3, slug='modern-missions', order=2,
            title_en='Modern Missions', title_uz='Zamonaviy missiyalar', title_ru='Современные миссии',
            xp_reward=450, fuel_reward=200,
        )
        self._make_lesson(unit6, 'iss', 1,
            'International Space Station', 'Xalqaro Kosmik Stansiya', 'МКС',
            'explanation', 50,
            en_text='The ISS has been continuously inhabited since 2000. It orbits Earth at about 400 km altitude, traveling at 7.7 km/s — completing one orbit every 90 minutes.',
            uz_text='XKS 2000-yildan beri doimiy ravishda odamlar yashaydigan joy. U Yerdan taxminan 400 km balandlikda, 7.7 km/s tezlikda aylanadi.',
            ru_text='МКС непрерывно обитаема с 2000 года. Она вращается на высоте около 400 км со скоростью 7,7 км/с — один оборот каждые 90 минут.',
            questions=[
                ('At what altitude does the ISS orbit?', 'XKS qancha balandlikda aylanadi?', 'На какой высоте летит МКС?',
                 [('A','200 km','200 km','200 км'),('B','400 km','400 km','400 км'),('C','800 km','800 km','800 км'),('D','2000 km','2000 km','2000 км')],
                 'B', 'The ISS orbits at approximately 400 km.', 'XKS taxminan 400 km balandlikda aylanadi.', 'МКС летит на высоте около 400 км.'),
            ]
        )
        self._make_lesson(unit6, 'mars-rovers', 2,
            'Mars Rovers', 'Mars roverlari', 'Марсоходы',
            'explanation', 55,
            en_text='Mars rovers — Sojourner, Spirit, Opportunity, Curiosity, and Perseverance — explore the Martian surface. Perseverance landed in 2021 and searched for signs of ancient life.',
            uz_text='Mars roverlari — Sojourner, Spirit, Opportunity, Curiosity va Perseverance — Mars sirtini o\'rganadi. Perseverance 2021-yilda qo\'ndi va qadimgi hayot izlarini qidirdi.',
            ru_text='Марсоходы — Sojourner, Spirit, Opportunity, Curiosity и Perseverance — исследуют поверхность Марса. Perseverance приземлился в 2021 году и ищет признаки древней жизни.',
            questions=[
                ('Which Mars rover landed in 2021?', 'Qaysi Mars roveri 2021-yilda qo\'ndi?', 'Какой марсоход приземлился в 2021 году?',
                 [('A','Curiosity','Curiosity','Curiosity'),('B','Spirit','Spirit','Spirit'),('C','Perseverance','Perseverance','Perseverance'),('D','Opportunity','Opportunity','Opportunity')],
                 'C', 'Perseverance landed in Jezero Crater on February 18, 2021.', 'Perseverance 2021-yil 18-fevralda Jezero krateriga qo\'ndi.', 'Perseverance приземлился в кратере Езеро 18 февраля 2021 года.'),
            ]
        )

        self.stdout.write(f'  Created {Level.objects.count()} levels, {Unit.objects.count()} units, {Lesson.objects.count()} lessons')

    def _make_lesson(self, unit, slug, order, en, uz, ru, ltype, xp,
                     en_text, uz_text, ru_text, questions=None):
        lesson = Lesson.objects.create(
            unit=unit, slug=slug, order=order,
            title_en=en, title_uz=uz, title_ru=ru,
            lesson_type=ltype, xp_reward=xp, estimated_minutes=10,
        )
        LessonSection.objects.create(
            lesson=lesson, order=1, section_type='text',
            content_en={'text': en_text},
            content_uz={'text': uz_text},
            content_ru={'text': ru_text},
        )
        for i, (qid, qen, quz, qru, opts, correct, exp_en, exp_uz, exp_ru) in enumerate(questions or []):
            QuizQuestion.objects.create(
                lesson=lesson, order=i + 1,
                text_en=qen, text_uz=quz, text_ru=qru,
                options=[{'id': o[0], 'en': o[1], 'uz': o[2], 'ru': o[3]} for o in opts],
                correct_answer=correct,
                explanation_en=exp_en, explanation_uz=exp_uz, explanation_ru=exp_ru,
            )
        return lesson

    # ──────────────────────────────────────────────
    def _seed_badges(self):
        if Badge.objects.exists():
            self.stdout.write('  Badges already seeded — skipping')
            return

        badges = [
            ('first-lesson',   'First Step',       'Birinchi qadam',       'Первый шаг',       'Complete your first lesson',          'Birinchi darsni tugatish',           'Завершите первый урок',           '🎯', 'lessons',       1),
            ('explorer-5',     'Space Explorer',   'Kosmik kashfiyotchi',  'Космический первопроходец', 'Complete 5 lessons', '5 ta darsni tugatish', 'Завершите 5 уроков',                '🚀', 'lessons',       5),
            ('scholar-10',     'Cosmic Scholar',   'Kosmik olim',          'Космический учёный',       'Complete 10 lessons','10 ta darsni tugatish','Завершите 10 уроков',               '📚', 'lessons',      10),
            ('streak-3',       'Comet Rider',      'Kometa chavandozi',    'Наездник комет',           '3-day streak',       '3 kunlik seria',       '3 дня подряд',                     '☄️', 'streak',         3),
            ('streak-7',       'Orbit Master',     'Orbit ustasi',         'Мастер орбиты',            '7-day streak',       '7 kunlik seria',       '7 дней подряд',                    '🌍', 'streak',         7),
            ('xp-500',         'Rising Star',      'Ko\'tarilayotgan yulduz','Восходящая звезда',      'Earn 500 XP',        '500 XP yig\'ing',      'Заработайте 500 XP',               '⭐', 'xp_threshold',  500),
            ('xp-2000',        'Stellar Mind',     'Yulduz aqli',          'Звёздный разум',           'Earn 2000 XP',       '2000 XP yig\'ing',     'Заработайте 2000 XP',              '✨', 'xp_threshold', 2000),
            ('xp-5000',        'Galaxy Brain',     'Galaktika aqli',       'Галактический разум',      'Earn 5000 XP',       '5000 XP yig\'ing',     'Заработайте 5000 XP',              '🌌', 'xp_threshold', 5000),
        ]
        for data in badges:
            Badge.objects.create(
                slug=data[0], title_en=data[1], title_uz=data[2], title_ru=data[3],
                description_en=data[4], description_uz=data[5], description_ru=data[6],
                icon=data[7], condition_type=data[8], condition_value=data[9],
            )
        self.stdout.write(f'  Created {Badge.objects.count()} badges')

    # ──────────────────────────────────────────────
    def _seed_market(self):
        if MarketItem.objects.exists():
            self.stdout.write('  Market items already seeded — skipping')
            return

        items = [
            ('rocket-basic',   'Basic Rocket',       'Asosiy raketa',        'Базовая ракета',       'Your first ship — reliable and fast.', '...', '...', 'spaceship', 0),
            ('rocket-pro',     'Rocket Pro',          'Rocket Pro',           'Ракета Про',           'Upgraded thrusters and stabilisers.',  '...', '...', 'spaceship', 80),
            ('cosmic-cruiser', 'Cosmic Cruiser',      'Kosmik kruizer',       'Космический крейсер',  'Long-range exploration ship.',         '...', '...', 'spaceship', 200),
            ('xp-boost-2x',    '2× XP Boost',         '2× XP Boost',          '2× Бонус XP',          'Double XP for 24 hours.',              '...', '...', 'boost',     120),
            ('star-badge',     'Star Collector Badge','Yulduz kollektori',    'Значок коллектора',    'Exclusive cosmetic badge.',            '...', '...', 'badge',     150),
        ]
        for data in items:
            MarketItem.objects.create(
                slug=data[0], title_en=data[1], title_uz=data[2], title_ru=data[3],
                description_en=data[4], description_uz=data[5], description_ru=data[6],
                item_type=data[7], cost_fuel=data[8],
            )
        self.stdout.write(f'  Created {MarketItem.objects.count()} market items')

    # ──────────────────────────────────────────────
    def _seed_chat(self):
        if ChatRoom.objects.exists():
            self.stdout.write('  Chat rooms already seeded — skipping')
            return
        ChatRoom.objects.create(slug='general', name='General', is_global=True)
        ChatRoom.objects.create(slug='uzbekistan', name='O\'zbekiston', is_global=True)
        ChatRoom.objects.create(slug='astronomy', name='Astronomy Talk', is_global=True)
        self.stdout.write('  Created 3 chat rooms')
