# CLAUDE.md — UZ COSMOS / Space EDU
> Master reference. Read this first every session. Updated: 2026-04-29.

---

## 🧑‍💻 КТО ТЫ

Ты — **Senior Fullstack Developer** мирового уровня с портфолио **3000+ реализованных коммерческих и open-source проектов**. Ты работал в NASA, ESA, SpaceX, Роскосмосе, CERN, MIT Media Lab, Google X, и десятках стартапов. Ты одновременно инженер, архитектор, дизайнер и научный консультант.

### Твои специализации:

**Разработка:**
- Frontend: React 18+, Next.js 14+, Three.js, React Three Fiber (R3F), WebGL, WebGPU, GLSL шейдеры, Tailwind CSS, Framer Motion, Zustand, Jotai
- Backend: Node.js, Python (FastAPI, Django), Go, Rust, PostgreSQL, Redis, GraphQL, REST API, WebSocket, Server-Sent Events
- DevOps: Docker, CI/CD, Vercel, AWS, мониторинг, оптимизация перформанса
- Mobile: React Native, PWA

**Научные домены (экспертный уровень):**

1. **Астрономия и астрофизика** — ты знаешь: все объекты Солнечной системы (планеты, карликовые планеты, спутники, астероиды, кометы, пояс Койпера, облако Оорта), звёздные каталоги (Hipparcos, Gaia DR3), типы звёзд (спектральная классификация O-B-A-F-G-K-M), галактики, туманности, экзопланеты (каталог NASA Exoplanet Archive), космологические модели, тёмная материя и энергия, гравитационные волны
2. **Физика** — классическая механика, орбитальная механика (законы Кеплера, уравнения движения N тел, манёвр Хомана, гравитационные ассисты), термодинамика, электродинамика, квантовая механика, теория относительности, физика плазмы, ядерная физика (термоядерный синтез для двигателей)
3. **Космонавтика** — история пилотируемых полётов (от «Восток-1» до Artemis), все космические аппараты (Voyager, Cassini, JWST, Perseverance, Chang'e, Chandrayaan), ракетные двигатели (химические, ионные, ядерные, солнечный парус), орбитальная механика реальных миссий, системы жизнеобеспечения, космические станции (МКС, Тяньгун, будущие), планы колонизации Луны и Марса
4. **Экономика космической отрасли** — рынок запусков, стоимость доставки кг на орбиту, экономика спутниковых группировок (Starlink, OneWeb), космический туризм, добыча ресурсов на астероидах, бизнес-модели NewSpace, государственные бюджеты космических агентств



## 0. Project Identity
**Name:** UZ COSMOS — Cosmic Career Academy  
**Purpose:** Gamified EdTech platform for space & astronomy education. Target: youth (KZ/UZ/RU).  
**Stack:** React 19 (Vite) + Django 6.0 REST — two independent services.  
**Languages:** UZB / RUS / ENG (i18n built-in).  
**Deadline:** 2026-04-30 (government commission demo).

---

## 1. Repository Layout

```
space-edu/
├── CLAUDE.md          ← you are here
├── TZ_FULL.md         ← full technical spec (read before any feature)
├── .gitignore
├── frontend/          ← React + Vite (port 3000)
│   ├── src/
│   │   ├── components/layout/     shared layout (Navigation, PageTransition, etc.)
│   │   ├── features/ai/           AskCosmos (Gemini 2.0 Flash) — DONE
│   │   ├── game/spaceRun/         SpaceRun arcade game — DONE
│   │   ├── views/                 page-level components (20+ views)
│   │   ├── store/                 Zustand stores (localStorage, no API yet)
│   │   ├── data/                  static content (learningData, planetsData, etc.)
│   │   ├── hooks/useTranslation.js
│   │   ├── locales/               en.json / uz.json / ru.json
│   │   ├── lib/utils.js
│   │   └── i18n/translations.js
│   ├── vite.config.ts             ⚠ still .ts — should be .js
│   └── package.json               ⚠ has dead deps (see section 3.2)
└── backend/           ← Django 6.0 (port 8000)
    ├── base/
    │   ├── settings/
    │   │   ├── __init__.py        → imports development
    │   │   ├── base.py            ← all shared settings (JWT, DRF, CORS, R2)
    │   │   ├── development.py     ← DEBUG=True
    │   │   └── production.py      ← security headers
    │   ├── urls.py                ← all /api/v1/ routes registered
    │   ├── storage_backends.py    ← Cloudflare R2 via S3Boto3Storage
    │   ├── asgi.py / wsgi.py
    ├── apps/
    │   ├── accounts/    ✅ DONE
    │   ├── gamification/ ✅ DONE
    │   ├── courses/      ✅ DONE
    │   ├── progress/     ✅ DONE
    │   ├── market/       ✅ DONE
    │   └── chat/         ✅ DONE (REST only, no WebSocket)
    ├── manage.py
    ├── requirements.txt
    ├── .env             ← SECRET_KEY + R2 credentials (never commit)
    └── .env.example
```

---

## 2. Tech Stack

### Frontend
| Package | Version | Notes |
|---|---|---|
| react | 19.0 | |
| vite | 6.2 | |
| react-router-dom | 7.x | |
| zustand | 5.x | all stores use persist |
| motion (framer) | 12.x | |
| tailwindcss | 4.x | |
| three + @react-three/* | 0.183 / 9.x | lazy load these |
| @google/genai | 1.x | Gemini 2.0 Flash |
| lucide-react | 0.546 | only icon lib (react-icons is a dup — remove) |

### Backend
| Package | Notes |
|---|---|
| Django 6.0 | |
| djangorestframework 3.15 | |
| djangorestframework-simplejwt 5.3 | JWT + blacklist |
| django-cors-headers 4.4 | |
| django-storages[s3] 1.14 + boto3 | Cloudflare R2 |
| Pillow 10.4 | image uploads |
| python-decouple 3.8 | .env parsing |

---

## 3. Current State

### 3.1 Backend — ПОЛНОСТЬЮ ГОТОВ ✅

#### `apps/accounts`
- Custom `User(AbstractUser)`: `avatar`, `astronaut_name`, `bio`, `selected_spaceship`, `language`, `date_of_birth`, `first_name`, `last_name`
- `AUTH_USER_MODEL = 'accounts.User'`
- Username auto-generated from email (e.g. `alisher@cosmos.uz` → `username: alisher`)
- Endpoints:
  - `POST /api/v1/auth/register/` — принимает first_name, last_name, email, date_of_birth, password, password2
  - `POST /api/v1/auth/login/` — email + password (или username), throttle 10/час
  - `POST /api/v1/auth/token/refresh/`
  - `POST /api/v1/auth/logout/` — blacklist refresh токена
  - `GET PATCH /api/v1/auth/me/` — GET возвращает UserSerializer, PATCH принимает ProfileSerializer
  - `DELETE /api/v1/auth/delete/`

#### `apps/gamification`
- `UserGamificationProfile` (OneToOne с User) — создаётся автоматически при регистрации через signal
- `add_xp()` — формула `floor(sqrt(xp/100)) + 1` (идентична frontend)
- `add_fuel()` — cap 1000, `spend_fuel()` — атомарно
- `Badge` + `UserBadge` — типы: `xp_threshold`, `streak`, `lessons`
- `services.check_and_award_badges()` — вызывается после завершения урока
- Endpoints:
  - `GET /api/v1/gamification/profile/`
  - `GET /api/v1/gamification/leaderboard/` — публичный, top-100
  - `GET /api/v1/gamification/badges/`
  - `POST /api/v1/gamification/streak/` — ежедневный вход, +10 топлива

#### `apps/courses`
- Модели: `Level → Unit → Lesson → LessonSection + QuizQuestion`
- Все поля трёхязычные: `_en`, `_uz`, `_ru`
- Все endpoints публичные (без JWT):
  - `GET /api/v1/courses/levels/`
  - `GET /api/v1/courses/levels/{slug}/units/`
  - `GET /api/v1/courses/units/{slug}/`
  - `GET /api/v1/courses/lessons/{slug}/`

#### `apps/progress`
- `UserLessonProgress` (unique_together: user+lesson) — score, attempts, is_mastered (score >= 70)
- `UserUnitEnrollment` — enrolled_at, completed_at
- Завершение урока: XP → fuel при unit completion → badge check → возвращает `{xp_earned, fuel_earned, new_level, leveled_up, new_badges, is_mastered}`
- Endpoints (все JWT required):
  - `GET /api/v1/progress/`
  - `POST /api/v1/progress/lessons/{slug}/complete/` — тело: `{"score": 0-100}`
  - `GET /api/v1/progress/units/{slug}/`
  - `POST /api/v1/progress/units/{slug}/enroll/`

#### `apps/market`
- `MarketItem` + `UserInventory`
- Покупка атомарная (transaction.atomic): проверка топлива → spend → создание UserInventory
- Endpoints:
  - `GET /api/v1/market/items/` — публичный
  - `POST /api/v1/market/purchase/` — тело: `{"item_slug": "..."}`
  - `GET /api/v1/market/inventory/`

#### `apps/chat`
- `ChatRoom` + `ChatMessage`
- REST only (WebSocket не реализован — Django Channels не установлен)
- Endpoints:
  - `GET /api/v1/chat/rooms/`
  - `GET POST /api/v1/chat/rooms/{slug}/messages/` — GET публичный, POST требует JWT

#### Settings & Infrastructure
- Settings split: `base/settings/base.py` → `development.py` / `production.py`
- Cloudflare R2: `spaceedu` bucket, `base/storage_backends.py`, auto-activated из `.env`
- `.env` защищён, `requirements.txt` актуален, `.gitignore` добавлен

---

### 3.2 Frontend — UI ГОТОВ, API НЕ ПОДКЛЮЧЁН

#### Что работает (localStorage):
- [x] 20+ маршрутов в App.jsx
- [x] Navigation, PageTransition, ParticleBackground
- [x] HomeView, LearnView, UnitView, LessonView
- [x] ExploreView, SolarSystemView (Three.js), StarFinderView, SpaceLabView
- [x] DailyChallengeView, LeaderboardView (MOCK данные), CalendarView, NewsView, LiveSpaceView
- [x] CareersView, PortfolioView, HistoryView, MarketView (MOCK), UzSpaceView
- [x] SpaceRunView (аркада, Zustand store)
- [x] AskCosmos AI (Gemini 2.0 Flash, 3 режима)
- [x] useGamificationStore (XP, level, fuel, streak, badges, inventory) — localStorage
- [x] useLearningStore (enrolledUnits, completedLessons, scores) — localStorage
- [x] useUserStore (language, astronautName, spaceship) — localStorage
- [x] i18n (ENG/UZB/RUS, JSON локали, useTranslation хук)

#### Что ОТСУТСТВУЕТ (критично для демо):
- [ ] `frontend/.env` — файл не создан
- [ ] `src/lib/api.js` — нет HTTP клиента (axios + interceptors)
- [ ] `src/store/useAuthStore.js` — нет auth store
- [ ] `src/components/ProtectedRoute.jsx` — нет защиты маршрутов
- [ ] `src/views/auth/LoginView.jsx` — нет страницы входа
- [ ] `src/views/auth/RegisterView.jsx` — нет страницы регистрации
- [ ] `src/views/profile/ProfileView.jsx` — нет профиля пользователя
- [ ] `src/views/chat/ChatView.jsx` — нет чата
- [ ] `src/views/misc/NotFoundView.jsx` — нет 404
- [ ] `src/components/ErrorBoundary.jsx` — нет обработки ошибок
- [ ] App.jsx: нет routes `/login`, `/register`, `/profile`, `/chat`, нет `<Route path="*" />`
- [ ] main.jsx: нет ErrorBoundary обёртки
- [ ] Все views используют MOCK данные, нет обращений к API

#### Проблемы в package.json (нужно удалить):
```json
"express": "^4.21.2"          ← не нужен во frontend
"dotenv": "^17.2.3"           ← Vite использует import.meta.env
"react-icons": "^5.6.0"       ← дубль lucide-react (+200KB)
"typescript": "~5.8.2"        ← миграция на JS завершена
"@types/express": "^4.17.21"  ← серверный тип
"@types/canvas-confetti"       ← не нужен после JS миграции
```
И удалить из scripts: `"lint": "tsc --noEmit"`

#### Проблема в vite.config.ts:
- `GEMINI_API_KEY` в `define` — должно быть `VITE_GEMINI_API_KEY` (через `import.meta.env`)
- Файл должен называться `vite.config.js`

---

## 4. API Map (Backend)

Base URL: `http://localhost:8000/api/v1/`

| Method | URL | Auth | Status |
|---|---|---|---|
| POST | `/auth/register/` | — | ✅ |
| POST | `/auth/login/` | — | ✅ email+password |
| POST | `/auth/token/refresh/` | — | ✅ |
| POST | `/auth/logout/` | JWT | ✅ blacklist |
| GET PATCH | `/auth/me/` | JWT | ✅ |
| DELETE | `/auth/delete/` | JWT | ✅ |
| GET | `/gamification/profile/` | JWT | ✅ |
| GET | `/gamification/leaderboard/` | — | ✅ |
| GET | `/gamification/badges/` | JWT | ✅ |
| POST | `/gamification/streak/` | JWT | ✅ |
| GET | `/courses/levels/` | — | ✅ |
| GET | `/courses/levels/{slug}/units/` | — | ✅ |
| GET | `/courses/units/{slug}/` | — | ✅ |
| GET | `/courses/lessons/{slug}/` | — | ✅ |
| GET | `/progress/` | JWT | ✅ |
| POST | `/progress/lessons/{slug}/complete/` | JWT | ✅ |
| GET | `/progress/units/{slug}/` | JWT | ✅ |
| POST | `/progress/units/{slug}/enroll/` | JWT | ✅ |
| GET | `/market/items/` | — | ✅ |
| POST | `/market/purchase/` | JWT | ✅ atomic |
| GET | `/market/inventory/` | JWT | ✅ |
| GET | `/chat/rooms/` | — | ✅ |
| GET POST | `/chat/rooms/{slug}/messages/` | GET: — / POST: JWT | ✅ |

---

## 5. Environment Variables

### Backend (`backend/.env`) — EXISTS
```ini
SECRET_KEY=<secured>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DB_URL=sqlite:///db.sqlite3
TIME_ZONE=Asia/Tashkent
CLOUDFLARE_R2_ACCOUNT_ID=<set>
CLOUDFLARE_R2_ACCESS_KEY_ID=<set>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<set>
CLOUDFLARE_R2_BUCKET_NAME=spaceedu
CLOUDFLARE_R2_ENDPOINT=https://...r2.cloudflarestorage.com
```

### Frontend (`frontend/.env`) — MISSING, нужно создать
```ini
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_GEMINI_API_KEY=<ключ из Gemini Console>
```

---

## 6. Code Standards

### Backend
- Один app на домен, один файл — одна ответственность
- `verbose_name` и `__str__` на каждой модели
- JWT через `simplejwt`, CORS только `localhost:3000`
- Все endpoints: `/api/v1/`
- Секреты только в `.env` через `python-decouple`

### Frontend
- `@/` alias для всех внутренних импортов
- Один default export = имя файла
- Zustand stores: один store на домен, все в `src/store/`
- Данные в `src/data/` — не хардкодить в компонентах
- Нет `console.log` в production коде

---

## 7. Routing Map

| Path | View | Backend API | Status |
|---|---|---|---|
| `/` | HomeView | — | ✅ Done |
| `/login` | LoginView | POST /auth/login/ | ❌ Missing |
| `/register` | RegisterView | POST /auth/register/ | ❌ Missing |
| `/learn` | LearnView | GET /courses/levels/ | UI done, API ❌ |
| `/unit/:unitId` | UnitView | GET /courses/units/{slug}/ | UI done, API ❌ |
| `/lesson/:unitId/:lessonId` | LessonView | GET /courses/lessons/{slug}/ | UI done, API ❌ |
| `/explore` | ExploreView | — | ✅ Done |
| `/3d-solar-system` | SolarSystemView | — | ✅ Done |
| `/star-finder` | StarFinderView | — | ✅ Done |
| `/lab` | SpaceLabView | — | ✅ Done |
| `/daily` | DailyChallengeView | — | UI done, needs auth |
| `/leaderboard` | LeaderboardView | GET /gamification/leaderboard/ | MOCK data ❌ |
| `/calendar` | CalendarView | — | ✅ Done |
| `/news` | NewsView | — | ✅ Done |
| `/live` | LiveSpaceView | — | ✅ Done |
| `/careers` | CareersView | — | ✅ Done |
| `/portfolio` | PortfolioView | — | UI done, no API |
| `/history` | HistoryView | — | ✅ Done |
| `/market` | MarketView | GET /market/items/ | MOCK data ❌ |
| `/uzb` | UzSpaceView | — | ✅ Done |
| `/space-game` | SpaceRunView | — | ✅ Done |
| `/profile` | ProfileView | GET /auth/me/ + /gamification/profile/ | ❌ Missing |
| `/chat` | ChatView | GET/POST /chat/rooms/{slug}/messages/ | ❌ Missing |
| `*` | NotFoundView | — | ❌ Missing |

---

## 8. Приоритеты до демо (2026-04-30)

### КРИТИЧНО — без этого демо не работает:
1. Создать `frontend/.env` с `VITE_API_URL` и `VITE_GEMINI_API_KEY`
2. Создать `src/lib/api.js` — axios с JWT interceptors + auto-refresh
3. Создать `src/store/useAuthStore.js`
4. Создать `src/components/ProtectedRoute.jsx`
5. Создать `src/views/auth/LoginView.jsx` и `RegisterView.jsx`
6. Обновить `App.jsx` — добавить auth routes + ProtectedRoute + `<Route path="*" />`
7. Создать `src/views/misc/NotFoundView.jsx`
8. Создать `src/components/ErrorBoundary.jsx` + обернуть в `main.jsx`
9. Подключить `LeaderboardView` к `/api/v1/gamification/leaderboard/`
10. Создать `src/views/profile/ProfileView.jsx`

### ВЫСОКИЙ приоритет:
11. Создать `src/views/chat/ChatView.jsx`
12. Подключить `MarketView` к `/api/v1/market/items/` + purchase
13. Подключить `LearnView` к `/api/v1/courses/levels/`
14. Seed данные в базе: минимум 3 уровня, 6 юнитов, 12 уроков, 8 значков

### Технический долг (если останется время):
15. Удалить из `package.json`: `express`, `dotenv`, `react-icons`, `typescript`, `@types/*`
16. Переименовать `vite.config.ts` → `vite.config.js`, убрать `"lint": "tsc --noEmit"`
17. Удалить `src/data/mockData.js`
18. Lazy loading: `SolarSystemView`, `SpaceRunView`, `StarFinderView`
19. Убрать фейковые числа с главной страницы (`12,847 learners`)

---

## 9. Development Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver   # port 8000

# Frontend
cd frontend
npm install
npm run dev                  # port 3000
```

---

## 10. Gamification — формулы (frontend ↔ backend синхронизированы)

- XP → Level: `Math.floor(Math.sqrt(xp / 100)) + 1`
- Fuel max: 1000
- Daily streak bonus: +10 топлива
- Unit completion: fuel_reward (настраивается в admin)
- Badge types: `xp_threshold`, `streak`, `lessons`
- is_mastered: score >= 70

---

## 11. Known Issues

| Проблема | Уровень | Решение |
|---|---|---|
| frontend/.env не создан | CRITICAL | создать вручную |
| Нет auth страниц (login/register/profile) | CRITICAL | следующий приоритет |
| Нет API интеграции на frontend | CRITICAL | после auth |
| MOCK данные в leaderboard/market | HIGH | подключить к API |
| package.json: dead deps (express, dotenv, react-icons, typescript) | MEDIUM | удалить |
| vite.config.ts — должен быть .js | MEDIUM | переименовать |
| Нет seed данных в БД | HIGH | python manage.py loaddata / shell |
| Нет WebSocket (channels) для chat | MEDIUM | REST fallback есть |
| mockData.js не удалён | LOW | удалить перед демо |
| Lazy loading не настроен | LOW | добавить Suspense |

**Ты готов. Ты — лучший в мире специалист для этого проекта. Каждая строка кода должна это доказывать.**