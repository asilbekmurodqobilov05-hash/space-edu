from django.core.management.base import BaseCommand
from apps.courses.models import Level, Unit, Lesson, LessonSection, QuizQuestion

UNITS = [
  # (level_slug, unit_slug, order, title_en, title_uz, title_ru, xp, fuel)
  ('mercury','solar-system-intro',2,'The Solar System','Quyosh tizimi','Солнечная система',120,60),
  ('mercury','what-is-space',3,'What is Space?','Kosmos nima?','Что такое космос?',100,50),
  ('venus','stars-and-life',2,'Life of Stars','Yulduzlar hayoti','Жизнь звёзд',150,70),
  ('venus','constellations',3,'Constellations','Yulduz turkumlari','Созвездия',120,60),
  ('earth','atmosphere',2,'Earth Atmosphere','Yer atmosferasi','Атмосфера Земли',130,65),
  ('earth','moon-phases',3,'Moon & Tides','Oy va suv toshqinlari','Луна и приливы',140,70),
  ('mars','mars-exploration',2,'Mars Rovers','Mars roverlari','Марсоходы',160,80),
  ('mars','terraforming',3,'Terraforming Mars','Marsni terraforming','Терраформирование Марса',180,90),
  ('jupiter','gas-giants',2,'Gas Giants','Gaz gigantlari','Газовые гиганты',170,85),
  ('jupiter','jupiter-moons',3,"Jupiter's Moons",'Yupiter oylari','Спутники Юпитера',160,80),
  ('saturn','rings-of-saturn',2,"Saturn's Rings",'Saturn halqalari','Кольца Сатурна',170,85),
  ('saturn','titan-moon',3,'Titan','Titan oyi','Титан',180,90),
  ('uranus','ice-giants',2,'Ice Giants','Muz gigantlari','Ледяные гиганты',190,95),
  ('neptune','kuiper-belt',2,'Kuiper Belt','Koyper kamari','Пояс Койпера',200,100),
  ('neptune','exoplanets',3,'Exoplanets','Ekzosayyoralar','Экзопланеты',220,110),
]

LESSONS = [
  # (unit_slug, lesson_slug, order, title_en, title_uz, title_ru, type, xp, mins)
  ('solar-system-intro','sun-center',1,'The Sun — Our Star','Quyosh — bizning yulduz','Солнце — наша звезда','explanation',60,12),
  ('solar-system-intro','inner-planets',2,'Inner Planets','Ichki sayyoralar','Внутренние планеты','explanation',60,15),
  ('solar-system-intro','outer-planets',3,'Outer Planets','Tashqi sayyoralar','Внешние планеты','explanation',60,15),
  ('solar-system-intro','quiz-solar',4,'Solar System Quiz','Quyosh tizimi quiz','Тест: Солнечная система','quiz',80,10),
  ('what-is-space','vacuum',1,'The Vacuum of Space','Kosmik bo\'shliq','Вакуум космоса','explanation',50,10),
  ('what-is-space','distances',2,'Cosmic Distances','Kosmik masofalar','Космические расстояния','explanation',50,12),
  ('what-is-space','quiz-space',3,'Space Basics Quiz','Kosmos quiz','Тест: Основы космоса','quiz',70,8),
  ('stars-and-life','star-birth',1,'How Stars Are Born','Yulduzlar qanday tug\'iladi','Как рождаются звёзды','explanation',70,15),
  ('stars-and-life','main-sequence',2,'Main Sequence','Asosiy ketma-ketlik','Главная последовательность','explanation',70,12),
  ('stars-and-life','supernovae',3,'Supernovae & Remnants','Supernova va qoldiqlar','Сверхновые и остатки','explanation',80,15),
  ('stars-and-life','quiz-stars',4,'Stars Quiz','Yulduzlar quiz','Тест: Звёзды','quiz',90,10),
  ('constellations','northern-sky',1,'Northern Constellations','Shimoliy yulduz turkumlari','Северные созвездия','explanation',60,12),
  ('constellations','zodiac',2,'The Zodiac','Zodiak','Зодиак','explanation',60,10),
  ('atmosphere','layers',1,'Atmospheric Layers','Atmosfera qatlamlari','Слои атмосферы','explanation',65,12),
  ('atmosphere','weather-space',2,'Space Weather','Kosmik ob-havo','Космическая погода','explanation',70,14),
  ('moon-phases','lunar-cycle',1,'Lunar Cycle','Oy sikli','Лунный цикл','explanation',70,12),
  ('moon-phases','eclipses',2,'Solar & Lunar Eclipses','Quyosh va Oy tutilishi','Солнечные и лунные затмения','explanation',80,15),
  ('moon-phases','quiz-moon',3,'Moon Quiz','Oy quiz','Тест: Луна','quiz',80,10),
  ('mars-exploration','curiosity',1,'Curiosity Rover','Curiosity roveri','Марсоход Curiosity','explanation',80,15),
  ('mars-exploration','perseverance',2,'Perseverance Mission','Perseverance missiyasi','Миссия Perseverance','explanation',80,15),
  ('terraforming','concept',1,'Terraforming Concept','Terraforming tushunchasi','Концепция терраформирования','explanation',90,18),
  ('gas-giants','composition',1,'Giant Planet Composition','Gigant sayyora tarkibi','Состав планет-гигантов','explanation',85,14),
  ('gas-giants','storms',2,'Great Red Spot','Buyuk Qizil Dog\'','Большое Красное Пятно','explanation',85,12),
  ('jupiter-moons','europa',1,'Europa — Ocean World','Yevropa — okean dunyosi','Европа — мир океанов','explanation',80,14),
  ('jupiter-moons','io',2,'Io — Volcanic Moon','Io — vulqon oyi','Ио — вулканический спутник','explanation',80,12),
  ('rings-of-saturn','ring-structure',1,'Ring Structure','Halqa tuzilishi','Структура колец','explanation',85,14),
  ('titan-moon','titan-atmosphere',1,"Titan's Atmosphere",'Titan atmosferasi','Атмосфера Титана','explanation',90,16),
  ('ice-giants','uranus-neptune',1,'Uranus vs Neptune','Uran va Neptun','Уран и Нептун','explanation',95,14),
  ('kuiper-belt','dwarf-planets',1,'Dwarf Planets','Mitti sayyoralar','Карликовые планеты','explanation',100,15),
  ('kuiper-belt','pluto',2,'Pluto & Beyond','Pluton va undan narida','Плутон и за его пределами','explanation',100,14),
  ('exoplanets','detection',1,'Finding Exoplanets','Ekzosayyoralarni topish','Обнаружение экзопланет','explanation',110,16),
  ('exoplanets','habitable-zone',2,'The Habitable Zone','Yashash mumkin zona','Обитаемая зона','explanation',110,15),
  ('exoplanets','quiz-exo',3,'Exoplanets Quiz','Ekzosayyora quiz','Тест: Экзопланеты','quiz',120,10),
]

SECTIONS_DATA = {
  'sun-center': [
    {'type':'text','en':{'title':'The Heart of Our System','body':'The Sun is a G-type main-sequence star (G2V). It contains 99.86% of all mass in the solar system. Its core temperature reaches 15 million °C, where hydrogen fuses into helium releasing enormous energy.'},'uz':{'title':'Tizimimiz yuragi','body':'Quyosh G-tipdagi asosiy ketma-ketlik yulduzi. U quyosh tizimidagi barcha massaning 99.86% ni o\'z ichiga oladi. Uning yadrosi harorati 15 million °C ga yetadi.'},'ru':{'title':'Сердце нашей системы','body':'Солнце — звезда главной последовательности типа G2V. Оно содержит 99,86% всей массы Солнечной системы. Температура ядра достигает 15 млн °C.'}},
    {'type':'text','en':{'title':'Solar Energy','body':'Every second, the Sun converts 600 million tons of hydrogen into helium. The energy travels from the core to the surface over 170,000 years, then reaches Earth in just 8 minutes and 20 seconds as light.'},'uz':{'title':'Quyosh energiyasi','body':'Har soniyada Quyosh 600 million tonna vodorodini geliyga aylantiradi. Energiya yadroda 170 000 yil sayohat qiladi, so\'ng Yerga nur sifatida atigi 8 daqiqa 20 soniyada yetib keladi.'},'ru':{'title':'Солнечная энергия','body':'Каждую секунду Солнце превращает 600 млн тонн водорода в гелий. Энергия проходит от ядра к поверхности за 170 000 лет, а затем достигает Земли за 8 минут 20 секунд.'}},
  ],
  'inner-planets': [
    {'type':'text','en':{'title':'Mercury, Venus, Earth, Mars','body':'The inner planets are rocky terrestrial worlds. Mercury is the smallest and closest to the Sun. Venus is the hottest due to its thick CO₂ atmosphere. Earth is the only known planet with liquid water and life. Mars, the Red Planet, has the tallest volcano — Olympus Mons (22 km).'},'uz':{'title':'Merkuriy, Venera, Yer, Mars','body':'Ichki sayyoralar tosh jinsli dunyo. Merkuriy eng kichik. Venera eng issiq. Yer — suyuq suv va hayot mavjud yagona sayyora. Mars esa eng baland vulqonga ega — Olimp tog\'i (22 km).'},'ru':{'title':'Меркурий, Венера, Земля, Марс','body':'Внутренние планеты — это каменистые миры. Меркурий — самая маленькая. Венера — самая горячая. Земля — единственная с жидкой водой и жизнью. Марс имеет самый высокий вулкан — Олимп (22 км).'}},
  ],
  'vacuum': [
    {'type':'text','en':{'title':'What Is the Vacuum?','body':'Space is not completely empty — it contains about 1 atom per cubic centimeter in interstellar space. By comparison, air at sea level has about 2.5×10¹⁹ molecules per cm³. This near-vacuum means no sound can travel, no convection occurs, and temperatures can vary from -270°C in shadows to +120°C in sunlight.'},'uz':{'title':'Vakuum nima?','body':'Kosmos to\'liq bo\'sh emas — yulduzlararo fazoda har kub santimetrda taxminan 1 ta atom bor. Taqqoslash uchun: dengiz sathidagi havoda ~2.5×10¹⁹ molekula bor. Bu deyarli vakuum tufayli ovoz tarqalmaydi, harorat -270°C dan +120°C gacha o\'zgaradi.'},'ru':{'title':'Что такое вакуум?','body':'Космос не полностью пуст — в межзвёздном пространстве около 1 атома на кубический сантиметр. Для сравнения: в воздухе на уровне моря ~2,5×10¹⁹ молекул. В почти полном вакууме звук не распространяется, температура варьируется от -270°C до +120°C.'}},
  ],
  'star-birth': [
    {'type':'text','en':{'title':'Stellar Nurseries','body':'Stars are born in giant molecular clouds — vast regions of gas and dust called nebulae. When gravity causes a region to collapse, the material heats up, forming a protostar. After millions of years of contraction, the core reaches 10 million °C and nuclear fusion ignites — a star is born!'},'uz':{'title':'Yulduz beshiklari','body':'Yulduzlar ulkan molekulyar bulutlarda — tumanliklar deb ataladigan gaz va chang mintaqalarida tug\'iladi. Tortishish kuchi mintaqani siqganda, material qiziydi va protoyulduz hosil bo\'ladi. Millionlab yillar o\'tib, yadro 10 million °C ga yetadi va termoyadro sintez boshlanadi!'},'ru':{'title':'Звёздные ясли','body':'Звёзды рождаются в гигантских молекулярных облаках — туманностях. Когда гравитация сжимает область, материя нагревается, формируя протозвезду. Через миллионы лет ядро достигает 10 млн °C и зажигается ядерный синтез — звезда рождена!'}},
  ],
  'supernovae': [
    {'type':'text','en':{'title':'Death of Massive Stars','body':'When a star 8+ times the Sun\'s mass exhausts its fuel, its core collapses in seconds, triggering a supernova — an explosion brighter than an entire galaxy. The remnant becomes either a neutron star (20 km wide but 1.4 solar masses) or a black hole. All elements heavier than iron in the universe were forged in supernovae.'},'uz':{'title':'Ulkan yulduzlar o\'limi','body':'Quyoshdan 8+ marta og\'ir yulduz yoqilg\'isini tugatganda, uning yadrosi soniyalarda qulaydi va supernova — butun galaktikadan ham yorqinroq portlash sodir bo\'ladi. Qoldiq neytron yulduz yoki qora tuynuk bo\'ladi. Koinotdagi temirdan og\'ir barcha elementlar supernovada yaratilgan.'},'ru':{'title':'Смерть массивных звёзд','body':'Когда звезда массой 8+ солнечных масс исчерпывает топливо, ядро коллапсирует за секунды, вызывая сверхновую — взрыв ярче целой галактики. Остаток становится нейтронной звездой или чёрной дырой. Все элементы тяжелее железа были созданы в сверхновых.'}},
  ],
}

QUIZ_DATA = {
  'quiz-solar': [
    ('Which planet is closest to the Sun?','Quyoshga eng yaqin sayyora qaysi?','Какая планета ближайшая к Солнцу?',['Mercury','Venus','Earth','Mars'],'A','Mercury orbits at just 58 million km.','Merkuriy atigi 58 mln km masofada.','Меркурий на расстоянии всего 58 млн км.'),
    ('How many planets are in our solar system?','Quyosh tizimida nechta sayyora bor?','Сколько планет в Солнечной системе?',['7','8','9','10'],'B','8 planets since Pluto was reclassified in 2006.','2006 yildan beri 8 ta sayyora.','8 планет с момента переклассификации Плутона в 2006 г.'),
    ('Which planet is known as the Red Planet?','Qaysi sayyora Qizil sayyora deb ataladi?','Какую планету называют Красной?',['Venus','Jupiter','Mars','Saturn'],'C','Mars appears red due to iron oxide on its surface.','Mars yuzasidagi temir oksidi sababli qizil ko\'rinadi.','Марс выглядит красным из-за оксида железа.'),
  ],
  'quiz-space': [
    ('What is the temperature of space in shadows?','Soyada kosmosning harorati qancha?','Какова температура космоса в тени?',['-270°C','-100°C','0°C','-50°C'],'A','Near absolute zero: about -270°C.','Mutlaq nolga yaqin: -270°C.','Почти абсолютный ноль: около -270°C.'),
    ('How long does light take to reach Earth from the Sun?','Quyosh nuri Yerga qancha vaqtda yetib keladi?','Сколько свет идёт от Солнца до Земли?',['1 minute','8 min 20 sec','1 hour','30 seconds'],'B','Light speed: ~300,000 km/s, distance ~150M km.','Yorug\'lik tezligi ~300 000 km/s.','Скорость света ~300 000 км/с.'),
  ],
  'quiz-stars': [
    ('What triggers nuclear fusion in a protostar?','Protoyulduzda termoyadro sintezni nima boshlaydi?','Что запускает ядерный синтез в протозвезде?',['Radiation','Core temperature reaching 10M°C','Magnetic fields','Solar wind'],'B','Fusion begins when the core reaches ~10 million degrees.','Yadro ~10 million darajaga yetganda sintez boshlanadi.','Синтез начинается при ~10 млн °C.'),
    ('What remains after a supernova of a massive star?','Ulkan yulduz supernovasidan keyin nima qoladi?','Что остаётся после сверхновой массивной звезды?',['White dwarf','Red giant','Neutron star or black hole','Nothing'],'C','Depending on mass: neutron star or black hole.','Massaga qarab: neytron yulduz yoki qora tuynuk.','В зависимости от массы: нейтронная звезда или чёрная дыра.'),
  ],
  'quiz-moon': [
    ('How long is a lunar cycle?','Oy sikli qancha davom etadi?','Сколько длится лунный цикл?',['7 days','14 days','29.5 days','365 days'],'C','The synodic period is approximately 29.5 days.','Sinodik davr taxminan 29.5 kun.','Синодический период ~29,5 дней.'),
  ],
  'quiz-exo': [
    ('What is the habitable zone?','Yashash mumkin zona nima?','Что такое обитаемая зона?',['The core of a star','Region where liquid water can exist','The asteroid belt','Edge of the galaxy'],'B','The Goldilocks zone where temperatures allow liquid water.','Suyuq suv mavjud bo\'ladigan zona.','Зона, где температура позволяет жидкой воде существовать.'),
    ('How are most exoplanets detected?','Ekzosayyoralar qanday aniqlanadi?','Как обнаруживают экзопланеты?',['Telescope images','Transit method','Sound waves','Gravity detectors'],'B','The transit method detects dips in star brightness.','Tranzit usuli yulduz yorqinligining kamayishini aniqlaydi.','Метод транзитов обнаруживает падения яркости звезды.'),
  ],
}

class Command(BaseCommand):
    help = 'Seed courses with rich educational content'

    def handle(self, *args, **options):
        # Add units
        created_u = 0
        for lslug, uslug, order, ten, tuz, tru, xp, fuel in UNITS:
            level = Level.objects.filter(slug=lslug).first()
            if not level:
                continue
            _, c = Unit.objects.get_or_create(level=level, slug=uslug, defaults={
                'order': order, 'title_en': ten, 'title_uz': tuz, 'title_ru': tru,
                'xp_reward': xp, 'fuel_reward': fuel,
            })
            if c: created_u += 1
        self.stdout.write(f'Units created: {created_u}')

        # Add lessons
        created_l = 0
        for uslug, lslug, order, ten, tuz, tru, ltype, xp, mins in LESSONS:
            unit = Unit.objects.filter(slug=uslug).first()
            if not unit:
                continue
            _, c = Lesson.objects.get_or_create(unit=unit, slug=lslug, defaults={
                'order': order, 'title_en': ten, 'title_uz': tuz, 'title_ru': tru,
                'lesson_type': ltype, 'xp_reward': xp, 'estimated_minutes': mins,
            })
            if c: created_l += 1
        self.stdout.write(f'Lessons created: {created_l}')

        # Add sections
        created_s = 0
        for lslug, secs in SECTIONS_DATA.items():
            lesson = Lesson.objects.filter(slug=lslug).first()
            if not lesson or lesson.sections.exists():
                continue
            for i, s in enumerate(secs, 1):
                LessonSection.objects.create(
                    lesson=lesson, order=i, section_type=s['type'],
                    content_en=s['en'], content_uz=s['uz'], content_ru=s['ru'],
                )
                created_s += 1
        self.stdout.write(f'Sections created: {created_s}')

        # Add quiz questions
        created_q = 0
        for lslug, questions in QUIZ_DATA.items():
            lesson = Lesson.objects.filter(slug=lslug).first()
            if not lesson or lesson.questions.exists():
                continue
            for i, (ten, tuz, tru, opts, ans, een, euz, eru) in enumerate(questions, 1):
                QuizQuestion.objects.create(
                    lesson=lesson, order=i,
                    text_en=ten, text_uz=tuz, text_ru=tru,
                    options=opts, correct_answer=ans,
                    explanation_en=een, explanation_uz=euz, explanation_ru=eru,
                )
                created_q += 1
        self.stdout.write(f'Quiz questions created: {created_q}')
        self.stdout.write(self.style.SUCCESS('✅ Seed complete!'))
