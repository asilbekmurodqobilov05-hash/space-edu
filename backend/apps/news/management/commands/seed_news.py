"""
Seed NewsArticle table with space news.
Usage:  python manage.py seed_news
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.news.models import NewsArticle


class Command(BaseCommand):
    help = 'Populate NewsArticle table with space news'

    def handle(self, *args, **options):
        self.stdout.write('Seeding news articles...')
        now = timezone.now()

        articles = [
            dict(
                title_en='James Webb Telescope Discovers New Exoplanet Atmosphere',
                title_uz='Jeyms Vebb teleskopi yangi ekzosayyora atmosferasini kashf etdi',
                title_ru='Teleskop Dzheyms Uebb obnaruzhil atmosferu novoy ekzoplanety',
                summary_en='JWST has detected water vapor and carbon dioxide in the atmosphere of a rocky exoplanet, bringing us closer to finding habitable worlds.',
                summary_uz='JWST toshli ekzosayyora atmosferasida suv bug\'i va karbonat angidridni aniqladi.',
                summary_ru='JWST obnaruzhil vodyanoy par i uglekislyy gaz v atmosfere skalistoy ekzoplanety.',
                content_en='The James Webb Space Telescope continues to revolutionize our understanding of distant worlds. In its latest finding, the telescope has detected clear signatures of water vapor and carbon dioxide in the atmosphere of a rocky exoplanet located 40 light-years from Earth.',
                content_uz='Jeyms Vebb kosmik teleskopi uzoq dunyolar haqidagi tushunchamizni inqilob qilishda davom etmoqda.',
                content_ru='Kosmicheskiy teleskop Dzheyms Uebb prodolzhaet revolyutsionirovat nashe ponimanie dalnih mirov.',
                category='discovery', source='NASA', source_url='https://www.nasa.gov',
                published_at=now - timedelta(hours=2),
            ),
            dict(
                title_en='SpaceX Starship Completes First Orbital Refueling Test',
                title_uz='SpaceX Starship birinchi orbital yoqilg\'i quyish sinovini yakunladi',
                title_ru='SpaceX Starship zavershil pervyy test orbitalnoy zapravki',
                summary_en='SpaceX has successfully demonstrated orbital propellant transfer between two Starship vehicles, a key milestone for Moon and Mars missions.',
                summary_uz='SpaceX ikki Starship o\'rtasida orbital yoqilg\'i uzatishni muvaffaqiyatli namoyish qildi.',
                summary_ru='SpaceX uspeshno prodemonstrirovala orbitalnuyu perekachku topliva mezhdu dvumya Starship.',
                content_en='In a historic achievement, SpaceX has completed the first successful orbital refueling demonstration.',
                content_uz='Tarixiy yutuqda SpaceX birinchi muvaffaqiyatli orbital yoqilg\'i quyish namoyishini yakunladi.',
                content_ru='V istoricheskom dostizhenii SpaceX zavershila pervuyu uspeshnuyu demonstratsiyu orbitalnoy zapravki.',
                category='technology', source='SpaceX', source_url='https://www.spacex.com',
                published_at=now - timedelta(hours=8),
            ),
            dict(
                title_en='NASA Artemis III Moon Landing Date Confirmed',
                title_uz='NASA Artemis III Oyga qo\'nish sanasi tasdiqlandi',
                title_ru='NASA podtverdila datu posadki Artemis III na Lunu',
                summary_en='NASA has officially confirmed the target date for the Artemis III mission, which will land the first woman and next man on the Moon.',
                summary_uz='NASA Artemis III missiyasi uchun maqsadli sanani rasman tasdiqladi.',
                summary_ru='NASA ofitsialno podtverdila tselevuyu datu missii Artemis III.',
                content_en='NASA Administrator announced the confirmed timeline for the Artemis III crewed lunar landing mission.',
                content_uz='NASA rahbari Artemis III ekipajli Oy qo\'nish missiyasi uchun tasdiqlangan jadval haqida e\'lon qildi.',
                content_ru='Administrator NASA obyavil podtverzhdennyy grafik missii Artemis III.',
                category='mission', source='NASA', source_url='https://www.nasa.gov/artemis',
                published_at=now - timedelta(days=1),
            ),
            dict(
                title_en='ESA JUICE Spacecraft Enters Jupiter Orbit',
                title_uz='ESA JUICE kosmik kemasi Yupiter orbitasiga kirdi',
                title_ru='Kosmicheskiy apparat ESA JUICE vyshel na orbitu Yupitera',
                summary_en='The European Space Agency\'s JUICE mission has successfully entered orbit around Jupiter to study its icy moons.',
                summary_uz='Yevropa Kosmik Agentligining JUICE missiyasi Yupiter orbitasiga muvaffaqiyatli kirdi.',
                summary_ru='Missiya JUICE Yevropeyskogo kosmicheskogo agentstva uspeshno vyshla na orbitu Yupitera.',
                content_en='After years of travel, ESA JUICE spacecraft has entered Jupiter orbit to begin studying Europa, Ganymede, and Callisto.',
                content_uz='Yillar davomida sayohat qilgandan so\'ng, ESA JUICE kosmik kemasi Yevropani o\'rganishni boshlash uchun Yupiter orbitasiga kirdi.',
                content_ru='Posle let puteshestviya kosmicheskiy apparat ESA JUICE vyshel na orbitu Yupitera.',
                category='exploration', source='ESA', source_url='https://www.esa.int',
                published_at=now - timedelta(days=2),
            ),
            dict(
                title_en='New Record: 17 People Simultaneously in Space',
                title_uz='Yangi rekord: Kosmosda bir vaqtning o\'zida 17 kishi',
                title_ru='Novyy rekord: 17 chelovek odnovremenno v kosmose',
                summary_en='With crews aboard ISS, Tiangong, and a private mission, 17 people are now simultaneously in orbit.',
                summary_uz='XKS, Tiangong va xususiy missiya ekipajlari bilan 17 kishi bir vaqtning o\'zida orbitada.',
                summary_ru='S ekipazhami na MKS, Tiangong i chastnoy missii, 17 chelovek odnovremenno na orbite.',
                content_en='A new record has been set for the most humans simultaneously in space.',
                content_uz='Kosmosda bir vaqtning o\'zida eng ko\'p odam soni bo\'yicha yangi rekord o\'rnatildi.',
                content_ru='Ustanovlen novyy rekord po kolichestvu lyudey odnovremenno v kosmose.',
                category='milestone', source='Space.com', source_url='https://www.space.com',
                published_at=now - timedelta(days=3),
            ),
            dict(
                title_en='India ISRO Successfully Tests Reusable Launch Vehicle',
                title_uz='Hindiston ISRO qayta ishlatiladigan uchirish vositasini muvaffaqiyatli sinab ko\'rdi',
                title_ru='ISRO Indii uspeshno ispytala mnogorazovuyu raketu-nositel',
                summary_en='ISRO completed a successful landing test of its Reusable Launch Vehicle demonstrator.',
                summary_uz='ISRO qayta ishlatiladigan uchirish vositasi namunasining qo\'nish sinovini muvaffaqiyatli yakunladi.',
                summary_ru='ISRO uspeshno zavershila ispytaniya posadki demonstratora mnogorazovoy rakety.',
                content_en='ISRO has taken a major step toward affordable space access with its reusable launch vehicle program.',
                content_uz='ISRO qayta ishlatiladigan uchirish vositasi dasturi bilan arzon kosmik kirish yo\'lida katta qadam tashladi.',
                content_ru='ISRO sdelala vazhnyy shag k dostupnomu kosmosu s programmoy mnogorazovoy rakety.',
                category='technology', source='ISRO', source_url='https://www.isro.gov.in',
                published_at=now - timedelta(days=4),
            ),
            dict(
                title_en='O\'zbekistonda kosmik ta\'lim platformasi ishga tushdi',
                title_uz='O\'zbekistonda kosmik ta\'lim platformasi ishga tushdi',
                title_ru='V Uzbekistane zapushchena kosmicheskaya obrazovatelnaya platforma',
                summary_en='A new space education platform UZ COSMOS has launched in Uzbekistan, providing free space science education.',
                summary_uz='O\'zbekistonda yangi kosmik ta\'lim platformasi UZ COSMOS ishga tushdi.',
                summary_ru='V Uzbekistane zapushchena novaya kosmicheskaya obrazovatelnaya platforma UZ COSMOS.',
                content_en='UZ COSMOS is a free educational platform covering physics, astronomy, and space exploration.',
                content_uz='UZ COSMOS - fizika, astronomiya va kosmosni o\'rganishni qamrab oluvchi bepul ta\'lim platformasi.',
                content_ru='UZ COSMOS - besplatnaya obrazovatelnaya platforma po fizike, astronomii i issledovaniyu kosmosa.',
                category='local', source='UZ COSMOS', source_url='https://uzcosmos.uz',
                published_at=now - timedelta(days=5),
                is_published=True,
            ),
            dict(
                title_en='Mars Sample Return Mission Gets New Timeline',
                title_uz='Mars namunalarini qaytarish missiyasi yangi jadval oldi',
                title_ru='Missiya po vozvratu obraztsov s Marsa poluchila novyy grafik',
                summary_en='NASA and ESA announced a revised plan for bringing Martian soil samples back to Earth by the early 2030s.',
                summary_uz='NASA va ESA Mars tuproq namunalarini Yerga qaytarish bo\'yicha qayta ko\'rib chiqilgan rejani e\'lon qildi.',
                summary_ru='NASA i ESA obyavili peresmotrenniy plan po dostavke obraztsov grunta s Marsa.',
                content_en='The Mars Sample Return mission continues to be one of the most ambitious projects in planetary science.',
                content_uz='Mars namunalarini qaytarish missiyasi sayyoralar ilmidagi eng ambitsiyali loyihalardan biri.',
                content_ru='Missiya Mars Sample Return ostaetsya odnim iz samyh ambitsioznyh proektov.',
                category='mission', source='NASA/ESA', source_url='https://mars.nasa.gov',
                published_at=now - timedelta(days=6),
            ),
        ]

        for art in articles:
            obj, created = NewsArticle.objects.update_or_create(
                title_en=art['title_en'],
                defaults=art,
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {obj.title_en[:60]}...')

        self.stdout.write(self.style.SUCCESS(f'\nSeeded {len(articles)} news articles!'))
