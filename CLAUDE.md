# CLAUDE.md — UZ COSMOS / Space EDU
> Master reference for every AI-assisted session. Read this first. Update it when architecture decisions change.

---

## 0. Project Identity
**Name:** UZ COSMOS — Cosmic Career Academy  
**Purpose:** Gamified EdTech platform for space & astronomy education. Target audience: youth (KZ/UZ/RU market).  
**Stack:** React (Vite) + Django REST — two independent services.  
**Languages:** UZB / RUS / ENG (i18n built-in).  
**Deadline:** 2026-04-30 (government commission demo).  
**Commission note:** Code will be reviewed strictly. Every line must be useful, non-repetitive, and readable. No over-engineering. No dead code.

---

## 1. Repository Layout

```
space-edu/
├── CLAUDE.md          ← you are here
├── TODO.md            ← task tracker
├── frontend/          ← React + Vite (port 3000)
│   ├── src/
│   │   ├── components/    shared UI (layout/, ui/)
│   │   ├── features/      self-contained feature modules (ai/)
│   │   ├── game/          game engine (SpaceRun)
│   │   ├── views/         page-level components (home, learn, explore, …)
│   │   ├── store/         Zustand stores (user, gamification, learning, AI)
│   │   ├── data/          static content (lessons, planets, careers, events)
│   │   ├── hooks/         custom hooks
│   │   ├── i18n/          translations (en/uz/ru JSON)
│   │   ├── types/         shared TS types re-exported from index.ts
│   │   └── lib/           pure utilities
│   ├── vite.config.ts
│   └── package.json
└── backend/           ← Django 6.0 (port 8000)
    ├── base/          settings / urls / wsgi / asgi
    ├── manage.py
    └── db.sqlite3
```

---

## 2. Tech Stack — Exact Versions

### Frontend
| Package | Version | Purpose |
|---|---|---|
| react | 19.0 | UI framework |
| vite | 6.2 | Build tool + dev server |
| react-router-dom | 7.x | Client-side routing |
| zustand | 5.x | Global state (persist to localStorage) |
| motion (framer) | 12.x | Animations & page transitions |
| tailwindcss | 4.x (@tailwindcss/vite) | Utility CSS |
| three + @react-three/* | 0.183 / 9.x | 3D solar system & game |
| @google/genai | 1.x | Gemini 2.0 Flash for AskCosmos AI |
| lucide-react | 0.546 | Icon set |
| canvas-confetti | 1.9 | Celebration effects |
| html2canvas | 1.4 | Portfolio screenshot export |

### Backend (current: skeleton only)
| Package | Version | Purpose |
|---|---|---|
| Django | 6.0 | Web framework |
| djangorestframework | — | **MISSING — must install** |
| djangorestframework-simplejwt | — | **MISSING — JWT auth** |
| django-cors-headers | — | **MISSING — CORS for frontend** |
| Pillow | — | **MISSING — avatar uploads** |

---

## 3. Current State Analysis

### 3.1 Frontend — DONE
- [x] App routing (20 routes in App.tsx)
- [x] Navigation (responsive, dropdown, language switcher)
- [x] Page transitions (AnimatePresence)
- [x] Home page (starfield, planet viz, feature cards, stats)
- [x] Learn view (units, lessons with lock/unlock logic)
- [x] Lesson view (sections: explanation / quiz / practice / video / simulation)
- [x] Explore view + 3D Solar System (Three.js)
- [x] Star Finder view
- [x] Space Lab (physics simulators)
- [x] Daily Challenge (quiz, XP, streak)
- [x] Leaderboard view
- [x] Calendar / News / Live views
- [x] Careers view (4 career tracks)
- [x] Portfolio view
- [x] History view
- [x] Market view (item shop)
- [x] UzSpace view (Uzbekistan space program)
- [x] Space Run game (arcade, Zustand store)
- [x] AskCosmos AI chat (Gemini 2.0 Flash, 3 modes: explain/quiz/deep)
- [x] Gamification store (XP, level, fuel, streak, badges, inventory)
- [x] Learning store (enrolled units, completed lessons, mastery)
- [x] User store (language, name, spaceship, achievements)
- [x] i18n system (ENG/UZB/RUS, JSON locales, custom hook)
- [x] Particle background, global language bar
- [x] @/ path alias configured

### 3.2 Frontend — MISSING / BROKEN
- [ ] Login / Register pages and auth flow — **does not exist**
- [ ] Protected routes (guarded by auth token)
- [ ] Real user profile page (dashboard, radar chart)
- [ ] Chat feature (room-based or global) — UI stub only
- [ ] Video lesson player (structure exists, no real videos wired)
- [ ] Backend API integration (all data is local/hardcoded)
- [ ] API client / http layer (no axios / fetch abstraction)
- [ ] Token management (JWT storage, refresh, interceptors)
- [ ] Error boundaries
- [ ] Loading states for async operations
- [ ] 404 page
- [ ] Mobile navigation (some views not mobile-optimized)

### 3.3 Backend — CURRENT STATE
The backend is a **bare Django project scaffold**:
- Only `base/` exists (settings, urls, wsgi, asgi)
- No apps, no models, no views, no serializers, no URLs beyond admin
- `SECRET_KEY` is hardcoded insecure default — **must fix before demo**
- `DEBUG = True`, `ALLOWED_HOSTS = []` — **not production-ready**
- SQLite only — acceptable for demo, note for commission

### 3.4 Backend — MUST BUILD
```
backend/
├── apps/
│   ├── accounts/      User model, register, login, profile
│   ├── courses/       Lesson, Unit, Level, Section, QuizQuestion
│   ├── progress/      UserLesson, UserUnit progress tracking
│   ├── gamification/  XP, Level, Streak, Badge, Inventory
│   ├── chat/          ChatRoom, ChatMessage (WebSocket via Channels)
│   └── market/        Item, UserItem (shop transactions)
```

---

## 4. Language Decision: TypeScript → JavaScript

The project currently uses TypeScript (`.tsx` / `.ts` files).  
**Decision: Migrate to plain JavaScript (JSX/JS) as per project requirements.**

Migration plan (do not rush, do file by file):
1. Convert `tsconfig.json` → `jsconfig.json`
2. Rename files: `.tsx` → `.jsx`, `.ts` → `.js`
3. Remove type annotations (keep JSDoc where it aids readability)
4. Remove `typescript` devDependency, keep `vite`
5. Update `vite.config.ts` → `vite.config.js`

**Important:** Only remove types that are redundant. Keep clear variable names. Commission reviewers should immediately understand every function.

---

## 5. Code Standards (enforced for commission review)

### General
- No dead code, no commented-out blocks, no TODO comments in JS/Python files
- No duplication — extract a shared component or util when logic repeats twice
- Each file does exactly one thing
- Max file length: ~250 lines (split if larger)
- No `console.log` in production code

### Frontend (React / Vite / JS)
- Use `@/` alias for all internal imports (never relative `../../`)
- One default export per file, named identically to the file
- Zustand stores: one store per domain, all in `src/store/`
- No inline styles except dynamic values (use Tailwind classes)
- Component props via plain object destructuring (no PropTypes required)
- Keep data files in `src/data/` — never hardcode content in components

### Backend (Django / DRF)
- One Django app per domain (accounts, courses, progress, gamification, chat, market)
- Models use `verbose_name` and `__str__`
- All API via DRF ViewSets + Routers
- JWT authentication via `simplejwt`
- CORS: allow only `localhost:3000` in development
- Settings split: `base.py`, `development.py`, `production.py`
- Secret key and DB credentials via `.env` (never committed)
- All endpoints prefixed: `/api/v1/`

### Security (critical for commission)
- Never commit `.env`, `db.sqlite3`, secrets
- Input validation on every API endpoint
- Use Django's built-in CSRF, password validators
- Rate-limit login endpoint
- Sanitize all user-generated content before storage

---

## 6. Routing Map (Frontend)

| Path | View | Status |
|---|---|---|
| `/` | HomeView | Done |
| `/login` | LoginView | **Missing** |
| `/register` | RegisterView | **Missing** |
| `/learn` | LearnView | Done |
| `/unit/:unitId` | UnitView | Done |
| `/lesson/:unitId/:lessonId` | LessonView | Done |
| `/explore` | ExploreView | Done |
| `/3d-solar-system` | SolarSystemView | Done |
| `/star-finder` | StarFinderView | Done |
| `/lab` | SpaceLabView | Done |
| `/daily` | DailyChallengeView | Done |
| `/leaderboard` | LeaderboardView | Done |
| `/calendar` | CalendarView | Done |
| `/news` | NewsView | Done |
| `/live` | LiveSpaceView | Done |
| `/careers` | CareersView | Done |
| `/portfolio` | PortfolioView | Done |
| `/history` | HistoryView | Done |
| `/market` | MarketView | Done |
| `/uzb` | UzSpaceView | Done |
| `/space-game` | SpaceRunView | Done |
| `/profile` | ProfileView | **Missing** |
| `/chat` | ChatView | **Missing** |

---

## 7. API Design (to be built)

Base URL: `http://localhost:8000/api/v1/`

### Auth
```
POST   /auth/register/
POST   /auth/login/
POST   /auth/token/refresh/
POST   /auth/logout/
GET    /auth/me/
```

### Courses
```
GET    /courses/levels/
GET    /courses/units/
GET    /courses/lessons/{id}/
GET    /courses/lessons/{id}/sections/
```

### Progress
```
GET    /progress/
POST   /progress/lessons/{id}/complete/
GET    /progress/units/{id}/
```

### Gamification
```
GET    /gamification/profile/
POST   /gamification/xp/add/
GET    /gamification/leaderboard/
GET    /gamification/badges/
```

### Chat
```
GET    /chat/rooms/
GET    /chat/rooms/{id}/messages/
WS     /ws/chat/{room_id}/
```

### Market
```
GET    /market/items/
POST   /market/purchase/
GET    /market/inventory/
```

---

## 8. Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000/api/v1
GEMINI_API_KEY=your_key_here
```

### Backend (`backend/.env`)
```
SECRET_KEY=generate_a_real_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 9. Development Commands

```bash
# Frontend
cd frontend
npm run dev          # starts on port 3000

# Backend
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # starts on port 8000
```

---

## 10. Session Workflow (how to work with this project)

1. Read `TODO.md` at the start of every session — pick the top unfinished task
2. Work on one task at a time, mark it done before starting the next
3. After backend changes: run `python manage.py migrate`, test endpoint with curl/httpie
4. After frontend changes: verify in browser at localhost:3000
5. Keep files under 250 lines — split when needed
6. Update `TODO.md` and this file if architecture changes

---

## 11. Gamification System (existing logic reference)

The frontend has a complete gamification system in Zustand:
- **XP** → levels via `sqrt(xp/100) + 1` formula
- **Fuel** → currency for market + travel (max 1000), earned via daily login / perfect score
- **Streak** → daily consecutive login check via `lastPlayDate`
- **Badges** → ID-based, checked on every XP gain
- **Skills** → per-skill mastery: Not Started → In Progress → Skilled → Mastered
- **Portfolio** → projects with career track, skills used, date

When building the backend, mirror this schema exactly so migration from localStorage → DB is clean.

---

## 12. i18n System

Custom hook at `src/hooks/useTranslation.ts`, reads from `useUserStore.language`.  
Locale files: `src/locales/en.json`, `uz.json`, `ru.json`.  
Usage: `const { t } = useTranslation(); t('namespace', 'key')`  
When adding new text: add to ALL three locale files simultaneously.

---

## 13. Known Issues / Tech Debt

| Issue | Priority | Notes |
|---|---|---|
| SECRET_KEY exposed in settings.py | CRITICAL | Move to .env before any demo |
| All data hardcoded in frontend | HIGH | Needs backend API |
| No auth system | HIGH | Login/register does not exist |
| TypeScript → JS migration pending | MEDIUM | Do per-file, test after each |
| No error boundaries in React | MEDIUM | App crashes on unhandled errors |
| `"12k+ learners"` hardcoded stat | LOW | Should be real or removed for commission |
| `db.sqlite3` committed to git | LOW | Add to .gitignore |
| No loading skeletons for async data | LOW | Add when API is wired |
