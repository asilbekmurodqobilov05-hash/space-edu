import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.settings')
django.setup()

from apps.news.models import NewsArticle
from django.utils import timezone

news_items = [
    {
        'title_en': 'James Webb Space Telescope Reveals New Exoplanet Atmosphere Data',
        'title_uz': 'James Webb (JWST) teleskopidan yangi ekzosayyora atmosferasi tasvirlari',
        'title_ru': 'Телескоп Джеймс Уэбб (JWST) представил новые данные об атмосфере экзопланет',
        'summary_en': 'NASA released new images from JWST showing methane and carbon dioxide ratios on K2-18b type planets, supporting theories of potential oceans.',
        'summary_uz': 'NASA JWST dan "K2-18b" tipidagi sayyoralarda metan va karbonat angidridning yangi nisbatlari aniqlangan tasvirlarni e’lon qildi, bu esa okeanlar ehtimolini oshiradi.',
        'summary_ru': 'НАСА опубликовало снимки JWST, на которых обнаружены новые соотношения метана и углекислого газа на планетах типа K2-18b, что подтверждает теорию об океанах.',
        'category': 'discovery',
        'source': 'NASA',
        'source_url': 'https://www.nasa.gov/mission_pages/webb/main/index.html',
    },
    {
        'title_en': 'Perseverance Rover Completes Delta Sample Analysis in Jezero Crater',
        'title_uz': 'Perseverance roveri "Ezero" kraterida namuna tahlilini yakunladi',
        'title_ru': 'Марсоход Perseverance завершил анализ образцов дельты в кратере Езеро',
        'summary_en': 'The rover finished analyzing samples from an ancient river delta, providing new data on organic molecule traces on Mars.',
        'summary_uz': 'Rover qadimgi daryo deltasidan olingan namunalar tahlilini yakunladi va organik molekulalar izlari haqida yangi ma’lumotlar berdi.',
        'summary_ru': 'Марсоход завершил анализ образцов из дельты древней реки, предоставив новые данные о следах органических молекул на Марсе.',
        'category': 'exploration',
        'source': 'NASA Mars',
        'source_url': 'https://mars.nasa.gov/mars2020/',
    }
]

for item in news_items:
    article, created = NewsArticle.objects.get_or_create(
        title_en=item['title_en'],
        defaults=item
    )
    if created:
        print(f"Created news article: {article.title_en}")
    else:
        print(f"News article already exists: {article.title_en}")

print("Done!")
