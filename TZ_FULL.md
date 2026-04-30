# UZ COSMOS — Полное Техническое Задание
### Версия 2.0 | Обновлено: 2026-04-29 | Статус: MVP реализован

---

## РАЗДЕЛ 0 — ТЕКУЩАЯ ОЦЕНКА ПРОЕКТА

### 0.1 Что реализовано и работает ✅

**Backend — полностью готов:**
- Django 6.0 + DRF + simplejwt + django-storages (Cloudflare R2)
- 6 приложений: `accounts`, `gamification`, `courses`, `progress`, `market`, `chat`
- 23 API endpoint, все протестированы
- Настройки разбиты: `base/settings/base.py` → `development.py` / `production.py`
- SECRET_KEY в `.env`, `.gitignore` добавлен, `requirements.txt` создан
- Cloudflare R2 bucket `spaceedu` подключён и работает (upload/download/delete)
- Seed данные: 3 уровня, 6 юнитов, 12 уроков (EN/UZ/RU), 8 значков, 5 товаров, 3 чат-комнаты

**Frontend — интеграция завершена:**
- `src/lib/api.js` — axios + JWT interceptors + auto-refresh + logout on 401
- `src/store/useAuthStore.js` — tokens, user, login/logout/fetchMe
- `src/components/ProtectedRoute.jsx` — редирект на `/login`
- `src/components/ErrorBoundary.jsx` — перехват крашей
- `src/components/LevelGate.jsx` — блокировка контента по уровню
- `src/views/auth/LoginView.jsx` + `RegisterView.jsx`
- `src/views/profile/ProfileView.jsx` — XP bar, fuel, streak, значки, редактирование
- `src/views/misc/NotFoundView.jsx` — 404 "Lost in Space"
- `src/views/misc/MarketView.jsx` — реальные данные из API, покупка за fuel
- `src/views/chat/ChatView.jsx` — комнаты, REST + 5s polling
- `LeaderboardView` подключён к `/api/v1/gamification/leaderboard/`
- Lazy loading: SolarSystemView, StarFinderView, SpaceRunView
- Dead deps удалены: `express`, `dotenv`, `react-icons`, `typescript`, `@types/express`
- `"lint": "tsc --noEmit"` удалён из scripts

**Исправленные проблемы из v1.0:**
- ✅ BLOCKER 1: SECRET_KEY → `.env`
- ✅ BLOCKER 2: Backend построен полностью
- ✅ BLOCKER 3: Аутентификация через JWT, ProtectedRoute, хранение в Zustand
- ✅ BLOCKER 4: `db.sqlite3` в `.gitignore`
- ✅ BLOCKER 5: `express`, `dotenv` удалены из package.json
- ✅ BLOCKER 6: TypeScript полностью удалён, JS миграция завершена
- ✅ HIGH 1: `react-icons` удалён, только `lucide-react`
- ✅ HIGH 2: ProtectedRoute + LevelGate защищают маршруты
- ✅ HIGH 3: ErrorBoundary в main.jsx, 404 страница
- ✅ HIGH 5: `requirements.txt` создан
- ✅ MEDIUM: Lazy loading для Three.js компонентов
- ✅ MEDIUM: `TIME_ZONE = 'Asia/Tashkent'`
- ✅ MEDIUM: `ACCESS_TOKEN_LIFETIME = 8h` (для демо)

### 0.2 Что ещё не сделано (LOW приоритет)

- [ ] Фейковые числа на главной (`"12,847 learners"`) — убрать или заменить API данными
- [ ] `src/data/mockData.js` — удалить перед демо
- [ ] `<title>` и `<meta description>` в `index.html` (SEO)
- [ ] WebSocket для чата (есть REST + polling fallback — для демо достаточно)
- [ ] Loading skeletons на async операции
- [ ] Мобильная адаптация отдельных views (audit 375px)
- [ ] Локализация контента (данные курсов EN/UZ/RU в БД есть, frontend ещё не переключается)

---

## РАЗДЕЛ 1 — MVP: ЧТО ВХОДИТ, ЧТО НЕ ВХОДИТ

MVP работает end-to-end: реальный пользователь регистрируется, обучается, зарабатывает XP, видит прогресс.

### Статус MVP фич

| # | Фича | Статус |
|---|---|---|
| 1 | Регистрация / Вход (JWT) | ✅ Готово |
| 2 | Профиль пользователя (XP, уровень, значки) | ✅ Готово |
| 3 | Каталог курсов из БД | ✅ Готово (3 уровня, 12 уроков) |
| 4 | Просмотр урока (текст + секции) | ✅ Готово (API + UI) |
| 5 | Квиз с сохранением результата | ✅ Backend готов, frontend использует hardcoded данные |
| 6 | Система XP и уровней | ✅ Backend + Zustand синхронизированы |
| 7 | Таблица лидеров из БД | ✅ Готово |
| 8 | Магазин (покупка за топливо) | ✅ Готово |
| 9 | Глобальный чат | ✅ REST (polling) |
| 10 | AI помощник AskCosmos | ✅ Готово (Gemini 2.0 Flash) |
| 11 | 3D Солнечная система | ✅ Готово |
| 12 | Gamification (XP, fuel, streak, badges) | ✅ Backend + Frontend |
| 13 | Система уровней для доступа к контенту | ✅ LevelGate компонент |
| 14 | Daily Challenge | ✅ UI готов, требует auth |
| 15 | Страница 404 | ✅ Готово |
| 16 | Cloudflare R2 для медиа | ✅ Готово |

### Не входит в MVP (следующая версия)

- Загрузка аватара (S3 подключён, endpoint готов, UI не добавлен)
- Видеозвонки / вебинары
- Система оплаты
- Email нотификации / верификация
- Мобильное приложение
- A/B тестирование
- WebSocket реального времени для чата

---

## РАЗДЕЛ 2 — ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ: BACKEND

### 2.1 Структура и настройки ✅ ГОТОВО

```
backend/
├── base/
│   ├── settings/
│   │   ├── __init__.py      ← from .development import *
│   │   ├── base.py          ← SECRET_KEY, DRF, JWT, CORS, R2, throttling
│   │   ├── development.py   ← DEBUG=True
│   │   └── production.py    ← security headers, HTTPS
│   ├── urls.py              ← все /api/v1/ маршруты
│   ├── storage_backends.py  ← R2MediaStorage
│   ├── asgi.py / wsgi.py
├── apps/
│   ├── accounts/     ✅
│   ├── gamification/ ✅
│   ├── courses/      ✅
│   ├── progress/     ✅
│   ├── market/       ✅
│   └── chat/         ✅
├── manage.py
├── requirements.txt  ✅
├── .env              ✅ (не в git)
└── .env.example      ✅
```

**`requirements.txt`:**
```
Django==6.0.*
djangorestframework==3.15.*
djangorestframework-simplejwt==5.3.*
django-cors-headers==4.4.*
django-storages[s3]==1.14.*
boto3==1.38.*
Pillow==10.4.*
python-decouple==3.8.*
dj-database-url==2.2.*
```

**Ключевые настройки `base.py`:**
```python
SECRET_KEY = config('SECRET_KEY')
TIME_ZONE = config('TIME_ZONE', default='Asia/Tashkent')
AUTH_USER_MODEL = 'accounts.User'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),   # 8h для демо
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'login': '10/hour',   # защита от брутфорса
        'anon': '100/day',
        'user': '1000/day',
    }
}
```

### 2.2 Приложение `accounts` ✅ ГОТОВО

**Модель `User(AbstractUser)`:**
```python
first_name, last_name       # от AbstractUser
email                       # уникальный (регистр нечувствительный)
date_of_birth               # DateField
avatar                      # ImageField → Cloudflare R2
astronaut_name              # CharField(50)
bio                         # TextField(300)
selected_spaceship          # CharField(50), default='rocket_basic'
language                    # choices: en/uz/ru
```
Username генерируется автоматически из email (`alisher@cosmos.uz` → `alisher`).

**API Endpoints:**

| Метод | URL | Auth | Описание |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | — | first_name, last_name, email, date_of_birth, password, password2 |
| POST | `/api/v1/auth/login/` | — | email + password (throttle 10/h) |
| POST | `/api/v1/auth/token/refresh/` | — | обновить access токен |
| POST | `/api/v1/auth/logout/` | JWT | blacklist refresh токена |
| GET PATCH | `/api/v1/auth/me/` | JWT | профиль + обновление |
| DELETE | `/api/v1/auth/delete/` | JWT | удалить аккаунт |

### 2.3 Приложение `gamification` ✅ ГОТОВО

**Модель `UserGamificationProfile`** — создаётся автоматически через signal при регистрации.

```python
xp, level, fuel (max 1000), streak, last_play_date, skills (JSONField)

def add_xp(amount):    # xp += amount; level = floor(sqrt(xp/100)) + 1
def add_fuel(amount):  # min(fuel + amount, 1000)
def spend_fuel(amount): # возвращает False если недостаточно
```

**Значки (Badge):** типы `xp_threshold`, `streak`, `lessons` — проверяются после каждого завершения урока через `services.check_and_award_badges()`.

**Seed значки (8 шт):** first-lesson, explorer-5, scholar-10, streak-3, streak-7, xp-500, xp-2000, xp-5000

**API Endpoints:**

| Метод | URL | Auth | Описание |
|---|---|---|---|
| GET | `/api/v1/gamification/profile/` | JWT | XP, level, fuel, streak |
| GET | `/api/v1/gamification/leaderboard/` | — | топ-100 по XP |
| GET | `/api/v1/gamification/badges/` | JWT | значки пользователя |
| POST | `/api/v1/gamification/streak/` | JWT | обновить streak (+10 fuel) |

### 2.4 Приложение `courses` ✅ ГОТОВО

**Модели:** `Level → Unit → Lesson → LessonSection + QuizQuestion`  
Все текстовые поля трёхязычные: `_en`, `_uz`, `_ru`

**Seed контент:**
- Level 1: Solar System (2 юнита, 4 урока)
- Level 2: Stars & Galaxies (2 юнита, 4 урока)
- Level 3: Space Exploration (2 юнита, 4 урока)
- Все уроки с квиз-вопросами на EN/UZ/RU

**API Endpoints (все публичные):**

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/v1/courses/levels/` | все уровни |
| GET | `/api/v1/courses/levels/{slug}/units/` | юниты уровня |
| GET | `/api/v1/courses/units/{slug}/` | юнит с уроками |
| GET | `/api/v1/courses/lessons/{slug}/` | урок с секциями и квизом |

### 2.5 Приложение `progress` ✅ ГОТОВО

**Логика завершения урока (`POST /progress/lessons/{slug}/complete/`):**
1. Создать/обновить `UserLessonProgress` (score, attempts, is_mastered если score >= 70)
2. Начислить `lesson.xp_reward` XP (только при первом прохождении)
3. Проверить завершение всех уроков юнита → начислить `unit.fuel_reward`
4. Проверить значки через `check_and_award_badges()`
5. Вернуть: `{xp_earned, fuel_earned, new_level, leveled_up, new_badges, is_mastered, score}`

**API Endpoints (JWT required):**

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/v1/progress/` | весь прогресс пользователя |
| POST | `/api/v1/progress/lessons/{slug}/complete/` | тело: `{"score": 0-100}` |
| GET | `/api/v1/progress/units/{slug}/` | прогресс по юниту |
| POST | `/api/v1/progress/units/{slug}/enroll/` | записаться на юнит |

### 2.6 Приложение `market` ✅ ГОТОВО

**Логика покупки (атомарная):**
1. Проверить `item.is_active`
2. Проверить `UserInventory` — не куплен ли уже
3. Проверить `profile.fuel >= item.cost_fuel`
4. `transaction.atomic`: spend_fuel + создать UserInventory
5. Вернуть объект инвентаря или HTTP 400 с понятным сообщением

**Seed товары (5 шт):** rocket-basic (бесплатно), rocket-pro (80), cosmic-cruiser (200), xp-boost-2x (120), star-badge (150)

**API Endpoints:**

| Метод | URL | Auth |
|---|---|---|
| GET | `/api/v1/market/items/` | — |
| POST | `/api/v1/market/purchase/` | JWT |
| GET | `/api/v1/market/inventory/` | JWT |

### 2.7 Приложение `chat` ✅ ГОТОВО (REST)

**Seed комнаты:** general, uzbekistan, astronomy-talk

**API Endpoints:**

| Метод | URL | Auth |
|---|---|---|
| GET | `/api/v1/chat/rooms/` | — |
| GET | `/api/v1/chat/rooms/{slug}/messages/` | — |
| POST | `/api/v1/chat/rooms/{slug}/messages/` | JWT |

WebSocket (Django Channels) не реализован. Frontend использует REST polling каждые 5 секунд — достаточно для демо.

---

## РАЗДЕЛ 3 — ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ: FRONTEND

### 3.1 Состояние package.json ✅ ЧИСТЫЙ

**Оставлено (только нужное):**
```json
"dependencies": {
  "@google/genai", "@react-three/drei", "@react-three/fiber",
  "@react-three/postprocessing", "@tailwindcss/vite", "@vitejs/plugin-react",
  "axios", "canvas-confetti", "html2canvas", "lucide-react",
  "motion", "react", "react-dom", "react-router-dom",
  "three", "vite", "zustand"
}
```

**Удалено:** `express`, `dotenv`, `react-icons`, `typescript`, `@types/express`, `@types/canvas-confetti`  
**Скрипты:** `dev`, `build`, `preview`, `clean` (удалён `lint: tsc --noEmit`)

### 3.2 API слой ✅ ГОТОВО

**`src/lib/api.js`** — axios instance с lazy-auth через `setupApiAuth()`:
- Добавляет `Authorization: Bearer <token>` к каждому запросу
- При 401: пробует refresh → повторяет запрос
- При неудачном refresh: logout + redirect `/login`
- Нет циклических импортов (auth getter передаётся через `setupApiAuth`)

**`src/lib/levels.js`** — конфиг доступа по уровням:
```js
LEVEL_GATES = {
  'space-game':      { requiredLevel: 3 },
  'daily-challenge': { requiredLevel: 2 },
  'course-level-2':  { requiredLevel: 5 },
  'course-level-3':  { requiredLevel: 10 },
  'market-premium':  { requiredLevel: 5 },
  'portfolio':       { requiredLevel: 4 },
}
```

### 3.3 Аутентификация ✅ ГОТОВО

**`src/store/useAuthStore.js`** — persist в localStorage:
```js
{ user, accessToken, refreshToken, isAuthenticated }
// actions: login, logout, setTokens, updateUser, fetchMe
```

**`src/components/ProtectedRoute.jsx`** — `<Navigate to="/login" replace />` если не авторизован

**`src/components/LevelGate.jsx`** — показывает blur + lock overlay если `userLevel < requiredLevel`

### 3.4 Обновлённый `App.jsx` ✅ ГОТОВО

```jsx
// Публичные маршруты
<Route path="/login"    element={<LoginView />} />
<Route path="/register" element={<RegisterView />} />
<Route path="/leaderboard" element={<LeaderboardView />} />  // API connected

// Protected (JWT required)
<Route element={<ProtectedRoute />}>
  <Route path="/profile"   element={<ProfileView />} />
  <Route path="/market"    element={<MarketView />} />   // API connected
  <Route path="/chat"      element={<ChatView />} />     // REST polling
  <Route path="/careers"   element={<CareersView />} />
  <Route path="/portfolio" element={<PortfolioView />} />

  // Level-gated
  <Route path="/daily"      element={<LevelGate requiredLevel={2}><DailyChallengeView /></LevelGate>} />
  <Route path="/space-game" element={<LevelGate requiredLevel={3}><SpaceRunView /></LevelGate>} />
  <Route path="/lab"        element={<LevelGate requiredLevel={2}><SpaceLabView /></LevelGate>} />
</Route>

// Lazy loaded (Three.js)
const SolarSystemView = lazy(() => import('...'));
const StarFinderView  = lazy(() => import('...'));
const SpaceRunView    = lazy(() => import('...'));

// 404
<Route path="*" element={<NotFoundView />} />
```

**`src/main.jsx`** обёрнут в `<ErrorBoundary>`.

### 3.5 Страницы ✅ ГОТОВО

**`LoginView`** — email + password, космический дизайн, link на Register, loading state на кнопке

**`RegisterView`** — 6 полей (first_name, last_name, email, date_of_birth, password, password2), ошибки из API на конкретных полях

**`ProfileView`** — аватар, имя, XP bar (текущий/нужный для след. уровня), fuel gauge, streak, сетка значков, inline редактирование (astronaut_name, language), Sign Out, Delete Account

**`NotFoundView`** — анимированный дрейфующий астронавт, кнопка "Return to Earth"

**`MarketView`** — список товаров из API, баланс fuel, покупка с проверкой баланса, owned state, sync fuel после покупки

**`ChatView`** — выбор комнаты, список сообщений, POST через REST, 5s polling для новых, auto-scroll

**`LeaderboardView`** — реальные данные из `/gamification/leaderboard/`, подиум топ-3, текущий пользователь выделен

### 3.6 Zustand stores — синхронизация с API

**`useGamificationStore`** добавлены:
- `syncFromAPI({ xp, level, fuel, streak, last_play_date, skills })` — вызывается после login и покупки
- `applyLessonResult({ xp_earned, fuel_earned, new_level })` — вызывается после завершения урока

---

## РАЗДЕЛ 4 — БЕЗОПАСНОСТЬ ✅ РЕАЛИЗОВАНО

| # | Требование | Статус |
|---|---|---|
| 1 | SECRET_KEY из `.env` | ✅ |
| 2 | DEBUG=False для production | ✅ `production.py` |
| 3 | `.env` в `.gitignore` | ✅ |
| 4 | `db.sqlite3` в `.gitignore` | ✅ |
| 5 | Rate-limit на login — 10/час | ✅ `LoginRateThrottle` |
| 6 | JWT в headers, не в URL | ✅ |
| 7 | CORS только `localhost:3000` | ✅ |
| 8 | Валидация всех POST данных | ✅ DRF serializers |
| 9 | Пагинация на list endpoints | ✅ `PAGE_SIZE=20` |
| 10 | Cloudflare R2 для медиа | ✅ не локальная файловая система |

---

## РАЗДЕЛ 5 — ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### Backend (`backend/.env`) ✅ СОЗДАН
```ini
SECRET_KEY=<сгенерирован через secrets.token_urlsafe(50)>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DB_URL=sqlite:///db.sqlite3
TIME_ZONE=Asia/Tashkent
CLOUDFLARE_R2_ACCOUNT_ID=<задан>
CLOUDFLARE_R2_ACCESS_KEY_ID=<задан>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<задан>
CLOUDFLARE_R2_BUCKET_NAME=spaceedu
CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

### Frontend (`frontend/.env`) ✅ СОЗДАН
```ini
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
GEMINI_API_KEY=<ключ для AskCosmos>
```

---

## РАЗДЕЛ 6 — МАРШРУТЫ И API

### Полная карта маршрутов

| Path | View | API | Auth | LevelGate |
|---|---|---|---|---|
| `/` | HomeView | — | — | — |
| `/login` | LoginView | POST /auth/login/ | — | — |
| `/register` | RegisterView | POST /auth/register/ | — | — |
| `/learn` | LearnView | — | — | — |
| `/learn/physics*` | PhysicsView* | — | — | — |
| `/learn/astronomy` | AstronomyView | — | — | — |
| `/unit/:id` | UnitView | — | — | — |
| `/lesson/:u/:l` | LessonView | — | — | — |
| `/explore` | ExploreView | — | — | — |
| `/3d-solar-system` | SolarSystemView | — | — | — |
| `/star-finder` | StarFinderView | — | — | — |
| `/leaderboard` | LeaderboardView | GET /gamification/leaderboard/ | — | — |
| `/history` | HistoryView | — | — | — |
| `/uzb` | UzSpaceView | — | — | — |
| `/calendar` | CalendarView | — | — | — |
| `/news` | NewsView | — | — | — |
| `/live` | LiveSpaceView | — | — | — |
| `/profile` | ProfileView | GET /auth/me/ + /gamification/* | ✅ | — |
| `/market` | MarketView | GET /market/items/ + purchase | ✅ | — |
| `/chat` | ChatView | GET/POST /chat/rooms/*/messages/ | ✅ | — |
| `/careers` | CareersView | — | ✅ | — |
| `/portfolio` | PortfolioView | — | ✅ | — |
| `/daily` | DailyChallengeView | — | ✅ | Level 2 |
| `/space-game` | SpaceRunView | — | ✅ | Level 3 |
| `/lab` | SpaceLabView | — | ✅ | Level 2 |
| `*` | NotFoundView | — | — | — |

### Полная карта API

| Метод | URL | Auth | Статус |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | — | ✅ |
| POST | `/api/v1/auth/login/` | — | ✅ email+pw, throttle |
| POST | `/api/v1/auth/token/refresh/` | — | ✅ |
| POST | `/api/v1/auth/logout/` | JWT | ✅ blacklist |
| GET PATCH | `/api/v1/auth/me/` | JWT | ✅ |
| DELETE | `/api/v1/auth/delete/` | JWT | ✅ |
| GET | `/api/v1/gamification/profile/` | JWT | ✅ |
| GET | `/api/v1/gamification/leaderboard/` | — | ✅ |
| GET | `/api/v1/gamification/badges/` | JWT | ✅ |
| POST | `/api/v1/gamification/streak/` | JWT | ✅ +10 fuel |
| GET | `/api/v1/courses/levels/` | — | ✅ |
| GET | `/api/v1/courses/levels/{slug}/units/` | — | ✅ |
| GET | `/api/v1/courses/units/{slug}/` | — | ✅ |
| GET | `/api/v1/courses/lessons/{slug}/` | — | ✅ |
| GET | `/api/v1/progress/` | JWT | ✅ |
| POST | `/api/v1/progress/lessons/{slug}/complete/` | JWT | ✅ XP+badges |
| GET | `/api/v1/progress/units/{slug}/` | JWT | ✅ |
| POST | `/api/v1/progress/units/{slug}/enroll/` | JWT | ✅ |
| GET | `/api/v1/market/items/` | — | ✅ |
| POST | `/api/v1/market/purchase/` | JWT | ✅ atomic |
| GET | `/api/v1/market/inventory/` | JWT | ✅ |
| GET | `/api/v1/chat/rooms/` | — | ✅ |
| GET POST | `/api/v1/chat/rooms/{slug}/messages/` | GET:— POST:JWT | ✅ |

---

## РАЗДЕЛ 7 — GAMIFICATION СИСТЕМА

### Формулы (идентичны backend и frontend)
```
Level = floor(sqrt(XP / 100)) + 1
XP для уровня N = (N-1)² × 100

Fuel: max 1000
  +10 — ежедневный вход (streak)
  +unit.fuel_reward — завершение юнита
  -item.cost_fuel — покупка в магазине
```

### Значки по условиям
| Slug | Условие | Значение |
|---|---|---|
| first-lesson | lessons >= 1 | 1 |
| explorer-5 | lessons >= 5 | 5 |
| scholar-10 | lessons >= 10 | 10 |
| streak-3 | streak >= 3 | 3 |
| streak-7 | streak >= 7 | 7 |
| xp-500 | xp >= 500 | 500 |
| xp-2000 | xp >= 2000 | 2000 |
| xp-5000 | xp >= 5000 | 5000 |

### Система уровней доступа (LevelGate)
| Секция | Требуемый уровень |
|---|---|
| Space Lab | 2 |
| Daily Challenge | 2 |
| Space Run (игра) | 3 |
| Portfolio | 4 |
| Course Level 2 | 5 |
| Course Level 3 | 10 |

---

## РАЗДЕЛ 8 — ЗАПУСК ДЛЯ ДЕМО

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed          # наполнить БД тестовыми данными
python manage.py runserver 8000

# Frontend
cd frontend
npm install
npm run dev                    # port 3000
```

**Порядок:** сначала backend (8000), потом frontend (3000).

**Тест flow для комиссии:**
1. Открыть `http://localhost:3000/register`
2. Зарегистрироваться (имя, фамилия, email, дата рождения, пароль)
3. Попасть на главную страницу — видеть профиль в навигации
4. Перейти `/leaderboard` — видеть себя в таблице
5. Перейти `/market` — видеть товары, купить за fuel
6. Перейти `/chat` — написать сообщение в General
7. Перейти `/profile` — видеть XP, fuel, streak, значки

---

## РАЗДЕЛ 9 — ПЛАН РАБОТ (АКТУАЛИЗИРОВАН)

### ✅ Phase 0 — Blockers (ВЫПОЛНЕНО)
- SECRET_KEY → `.env`
- `.gitignore` добавлен
- Dead deps удалены из `package.json`
- `requirements.txt` создан
- Django packages установлены
- `settings.py` разбит на `base/dev/prod`
- `ACCESS_TOKEN_LIFETIME` → 8h

### ✅ Phase 1 — Backend core (ВЫПОЛНЕНО)
- `accounts` — User + auth API (6 endpoints)
- `courses` — Level/Unit/Lesson + seed данные (12 уроков EN/UZ/RU)
- `progress` — завершение урока + XP + badges
- `gamification` — профиль + leaderboard + streak
- `market` — список + атомарная покупка
- `chat` — REST rooms + messages

### ✅ Phase 2 — Frontend интеграция (ВЫПОЛНЕНО)
- `api.js` + `useAuthStore.js`
- `LoginView` + `RegisterView`
- `ProtectedRoute` + `LevelGate` + `ErrorBoundary`
- `App.jsx` — все маршруты, lazy loading, 404
- `ProfileView` — XP, fuel, badges, edit, logout
- `NotFoundView` — 404
- `LeaderboardView` → реальный API
- `MarketView` → реальный API
- `ChatView` → REST + 5s polling
- Lazy loading: SolarSystem, StarFinder, SpaceRun

### 🔲 Phase 4 — Полировка (остаток)
- Убрать фейковые числа с главной страницы
- Удалить `src/data/mockData.js`
- `<title>` и `<meta>` в `index.html`
- Мобильный audit (375px)
- Loading skeletons для async данных

---

## РАЗДЕЛ 10 — РИСКИ

| Риск | Вероятность | Влияние | Митигация |
|---|---|---|---|
| JWT токен истекает во время демо | ~~Низкая~~ **Устранён** | — | `ACCESS_TOKEN_LIFETIME = 8h` |
| WebSocket нестабилен на демо WiFi | — | — | REST polling каждые 5 сек (реализован) |
| Three.js грузит CPU на слабых ноутбуках | Средняя | Среднее | Lazy load реализован |
| Комиссия тестирует с мобильного | Средняя | Высокое | Audit 375px не проведён |
| Контент не переведён | Частично | Среднее | Курсы в БД с EN/UZ/RU, UI фронтенда i18n работает |
| seed данные не загружены | Низкая | Критическое | `python manage.py seed` — идемпотентный |

---

## РАЗДЕЛ 11 — ЧТО НЕ НУЖНО ДЕЛАТЬ

- ❌ CI/CD, Docker, PostgreSQL — SQLite для демо достаточно
- ❌ Unit тесты — нет времени
- ❌ Email верификация / нотификации
- ❌ WebSocket (есть REST fallback)
- ❌ Новые страницы — существующие ещё не все подключены к API
- ❌ Рефакторинг работающего кода
- ❌ Отдельный admin frontend — Django Admin достаточно

---

*Документ обновлён 2026-04-29. Версия 2.0 — отражает реальное состояние после реализации Phase 0–2.*
