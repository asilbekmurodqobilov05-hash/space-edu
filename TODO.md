# TODO — UZ COSMOS
> Work top-to-bottom. Mark tasks with [x] when done. One task at a time.
> Updated: 2026-04-28

---

## PHASE 0 — Critical Fixes (Before Any Demo)

- [x] **0.1** Move Django `SECRET_KEY` to `.env` file, load via `python-decouple` or `os.environ`
- [x] **0.2** Add `.gitignore` entries: `.env`, `db.sqlite3`, `__pycache__`, `venv/`, `node_modules/`, `dist/`
- [x] **0.3** Create `frontend/.env.example` and `backend/.env.example` with placeholder keys
- [x] **0.4** Set `ALLOWED_HOSTS` from env var in Django settings
- [x] **0.5** Create `backend/requirements.txt` with all dependencies pinned

---

## PHASE 1 — Backend Foundation

### 1.1 Django Project Setup
- [x] Install: `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `Pillow`, `python-decouple`, `channels`
- [x] Split settings into `settings/base.py`, `settings/development.py`, `settings/production.py`
- [x] Configure CORS: allow `http://localhost:3000`
- [x] Add DRF to `INSTALLED_APPS`, configure default authentication classes (JWT)
- [x] Set `TIME_ZONE = 'Asia/Tashkent'`

### 1.2 Accounts App (`apps/accounts/`)
- [x] Create app: `python manage.py startapp accounts`
- [x] Custom `User` model extending `AbstractUser`: fields `avatar`, `spaceship`, `bio`, `astronaut_name`
- [x] Serializers: `RegisterSerializer`, `UserSerializer`, `ProfileSerializer`
- [x] Views: `RegisterView`, `LoginView` (JWT), `ProfileView` (GET/PATCH)
- [x] URLs: `/api/v1/auth/register/`, `/api/v1/auth/login/`, `/api/v1/auth/token/refresh/`, `/api/v1/auth/me/`
- [x] Password validation rules wired to DRF

### 1.3 Courses App (`apps/courses/`)
- [x] Create app: `python manage.py startapp courses`
- [x] Models: `Level`, `Unit`, `Lesson`, `LessonSection`, `QuizQuestion`, `PracticeExercise`
- [x] Mirror the TypeScript interfaces from `frontend/src/data/learningData.ts` exactly
- [x] Django Admin for all models (so content can be managed)
- [x] Read-only API (no auth required): `LevelViewSet`, `UnitViewSet`, `LessonViewSet`
- [x] Management command: `load_initial_data` — seeds DB from existing frontend data files

### 1.4 Progress App (`apps/progress/`)
- [x] Create app: `python manage.py startapp progress`
- [x] Models: `UserLessonProgress` (user, lesson, score, is_mastered, completed_at), `UserUnitEnrollment`
- [x] Views: get progress, complete lesson (POST), get unit progress
- [x] All endpoints require JWT auth

### 1.5 Gamification App (`apps/gamification/`)
- [x] Create app: `python manage.py startapp gamification`
- [x] Models: `UserProfile` (xp, level, fuel, streak, last_play_date), `UserBadge`, `UserInventory`
- [x] XP formula: `level = floor(sqrt(xp / 100)) + 1` (match frontend exactly)
- [x] Views: get profile, add XP (internal), leaderboard (top 100 by XP), badges list
- [x] Signal: on `UserLessonProgress` save → auto-add XP, check badges

### 1.6 Market App (`apps/market/`)
- [x] Create app: `python manage.py startapp market`
- [x] Models: `Item` (name, description, cost_fuel, item_type, image), `UserItem`
- [x] Views: list items, purchase (deduct fuel, add to inventory)
- [x] Seed items via fixture

### 1.7 Chat App (`apps/chat/`)
- [x] Create app: `python manage.py startapp chat`
- [x] Models: `ChatRoom` (name, is_global), `ChatMessage` (room, user, content, created_at)
- [x] REST: list rooms, list messages (paginated)
- [x] WebSocket consumer via Django Channels for real-time
- [x] Use `channels_redis` for channel layer (or in-memory for demo)

---

## PHASE 2 — Frontend Auth

- [x] **2.1** Create `src/views/auth/LoginView.jsx`
- [x] **2.2** Create `src/views/auth/RegisterView.jsx`
- [x] **2.3** Create `src/store/useAuthStore.js`
- [x] **2.4** Create `src/lib/api.js`
- [x] **2.5** Create `src/components/ProtectedRoute.jsx`
- [x] **2.6** Wrap private routes in `App.jsx` with `ProtectedRoute`
- [x] **2.7** Add `/login` and `/register` routes to `App.jsx`
- [x] **2.8** Logout: clear tokens from store and localStorage, redirect to `/`

---

## PHASE 3 — TypeScript → JavaScript Migration

> Strategy: new .jsx/.js files take priority over .tsx/.ts via vite.config.js extension order.
> Run `rename-to-js.ps1` to finish bulk rename of remaining files.

- [x] **3.1** `vite.config.js` created — .jsx preferred over .tsx in resolve.extensions
- [x] **3.2** `jsconfig.json` created alongside tsconfig.json
- [x] **3.3** Remove `typescript` from devDependencies, remove `tsc --noEmit` lint script in package.json
- [x] **3.4** Migrate `src/lib/utils.ts` → `utils.js`
- [x] **3.5** Migrate stores: `useUserStore`, `useGamificationStore`, `useLearningStore`, `useAIStore`
- [x] **3.6** Migrate `src/hooks/useTranslation.ts` → `.js`
- [x] **3.7** Migrate `src/i18n/translations.ts` → `.js`
- [x] **3.8** Migrate all data files in `src/data/`
- [x] **3.9** Delete `src/types/index.ts` (not needed in JS)
- [x] **3.10** Migrate layout components
- [x] **3.11** Migrate all views
- [x] **3.12** Migrate game files
- [x] **3.13** Migrate `src/features/ai/AskCosmos`
- [x] **3.14** `src/main.jsx` created, `index.html` updated to load main.jsx
- [x] **3.15** `src/App.jsx` created (no TypeScript)
- [x] **3.16** `HomeView` — rewritten in JS syntax, no type annotations
- [x] **3.17** Run `rename-to-js.ps1` to bulk rename remaining .tsx → .jsx and .ts → .js
- [x] **3.18** Full browser test after bulk rename

---

## PHASE 4 — Frontend API Integration

- [ ] **4.1** Connect LearnView → `GET /api/v1/courses/levels/`
- [ ] **4.2** Connect LessonView → `GET /api/v1/courses/lessons/{id}/`
- [ ] **4.3** Complete lesson → `POST /api/v1/progress/lessons/{id}/complete/`
- [ ] **4.4** Load user gamification profile from API on login
- [ ] **4.5** Leaderboard → `GET /api/v1/gamification/leaderboard/`
- [ ] **4.6** Market purchases → `POST /api/v1/market/purchase/`
- [ ] **4.7** Chat → connect WebSocket consumer
- [ ] **4.8** Profile page: fetch real user data, update avatar/name via PATCH

---

## PHASE 5 — Missing Pages & Features

- [x] **5.1** Create `/profile` page
- [x] **5.2** Create `/chat` page
- [x] **5.3** Create `404.jsx` — "Lost in Space" styled not-found page, add to router
- [ ] **5.4** Video lesson player — embed YouTube or self-hosted video in `LessonSection` type `video`
- [x] **5.5** Radar chart for skills on profile
- [x] **5.6** Error boundary component wrapping the whole app

---

## PHASE 6 — Quality & Commission Readiness

- [ ] **6.1** Remove all hardcoded fake stats ("12k+ learners") — replace with real API data or neutral text
- [ ] **6.2** Audit every component for unused imports — remove them
- [ ] **6.3** Verify all 3 languages (ENG/UZB/RUS) have complete translation keys — no missing keys
- [ ] **6.4** Mobile responsiveness audit — test all views on 375px width
- [ ] **6.5** Performance: lazy-load heavy views (SolarSystem, SpaceRun) with `React.lazy + Suspense`
- [ ] **6.6** Add `<title>` and `<meta description>` to `index.html`
- [ ] **6.7** Verify no `console.log` statements remain in any file
- [ ] **6.8** Backend: add pagination to all list endpoints (default 20 per page)
- [ ] **6.9** Backend: add input validation and meaningful error messages to all POST endpoints
- [ ] **6.10** Final security check: SECRET_KEY in env, no hardcoded credentials, DEBUG=False for demo build

---

## PHASE 7 — Demo Preparation

- [ ] **7.1** Create demo user account with pre-filled progress (seeded data)
- [ ] **7.2** Seed 5+ lessons with real space/astronomy content in all 3 languages
- [ ] **7.3** Seed market items with images
- [ ] **7.4** Record or link 1-2 real video lessons (YouTube embed)
- [ ] **7.5** Write `README.md` (setup instructions, features list, screenshots)
- [ ] **7.6** Test full user flow: register → complete lesson → earn XP → buy item → view leaderboard
- [ ] **7.7** Verify the app runs cleanly from a fresh `npm install` + `pip install -r requirements.txt`

---

## Progress Tracker

| Phase | Status | Notes |
|---|---|---|
| 0 — Critical fixes | Not started | Top priority |
| 1 — Backend | Not started | Nothing built yet |
| 2 — Auth UI | Not started | Blocked by Phase 1 |
| 3 — JS migration | Not started | Can parallel with Phase 1 |
| 4 — API integration | Not started | Blocked by Phase 1+2 |
| 5 — Missing pages | Not started | |
| 6 — Quality | Not started | |
| 7 — Demo prep | Not started | |
