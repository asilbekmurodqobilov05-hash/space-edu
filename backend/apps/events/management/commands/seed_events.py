"""
Seed SpaceEvent table with data from frontend eventsData.js + extra historical events.
Usage:  python manage.py seed_events
"""
from django.core.management.base import BaseCommand
from apps.events.models import SpaceEvent


class Command(BaseCommand):
    help = 'Populate SpaceEvent table with space events data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding space events...')

        events = [
            # ── From eventsData.js (2026 events) ──
            dict(
                title_en='Total Lunar Eclipse', title_uz='To\'liq Oy tutilishi', title_ru='Polnoe lunnoe zatmenie',
                description_en='A total lunar eclipse occurs when the Moon passes completely into the Earth\'s umbral shadow. The Moon will gradually get darker and then take on a rusty or blood red color.',
                description_uz='To\'liq Oy tutilishi Oy Yer soyasiga to\'liq kirganda sodir bo\'ladi.',
                description_ru='Polnoe lunnoe zatmenie proishodit kogda Luna polnostyu vhodit v ten Zemli.',
                event_date='2026-03-03', event_type='lunar_eclipse', event_time='11:34 UTC',
                visibility='Visible from East Asia, Australia, Pacific, Americas',
                facts=['Also known as a Blood Moon.', 'Safe to view with the naked eye.', 'Duration of totality is about 58 minutes.'],
                is_featured=True,
            ),
            dict(
                title_en='Eta Aquariids Meteor Shower', title_uz='Eta Aquariids meteor yomg\'iri', title_ru='Meteorniy potok Eta Akvaridov',
                description_en='The Eta Aquariids is an above average shower, capable of producing up to 60 meteors per hour at its peak. Produced by dust particles left behind by comet Halley.',
                description_uz='Eta Aquariids o\'rtacha darajadan yuqori meteor yomg\'iri.',
                description_ru='Eta Akvaridy - meteor potok vyshe srednego urovnya.',
                event_date='2026-05-06', event_type='meteor_shower', event_time='Peak: Pre-dawn hours',
                visibility='Best viewed from the Southern Hemisphere, but visible globally.',
                facts=['Meteors are fast and often leave glowing "trains".', 'Best viewing is from a dark location after midnight.'],
            ),
            dict(
                title_en='Total Solar Eclipse', title_uz='To\'liq Quyosh tutilishi', title_ru='Polnoe solnechnoe zatmenie',
                description_en='A total solar eclipse occurs when the Moon completely blocks the Sun, revealing the Sun\'s beautiful outer atmosphere known as the corona.',
                description_uz='To\'liq Quyosh tutilishi Oy Quyoshni to\'liq yopganda sodir bo\'ladi.',
                description_ru='Polnoe solnechnoe zatmenie proishodit kogda Luna polnostyu zakryvaet Solntse.',
                event_date='2026-08-12', event_type='solar_eclipse', event_time='17:45 UTC',
                visibility='Arctic, Greenland, Iceland, Atlantic Ocean, Spain',
                facts=['The path of totality will pass over the North Pole.', 'Never look directly at the Sun without proper eye protection.'],
                is_featured=True,
            ),
            dict(
                title_en='Perseids Meteor Shower', title_uz='Perseidlar meteor yomg\'iri', title_ru='Meteorniy potok Perseidy',
                description_en='The Perseids is one of the best meteor showers to observe, producing up to 60 meteors per hour at its peak. Produced by comet Swift-Tuttle.',
                description_uz='Perseidlar kuzatish uchun eng yaxshi meteor yomg\'irlaridan biri.',
                description_ru='Perseidy - odin iz luchshih meteornyh potokov dlya nablyudeniya.',
                event_date='2026-08-13', event_type='meteor_shower', event_time='Peak: Pre-dawn hours',
                visibility='Best viewed from the Northern Hemisphere.',
                facts=['Famous for producing a large number of bright meteors.', 'The moon will be a thin crescent, providing dark skies.'],
                is_featured=True,
            ),
            dict(
                title_en='Leonids Meteor Shower', title_uz='Leonidlar meteor yomg\'iri', title_ru='Meteorniy potok Leonidy',
                description_en='The Leonids is an average shower, producing up to 15 meteors per hour at its peak. Unique cyclonic peak about every 33 years.',
                description_uz='Leonidlar o\'rtacha meteor yomg\'iri, har 33 yilda kuchli pik beradi.',
                description_ru='Leonidy - sredniy potok s tsiklicheskim pikom kazhdye 33 goda.',
                event_date='2026-11-17', event_type='meteor_shower', event_time='Peak: Pre-dawn hours',
                visibility='Visible globally.',
                facts=['Produced by comet Tempel-Tuttle.', 'Meteors radiate from the constellation Leo.'],
            ),
            dict(
                title_en='Geminids Meteor Shower', title_uz='Geminidlar meteor yomg\'iri', title_ru='Meteorniy potok Geminidy',
                description_en='The Geminids is the king of the meteor showers, producing up to 120 multicolored meteors per hour at its peak.',
                description_uz='Geminidlar meteor yomg\'irlarining qiroli hisoblanadi.',
                description_ru='Geminidy - korol meteornyh potokov, do 120 meteorov v chas.',
                event_date='2026-12-14', event_type='meteor_shower', event_time='Peak: All night',
                visibility='Visible globally, best in Northern Hemisphere.',
                facts=['Produced by asteroid 3200 Phaethon.', 'Meteors can be seen starting as early as 9 or 10 PM.'],
                is_featured=True,
            ),

            # ── Historical milestones ──
            dict(
                title_en='Sputnik 1 Launch', title_uz='Sputnik 1 uchishi', title_ru='Zapusk Sputnika 1',
                description_en='The Soviet Union launched the first artificial Earth satellite, Sputnik 1, marking the beginning of the Space Age.',
                description_uz='Sovet Ittifoqi birinchi sun\'iy Yer yo\'ldoshini - Sputnik 1ni uchirib yubordi.',
                description_ru='Sovetskiy Soyuz zapustil pervyy iskusstvennyy sputnik Zemli.',
                event_date='1957-10-04', event_type='milestone', is_historical=True, is_featured=True,
                facts=['Orbited for 3 months.', 'Weighed 83.6 kg.', 'Transmitted radio signals for 21 days.'],
            ),
            dict(
                title_en='Yuri Gagarin - First Human in Space', title_uz='Yuriy Gagarin - kosmosda birinchi inson', title_ru='Yuriy Gagarin - pervyy chelovek v kosmose',
                description_en='Soviet cosmonaut Yuri Gagarin became the first human to journey into outer space on Vostok 1.',
                description_uz='Sovet kosmonavti Yuriy Gagarin Vostok 1 da kosmosga uchgan birinchi inson bo\'ldi.',
                description_ru='Sovetskiy kosmonavt Yuriy Gagarin stal pervym chelovekom v kosmose.',
                event_date='1961-04-12', event_type='milestone', is_historical=True, is_featured=True,
                facts=['The flight lasted 108 minutes.', 'He orbited Earth once.', 'His call sign was Kedr (Cedar).'],
            ),
            dict(
                title_en='Apollo 11 Moon Landing', title_uz='Apollo 11 Oyga qo\'nish', title_ru='Posadka Apollo 11 na Lunu',
                description_en='NASA astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.',
                description_uz='NASA astronavtlari Nil Armstrong va Baz Aldrin Oyda yurgan birinchi insonlar bo\'ldi.',
                description_ru='Astronavty NASA Nil Armstrong i Baz Oldrin stali pervymi lyudmi na Lune.',
                event_date='1969-07-20', event_type='milestone', is_historical=True, is_featured=True,
                facts=['Armstrong\'s first words: "That\'s one small step for man..."', 'They spent 2.5 hours on the surface.'],
            ),
            dict(
                title_en='Hubble Space Telescope Launch', title_uz='Xabbl teleskopi uchishi', title_ru='Zapusk teleskopa Habbl',
                description_en='NASA launched the Hubble Space Telescope, revolutionizing astronomy with unprecedented deep-space imagery.',
                description_uz='NASA Xabbl kosmik teleskopini uchirib yubordi.',
                description_ru='NASA zapustila kosmicheskiy teleskop Habbl.',
                event_date='1990-04-24', event_type='milestone', is_historical=True,
                facts=['Still operational after 35+ years.', 'Has made over 1.5 million observations.'],
            ),
            dict(
                title_en='ISS First Crew Arrival', title_uz='XKS birinchi ekipaj kelishi', title_ru='Pribytie pervogo ekipazha na MKS',
                description_en='The first crew arrived at the International Space Station, beginning continuous human presence in space.',
                description_uz='Birinchi ekipaj Xalqaro Kosmik Stansiyaga keldi.',
                description_ru='Pervyy ekipazh pribyl na MKS.',
                event_date='2000-11-02', event_type='milestone', is_historical=True,
                facts=['Crew: Bill Shepherd, Yuri Gidzenko, Sergei Krikalev.', 'Continuous habitation since then.'],
            ),
            dict(
                title_en='SpaceX Falcon 9 First Landing', title_uz='SpaceX Falcon 9 birinchi qo\'nishi', title_ru='Pervaya posadka SpaceX Falcon 9',
                description_en='SpaceX successfully landed a Falcon 9 rocket booster for the first time, proving reusable rocketry.',
                description_uz='SpaceX Falcon 9 raketasining birinchi bosqichini birinchi marta muvaffaqiyatli qo\'ndirdi.',
                description_ru='SpaceX vpervye uspeshno posadila pervuyu stupen Falcon 9.',
                event_date='2015-12-22', event_type='milestone', is_historical=True,
                facts=['Landed at Cape Canaveral Landing Zone 1.', 'Revolutionized space economics.'],
            ),
            dict(
                title_en='James Webb Space Telescope Launch', title_uz='Jeyms Vebb teleskopi uchishi', title_ru='Zapusk teleskopa Dzheyms Uebb',
                description_en='NASA launched JWST, the most powerful space telescope ever built, to observe the earliest galaxies.',
                description_uz='NASA eng qudratli kosmik teleskop - JWSTni uchirib yubordi.',
                description_ru='NASA zapustila JWST - samyy moshchnyy kosmicheskiy teleskop.',
                event_date='2021-12-25', event_type='milestone', is_historical=True, is_featured=True,
                facts=['Located at L2 point, 1.5M km from Earth.', 'Mirror diameter: 6.5 meters.', 'Cost: $10 billion.'],
            ),
        ]

        for ev in events:
            obj, created = SpaceEvent.objects.update_or_create(
                title_en=ev['title_en'], event_date=ev['event_date'],
                defaults=ev,
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {obj.title_en} ({obj.event_date})')

        self.stdout.write(self.style.SUCCESS(f'\nSeeded {len(events)} space events!'))
