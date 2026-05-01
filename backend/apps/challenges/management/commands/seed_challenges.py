"""
Seed ChallengeQuestion pool from frontend quizData.js.
Usage:  python manage.py seed_challenges
"""
from django.core.management.base import BaseCommand
from apps.challenges.models import ChallengeQuestion


DIFF_MAP = {1: 'easy', 2: 'medium', 3: 'hard'}


class Command(BaseCommand):
    help = 'Populate ChallengeQuestion pool with quiz questions'

    def handle(self, *args, **options):
        self.stdout.write('Seeding challenge questions...')

        questions = [
            # ── General Space (beginner) ──
            dict(category='general', difficulty='easy',
                 question_en='Which planet is known as the Red Planet?',
                 question='Qaysi sayyora Qizil sayyora deb ataladi?',
                 options=['Venus', 'Mars', 'Jupiter', 'Saturn'], correct_answer=1),
            dict(category='general', difficulty='easy',
                 question_en='What is the closest star to Earth?',
                 question='Yerga eng yaqin yulduz qaysi?',
                 options=['Sirius', 'Alpha Centauri', 'The Sun', 'Betelgeuse'], correct_answer=2),
            dict(category='general', difficulty='easy',
                 question_en='Which planet is the largest in our solar system?',
                 question='Quyosh tizimidagi eng katta sayyora qaysi?',
                 options=['Earth', 'Saturn', 'Jupiter', 'Neptune'], correct_answer=2),
            dict(category='general', difficulty='easy',
                 question_en='How many moons does Earth have?',
                 question='Yerning nechta tabiiy yo\'ldoshi bor?',
                 options=['0', '1', '2', '3'], correct_answer=1),
            dict(category='general', difficulty='easy',
                 question_en='What do we call a rock from space that hits Earth?',
                 question='Kosmosdan kelib Yerga tushgan toshni nima deyiladi?',
                 options=['Meteor', 'Meteorite', 'Asteroid', 'Comet'], correct_answer=1),

            # ── General Space (intermediate) ──
            dict(category='general', difficulty='medium',
                 question_en='What is the name of the galaxy we live in?',
                 question='Biz yashaydigan galaktikaning nomi nima?',
                 options=['Andromeda', 'Triangulum', 'Milky Way', 'Sombrero'], correct_answer=2),
            dict(category='general', difficulty='medium',
                 question_en='Which planet rotates on its side?',
                 question='Qaysi sayyora yonboshlab aylanadi?',
                 options=['Uranus', 'Neptune', 'Saturn', 'Venus'], correct_answer=0),
            dict(category='general', difficulty='medium',
                 question_en='What is the hottest planet in our solar system?',
                 question='Quyosh tizimidagi eng issiq sayyora qaysi?',
                 options=['Mercury', 'Venus', 'Mars', 'Jupiter'], correct_answer=1),
            dict(category='general', difficulty='medium',
                 question_en='Who was the first human to travel into space?',
                 question='Kosmosga uchgan birinchi inson kim?',
                 options=['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'], correct_answer=2),

            # ── General Space (advanced) ──
            dict(category='general', difficulty='hard',
                 question_en='What is the approximate age of the Universe?',
                 question='Koinotning taxminiy yoshi qancha?',
                 options=['4.5 billion years', '13.8 billion years', '93 billion years', '1 trillion years'], correct_answer=1),
            dict(category='general', difficulty='hard',
                 question_en='What is the boundary around a black hole beyond which no light can escape?',
                 question='Qora tuynuk atrofidagi yorug\'lik qochib qutula olmaydigan chegara nima deyiladi?',
                 options=['Event Horizon', 'Singularity', 'Accretion Disk', 'Photon Sphere'], correct_answer=0),
            dict(category='general', difficulty='hard',
                 question_en='Which moon has a dense atmosphere?',
                 question='Qaysi yo\'ldoshda zich atmosfera bor?',
                 options=['Europa', 'Ganymede', 'Titan', 'Triton'], correct_answer=2),

            # ── Physics ──
            dict(category='physics', difficulty='easy',
                 question="Moddiy nuqta deb nimaga aytiladi?",
                 options=["O'lchamlari berilgan sharoitda e'tiborga olinmaydigan jismga", "O'ta kichik massali jismga", "Faqat bitta atomdan iborat jismga", "Harakatlanmaydigan jismga"],
                 correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Jism to'g'ri chiziq bo'ylab 5 m/s tezlik bilan harakatlanmoqda. 10 sekundda qanday masofa bosib o'tadi?",
                 options=["50 m", "2 m", "15 m", "500 m"], correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Tezligi har sekundda 2 m/s ga ortib boruvchi jismning tezlanishi qancha?",
                 options=["2 m/s^2", "0 m/s^2", "4 m/s^2", "0.5 m/s^2"], correct_answer=0),
            dict(category='physics', difficulty='medium',
                 question="Tezligi 4 m/s bo'lgan jism 2 m/s^2 tezlanish bilan harakatlansa, 5 sekunddan keyingi tezligi qancha?",
                 options=["14 m/s", "10 m/s", "6 m/s", "20 m/s"], correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Nyutonning birinchi qonuni nimani ifodalaydi?",
                 options=["Inersiya qonunini", "Kuch va tezlanish bog'liqligini", "Ta'sir va aks ta'sir qonunini", "Butun olam tortishish qonunini"],
                 correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Massasi 2 kg bo'lgan jismga 10 N kuch ta'sir qilsa, u qanday tezlanish oladi?",
                 options=["5 m/s^2", "20 m/s^2", "0.2 m/s^2", "12 m/s^2"], correct_answer=0),
            dict(category='physics', difficulty='medium',
                 question="Kosmik kemada astronavt vaznsizlik holatida bo'lsa, uning massasi va og'irligi qanday bo'ladi?",
                 options=["Massasi o'zgarmaydi, og'irligi nolga teng", "Ikkalasi ham nolga teng", "Massasi nolga teng", "Ikkalasi ham ortadi"],
                 correct_answer=0),
            dict(category='physics', difficulty='medium',
                 question="Jism vertikal yuqoriga 20 m/s tezlik bilan otildi. U eng baland nuqtaga necha sekundda yetib boradi (g=10)?",
                 options=["2 s", "1 s", "4 s", "0.5 s"], correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Potensial energiya qaysi formuladan topiladi?",
                 options=["mgh", "mv^2/2", "kx^2/2", "F*s"], correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Yer sirtiga yaqin joyda erkin tushish tezlanishi qanchaga teng?",
                 options=["~9.8 m/s^2", "10.5 m/s^2", "1.6 m/s^2", "11.2 km/s"], correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Ishning o'lchov birligi nima?",
                 options=["Joul (J)", "Vatt (W)", "Nyuton (N)", "Paskal (Pa)"], correct_answer=0),

            # ── Astronomy ──
            dict(category='astronomy', difficulty='easy',
                 question="Quyosh sistemasidagi eng katta sayyora qaysi?",
                 options=["Yupiter", "Saturn", "Yer", "Uran"], correct_answer=0),
            dict(category='astronomy', difficulty='easy',
                 question="Yorug'lik yili nima?",
                 options=["Yorug'likning bir yilda bosib o'tgan masofasi", "Vaqt o'lchov birligi", "Yulduzning yoshini o'lchash birligi", "Quyoshning faollik davri"],
                 correct_answer=0),
            dict(category='astronomy', difficulty='easy',
                 question="Galaktikamizning nomi nima?",
                 options=["Somon yo'li", "Andromeda", "Katta Magellan buluti", "Uchburchak"], correct_answer=0),
            dict(category='astronomy', difficulty='medium',
                 question="Koinotning kengayishini kim kashf qilgan?",
                 options=["Edvin Xabbl", "Albert Eynshteyn", "Isaak Nyuton", "Galileo Galiley"], correct_answer=0),
            dict(category='astronomy', difficulty='hard',
                 question="Qora tuynuk nima?",
                 options=["Gravitatsiyasi shunchalik kuchliki, undan yorug'lik ham qochib qutula olmaydigan obyekt", "Yulduzlarning paydo bo'lish joyi", "Koinotdagi bo'shliq", "O'lchami juda kichik sayyora"],
                 correct_answer=0),

            # ── Problems ──
            dict(category='problems', difficulty='hard',
                 question="Avtomobil yo'lning birinchi yarmini 60 km/soat, ikkinchi yarmini 40 km/soat tezlik bilan o'tdi. O'rtacha tezlikni toping.",
                 options=["48 km/soat", "50 km/soat", "52 km/soat", "45 km/soat"], correct_answer=0),
            dict(category='problems', difficulty='medium',
                 question="Bikrligi 100 N/m bo'lgan prujinani 2 sm ga cho'zish uchun qancha ish bajarish kerak?",
                 options=["0.02 J", "0.04 J", "2 J", "4 J"], correct_answer=0),
            dict(category='problems', difficulty='medium',
                 question="Massasi 2 kg jism 10 m balandlikdan erkin tushmoqda. Kinetik energiyasi qancha (g=10)?",
                 options=["200 J", "100 J", "50 J", "400 J"], correct_answer=0),
            dict(category='problems', difficulty='hard',
                 question="20 C dagi 5 kg suvni qaynash darajasigacha isitish uchun qancha issiqlik kerak (c=4200)?",
                 options=["1.68 MJ", "2.1 MJ", "16.8 MJ", "0.84 MJ"], correct_answer=0),

            # ── Courses (Online Learning) ──
            dict(category='courses', difficulty='easy',
                 question="Qaysi onlayn platforma dasturlash bo'yicha eng ko'p kurslarga ega?",
                 options=["Coursera", "Udemy", "edX", "Khan Academy"], correct_answer=1),
            dict(category='courses', difficulty='easy',
                 question="MOOC qisqartmasining ma'nosi nima?",
                 options=["Massive Open Online Course", "Modern Online Object Creation", "Multiple Online Open Classes", "Main Open Online Community"],
                 correct_answer=0),
            dict(category='courses', difficulty='easy',
                 question="Fizika bo'yicha onlayn kurslarda eng ko'p o'qitiladigan birinchi mavzu qaysi?",
                 options=["Kinematika", "Kvant mexanikasi", "Termodinamika", "Optika"], correct_answer=0),
            dict(category='courses', difficulty='easy',
                 question="Masofaviy ta'limning afzalligi nimada?",
                 options=["Vaqt va joyga bog'liq emasligi", "Faqat kompyuterda o'qish mumkinligi", "Bepulligi", "Diplom berilmasligi"],
                 correct_answer=0),
            dict(category='courses', difficulty='medium',
                 question="Khan Academy qaysi universitetning talabasi tomonidan yaratilgan?",
                 options=["MIT", "Harvard", "Stanford", "Yale"], correct_answer=0),
            dict(category='courses', difficulty='easy',
                 question="Python dasturlash tili qaysi yilda yaratilgan?",
                 options=["1991", "2000", "1985", "1995"], correct_answer=0),
            dict(category='courses', difficulty='medium',
                 question="NASA Space Apps Challenge nima?",
                 options=["Xalqaro hackathon", "Kosmik missiya", "Kurs platformasi", "Laboratoriya dasturi"],
                 correct_answer=0),
            dict(category='courses', difficulty='easy',
                 question="Qaysi tashkilot kosmik ta'lim bo'yicha bepul kurslar taqdim etadi?",
                 options=["NASA", "Apple", "Microsoft", "Samsung"], correct_answer=0),
            dict(category='courses', difficulty='medium',
                 question="STEM qisqartmasi nimani anglatadi?",
                 options=["Science, Technology, Engineering, Mathematics", "Space, Technology, Energy, Mathematics", "Science, Teaching, Education, Modules", "System, Technology, Engineering, Management"],
                 correct_answer=0),
            dict(category='courses', difficulty='hard',
                 question="Qaysi universitet kosmik injiniring bo'yicha dunyodagi eng nufuzli dasturga ega?",
                 options=["MIT", "Oxford", "Tokyo University", "Tashkent Politexnika"], correct_answer=0),

            # ── More Physics (to reach 15+) ──
            dict(category='physics', difficulty='easy',
                 question="Sanoq sistemasi nimalardan iborat?",
                 options=["Sanoq jismi, koordinatalar sistemasi va soatdan", "Faqat koordinatalar sistemasidan", "Jism va uning tezligidan", "Faqat soat va asboblardan"],
                 correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Kuch momentining o'lchov birligi qanday?",
                 options=["N*m", "N/m", "J/s", "W"], correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Quvvat qanday hisoblanadi?",
                 options=["Bajarilgan ishning vaqtga nisbati", "Kuchning masofaga ko'paytmasi", "Massaning tezlanishga ko'paytmasi", "Energiyaning vaqtga ko'paytmasi"],
                 correct_answer=0),
            dict(category='physics', difficulty='medium',
                 question="Impulsning saqlanish qonuni qachon bajariladi?",
                 options=["Yopiq sistemada", "Ochiq sistemada", "Faqat elastik to'qnashuvlarda", "Faqat inersial bo'lmagan sanoq sistemalarida"],
                 correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Bosim nima va uning birligi qanday?",
                 options=["Yuzaga perpendikulyar kuch; Paskal (Pa)", "Jismning massasi; Kilogramm (kg)", "Ishning vaqtga nisbati; Vatt (W)", "Energiyaning o'zgarishi; Joul (J)"],
                 correct_answer=0),
            dict(category='physics', difficulty='medium',
                 question="Kinetik energiya nimaga bog'liq?",
                 options=["Jismning massasi va tezligiga", "Jismning massasi va balandligiga", "Faqat jismning tezligiga", "Jismning shakliga"],
                 correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Tekis harakatlanayotgan jismning tezlik-vaqt grafigi qanday?",
                 options=["Vaqt o'qiga parallel to'g'ri chiziq", "Parabola", "Koordinata boshidan chiquvchi to'g'ri chiziq", "Giperbola"],
                 correct_answer=0),
            dict(category='physics', difficulty='easy',
                 question="Mexanik harakat nima?",
                 options=["Jismning boshqa jismga nisbatan holat o'zgarishi", "Issiqlik harakati", "Elektromagnit hodisa", "Optik hodisa"],
                 correct_answer=0),
            dict(category='physics', difficulty='medium',
                 question="Nyutonning uchinchi qonuni qanday ta'riflanadi?",
                 options=["Ta'sir kuchi aks ta'sir kuchiga teng va qarama-qarshi", "Jismga ta'sir etuvchi kuchlar yig'indisi nolga teng", "Kuch massa va tezlanish ko'paytmasiga teng", "Jismning tezligi faqat tashqi kuchlar ta'sirida o'zgaradi"],
                 correct_answer=0),

            # ── More Astronomy (to reach 10+) ──
            dict(category='astronomy', difficulty='easy',
                 question="Yerga eng yaqin yulduz qaysi?",
                 options=["Quyosh", "Sirius", "Proksima Sentavr", "Alfa Sentavr"], correct_answer=0),
            dict(category='astronomy', difficulty='medium',
                 question="Oyning Yer atrofida aylanish davri qancha?",
                 options=["27.3 kun", "30 kun", "24 soat", "365 kun"], correct_answer=0),
            dict(category='astronomy', difficulty='easy',
                 question="Mars sayyorasining rangi qanday?",
                 options=["Qizil", "Ko'k", "Sariq", "Yashil"], correct_answer=0),
            dict(category='astronomy', difficulty='medium',
                 question="Saturning halqalari asosan nimadan iborat?",
                 options=["Muz va tosh parchalaridan", "Gazlardan", "Suyuq metalldan", "Tuproqdan"], correct_answer=0),
            dict(category='astronomy', difficulty='hard',
                 question="Hubble teleskopi qachon kosmosga uchirilib yuborilgan?",
                 options=["1990", "2000", "1985", "1995"], correct_answer=0),
            dict(category='astronomy', difficulty='hard',
                 question="Neytrino yulduzi nima?",
                 options=["Neytron yulduz - massiv yulduzning qoldig'i", "Yangi tug'ilgan yulduz", "Eng kichik yulduz turi", "Quyosh tizimidagi asteroid"],
                 correct_answer=0),
            dict(category='astronomy', difficulty='medium',
                 question="Jupiterning eng katta yo'ldoshi qaysi?",
                 options=["Ganimed", "Kalisto", "Io", "Yevropa"], correct_answer=0),

            # ── More Problems (to reach 10+) ──
            dict(category='problems', difficulty='medium',
                 question="Massasi 500 g bo'lgan jism 4 m/s tezlik bilan harakatlansa, uning impulsi qancha?",
                 options=["2 kg*m/s", "2000 kg*m/s", "0.125 kg*m/s", "8 kg*m/s"], correct_answer=0),
            dict(category='problems', difficulty='hard',
                 question="Yer atrofida uchayotgan sun'iy yo'ldoshning orbital tezligi taxminan qancha?",
                 options=["7.9 km/s", "11.2 km/s", "3.4 km/s", "29.8 km/s"], correct_answer=0),
            dict(category='problems', difficulty='medium',
                 question="10 kg massali jism 5 m balandlikdan tushganda qancha kinetik energiya oladi (g=10)?",
                 options=["500 J", "50 J", "100 J", "250 J"], correct_answer=0),
            dict(category='problems', difficulty='hard',
                 question="Ikkinchi kosmik tezlik (Yerdan qochish tezligi) qanchaga teng?",
                 options=["11.2 km/s", "7.9 km/s", "16.7 km/s", "29.8 km/s"], correct_answer=0),
            dict(category='problems', difficulty='medium',
                 question="R=2 m radiusli aylana bo'ylab 4 m/s tezlik bilan harakatlanayotgan jismning markazga intilma tezlanishi qancha?",
                 options=["8 m/s^2", "2 m/s^2", "16 m/s^2", "4 m/s^2"], correct_answer=0),
            dict(category='problems', difficulty='hard',
                 question="Massasi 60 kg bo'lgan kosmonavt Oyda qancha og'irlik kuchiga ega (g_oy=1.6 m/s^2)?",
                 options=["96 N", "600 N", "9.6 N", "588 N"], correct_answer=0),
        ]

        count = 0
        for q in questions:
            _, created = ChallengeQuestion.objects.update_or_create(
                question=q['question'],
                defaults=q,
            )
            if created:
                count += 1

        total = ChallengeQuestion.objects.count()
        by_cat = {}
        for q in ChallengeQuestion.objects.values('category'):
            cat = q['category']
            by_cat[cat] = by_cat.get(cat, 0) + 1

        self.stdout.write(self.style.SUCCESS(
            f'Seeded {count} new questions (total pool: {total})'
        ))
        for cat, cnt in sorted(by_cat.items()):
            self.stdout.write(f'  {cat}: {cnt} questions')

