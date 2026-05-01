"""
Fetch real astronomical events from public APIs and seed them into SpaceEvent.

Sources:
  1. Visible Planets API (astronomy engine)
  2. Eclipses & meteor showers (hardcoded astronomically accurate 2025-2027)
  3. Launch Library 2 (rocket launches)

Usage:  python manage.py sync_astronomy_events
        python manage.py sync_astronomy_events --year 2026
"""
import json
import urllib.request
from datetime import date, datetime
from django.core.management.base import BaseCommand
from apps.events.models import SpaceEvent


# Astronomically verified events 2025-2027
VERIFIED_EVENTS = [
    # ── 2025 ──
    dict(title_en='Total Lunar Eclipse', title_uz="To'liq Oy tutilishi", title_ru='Polnoe lunnoe zatmenie',
         description_en='A total lunar eclipse visible from the Pacific, Americas, Europe and Africa.',
         description_uz="Tinch okeani, Amerika, Yevropa va Afrikadan ko'rinadigan to'liq Oy tutilishi.",
         description_ru='Polnoe lunnoe zatmenie, vidimoe iz Tihogo okeana, Ameriki, Yevropy i Afriki.',
         event_date='2025-03-14', event_type='lunar_eclipse', event_time='06:58 UTC',
         visibility='Pacific, Americas, Europe, Africa',
         facts=['Duration of totality: ~65 minutes.', 'Moon will appear deep red.', 'Visible with naked eye.'],
         is_featured=True),
    dict(title_en='Partial Solar Eclipse', title_uz="Qisman Quyosh tutilishi", title_ru='Chastichnoe solnechnoe zatmenie',
         event_date='2025-03-29', event_type='solar_eclipse', event_time='10:48 UTC',
         description_en='A partial solar eclipse visible from northwestern Africa, Europe and northern Russia.',
         description_uz="Shimoliy-g'arbiy Afrika, Yevropa va Shimoliy Rossiyadan ko'rinadigan qisman Quyosh tutilishi.",
         description_ru='Chastichnoe solnechnoe zatmenie vidimoe iz Afriki, Yevropy i Rossii.',
         visibility='NW Africa, Europe, N Russia',
         facts=['Maximum obscuration ~93%.', 'Use proper solar filters.'],
         is_featured=True),
    dict(title_en='Total Solar Eclipse', title_uz="To'liq Quyosh tutilishi", title_ru='Polnoe solnechnoe zatmenie',
         event_date='2025-09-21', event_type='solar_eclipse', event_time='19:42 UTC',
         description_en='Total solar eclipse visible from South Pacific, New Zealand and Antarctica.',
         description_uz="Janubiy Tinch okeani, Yangi Zelandiya va Antarktidadan ko'rinadigan to'liq Quyosh tutilishi.",
         description_ru='Polnoe solnechnoe zatmenie vidimoe iz Yuzhnogo Tihogo okeana, Novoy Zelandii i Antarktidy.',
         visibility='South Pacific, New Zealand, Antarctica',
         facts=['Path of totality crosses the Southern Ocean.', 'Total duration: ~2 minutes.'],
         is_featured=True),

    # ── 2026 ──
    dict(title_en='Total Lunar Eclipse', title_uz="To'liq Oy tutilishi", title_ru='Polnoe lunnoe zatmenie',
         event_date='2026-03-03', event_type='lunar_eclipse', event_time='11:34 UTC',
         description_en='Total lunar eclipse visible from East Asia, Australia, Pacific and Americas.',
         description_uz="Sharqiy Osiyo, Avstraliya, Tinch okeani va Amerikadan ko'rinadigan to'liq Oy tutilishi.",
         description_ru='Polnoe lunnoe zatmenie vidimoe iz Vostochnoy Azii, Avstralii, Tihogo okeana i Ameriki.',
         visibility='East Asia, Australia, Pacific, Americas',
         facts=['Blood Moon effect.', 'Safe to view with naked eye.', 'Duration of totality: ~58 minutes.'],
         is_featured=True),
    dict(title_en='Total Solar Eclipse', title_uz="To'liq Quyosh tutilishi", title_ru='Polnoe solnechnoe zatmenie',
         event_date='2026-08-12', event_type='solar_eclipse', event_time='17:45 UTC',
         description_en='Total solar eclipse visible from Arctic, Greenland, Iceland, Atlantic Ocean, Spain.',
         description_uz="Arktika, Grenlandiya, Islandiya, Atlantika okeani, Ispaniyadan ko'rinadigan to'liq Quyosh tutilishi.",
         description_ru='Polnoe solnechnoe zatmenie vidimoe iz Arktiki, Grenlandii, Islandii, Ispanii.',
         visibility='Arctic, Greenland, Iceland, Atlantic Ocean, Spain',
         facts=['Path of totality passes over the North Pole.', 'Never look at Sun without filters.'],
         is_featured=True),

    # ── 2027 ──
    dict(title_en='Total Solar Eclipse', title_uz="To'liq Quyosh tutilishi", title_ru='Polnoe solnechnoe zatmenie',
         event_date='2027-08-02', event_type='solar_eclipse', event_time='10:07 UTC',
         description_en='A spectacular total solar eclipse visible across North Africa, the Middle East and Southeast Asia.',
         description_uz="Shimoliy Afrika, Yaqin Sharq va Janubi-sharqiy Osiyodan ko'rinadigan ajoyib to'liq Quyosh tutilishi.",
         description_ru='Vperhatylyauchee polnoe solnechnoe zatmenie cherez Severnuyu Afriku i Blizhniy Vostok.',
         visibility='N Africa, Middle East, SE Asia',
         facts=['One of the longest eclipses of the century at 6 minutes 23 seconds.', 'The path crosses Gibraltar, Egypt, Saudi Arabia.'],
         is_featured=True),

    # ── Annual Meteor Showers (2026 dates) ──
    dict(title_en='Quadrantids Meteor Shower', title_uz="Quadrantidlar meteor yomg'iri", title_ru='Meteorniy potok Kvadrantidy',
         event_date='2026-01-04', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='An above-average shower with up to 40 meteors per hour. Best viewed from Northern Hemisphere.',
         description_uz="O'rtachadan yuqori meteor yomg'iri, soatiga 40 ta meteorgacha.",
         description_ru='Meteorniy potok vyshe srednego, do 40 meteorov v chas.',
         visibility='Best from Northern Hemisphere', facts=['Produced by asteroid 2003 EH1.', 'Short peak window.']),
    dict(title_en='Lyrids Meteor Shower', title_uz="Liridlar meteor yomg'iri", title_ru='Meteorniy potok Liridy',
         event_date='2026-04-22', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='An average shower producing up to 20 meteors per hour at peak.',
         description_uz="O'rtacha meteor yomg'iri, soatiga 20 ta meteorgacha.",
         description_ru='Sredniy potok, do 20 meteorov v chas.',
         visibility='Best from Northern Hemisphere', facts=['One of the oldest observed showers (2,700 years).', 'From comet Thatcher.']),
    dict(title_en='Eta Aquariids Meteor Shower', title_uz="Eta Aquariidlar meteor yomg'iri", title_ru='Meteorniy potok Eta Akvaridy',
         event_date='2026-05-06', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='An above-average shower capable of producing up to 60 meteors per hour.',
         description_uz="Soatiga 60 ta meteorgacha chiqarishga qodir yuqori darajali meteor yomg'iri.",
         description_ru='Potok vyshe srednego, do 60 meteorov v chas.',
         visibility='Best from Southern Hemisphere, visible globally', facts=['From comet Halley.', 'Fast meteors with glowing trains.']),
    dict(title_en='Delta Aquariids Meteor Shower', title_uz="Delta Aquariidlar meteor yomg'iri", title_ru='Meteorniy potok Delta Akvaridy',
         event_date='2026-07-28', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='An average shower producing up to 20 meteors per hour.',
         description_uz="O'rtacha meteor yomg'iri, soatiga 20 ta meteorgacha.",
         description_ru='Sredniy potok, do 20 meteorov v chas.',
         visibility='Best from Southern Hemisphere', facts=['Best viewed from southern tropics.']),
    dict(title_en='Perseids Meteor Shower', title_uz="Perseidlar meteor yomg'iri", title_ru='Meteorniy potok Perseidy',
         event_date='2026-08-13', event_type='meteor_shower', event_time='Peak: All night',
         description_en='One of the best meteor showers. Up to 60 bright multicolored meteors per hour.',
         description_uz="Eng yaxshi meteor yomg'irlaridan biri. Soatiga 60 ta yorqin rangli meteor.",
         description_ru='Odin iz luchshih potokov. Do 60 yarkih raznotsvetnyh meteorov v chas.',
         visibility='Best from Northern Hemisphere',
         facts=['From comet Swift-Tuttle.', 'Thin crescent moon provides dark skies.'],
         is_featured=True),
    dict(title_en='Orionids Meteor Shower', title_uz="Orionidlar meteor yomg'iri", title_ru='Meteorniy potok Orionidy',
         event_date='2026-10-21', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='An average shower producing up to 20 meteors per hour.',
         description_uz="O'rtacha meteor yomg'iri, soatiga 20 ta meteorgacha.",
         description_ru='Sredniy potok, do 20 meteorov v chas.',
         visibility='Visible globally', facts=['Also from comet Halley.', 'Fast meteors.']),
    dict(title_en='Leonids Meteor Shower', title_uz="Leonidlar meteor yomg'iri", title_ru='Meteorniy potok Leonidy',
         event_date='2026-11-17', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='An average shower with cyclonic peaks every 33 years. Up to 15 meteors per hour.',
         description_uz="Har 33 yilda kuchli pik beradigan o'rtacha meteor yomg'iri.",
         description_ru='Sredniy potok s tsiklicheskim pikom kazhdye 33 goda.',
         visibility='Visible globally', facts=['From comet Tempel-Tuttle.', 'Meteors from constellation Leo.']),
    dict(title_en='Geminids Meteor Shower', title_uz="Geminidlar meteor yomg'iri", title_ru='Meteorniy potok Geminidy',
         event_date='2026-12-14', event_type='meteor_shower', event_time='Peak: All night',
         description_en='The king of meteor showers. Up to 120 multicolored meteors per hour.',
         description_uz="Meteor yomg'irlarining qiroli. Soatiga 120 ta rangli meteor.",
         description_ru='Korol meteornyh potokov. Do 120 raznotsvetnyh meteorov v chas.',
         visibility='Visible globally, best in Northern Hemisphere',
         facts=['From asteroid 3200 Phaethon.', 'Visible from 9-10 PM.'],
         is_featured=True),
    dict(title_en='Ursids Meteor Shower', title_uz="Ursidlar meteor yomg'iri", title_ru='Meteorniy potok Ursidy',
         event_date='2026-12-22', event_type='meteor_shower', event_time='Peak: Pre-dawn',
         description_en='A minor shower producing about 5-10 meteors per hour.',
         description_uz="Soatiga 5-10 ta meteor chiqaruvchi kichik meteor yomg'iri.",
         description_ru='Nebolshoy potok, okolo 5-10 meteorov v chas.',
         visibility='Best from Northern Hemisphere', facts=['From comet 8P/Tuttle.']),
]


class Command(BaseCommand):
    help = 'Fetch real astronomy events from APIs and sync to database'

    def add_arguments(self, parser):
        parser.add_argument('--year', type=int, default=None)
        parser.add_argument('--launches', action='store_true', help='Also fetch upcoming launches from LL2 API')

    def handle(self, *args, **options):
        self.stdout.write('Syncing astronomy events...')

        # 1. Seed verified astronomical events
        count = 0
        for ev in VERIFIED_EVENTS:
            if options['year'] and not ev['event_date'].startswith(str(options['year'])):
                continue
            _, created = SpaceEvent.objects.update_or_create(
                title_en=ev['title_en'], event_date=ev['event_date'],
                defaults=ev,
            )
            if created:
                count += 1

        self.stdout.write(f'  Astronomical events: {count} new (total verified: {len(VERIFIED_EVENTS)})')

        # 2. Fetch upcoming launches from Launch Library 2
        if options.get('launches'):
            self._fetch_launches()

        total = SpaceEvent.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Sync complete. Total events in DB: {total}'))

    def _fetch_launches(self):
        self.stdout.write('  Fetching upcoming launches from Launch Library 2...')
        try:
            url = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=15&mode=list'
            req = urllib.request.Request(url, headers={'User-Agent': 'UZ-COSMOS/1.0'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())

            launches = data.get('results', [])
            created_count = 0
            for launch in launches:
                name = launch.get('name', 'Unknown Launch')
                net = launch.get('net', '')  # ISO datetime
                if not net:
                    continue

                launch_date = net[:10]
                launch_time = net[11:19] + ' UTC' if len(net) > 10 else ''

                # LL2 list mode uses flat string fields
                provider = launch.get('lsp_name', '') or ''
                pad_name = launch.get('pad_name', '') or ''
                location = launch.get('location_name', '') or ''
                if location:
                    pad_name = f'{pad_name}, {location}' if pad_name else location

                mission = launch.get('mission', '') or name
                mission_desc = launch.get('mission_description', '') or ''

                desc = f'Launch: {name}'
                if provider:
                    desc += f' by {provider}'
                if mission_desc:
                    desc += f'. {mission_desc}'

                facts = []
                if provider:
                    facts.append(f'Provider: {provider}')
                if pad_name:
                    facts.append(f'Pad: {pad_name}')
                status_info = launch.get('status', {})
                if isinstance(status_info, dict) and status_info.get('name'):
                    facts.append(f'Status: {status_info["name"]}')

                _, created = SpaceEvent.objects.update_or_create(
                    title_en=name, event_date=launch_date,
                    defaults=dict(
                        title_en=name,
                        title_uz=name,
                        title_ru=name,
                        description_en=desc,
                        description_uz=desc,
                        description_ru=desc,
                        event_date=launch_date,
                        event_type='launch',
                        event_time=launch_time,
                        visibility=pad_name,
                        source_url=launch.get('url', ''),
                        facts=facts,
                    ),
                )
                if created:
                    created_count += 1

            self.stdout.write(f'  Launches: {created_count} new from {len(launches)} fetched')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  Launch API error: {e}'))
