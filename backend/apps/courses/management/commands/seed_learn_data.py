"""
Seed the database with all Learn sphere data from frontend JS files.
Usage:  python manage.py seed_learn_data
"""
from django.core.management.base import BaseCommand
from apps.courses.models import Sphere, Topic, TopicLesson, SubLesson, Problem


class Command(BaseCommand):
    help = 'Populate Sphere/Topic/Lesson/Problem tables with educational content'

    def handle(self, *args, **options):
        self.stdout.write('Seeding learn data...')

        # ─────────────────────────────────────────────
        # 1. SPHERES
        # ─────────────────────────────────────────────
        spheres_data = [
            dict(slug='physics', order=1, title='Fizika', title_en='Physics',
                 description='Kosmik mexanika, gravitatsiya va energiya asoslari',
                 description_en='Cosmic mechanics, gravity and energy fundamentals',
                 color='#00e5ff', icon='Atom', link='/learn/physics', lessons_count=24),
            dict(slug='astronomy', order=2, title='Astronomiya', title_en='Astronomy',
                 description='Yulduzlar, galaktikalar va koinot tuzilishi',
                 description_en='Stars, galaxies and the structure of the universe',
                 color='#fbbf24', icon='Telescope', link='/learn/astronomy', lessons_count=32),
            dict(slug='problems', order=3, title='Masalalar', title_en='Problems',
                 description='Amaliy masalalar va olimpiada savollari',
                 description_en='Applied problems and olympiad questions',
                 color='#4ade80', icon='HelpCircle', link='/learn/problems', lessons_count=145),
            dict(slug='creativity', order=4, title='Ijodkorlik', title_en='Creativity',
                 description="Kosmik san'at, yozish va dizayn loyihalari",
                 description_en='Space art, writing and design projects',
                 color='#f472b6', icon='Palette', link='/learn/creativity', lessons_count=16),
            dict(slug='interviews', order=5, title='Intervyular', title_en='Interviews',
                 description='Olimlar, astronavtlar va muhandislar bilan suhbatlar',
                 description_en='Conversations with scientists, astronauts and engineers',
                 color='#a78bfa', icon='Mic', link='/learn/interviews', lessons_count=12),
        ]

        sphere_objs = {}
        for sd in spheres_data:
            obj, created = Sphere.objects.update_or_create(slug=sd['slug'], defaults=sd)
            sphere_objs[sd['slug']] = obj
            self.stdout.write(f'  {"Created" if created else "Updated"} sphere: {obj.slug}')

        # ─────────────────────────────────────────────
        # 2. PHYSICS TOPICS + LESSONS
        # ─────────────────────────────────────────────
        physics = sphere_objs['physics']
        physics_topics = [
            ('Kinematika', 'Kinematics', [
                "Basic concepts in mechanics", "Straight-line uniform motion",
                "Graphical representation of straight-line uniform motion",
                "Relativity of motion", "Non-uniform motion",
                "Uniformly accelerated motion. Acceleration. Instantaneous velocity",
                "Displacement in uniformly accelerated motion", "Motion of two bodies",
                "Graphical representation of uniformly accelerated motion",
                "Curvilinear motion", "Acceleration in curvilinear motion",
                "Transmission of rotational motion", "Non-uniform circular motion"
            ]),
            ('Dinamika', 'Dynamics', [
                "Force. Newton's first law", "Mass. Density", "Newton's second law",
                "Newton's third law", "Law of universal gravitation", "Gravity",
                "Elastic force", "Weight", "Weightlessness",
                "Vertical motion of a body under gravity",
                "Motion of a body thrown horizontally",
                "Motion of a body thrown at an angle to the horizon",
                "Friction forces", "Motion in resistive media"
            ]),
            ('Statika', 'Statics', [
                "Equilibrium conditions", "Center of mass", "Lever. Moment of force",
                "Couple of forces", "Types of equilibrium"
            ]),
            ("Saqlanish qonunlari", 'Conservation Laws', [
                "Momentum", "Law of conservation of momentum", "Reactive motion",
                "Work. Power", "Energy", "Kinetic energy theorem",
                "Potential energy", "Conservation of energy", "Elastic and inelastic collisions"
            ]),
            ("Mexanik tebranishlar va to'lqinlar", 'Mechanical Oscillations and Waves', [
                "Harmonic oscillations", "Mathematical pendulum", "Spring pendulum",
                "Damped oscillations", "Forced oscillations. Resonance",
                "Mechanical waves", "Sound. Speed of sound"
            ]),
            ("Suyuqlik va gaz mexanikasi", 'Fluid Mechanics', [
                "Pressure", "Pascal's law", "Hydraulic press",
                "Atmosphere pressure", "Barometers and manometers",
                "Archimedes principle", "Swimming conditions"
            ]),
            ("Molekulyar fizika", 'Molecular Physics', [
                "Molecular kinetic theory foundations", "Diffusion. Brownian motion",
                "Ideal gas equation of state", "Gas laws",
                "Saturated vapor. Humidity", "Surface tension",
                "Capillary phenomena"
            ]),
            ("Termodinamika", 'Thermodynamics', [
                "Internal energy", "First law of thermodynamics",
                "Work done by gas", "Heat engines. Carnot cycle",
                "Second law of thermodynamics"
            ]),
            ("Elektrostatika", 'Electrostatics', [
                "Electric charge", "Coulomb's law",
                "Electric field. Field strength", "Electric potential",
                "Capacitance. Capacitors", "Energy of an electric field"
            ]),
            ("Doimiy tok", 'Direct Current', [
                "Current. Current strength", "Ohm's law",
                "Resistance. Resistivity", "Series and parallel connection",
                "Kirchhoff's laws", "Work and power of current",
                "Electromotive force"
            ]),
            ("Magnit maydoni", 'Magnetic Field', [
                "Magnetic field of a current", "Ampere force",
                "Lorentz force", "Magnetic properties of materials",
                "Electromagnetic induction", "Faraday's law",
                "Lenz's rule", "Inductance. Self-induction"
            ]),
            ("Elektromagnit tebranishlar va to'lqinlar", 'EM Oscillations and Waves', [
                "Oscillating circuit", "Alternating current",
                "Transformer", "Electromagnetic waves",
                "Radio waves. Radio communication"
            ]),
            ("Optika", 'Optics', [
                "Light. Speed of light", "Reflection and refraction",
                "Total internal reflection", "Lenses. Optical instruments",
                "Interference", "Diffraction", "Polarization"
            ]),
            ("Atom va yadro fizikasi", 'Nuclear Physics', [
                "Photoelectric effect", "Bohr's atom model",
                "Atomic spectra", "Radioactivity",
                "Nuclear reactions", "Nuclear energy",
                "Elementary particles"
            ]),
        ]

        for i, (title, title_en, lessons) in enumerate(physics_topics, 1):
            topic, _ = Topic.objects.update_or_create(
                sphere=physics, order=i,
                defaults=dict(title=title, title_en=title_en, color='#00e5ff')
            )
            for j, name in enumerate(lessons, 1):
                TopicLesson.objects.update_or_create(
                    topic=topic, order=j,
                    defaults=dict(name=name, name_en=name)
                )

        self.stdout.write(f'  Physics: {len(physics_topics)} topics seeded')

        # ─────────────────────────────────────────────
        # 3. ASTRONOMY TOPICS (with sub-lessons)
        # ─────────────────────────────────────────────
        astronomy = sphere_objs['astronomy']
        astro_topics = [
            ('Quyosh tizimi', 'Solar System', [
                ('Sun', [("Structure of the Sun", "https://www.youtube.com/embed/2HoTK_Gqi2Q"),
                          ("Solar Energy & Fusion", "https://www.youtube.com/embed/0KBjnN7kUKo"),
                          ("The Sun's Life Cycle", "https://www.youtube.com/embed/HCDVN7DCzYE")]),
                ('Mercury', [("Mercury's Extreme Environment", "https://www.youtube.com/embed/libKVRa01L8"),
                              ("Geology of the Smallest Planet", "https://www.youtube.com/embed/XycHvvnc2X4"),
                              ("Missions to Mercury", "https://www.youtube.com/embed/epZdZaEQhS0")]),
                ('Venus', [("The Runaway Greenhouse Effect", "https://www.youtube.com/embed/BvKaWlyf57w"),
                            ("Venusian Surface & Volcanism", "https://www.youtube.com/embed/m4NXbFOiOGk"),
                            ("Exploration of the Morning Star", "https://www.youtube.com/embed/D85gxYG9qhM")]),
                ('Earth', [("The Goldilocks Zone", "https://www.youtube.com/embed/HCDVN7DCzYE"),
                            ("Atmosphere & Biosphere", "https://www.youtube.com/embed/libKVRa01L8"),
                            ("Earth's Magnetic Shield", "https://www.youtube.com/embed/0KBjnN7kUKo")]),
                ('Mars', [("The Red Planet", "https://www.youtube.com/embed/D85gxYG9qhM"),
                           ("Mars Rovers & Exploration", "https://www.youtube.com/embed/921VbEMAwwY"),
                           ("Terraforming Mars", "https://www.youtube.com/embed/XJSKezIdHJY")]),
                ('Jupiter', [("Gas Giant King", "https://www.youtube.com/embed/epZdZaEQhS0"),
                              ("Jupiter's Moons", "https://www.youtube.com/embed/m4NXbFOiOGk"),
                              ("The Great Red Spot", "https://www.youtube.com/embed/2HoTK_Gqi2Q")]),
                ('Saturn', [("Lord of the Rings", "https://www.youtube.com/embed/0KBjnN7kUKo"),
                             ("Titan — Saturn's Largest Moon", "https://www.youtube.com/embed/BvKaWlyf57w"),
                             ("Cassini Mission Legacy", "https://www.youtube.com/embed/libKVRa01L8")]),
                ('Uranus', [("The Tilted Giant", "https://www.youtube.com/embed/D85gxYG9qhM"),
                             ("Uranus' Ring System", "https://www.youtube.com/embed/XycHvvnc2X4")]),
                ('Neptune', [("The Windy World", "https://www.youtube.com/embed/921VbEMAwwY"),
                              ("Triton & Beyond", "https://www.youtube.com/embed/XJSKezIdHJY")]),
            ]),
        ]

        for i, (title, title_en, planet_lessons) in enumerate(astro_topics, 1):
            topic, _ = Topic.objects.update_or_create(
                sphere=astronomy, order=i,
                defaults=dict(title=title, title_en=title_en, color='#fbbf24')
            )
            for j, (planet_name, subs) in enumerate(planet_lessons, 1):
                parent, _ = TopicLesson.objects.update_or_create(
                    topic=topic, order=j,
                    defaults=dict(name=planet_name, name_en=planet_name)
                )
                for k, (sub_name, video) in enumerate(subs, 1):
                    SubLesson.objects.update_or_create(
                        parent_lesson=parent, order=k,
                        defaults=dict(name=sub_name, name_en=sub_name, video_url=video)
                    )

        self.stdout.write(f'  Astronomy: {len(astro_topics)} topics seeded')

        # ─────────────────────────────────────────────
        # 4. PROBLEMS (Masalalar)
        # ─────────────────────────────────────────────
        problems_sphere = sphere_objs['problems']
        problems_data = [
            (1, "Mexanikaning asosiy vazifasini o'rganadigan bo'lim nima deyiladi?", "Harakat", "Mexanika - jismlarning harakatini o'rganadi."),
            (2, "Moddiy nuqta radiusi 10 m bo'lgan aylana bo'ylab tekis harakatlanmoqda. 10 sekundda qancha masofani bosib o'tadi? (v=2 m/s)", "20 m", "s = v * t = 2 * 10 = 20 m"),
            (3, "Jismning boshlang'ich va oxirgi nuqtalarini birlashtiruvchi yo'naltirilgan kesma nima deyiladi?", "Ko'chish", "Ko'chish - bu vektor miqdor."),
            (4, "Turli sanoq sistemalarida harakat turlicha ko'rinishi nima deyiladi?", "Harakatning nisbiyligi", "Harakat nisbiydir."),
            (5, "Xalqaro birliklar sistemasida (SI) uzunlik va vaqt birliklari nima?", "Metr va sekund", "SI sistemasida asosiy birliklar."),
            (6, "Tezlik har sekundda 2 m/s ga ortib boruvchi jismning tezlanishi qancha?", "2 m/s²", "a = Δv / Δt"),
            (7, "Tezligi 4 m/s bo'lgan jism 5 sekunddan keyin tezligi 19 m/s bo'lsa, o'rtacha tezligi qancha?", "15 m/s", "v_avg = (v1 + v2) / 2"),
            (8, "Tezligi 5 m/s² tezlanish bilan 20 m yo'l bosish uchun qancha vaqt kerak? (v0=0)", "4 s", "s = at²/2 => t = sqrt(2s/a)"),
            (9, "Tezlikning vaqt bo'yicha o'zgarishini xarakterlovchi kattalik?", "Tezlanish", "a = dv/dt"),
            (10, "Jism 5 m/s² tezlanish bilan 5 s harakatlandi. Oxirgi tezlik qancha? (v0=0)", "25 m/s", "v = a*t = 5 * 5 = 25 m/s"),
            (11, "Astronomik masofalar asosan qaysi birliklarda o'lchanadi?", "Yorug'lik yili", "Katta masofalar uchun."),
            (12, "Jism 10 m/s tezlik bilan 10 s yurdi. Masofa qancha?", "100 m", "s = v * t"),
            (13, "Aylanish chastotasi birligi nima?", "Hz", "Gerts (Hz)"),
            (14, "Burchak tezlik nimani ifodalaydi?", "Burchak tezlikning o'zgarishi", "Aylanish tezligi."),
            (15, "Chastota va davr orasidagi bog'liqlik?", "f = 1/T", "v = 1/T"),
            (16, "Vektorli kattaliklar nimaga ega?", "Yo'nalish va son", "Yo'nalish va songa ega."),
            (17, "1 tonna necha kilogramm?", "1000 kg", "1 t = 1000 kg"),
            (18, "Bosim birligi nima?", "Paskal", "Paskal (Pa) yoki N/m²"),
            (19, "10 kg massali jismning Yerga tortish kuchi (g=10)?", "100 N", "F = m * g = 10 * 10 = 100 N"),
            (20, "Butun olam tortishish qonuni kashfiyotchisi kim?", "Nyuton", "Isaak Nyuton."),
            (21, "Prujinaning bikrligi qanday aniqlanadi?", "k = F/x", "k = F / x"),
            (22, "5 kg massali jismga 1 m/s² tezlanish beruvchi kuch?", "5 N", "F = m * a = 5 * 1 = 5 N"),
            (23, "Koinotda vaznsizlik holatida jismning massasi qanday bo'ladi?", "O'zgarmaydi", "Massa doimiy, og'irlik yo'qoladi."),
            (24, "Erkin tushish tezlanishi qancha?", "9.8 m/s²", "g ≈ 9.8 m/s²"),
            (25, "Sun'iy yo'ldoshning birinchi kosmik tezligi?", "7.9 km/s", "v1 ≈ 7.9 km/s"),
            (26, "Massasi 2 kg jismga 3 m/s² tezlanish beruvchi kuch?", "6 N", "F = m * a = 6 N"),
            (27, "Impuls nima?", "p = mv", "Impuls = massa × tezlik"),
            (28, "Kinetik energiya formulasi?", "E = mv²/2", "Kinetik energiya"),
            (29, "Potentsial energiya formulasi?", "E = mgh", "Potentsial energiya"),
            (30, "Ish formulasi?", "A = Fs", "Ish = Kuch × yo'l"),
        ]

        for num, question, answer, explanation in problems_data:
            Problem.objects.update_or_create(
                sphere=problems_sphere, number=num,
                defaults=dict(question=question, answer=answer, explanation=explanation, difficulty='medium')
            )

        self.stdout.write(f'  Problems: {len(problems_data)} problems seeded')

        # ─────────────────────────────────────────────
        # 5. CREATIVITY TOPICS
        # ─────────────────────────────────────────────
        creativity = sphere_objs['creativity']
        creativity_topics = [
            ("Sayyora modullari", "Planet Modules", [
                "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
            ]),
            ("Raketalar va sun'iy yo'ldoshlar", "Rockets and Satellites", [
                "Falcon 9", "Falcon Heavy", "Electron", "New Shepard", "Starship",
                "International Space Station", "Terra", "Aqua", "Envisat", "Gaia"
            ]),
        ]

        for i, (title, title_en, lessons) in enumerate(creativity_topics, 1):
            topic, _ = Topic.objects.update_or_create(
                sphere=creativity, order=i,
                defaults=dict(title=title, title_en=title_en, color='#f472b6')
            )
            for j, name in enumerate(lessons, 1):
                parent, _ = TopicLesson.objects.update_or_create(
                    topic=topic, order=j,
                    defaults=dict(name=name, name_en=name)
                )
                # Sub-lessons for creativity
                subs = [
                    (f"{name} Module Design", "https://www.youtube.com/embed/libKVRa01L8"),
                    (f"{name} Landing Systems", "https://www.youtube.com/embed/2HoTK_Gqi2Q"),
                    (f"{name} Habitat Construction", "https://www.youtube.com/embed/0KBjnN7kUKo"),
                ]
                if i == 2:  # Rockets
                    subs = [
                        (f"{name} Engineering", "https://www.youtube.com/embed/921VbEMAwwY"),
                        (f"{name} Operational Orbit", "https://www.youtube.com/embed/libKVRa01L8"),
                        (f"{name} Future Upgrades", "https://www.youtube.com/embed/XJSKezIdHJY"),
                    ]
                for k, (sub_name, video) in enumerate(subs, 1):
                    SubLesson.objects.update_or_create(
                        parent_lesson=parent, order=k,
                        defaults=dict(name=sub_name, name_en=sub_name, video_url=video)
                    )

        self.stdout.write(f'  Creativity: {len(creativity_topics)} topics seeded')

        # ─────────────────────────────────────────────
        # 6. INTERVIEWS TOPICS
        # ─────────────────────────────────────────────
        interviews = sphere_objs['interviews']
        interviews_topics = [
            ("Professorlar", "Professors", {
                "Astronomy": ["Neil deGrasse Tyson", "Kip Thorne", "Brian Cox", "Andrea Ghez", "Adam Riess", "Saul Perlmutter", "Roger Penrose"],
                "Physics": ["Edward Witten", "Juan Maldacena", "Lisa Randall", "David Gross", "Frank Wilczek", "Ashoke Sen", "Cumrun Vafa"],
            }),
            ("Astronavtlar", "Astronauts", {
                "NASA": ["Chris Hadfield", "Scott Kelly", "Peggy Whitson", "Sunita Williams", "Jessica Meir"],
                "Roscosmos": ["Yuri Gagarin Legacy", "Valentina Tereshkova", "Oleg Kononenko"],
            }),
            ("Muhandislar", "Engineers", {
                "SpaceX": ["Elon Musk", "Gwynne Shotwell", "Tom Mueller"],
                "NASA JPL": ["Adam Steltzner", "Allen Chen", "Diana Trujillo"],
            }),
        ]

        for i, (title, title_en, sections) in enumerate(interviews_topics, 1):
            topic, _ = Topic.objects.update_or_create(
                sphere=interviews, order=i,
                defaults=dict(title=title, title_en=title_en, color='#a78bfa')
            )
            order = 1
            for section_name, names in sections.items():
                for name in names:
                    parent, _ = TopicLesson.objects.update_or_create(
                        topic=topic, order=order,
                        defaults=dict(name=name, name_en=name)
                    )
                    subs = [
                        (f"{name}'s Early Career", "https://www.youtube.com/embed/libKVRa01L8"),
                        (f"{name}'s Greatest Discoveries", "https://www.youtube.com/embed/2HoTK_Gqi2Q"),
                        (f"{name} on Future of Space", "https://www.youtube.com/embed/0KBjnN7kUKo"),
                    ]
                    for k, (sub_name, video) in enumerate(subs, 1):
                        SubLesson.objects.update_or_create(
                            parent_lesson=parent, order=k,
                            defaults=dict(name=sub_name, name_en=sub_name, video_url=video)
                        )
                    order += 1

        self.stdout.write(f'  Interviews: {len(interviews_topics)} topics seeded')

        self.stdout.write(self.style.SUCCESS('\nAll learn data seeded successfully!'))
