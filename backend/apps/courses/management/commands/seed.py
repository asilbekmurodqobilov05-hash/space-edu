from django.core.management.base import BaseCommand
from django.db import transaction

from apps.events.models import SpaceEvent
from apps.gamification.models import Badge
from apps.market.models import MarketItem
from apps.chat.models import ChatRoom
from apps.news.models import NewsArticle


class Command(BaseCommand):
    help = 'Seed database with demo content'

    @transaction.atomic
    def handle(self, *args, **options):
        # `_seed_levels` went with the Level branch (ADR 0001). The learn tree is
        # seeded by `manage.py seed_learn_content`, which reads the real content
        # instead of a hand-written demo copy of it.
        self._seed_badges()
        self._seed_market()
        self._seed_chat()
        self._seed_news()
        self._seed_events()
        self.stdout.write(self.style.SUCCESS('Seed complete'))

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

    # ──────────────────────────────────────────────
    def _seed_news(self):
        if NewsArticle.objects.exists():
            self.stdout.write('  News already seeded — skipping')
            return

        articles = [
            {
                'title_en': 'James Webb Telescope Captures Ancient Galaxy Cluster',
                'title_uz': 'Webb teleskopi qadimiy galaktika klasterini suratga oldi',
                'title_ru': 'Телескоп Джеймс Уэбб снял древнее скопление галактик',
                'summary_en': 'The JWST has imaged a galaxy cluster dating back 13 billion years, offering unprecedented insight into the early universe and galaxy formation.',
                'summary_uz': 'JWST teleskopi 13 milliard yillik galaktika klasterini suratga oldi va dastlabki koinot hamda galaktika shakllanishi haqida tengsiz ma\'lumot berdi.',
                'summary_ru': 'JWST запечатлел скопление галактик возрастом 13 миллиардов лет, предоставив беспрецедентное понимание ранней Вселенной.',
                'content_en': 'The James Webb Space Telescope continues to rewrite our understanding of the cosmos. In its latest observation, JWST captured an ancient galaxy cluster dating back approximately 13 billion years — just 700 million years after the Big Bang. The images reveal intricate structures of dark matter and hot gas that were previously invisible to astronomers. Scientists are particularly excited about the gravitational lensing effects, which allow JWST to peer at galaxies behind the cluster with extraordinary clarity.',
                'content_uz': 'Jeyms Uebb kosmik teleskopi koinot haqidagi tushunchamizni qayta yozishda davom etmoqda. So\'nggi kuzatishida JWST taxminan 13 milliard yillik qadimiy galaktika klasterini suratga oldi.',
                'content_ru': 'Космический телескоп Джеймс Уэбб продолжает переписывать наше понимание космоса. В своём последнем наблюдении JWST запечатлел древнее скопление галактик возрастом около 13 миллиардов лет.',
                'category': 'discovery',
                'source': 'NASA JWST Mission',
                'source_url': 'https://webbtelescope.org',
            },
            {
                'title_en': 'Artemis III Moon Mission Prepares for Historic Lunar Landing',
                'title_uz': 'Artemis III missiyasi tarixiy Oy qo\'nishiga tayyorlanmoqda',
                'title_ru': 'Миссия Artemis III готовится к исторической посадке на Луну',
                'summary_en': 'NASA\'s Artemis III mission is on track to return humans to the lunar surface for the first time since Apollo 17 in 1972, targeting the Moon\'s south pole.',
                'summary_uz': 'NASA Artemis III missiyasi 1972-yilgi Apollo 17 dan beri birinchi marta odamlarni Oy yuzasiga qaytarishga tayyorlanmoqda.',
                'summary_ru': 'Миссия Artemis III на пути к возвращению людей на поверхность Луны впервые с момента полёта Apollo 17 в 1972 году.',
                'content_en': 'The Artemis III mission marks a new era of lunar exploration. Unlike Apollo missions, Artemis will land near the lunar south pole — a region believed to contain vast deposits of water ice. These resources could support future long-duration missions and eventually serve as a stepping stone to Mars. The mission will carry the first woman and first person of colour to the lunar surface, representing a milestone in the democratization of space exploration.',
                'content_uz': 'Artemis III missiyasi oy tadqiqotlarining yangi davrini belgilaydi. Apollo missiyalaridan farqli o\'laroq, Artemis Oyning janubiy qutbiga qo\'nadi.',
                'content_ru': 'Миссия Artemis III знаменует новую эру исследования Луны. В отличие от миссий Apollo, Artemis приземлится вблизи южного полюса Луны.',
                'category': 'mission',
                'source': 'NASA Artemis',
                'source_url': 'https://www.nasa.gov/artemis',
            },
            {
                'title_en': 'Mars Sample Return Mission: Perseverance Tubes Ready for Earth',
                'title_uz': 'Mars namunalarini qaytarish missiyasi: Perseverance naychalar Yerga tayyor',
                'title_ru': 'Миссия по возвращению образцов с Марса: тюбики Perseverance готовы',
                'summary_en': 'Perseverance rover has completed sealing 38 sample tubes containing Martian rock and soil, marking a crucial step toward returning the first Mars samples to Earth.',
                'summary_uz': 'Perseverance roveri Mars jinslari va tuproqni o\'z ichiga olgan 38 ta namunaviy naychalarni muhrlashni yakunladi.',
                'summary_ru': 'Марсоход Perseverance завершил герметизацию 38 тюбиков с марсианской породой и грунтом.',
                'content_en': 'The Mars Sample Return (MSR) campaign represents one of the most ambitious efforts in planetary science. Perseverance has successfully collected samples from diverse geological environments in Jezero Crater — a former lake bed that could preserve biosignatures of ancient Martian life. The samples will be retrieved by a future lander, launched into Mars orbit, and transferred to an Earth Return Orbiter for the journey home. Scientists expect the samples to arrive on Earth in the early 2030s.',
                'content_uz': 'Mars namunalarini qaytarish kampaniyasi sayyora fanidagi eng ambitsiyali sa\'y-harakatlardan birini ifodalaydi.',
                'content_ru': 'Кампания по возвращению образцов с Марса (MSR) представляет собой одно из самых амбициозных усилий в планетологии.',
                'category': 'mission',
                'source': 'NASA JPL',
                'source_url': 'https://mars.nasa.gov',
            },
            {
                'title_en': 'SpaceX Starship Completes Sixth Integrated Flight Test',
                'title_uz': 'SpaceX Starship oltinchi integral parvoz sinovini yakunladi',
                'title_ru': 'SpaceX Starship завершил шестое интегрированное лётное испытание',
                'summary_en': 'SpaceX\'s Starship successfully completed its sixth integrated flight test, demonstrating full reusability with both the Super Heavy booster and Starship returning to their launch infrastructure.',
                'summary_uz': 'SpaceX Starship muvaffaqiyatli oltinchi integral parvoz sinovini yakunladi, Super Heavy booster va Starship parvoz infratuzilmasiga qaytdi.',
                'summary_ru': 'Starship от SpaceX успешно завершил шестое интегрированное лётное испытание с полной возвращаемостью.',
                'content_en': 'SpaceX achieved a landmark moment when Starship\'s Super Heavy booster was caught mid-air by the Mechazilla launch tower\'s mechanical arms — a feat that was considered science fiction just years ago. Starship itself performed a controlled ocean splashdown. The milestone brings SpaceX\'s vision of full and rapid reusability one step closer to reality, potentially reducing the cost of reaching orbit by orders of magnitude. NASA has contracted SpaceX to use a modified Starship as the Artemis Human Landing System.',
                'content_uz': 'SpaceX Starship Super Heavy boosterni Mechazilla minorasi mexanik qo\'llari tomonidan havoda ushlaganda muhim lahzaga erishdi.',
                'content_ru': 'SpaceX достигла переломного момента, когда ускоритель Super Heavy был пойман в воздухе механическими руками башни Mechazilla.',
                'category': 'technology',
                'source': 'SpaceX',
                'source_url': 'https://www.spacex.com',
            },
            {
                'title_en': 'UZ COSMOS Academy Launches Nationwide Space Education Program',
                'title_uz': 'UZ COSMOS Akademiyasi butun O\'zbekiston bo\'ylab kosmik ta\'lim dasturini ishga tushirdi',
                'title_ru': 'Академия UZ COSMOS запустила общенациональную программу космического образования',
                'summary_en': 'UzbekCosmos has partnered with educational institutions across Uzbekistan to launch a comprehensive space education initiative, targeting over 50,000 students in the first year.',
                'summary_uz': 'O\'zberkosmos O\'zbekistondagi ta\'lim muassasalari bilan hamkorlikda 50,000 dan ortiq o\'quvchini birinchi yilda qamrab olishga yo\'naltirilgan kosmik ta\'lim tashabbusini ishga tushirdi.',
                'summary_ru': 'UzbekKosmos совместно с образовательными учреждениями Узбекистана запустил образовательную программу по космосу для более 50 000 студентов.',
                'content_en': 'In a historic step for Uzbekistan\'s space sector, UzbekCosmos has officially launched the UZ COSMOS Academy — a nationwide initiative designed to inspire the next generation of space scientists and engineers. The program combines interactive digital learning, hands-on experiments, and mentorship from leading scientists. Regional hubs will be established in Tashkent, Samarkand, Namangan, and Fergana. The initiative aligns with Uzbekistan\'s strategic goal of developing national space capabilities by 2030.',
                'content_uz': 'O\'zbekiston kosmik sektori uchun tarixiy qadam sifatida, O\'zberkosmos rasman UZ COSMOS Akademiyasini ishga tushirdi.',
                'content_ru': 'В историческом шаге для космической отрасли Узбекистана UzbekKosmos официально запустил Академию UZ COSMOS.',
                'category': 'local',
                'source': 'UzbekCosmos',
                'source_url': 'https://cosmos.uz',
            },
            {
                'title_en': 'Astronomers Detect Radio Signals from Potentially Habitable Exoplanet',
                'title_uz': 'Astronomlar potensial yashovchan ekzosayyoradan radio signallarini aniqladi',
                'title_ru': 'Астрономы обнаружили радиосигналы с потенциально обитаемой экзопланеты',
                'summary_en': 'Using the Square Kilometre Array, scientists have detected anomalous radio emissions from a rocky exoplanet in the habitable zone of a nearby star, sparking intense scientific debate.',
                'summary_uz': 'Kvadrat Kilometr Massiv yordamida olimlar yaqin yulduzning hayot uchun qulay zonasidagi toshli ekzosayyoradan g\'ayrioddiy radio chiqindilarni aniqladilar.',
                'summary_ru': 'Используя Square Kilometre Array, учёные обнаружили аномальные радиоэмиссии от скалистой экзопланеты в обитаемой зоне близлежащей звезды.',
                'content_en': 'In what could be the most significant discovery in the history of astronomy, scientists using the Square Kilometre Array (SKA) telescope have detected unusual radio signals originating from Proxima Centauri b — a rocky exoplanet orbiting within the habitable zone of our nearest stellar neighbour. The signals exhibit properties inconsistent with natural astrophysical phenomena, prompting a global coordinated observation campaign. Researchers urge caution, noting that instrumental artefacts and natural magnetospheric activity remain plausible explanations.',
                'content_uz': 'Astronomiya tarixidagi eng muhim kashfiyot bo\'lishi mumkin bo\'lgan narsa: SKA teleskopidan foydalangan olimlar Proxima Centauri b dan g\'ayrioddiy radio signallarini aniqladilar.',
                'content_ru': 'В том, что может стать самым значимым открытием в истории астрономии, учёные с помощью телескопа SKA обнаружили необычные радиосигналы из Proxima Centauri b.',
                'category': 'discovery',
                'source': 'SKA Observatory',
                'source_url': 'https://www.skao.int',
            },
        ]

        for a in articles:
            NewsArticle.objects.create(**a)
        self.stdout.write(f'  Created {NewsArticle.objects.count()} news articles')

    # ──────────────────────────────────────────────
    def _seed_events(self):
        if SpaceEvent.objects.exists():
            self.stdout.write('  Events already seeded — skipping')
            return

        historical = [
            {
                'title_en': 'Ulugh Beg Observatory Founded',
                'title_uz': 'Ulug\'bek rasadxonasi tashkil etildi',
                'title_ru': 'Основана обсерватория Улугбека',
                'description_en': 'Sultan Ulugh Beg commissioned the construction of one of the medieval world\'s most advanced observatories in Samarkand, Uzbekistan. Its instruments allowed the measurement of star positions to unprecedented accuracy.',
                'description_uz': 'Sulton Ulug\'bek O\'zbekistonning Samarqand shahrida o\'rta asrlarning eng ilg\'or rasadxonasidan birini qurish buyrug\'ini berdi.',
                'description_ru': 'Султан Улугбек заказал строительство одной из самых передовых обсерваторий средневекового мира в Самарканде.',
                'event_date': '1424-01-01',
                'event_type': 'milestone',
                'source_url': 'https://www.youtube.com/embed/U5mMLN8fM0Y',
                'is_historical': True,
                'is_featured': False,
            },
            {
                'title_en': 'Sputnik 1 — First Artificial Satellite',
                'title_uz': 'Sputnik 1 — birinchi sun\'iy yo\'ldosh',
                'title_ru': 'Спутник-1 — первый искусственный спутник',
                'description_en': 'The Soviet Union launched Sputnik 1, the Earth\'s first artificial satellite. It marked the start of the space age and the beginning of the space race between the USSR and the United States.',
                'description_uz': 'Sovet Ittifoqi Sputnik 1 ni uchirdi — Yerning birinchi sun\'iy yo\'ldoshini. Bu kosmik asrning boshlanishini va kosmik poyganing boshlanishini belgiladi.',
                'description_ru': 'Советский Союз запустил Спутник-1 — первый искусственный спутник Земли. Это ознаменовало начало космической эры.',
                'event_date': '1957-10-04',
                'event_type': 'milestone',
                'source_url': 'https://www.youtube.com/embed/K1jIvXzEwH0',
                'is_historical': True,
                'is_featured': True,
            },
            {
                'title_en': 'Yuri Gagarin — First Human in Space',
                'title_uz': 'Yuriy Gagarin — kosmosga chiqqan birinchi inson',
                'title_ru': 'Юрий Гагарин — первый человек в космосе',
                'description_en': 'Soviet cosmonaut Yuri Gagarin became the first human to journey into outer space aboard Vostok 1, completing one orbit of Earth in 108 minutes.',
                'description_uz': 'Sovet kosmonavti Yuriy Gagarin Vostok 1 kosmik kemasi bortida birinchi kosmosga sayohat qilgan inson bo\'ldi, 108 daqiqada Yerni bir marta aylanib chiqdi.',
                'description_ru': 'Советский космонавт Юрий Гагарин стал первым человеком, совершившим полёт в космос на корабле «Восток-1», облетев Землю за 108 минут.',
                'event_date': '1961-04-12',
                'event_type': 'milestone',
                'source_url': 'https://www.youtube.com/embed/pMBXL5S9HnQ',
                'is_historical': True,
                'is_featured': True,
            },
            {
                'title_en': 'Apollo 11 Moon Landing',
                'title_uz': 'Apollo 11 Oyga qo\'nishi',
                'title_ru': 'Посадка Аполлона-11 на Луну',
                'description_en': 'Apollo 11 astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon. Armstrong\'s famous words: "That\'s one small step for man, one giant leap for mankind."',
                'description_uz': 'Apollo 11 astronavtlari Neil Armstrong va Buzz Oldrin Oyda yurgan birinchi insonlar bo\'ldi. Armstrongning mashhur so\'zlari: "Bu inson uchun kichik qadam, insoniyat uchun ulkan sakrash."',
                'description_ru': 'Астронавты Apollo 11 Нил Армстронг и Базз Олдрин стали первыми людьми, ступившими на Луну. Знаменитые слова Армстронга: "Маленький шаг для человека — гигантский скачок для человечества."',
                'event_date': '1969-07-20',
                'event_type': 'milestone',
                'source_url': 'https://www.youtube.com/embed/cb1EWXqO1eA',
                'is_historical': True,
                'is_featured': True,
            },
            {
                'title_en': 'Hubble Space Telescope Launch',
                'title_uz': 'Hubble kosmik teleskopi uchirilishi',
                'title_ru': 'Запуск космического телескопа Хаббл',
                'description_en': 'The Hubble Space Telescope was deployed from the Space Shuttle Discovery. Despite an initial mirror flaw, a servicing mission in 1993 transformed Hubble into one of humanity\'s most powerful scientific instruments.',
                'description_uz': 'Hubble kosmik teleskopi Discovery kosmik shattlidan chiqarildi. Dastlabki ko\'zgu nuqsoni bo\'lishiga qaramay, 1993-yildagi xizmat ko\'rsatish missiyasi Hubbalni eng kuchli ilmiy asbobga aylantirdi.',
                'description_ru': 'Космический телескоп Хаббл был развёрнут с борта шаттла Discovery. Несмотря на начальный дефект зеркала, миссия по обслуживанию в 1993 году превратила Хаббл в один из самых мощных научных инструментов.',
                'event_date': '1990-04-24',
                'event_type': 'mission',
                'source_url': 'https://www.youtube.com/embed/_-jwA1m0T-Y',
                'is_historical': True,
                'is_featured': False,
            },
            {
                'title_en': 'International Space Station — First Module Launch',
                'title_uz': 'Xalqaro Kosmik Stansiya — birinchi modul uchirilishi',
                'title_ru': 'МКС — запуск первого модуля',
                'description_en': 'The Zarya module, the first component of the International Space Station, was launched aboard a Russian Proton rocket. The ISS has since become the largest human-made structure in space.',
                'description_uz': 'Zarya moduli, Xalqaro Kosmik Stansiyaning birinchi komponenti, rus Proton raketasi yordamida uchirildi.',
                'description_ru': 'Модуль «Заря», первый компонент МКС, был запущен на российской ракете «Протон».',
                'event_date': '1998-11-20',
                'event_type': 'mission',
                'source_url': 'https://www.youtube.com/embed/XBPjVzSoepo',
                'is_historical': True,
                'is_featured': False,
            },
            {
                'title_en': 'James Webb Space Telescope Launch',
                'title_uz': 'Jeyms Uebb kosmik teleskopi uchirilishi',
                'title_ru': 'Запуск космического телескопа Джеймс Уэбб',
                'description_en': 'The most powerful space telescope ever built was launched on an Ariane 5 rocket from Kourou, French Guiana. JWST observes the universe in infrared light, revealing objects too old and distant for Hubble.',
                'description_uz': 'Hech qachon qurilgan eng kuchli kosmik teleskop Kourou, Frantsuz Gvianasidan Ariane 5 raketa yordamida uchirildi.',
                'description_ru': 'Самый мощный когда-либо построенный космический телескоп был запущен на ракете Ariane 5 из Куру, Французская Гвиана.',
                'event_date': '2021-12-25',
                'event_type': 'mission',
                'source_url': 'https://www.youtube.com/embed/tnmBqE2E208',
                'is_historical': True,
                'is_featured': True,
            },
            {
                'title_en': 'UzbekCosmos Space Agency Established',
                'title_uz': 'O\'zberkosmos kosmik agentligi tashkil etildi',
                'title_ru': 'Создано космическое агентство UzbekCosmos',
                'description_en': 'Uzbekistan established UzbekCosmos, its national space agency, with a mandate to develop satellite communications, remote sensing, and space education programs.',
                'description_uz': 'O\'zbekiston o\'zining milliy kosmik agentligi — O\'zberkosmos ni tashkil etdi. Vazifasi: sun\'iy yo\'ldosh aloqasi, masofadan zondlash va kosmik ta\'limni rivojlantirish.',
                'description_ru': 'Узбекистан создал UzbekKosmos — национальное космическое агентство с задачами развития спутниковой связи, дистанционного зондирования и космического образования.',
                'event_date': '2019-06-01',
                'event_type': 'milestone',
                'source_url': 'https://cosmos.uz',
                'is_historical': True,
                'is_featured': False,
            },
        ]

        upcoming = [
            {
                'title_en': 'Eta Aquariids Meteor Shower',
                'title_uz': 'Eta Akvariidlar meteor yomg\'iri',
                'title_ru': 'Метеорный поток Эта Аквариид',
                'description_en': 'The Eta Aquariids is an above-average meteor shower caused by dust particles from Halley\'s Comet. Capable of producing up to 60 meteors per hour at its peak, it is best viewed from the Southern Hemisphere.',
                'description_uz': 'Eta Akvariidlar Galley kometasidan changli zarralardan kelib chiqqan o\'rtacha darajadan yuqori meteor yomg\'iridir. Cho\'qqisida soatiga 60 ta meteorni ishlab chiqarishi mumkin.',
                'description_ru': 'Метеорный поток Эта Аквариид вызван пылевыми частицами кометы Галлея. В пик активности возможно до 60 метеоров в час.',
                'event_date': '2026-05-06',
                'event_type': 'meteor_shower',
                'event_time': 'Peak: Pre-dawn hours',
                'visibility': 'Best from Southern Hemisphere, visible globally from dark sites.',
                'facts': [
                    'Meteors are fast and often leave glowing "trains" behind.',
                    'Produced by debris from Halley\'s Comet.',
                    'Best viewed after midnight from a dark location.',
                ],
                'is_featured': True,
                'is_historical': False,
            },
            {
                'title_en': 'Total Solar Eclipse',
                'title_uz': 'To\'liq Quyosh tutilishi',
                'title_ru': 'Полное солнечное затмение',
                'description_en': 'A total solar eclipse occurs when the Moon completely blocks the Sun, revealing the beautiful solar corona. The path of totality will cross the Arctic, Greenland, Iceland, and Spain.',
                'description_uz': 'To\'liq quyosh tutilishi Oy Quyoshni to\'liq to\'sib qo\'yganida sodir bo\'ladi va go\'zal quyosh korona namoyon bo\'ladi.',
                'description_ru': 'Полное солнечное затмение происходит, когда Луна полностью закрывает Солнце, обнажая красивую солнечную корону.',
                'event_date': '2026-08-12',
                'event_type': 'solar_eclipse',
                'event_time': '17:45 UTC',
                'visibility': 'Arctic, Greenland, Iceland, Atlantic Ocean, northern Spain.',
                'facts': [
                    'Never look directly at the Sun without proper eclipse glasses.',
                    'The path of totality is only about 100 km wide.',
                    'During totality, stars are visible in the daytime sky.',
                ],
                'is_featured': True,
                'is_historical': False,
            },
            {
                'title_en': 'Perseid Meteor Shower',
                'title_uz': 'Perseid meteor yomg\'iri',
                'title_ru': 'Метеорный поток Персеиды',
                'description_en': 'The Perseids are one of the best annual meteor showers, producing up to 100 meteors per hour at peak. They are bright, fast, and leave long glowing trails. The shower is caused by debris from comet Swift-Tuttle.',
                'description_uz': 'Perseidlar eng yaxshi yillik meteor yomg\'irlaridan biri bo\'lib, cho\'qqisida soatiga 100 ta meteorni ishlab chiqaradi.',
                'description_ru': 'Персеиды — один из лучших ежегодных метеорных потоков, в пик активности до 100 метеоров в час.',
                'event_date': '2026-08-12',
                'event_type': 'meteor_shower',
                'event_time': 'Peak: 02:00–04:00 local time',
                'visibility': 'Northern Hemisphere. Best from dark rural areas.',
                'facts': [
                    'Produced by debris from comet 109P/Swift-Tuttle.',
                    'Meteors travel at 59 km/s and are known for fireballs.',
                    'No telescope needed — best viewed with naked eye.',
                ],
                'is_featured': False,
                'is_historical': False,
            },
            {
                'title_en': 'Total Lunar Eclipse (Blood Moon)',
                'title_uz': 'To\'liq Oy tutilishi (Qon Oy)',
                'title_ru': 'Полное лунное затмение (Кровавая Луна)',
                'description_en': 'A total lunar eclipse occurs when the Moon passes through Earth\'s full shadow (umbra), turning it a vivid red or orange — earning the nickname "Blood Moon". The event is safe to watch with the naked eye.',
                'description_uz': 'To\'liq oy tutilishi Oy Yerning to\'liq soyasidan (umbra) o\'tganda sodir bo\'ladi va u yorqin qizil yoki to\'q sariq rangga aylanadi.',
                'description_ru': 'Полное лунное затмение происходит, когда Луна проходит через полную тень Земли, окрашиваясь в ярко-красный или оранжевый цвет.',
                'event_date': '2026-09-07',
                'event_type': 'lunar_eclipse',
                'event_time': '18:11 UTC',
                'visibility': 'Europe, Asia, Africa, Australia, Pacific, Americas.',
                'facts': [
                    'Safe to observe with naked eye — no special equipment needed.',
                    'The red colour is caused by Earth\'s atmosphere refracting sunlight.',
                    'Duration of totality: approximately 85 minutes.',
                ],
                'is_featured': True,
                'is_historical': False,
            },
            {
                'title_en': 'Close Approach: Jupiter at Opposition',
                'title_uz': 'Yaqinlashuv: Yupiter qarama-qarshi holatda',
                'title_ru': 'Сближение: Юпитер в противостоянии',
                'description_en': 'Jupiter reaches opposition, meaning it rises at sunset and sets at sunrise, staying visible all night. At this time it is closest to Earth and shines at its brightest — a perfect opportunity for telescopic observation.',
                'description_uz': 'Yupiter qarama-qarshi holatga yetadi: quyosh botganda ko\'tariladi va quyosh chiqqanda botadi, butun tun davomida ko\'rinadi.',
                'description_ru': 'Юпитер достигает противостояния: восходит на закате, заходит на восходе, виден всю ночь в максимальном блеске.',
                'event_date': '2026-10-01',
                'event_type': 'observation',
                'event_time': 'All night',
                'visibility': 'Worldwide — visible to naked eye, excellent through binoculars or telescope.',
                'facts': [
                    'At opposition, Jupiter is about 591 million km from Earth.',
                    'Jupiter\'s four Galilean moons are visible through binoculars.',
                    'The Great Red Spot can be seen through a small telescope.',
                ],
                'is_featured': False,
                'is_historical': False,
            },
        ]

        for data in historical:
            SpaceEvent.objects.create(**data)
        for data in upcoming:
            SpaceEvent.objects.create(**data)

        self.stdout.write(f'  Created {SpaceEvent.objects.count()} space events')
