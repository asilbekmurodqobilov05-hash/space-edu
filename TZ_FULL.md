# UZ COSMOS — Полное Техническое Задание
### Версия 1.0 | Дата: 2026-04-29 | Ревьюер: Senior Fullstack / Tech Lead

---

## РАЗДЕЛ 0 — ЧЕСТНАЯ ОЦЕНКА ПРОЕКТА

> Это не похвала и не критика ради критики. Это взгляд человека, который сдал 3000+ проектов и знает, что ждёт на production.

---

### 0.1 Что сделано хорошо

**Архитектурные решения:**
- Стек выбран правильно и современно: React 19, Vite 6, Zustand 5, Tailwind 4, Three.js. Это не устаревшие технологии, это актуальный production-стек.
- Разделение на `views/`, `components/`, `store/`, `data/`, `features/` — правильная доменная структура. Не плоский хаос, не overengineered монолит.
- `@/` алиасы настроены — нет адских `../../../../../../` путей.
- Gamification store (`useGamificationStore.js`) написан грамотно: чистые действия, формула уровня через `sqrt`, правильный `persist`.
- i18n система кастомная и работает — 3 языка, JSON локали, `useTranslation` хук.
- AskCosmos (Gemini 2.0 Flash) — хорошая идея и реализована как отдельный `feature/` модуль, не перемешана с остальным кодом.
- `PageTransition` вынесен в компонент — нет дублирования Framer Motion обёрток.
- Router структура в `App.jsx` чистая и читаемая.
- Gamification логика в Zustand покрывает всё нужное: XP, fuel, streak, badges, skills, portfolio, inventory.

**Что правильно придумано концептуально:**
- Геймификация через космическую метафору (топливо = валюта, уровни = ранги, ракеты = скины) — работает органично.
- 4 карьерных трека — правильная дифференциация обучения.
- Раздел UzSpace (узбекская космическая программа) — уникальный контент, которого нет у конкурентов.
- Daily Challenge со streak — retention механика правильная.

---

### 0.2 Критические проблемы (BLOCKER уровень)

Это не "нужно улучшить". Это "проект НЕ РАБОТАЕТ в production без этого".

**BLOCKER 1 — SECRET_KEY захардкожен в settings.py**
```python
# backend/base/settings.py — прямо в репозитории:
SECRET_KEY = 'django-insecure-nau*1u@t^542#y_bl#9anu#5n-5f%(g*=j(f4fdj%7t67_pg-d'
```
Это не warning, это критический провал безопасности. При наличии этого ключа злоумышленник может подделать любую сессию Django. Комиссия или любой технический проверяющий увидит это в первые 30 секунд.

**BLOCKER 2 — Backend не существует**
```
backend/
├── base/          ← только settings/urls/wsgi/asgi
├── manage.py
└── db.sqlite3     ← закоммичен в репозиторий
```
Ноль приложений. Ноль моделей. Ноль API. Ноль аутентификации. Фронтенд работает полностью на захардкоженных данных. Это не MVP — это прототип с видом платформы.

**BLOCKER 3 — Нет аутентификации**
Любой пользователь может войти на любую страницу без регистрации. Данные "пользователя" живут в localStorage без привязки к реальному аккаунту. Если очистить localStorage — пользователь теряет всё: прогресс, XP, значки, инвентарь.

**BLOCKER 4 — `db.sqlite3` в репозитории**
База данных не должна храниться в git. Никогда. Это означает, что у каждого разработчика в истории репозитория есть снимок базы данных других разработчиков.

**BLOCKER 5 — `express` и `dotenv` в frontend зависимостях**
```json
"dependencies": {
  "express": "^4.21.2",
  "dotenv": "^17.2.3"
}
```
Express — это Node.js серверный фреймворк. Он не нужен во frontend Vite-приложении. Это говорит о том, что кто-то экспериментировал с созданием mini-сервера внутри frontend репозитория. Это неправильная архитектура. Удалить немедленно.

**BLOCKER 6 — TypeScript удалён наполовину**
`package.json` содержит `typescript` в `devDependencies`, скрипт `"lint": "tsc --noEmit"`, но файлы уже `.jsx`/`.js`. `tsc --noEmit` падает, значит `npm run lint` сломан. Миграция застряла в переходном состоянии.

---

### 0.3 Серьёзные проблемы (HIGH — без них MVP не считается готовым)

**HIGH 1 — Дублирование иконочных библиотек**
```json
"lucide-react": "^0.546.0",
"react-icons": "^5.6.0"
```
Два пакета иконок — это +200KB бандла без причины. Выбрать один (lucide-react) и удалить второй.

**HIGH 2 — Нет защищённых маршрутов**
`/leaderboard`, `/market`, `/portfolio`, `/careers`, `/daily` — открыты для всех. Данные должны быть привязаны к авторизованному пользователю.

**HIGH 3 — Нет обработки ошибок**
Нет `ErrorBoundary`. Нет 404 страницы. Любой необработанный `throw` в компоненте кладёт всё приложение с белым экраном. Для комиссии это критично.

**HIGH 4 — Фейковые данные в production-виде**
`"12,847 learners"`, `"4.9 rating"` — захардкоженные числа на главной странице. Если комиссия спросит "покажите реальных пользователей" — ответа нет. Либо убрать, либо заменить реальными данными из API.

**HIGH 5 — Нет `requirements.txt` для бэкенда**
Невозможно воспроизвести окружение. `pip install -r requirements.txt` упадёт потому что файла нет.

**HIGH 6 — Все данные только на английском в коде**
`src/data/planetsData.js`, `src/data/careersData.js`, `src/data/learningData.js` — данные без локализации. Либо данные должны быть структурированы как `{ en, uz, ru }`, либо они должны идти с бэкенда. Сейчас i18n сделан только для UI-строк, но не для контента.

---

### 0.4 Средние проблемы (MEDIUM — без них неудобно, но работает)

- Нет loading skeleton при асинхронных запросах (когда API будет подключён)
- `src/data/mockData.js` содержит тестовые данные — должен быть удалён перед демо
- Нет lazy loading для тяжёлых страниц (`SolarSystemView`, `SpaceRunView` — Three.js грузится сразу)
- Нет `<title>` и `<meta description>` в `index.html` — плохо для SEO и для вкладки браузера
- `TIME_ZONE = 'UTC'` в Django вместо `'Asia/Tashkent'`
- Нет пагинации (когда появятся реальные данные, списки будут загружать всё сразу)
- `console.log` предположительно есть в коде (не проверено, но типично)

---

## РАЗДЕЛ 1 — MVP: ЧТО ВХОДИТ, ЧТО НЕ ВХОДИТ

MVP (Minimum Viable Product) — это минимальная версия, которую можно показать комиссии и которая работает end-to-end: реальный пользователь регистрируется, обучается, зарабатывает XP, видит прогресс.

### Входит в MVP

| # | Фича | Статус |
|---|---|---|
| 1 | Регистрация / Вход (JWT) | Не сделано |
| 2 | Профиль пользователя (XP, уровень, значки) | Не сделано |
| 3 | Каталог курсов из БД | Не сделано |
| 4 | Просмотр урока (текст + видео) | Частично (нет API) |
| 5 | Квиз с сохранением результата | Частично (нет API) |
| 6 | Система XP и уровней | Есть (Zustand), нужен backend |
| 7 | Таблица лидеров из БД | Нет API |
| 8 | Магазин (покупка за топливо) | Нет API |
| 9 | Глобальный чат | Не сделано |
| 10 | AI помощник AskCosmos | Готово |
| 11 | 3D Солнечная система | Готово |
| 12 | Раздел хронологии с контентом | Частично |
| 13 | Раздел карьер | Готово (UI) |
| 14 | Daily Challenge | Готово (UI, нет API) |
| 15 | Страница 404 | Не сделано |
| 16 | Мобильная адаптация | Частично |

### Не входит в MVP (следующая версия)

- Загрузка собственного аватара (S3/CDN)
- Видеозвонки / вебинары
- Система оплаты
- Нотификации по email
- Мобильное приложение
- Административная панель (кроме Django Admin)
- A/B тестирование
- Аналитика событий

---

## РАЗДЕЛ 2 — ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ: BACKEND

### 2.1 Окружение и настройка

**Обязательные пакеты** (`requirements.txt`):
```
Django==6.0.*
djangorestframework==3.15.*
djangorestframework-simplejwt==5.3.*
django-cors-headers==4.4.*
django-channels==4.1.*
channels-redis==4.2.*
Pillow==10.4.*
python-decouple==3.8
dj-database-url==2.2.*
```

**Структура настроек:**
```
backend/
├── base/
│   ├── settings/
│   │   ├── __init__.py      ← from .development import *
│   │   ├── base.py          ← общие настройки
│   │   ├── development.py   ← DEBUG=True, SQLite
│   │   └── production.py    ← DEBUG=False, PostgreSQL, HTTPS
│   ├── urls.py
│   ├── asgi.py              ← включая Channels routing
│   └── wsgi.py
├── apps/
│   ├── accounts/
│   ├── courses/
│   ├── progress/
│   ├── gamification/
│   ├── chat/
│   └── market/
├── manage.py
├── requirements.txt
├── .env.example
└── .gitignore
```

**`.env` (никогда не коммитить):**
```ini
SECRET_KEY=<генерировать через secrets.token_urlsafe(50)>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DB_URL=sqlite:///db.sqlite3
TIME_ZONE=Asia/Tashkent
```

**`base.py` — обязательные настройки:**
```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', cast=bool, default=False)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')
TIME_ZONE = config('TIME_ZONE', default='Asia/Tashkent')

INSTALLED_APPS = [
    # django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',
    # apps
    'apps.accounts',
    'apps.courses',
    'apps.progress',
    'apps.gamification',
    'apps.chat',
    'apps.market',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
```

---

### 2.2 Приложение `accounts`

**Модели:**
```python
class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    astronaut_name = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=300, blank=True)
    selected_spaceship = models.CharField(max_length=50, default='rocket_basic')
    language = models.CharField(max_length=2, choices=[('en','ENG'),('uz','UZB'),('ru','RUS')], default='en')

    class Meta:
        verbose_name = 'User'

    def __str__(self):
        return self.username
```

**API Endpoints:**

| Метод | URL | Auth | Описание |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | Нет | Регистрация |
| POST | `/api/v1/auth/login/` | Нет | Получить токены |
| POST | `/api/v1/auth/token/refresh/` | Нет | Обновить access токен |
| POST | `/api/v1/auth/logout/` | Да | Инвалидировать refresh |
| GET | `/api/v1/auth/me/` | Да | Получить профиль |
| PATCH | `/api/v1/auth/me/` | Да | Обновить профиль |

**Сериализаторы:**
```python
# RegisterSerializer — обязательные поля: username, email, password, password2
# Валидация: password == password2, email уникален, username уникален
# После создания — не возвращать пароль

# UserSerializer — только для чтения: id, username, email, avatar, astronaut_name, language
# ProfileSerializer — для PATCH: avatar, astronaut_name, bio, selected_spaceship, language
```

**Требования к паролям:**
- Минимум 8 символов
- Не может быть полностью числовым
- Не может совпадать с username
- Обрабатывать Django `AUTH_PASSWORD_VALIDATORS`

---

### 2.3 Приложение `courses`

**Модели:**
```python
class Level(models.Model):
    slug = models.SlugField(unique=True)           # 'solar-system'
    order = models.PositiveSmallIntegerField()
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    icon = models.CharField(max_length=50)          # имя иконки lucide
    color = models.CharField(max_length=20)         # tailwind класс

class Unit(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='units')
    slug = models.SlugField()
    order = models.PositiveSmallIntegerField()
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    xp_reward = models.PositiveIntegerField(default=100)
    fuel_reward = models.PositiveIntegerField(default=50)

class Lesson(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='lessons')
    slug = models.SlugField()
    order = models.PositiveSmallIntegerField()
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    lesson_type = models.CharField(max_length=20, choices=[
        ('explanation', 'Explanation'),
        ('quiz', 'Quiz'),
        ('video', 'Video'),
        ('simulation', 'Simulation'),
    ])
    xp_reward = models.PositiveIntegerField(default=50)
    estimated_minutes = models.PositiveSmallIntegerField(default=10)

class LessonSection(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='sections')
    order = models.PositiveSmallIntegerField()
    section_type = models.CharField(max_length=20)   # 'text', 'video', 'quiz'
    content_en = models.JSONField(default=dict)
    content_uz = models.JSONField(default=dict)
    content_ru = models.JSONField(default=dict)

class QuizQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    order = models.PositiveSmallIntegerField()
    text_en = models.TextField()
    text_uz = models.TextField()
    text_ru = models.TextField()
    options = models.JSONField()          # [{"id": "a", "en": ..., "uz": ..., "ru": ...}]
    correct_answer = models.CharField(max_length=1)
    explanation_en = models.TextField()
    explanation_uz = models.TextField()
    explanation_ru = models.TextField()
```

**API Endpoints (все публичные — авторизация не требуется):**

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/v1/courses/levels/` | Все уровни |
| GET | `/api/v1/courses/levels/{slug}/units/` | Юниты уровня |
| GET | `/api/v1/courses/units/{slug}/` | Один юнит с уроками |
| GET | `/api/v1/courses/lessons/{slug}/` | Урок с секциями и квизом |

---

### 2.4 Приложение `progress`

**Модели:**
```python
class UserLessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)   # 0–100
    attempts = models.PositiveSmallIntegerField(default=0)
    is_mastered = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')

class UserUnitEnrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    unit = models.ForeignKey('courses.Unit', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'unit')
```

**API Endpoints (все требуют JWT):**

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/v1/progress/` | Весь прогресс пользователя |
| POST | `/api/v1/progress/lessons/{lesson_slug}/complete/` | Завершить урок + начислить XP |
| GET | `/api/v1/progress/units/{unit_slug}/` | Прогресс по юниту |
| POST | `/api/v1/progress/units/{unit_slug}/enroll/` | Записаться на юнит |

**Бизнес-логика при завершении урока:**
1. Создать/обновить `UserLessonProgress` (score, attempts)
2. Если score >= 70 — `is_mastered = True`
3. Вызвать сигнал → `apps.gamification` начисляет XP и топливо
4. Проверить значки через сигнал
5. Проверить — все уроки юнита пройдены? Завершить `UserUnitEnrollment`
6. Вернуть: `{ xp_earned, fuel_earned, new_level, new_badges, is_mastered }`

---

### 2.5 Приложение `gamification`

**Модели:**
```python
class UserGamificationProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='gamification')
    xp = models.PositiveIntegerField(default=0)
    level = models.PositiveSmallIntegerField(default=1)
    fuel = models.PositiveIntegerField(default=100)
    streak = models.PositiveSmallIntegerField(default=0)
    last_play_date = models.DateField(null=True, blank=True)
    skills = models.JSONField(default=dict)   # {"physics": "skilled", "astronomy": "mastered"}

    def add_xp(self, amount):
        self.xp += amount
        self.level = math.floor(math.sqrt(self.xp / 100)) + 1
        self.save(update_fields=['xp', 'level'])

class Badge(models.Model):
    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    icon = models.CharField(max_length=50)
    condition_type = models.CharField(max_length=30)   # 'xp_threshold', 'streak', 'lessons'
    condition_value = models.PositiveIntegerField()

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
```

**API Endpoints:**

| Метод | URL | Auth | Описание |
|---|---|---|---|
| GET | `/api/v1/gamification/profile/` | Да | Профиль с XP, уровнем, топливом |
| GET | `/api/v1/gamification/leaderboard/` | Нет | Топ-100 по XP |
| GET | `/api/v1/gamification/badges/` | Да | Все значки пользователя |
| POST | `/api/v1/gamification/streak/` | Да | Обновить streak (ежедневный вход) |

---

### 2.6 Приложение `market`

**Модели:**
```python
class MarketItem(models.Model):
    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    item_type = models.CharField(max_length=20, choices=[
        ('spaceship', 'Spaceship'),
        ('badge', 'Badge'),
        ('boost', 'XP Boost'),
    ])
    cost_fuel = models.PositiveIntegerField()
    image = models.ImageField(upload_to='market/')
    is_active = models.BooleanField(default=True)

class UserInventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inventory')
    item = models.ForeignKey(MarketItem, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')
```

**API Endpoints:**

| Метод | URL | Auth | Описание |
|---|---|---|---|
| GET | `/api/v1/market/items/` | Нет | Список товаров |
| POST | `/api/v1/market/purchase/` | Да | Купить товар |
| GET | `/api/v1/market/inventory/` | Да | Инвентарь пользователя |

**Логика покупки:**
1. Проверить — достаточно топлива (`user.gamification.fuel >= item.cost_fuel`)
2. Проверить — товар не куплен (`UserInventory` не существует)
3. Атомарно: списать топливо + создать `UserInventory`
4. Если топлива не хватает → `HTTP 400` с понятным сообщением

---

### 2.7 Приложение `chat`

**Модели:**
```python
class ChatRoom(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    is_global = models.BooleanField(default=True)

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
```

**REST API:**

| Метод | URL | Auth | Описание |
|---|---|---|---|
| GET | `/api/v1/chat/rooms/` | Нет | Список комнат |
| GET | `/api/v1/chat/rooms/{slug}/messages/` | Нет | Последние 50 сообщений |

**WebSocket (`asgi.py`):**
```
ws://localhost:8000/ws/chat/{room_slug}/
```

**Consumer логика:**
- `connect()` — принять подключение, добавить в channel group
- `receive()` — сохранить в БД, broadcast всем в группе
- `disconnect()` — убрать из группы
- Сообщение не отправляется если пользователь не авторизован (JWT в query string или cookie)

---

## РАЗДЕЛ 3 — ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ: FRONTEND

### 3.1 Что исправить немедленно

**Удалить из `package.json`:**
```json
"express": "^4.21.2",     ← это не нужно во frontend
"dotenv": "^17.2.3",      ← Vite использует import.meta.env, не dotenv
"react-icons": "^5.6.0",  ← дублирует lucide-react
"typescript": "~5.8.2",   ← миграция на JS завершена
"@types/express": "^4.17.21",   ← серверный тип, не нужен
"@types/canvas-confetti": "^1.9.0"  ← можно убрать после JS миграции
```

**Исправить `package.json` скрипты:**
```json
"scripts": {
  "dev": "vite --port=3000 --host=0.0.0.0",
  "build": "vite build",
  "preview": "vite preview"
}
```
Убрать `"lint": "tsc --noEmit"` — TypeScript больше нет.

**Добавить в `index.html`:**
```html
<title>UZ COSMOS — Cosmic Career Academy</title>
<meta name="description" content="Gamified space education platform for Uzbekistan youth. Learn astronomy, physics, and space careers." />
<meta name="theme-color" content="#0f172a" />
```

---

### 3.2 API слой

**`src/lib/api.js`** — единственное место всех HTTP запросов:
```js
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status !== 401) return Promise.reject(error);
    try {
      const refresh = useAuthStore.getState().refreshToken;
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, { refresh });
      useAuthStore.getState().setTokens(data.access, data.refresh);
      error.config.headers.Authorization = `Bearer ${data.access}`;
      return api(error.config);
    } catch {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }
);

export default api;
```

---

### 3.3 Аутентификация (Frontend)

**`src/store/useAuthStore.js`:**
```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      updateUser: (data) =>
        set((s) => ({ user: { ...s.user, ...data } })),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

**`src/components/ProtectedRoute.jsx`:**
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

**Обновить `App.jsx`** — добавить маршруты:
```jsx
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginView from '@/views/auth/LoginView';
import RegisterView from '@/views/auth/RegisterView';
import ProfileView from '@/views/profile/ProfileView';
import ChatView from '@/views/chat/ChatView';
import NotFoundView from '@/views/misc/NotFoundView';

// В Router:
<Route path="/login"    element={<LoginView />} />
<Route path="/register" element={<RegisterView />} />

<Route element={<ProtectedRoute />}>
  <Route path="/profile"     element={<PageTransition><ProfileView /></PageTransition>} />
  <Route path="/chat"        element={<PageTransition><ChatView /></PageTransition>} />
  <Route path="/market"      element={<PageTransition><MarketView /></PageTransition>} />
  <Route path="/portfolio"   element={<PageTransition><PortfolioView /></PageTransition>} />
  <Route path="/daily"       element={<PageTransition><DailyChallengeView /></PageTransition>} />
</Route>

<Route path="*" element={<NotFoundView />} />
```

---

### 3.4 Обработка ошибок

**`src/components/ErrorBoundary.jsx`:**
```jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <button
            className="px-6 py-2 bg-blue-600 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Обернуть в `main.jsx`:
```jsx
<ErrorBoundary>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</ErrorBoundary>
```

---

### 3.5 Страница 404

**`src/views/misc/NotFoundView.jsx`** — "Lost in Space" дизайн:
- Большая надпись `404`
- Текст: "You are lost in space" (локализованный)
- Кнопка "Return to Earth" → `navigate('/')`
- Анимация: дрейфующий астронавт (CSS или Framer Motion)

---

### 3.6 Производительность

**Lazy loading тяжёлых маршрутов** в `App.jsx`:
```jsx
import { lazy, Suspense } from 'react';

const SolarSystemView = lazy(() => import('@/views/explore/SolarSystemView'));
const SpaceRunView = lazy(() => import('@/views/game/SpaceRunView'));
const StarFinderView = lazy(() => import('@/views/explore/StarFinderView'));

// Обернуть в <Suspense fallback={<PageLoader />}>
```

**`src/components/ui/PageLoader.jsx`** — spinner на время загрузки чанка.

---

### 3.7 Новые страницы

**`LoginView.jsx`** и **`RegisterView.jsx`** — требования:
- Форма с валидацией (без внешних библиотек форм — Zustand + useState)
- Показывать конкретные ошибки с API (не "что-то пошло не так")
- Loading state на кнопке Submit
- Навигация между Login↔Register
- Космический дизайн, тёмный фон, нет Navigation (не нужна на auth страницах)

**`ProfileView.jsx`** — требования:
- Загружать данные: `GET /api/v1/auth/me/` + `GET /api/v1/gamification/profile/`
- Показывать: аватар, username, уровень, XP бар, топливо, streak, значки
- Скелетон во время загрузки
- Кнопка "Edit" — inline форма (не отдельная страница)
- Radar chart навыков — через SVG, без recharts

**`ChatView.jsx`** — требования:
- Загрузить 50 последних сообщений через REST при открытии
- Подключить WebSocket для реального времени
- Автоскролл вниз при новом сообщении
- Показывать аватар + username + время сообщения
- Поле ввода с Enter для отправки

---

## РАЗДЕЛ 4 — БЕЗОПАСНОСТЬ

### Обязательно до любого демо:

| # | Требование | Уровень |
|---|---|---|
| 1 | SECRET_KEY из `.env` | CRITICAL |
| 2 | DEBUG=False для production build | CRITICAL |
| 3 | `.env` в `.gitignore` | CRITICAL |
| 4 | `db.sqlite3` в `.gitignore` | HIGH |
| 5 | Rate-limit на `/api/v1/auth/login/` — макс 10 попыток/час | HIGH |
| 6 | JWT токены не в URL параметрах, только в headers | HIGH |
| 7 | CORS — только разрешённые origins | HIGH |
| 8 | Валидация всех POST данных на backend | HIGH |
| 9 | Пагинация на всех list endpoints | MEDIUM |
| 10 | Sanitize текстовый ввод (chat) — XSS защита | MEDIUM |

**Rate limiting** (через middleware или `djangorestframework-throttling`):
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day',
        'login': '10/hour',   # кастомный throttle на LoginView
    }
}
```

---

## РАЗДЕЛ 5 — FRONTEND ↔ BACKEND ИНТЕГРАЦИЯ

### 5.1 Переменные окружения

**`frontend/.env`** (не коммитить):
```ini
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_GEMINI_API_KEY=<ключ>
```

**`frontend/.env.example`** (коммитить):
```ini
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### 5.2 Синхронизация состояния Zustand ↔ API

**Проблема:** Zustand stores (`useGamificationStore`, `useLearningStore`) содержат данные в localStorage. После подключения API нужно:

1. При логине — загрузить данные с API и записать в Zustand
2. При завершении урока — обновить Zustand данными из ответа API (не вычислять на frontend)
3. Formulas (XP → level) должны быть идентичны в backend и frontend:
   - Backend: `math.floor(math.sqrt(xp / 100)) + 1`
   - Frontend: `Math.floor(Math.sqrt(xp / 100)) + 1`

**Стратегия миграции localStorage → API:**
- При первом логине: если в localStorage есть данные (`xp > 0`) — показать предупреждение "Ваш прогресс не был сохранён. Начать заново?" Не пытаться мигрировать данные автоматически.

### 5.3 Последовательность запросов при загрузке приложения

```
App mount
  └── isAuthenticated? (Zustand persist)
        ├── Да → GET /api/v1/auth/me/ (проверить токен свежий)
        │         └── GET /api/v1/gamification/profile/ (синхр. XP/уровень)
        └── Нет → показать публичный контент
```

---

## РАЗДЕЛ 6 — КОНТЕНТ ТРЕБОВАНИЯ

### Минимальный контент для демо (твёрдый минимум)

| Тип | Минимум | Языки |
|---|---|---|
| Уровни курсов | 3 | EN + UZ + RU |
| Юниты | 6 (2 на уровень) | EN + UZ + RU |
| Уроки | 12 (2 на юнит) | EN + UZ + RU |
| Квиз вопросов | 5 на квиз-урок | EN + UZ + RU |
| Исторических событий | 20 | EN + UZ + RU |
| Планет с данными | 8 + Солнце | EN + UZ + RU |
| Товаров в магазине | 5 | EN + UZ + RU |
| Значков | 8 | EN + UZ + RU |
| Видеоуроков | 3 (YouTube embed) | Любой |

**Важно:** Данные должны идти с бэкенда. `src/data/mockData.js` — удалить перед демо. Остальные `src/data/*.js` — переосмыслить: либо удалить после наполнения БД, либо использовать как seed данные.

---

## РАЗДЕЛ 7 — КАЧЕСТВО И СТАНДАРТЫ

### Чеклист перед любым демо

**Backend:**
- [ ] `python manage.py check --deploy` — ноль warnings
- [ ] `python manage.py migrate` — ноль ошибок
- [ ] `SECRET_KEY` не содержит слово "insecure"
- [ ] `DEBUG = False` при запуске
- [ ] Все endpoints отвечают корректным JSON при ошибках (не HTML 500)
- [ ] Все list endpoints пагинированы
- [ ] `requirements.txt` содержит все зависимости с версиями

**Frontend:**
- [ ] `npm run build` — ноль ошибок
- [ ] Нет `console.log` в коде (проверить: `grep -r "console.log" src/`)
- [ ] Нет мёртвых импортов (проверить в браузере DevTools → Network)
- [ ] Нет `react-icons` в импортах (только `lucide-react`)
- [ ] Все три языка переключаются без ошибок
- [ ] 404 маршрут работает
- [ ] `ErrorBoundary` установлен
- [ ] `ProtectedRoute` работает — `/login` редирект при отсутствии токена
- [ ] Мобильный вид при 375px — навигация не сломана

**Интеграция:**
- [ ] Регистрация → Логин → Просмотр курса → Квиз → XP начислен → Видно в профиле
- [ ] Покупка в магазине списывает топливо
- [ ] Таблица лидеров показывает реальных пользователей
- [ ] Чат: сообщение отправлено → видно у другого пользователя в реальном времени

---

## РАЗДЕЛ 8 — РАЗВЁРТЫВАНИЕ (ДЛЯ ДЕМО)

### Минимальная конфигурация для демо на локальной машине

**Запуск backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata initial_data.json   # seed данные
python manage.py runserver 8000
```

**Запуск frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Порядок запуска:** сначала backend (8000), потом frontend (3000).

### `.gitignore` (обязательный минимум)

```gitignore
# Backend
backend/.env
backend/db.sqlite3
backend/venv/
backend/__pycache__/
backend/**/__pycache__/
backend/*.pyc
backend/media/

# Frontend
frontend/.env
frontend/node_modules/
frontend/dist/

# OS
.DS_Store
Thumbs.db
```

---

## РАЗДЕЛ 9 — ПЛАН РАБОТ ПО ПРИОРИТЕТАМ

### Приоритет 1 — СЕГОДНЯ (blocker'ы)

| Задача | Исполнитель | Время |
|---|---|---|
| SECRET_KEY → `.env` | Любой | 15 мин |
| Добавить `.gitignore` | Любой | 10 мин |
| Удалить `express`, `dotenv`, `react-icons`, `typescript` из `package.json` | Любой | 10 мин |
| Создать `requirements.txt` | Любой | 20 мин |
| Установить Django packages (DRF, JWT, CORS, Channels) | Backend dev | 30 мин |
| Разбить `settings.py` на `base/dev/prod` | Backend dev | 45 мин |

### Приоритет 2 — Backend core

| Задача | Время |
|---|---|
| `accounts` app — User модель + Register + Login API | 3–4 ч |
| `courses` app — модели + API (read-only) + seed данные | 4–5 ч |
| `progress` app — завершение урока + XP сигнал | 3 ч |
| `gamification` app — профиль + leaderboard | 2 ч |
| `market` app — список + покупка | 2 ч |
| `chat` app — REST + WebSocket consumer | 3–4 ч |

### Приоритет 3 — Frontend интеграция

| Задача | Время |
|---|---|
| `src/lib/api.js` + `useAuthStore.js` | 1.5 ч |
| `LoginView` + `RegisterView` | 3 ч |
| `ProtectedRoute` + обновить `App.jsx` | 1 ч |
| `ProfileView` с реальными данными | 2–3 ч |
| `ErrorBoundary` + `NotFoundView` | 1 ч |
| Подключить `LearnView` → API | 2 ч |
| Подключить `LeaderboardView` → API | 1 ч |
| Подключить `MarketView` → API | 1.5 ч |
| `ChatView` с WebSocket | 3 ч |
| Lazy loading тяжёлых компонентов | 1 ч |

### Приоритет 4 — Контент и полировка

| Задача | Время |
|---|---|
| Seed данные (курсы, уроки, квизы, планеты) | 4–6 ч |
| Хронология — 20 событий | 2–3 ч |
| Удалить `mockData.js` и фейковые числа | 1 ч |
| Проверка всех трёх языков | 2 ч |
| Мобильный audit | 2–3 ч |
| `npm run build` — исправить все ошибки | 1–2 ч |

---

## РАЗДЕЛ 10 — РИСКИ

| Риск | Вероятность | Влияние | Митигация |
|---|---|---|---|
| Backend не успеет до демо | Высокая | Критическое | Начать с accounts + courses, остальное заглушки |
| WebSocket нестабилен на демо WiFi | Средняя | Высокое | Иметь REST fallback для chat (poll каждые 5 сек) |
| Контент не переведён на все 3 языка | Высокая | Высокое | Приоритизировать UZB + RU, EN последним |
| Three.js грузит CPU на слабых ноутбуках | Средняя | Среднее | Lazy load, кнопка "Disable 3D" |
| JWT токен истекает во время демо | Низкая | Высокое | Установить `ACCESS_TOKEN_LIFETIME = timedelta(hours=8)` |
| Комиссия тестирует с мобильного телефона | Средняя | Высокое | Проверить 375px до демо |

---

## РАЗДЕЛ 11 — ЧТО НЕ НУЖНО ДЕЛАТЬ

> Ошибки, которые убивают время и не приближают к MVP:

- ❌ Не настраивать CI/CD, Docker, PostgreSQL — SQLite для демо достаточно
- ❌ Не писать unit тесты — нет времени, комиссию интересует рабочий продукт
- ❌ Не делать систему нотификаций / email верификацию
- ❌ Не добавлять новые страницы — сначала починить и подключить существующие
- ❌ Не переписывать компоненты, которые уже работают
- ❌ Не добавлять анимации, если функционал не готов
- ❌ Не рефакторить работающий код без причины — время дороже
- ❌ Не создавать отдельный "admin frontend" — Django Admin достаточно

---

*Документ описывает состояние и требования на 2026-04-29. При изменении архитектурных решений — обновить этот файл и `CLAUDE.md`.*
