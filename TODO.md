# TODO — UZ COSMOS
> Work top-to-bottom. Mark tasks with [x] when done. One task at a time.
> Updated: 2026-04-28

---

## PHASE 0 — Critical Fixes (Before Any Demo)

- [ ] **0.1** Move Django `SECRET_KEY` to `.env` file, load via `python-decouple` or `os.environ`
- [ ] **0.2** Add `.gitignore` entries: `.env`, `db.sqlite3`, `__pycache__`, `venv/`, `node_modules/`, `dist/`
- [ ] **0.3** Create `frontend/.env.example` and `backend/.env.example` with placeholder keys
- [ ] **0.4** Set `ALLOWED_HOSTS` from env var in Django settings
- [ ] **0.5** Create `backend/requirements.txt` with all dependencies pinned

---

## PHASE 1 — Backend Foundation

### 1.1 Django Project Setup
- [ ] Install: `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `Pillow`, `python-decouple`, `channels` (for WebSocket chat)
- [ ] Split settings into `settings/base.py`, `settings/development.py`, `settings/production.py`
- [ ] Configure CORS: allow `http://localhost:3000`
- [ ] Add DRF to `INSTALLED_APPS`, configure default authentication classes (JWT)
- [ ] Set `TIME_ZONE = 'Asia/Tashkent'`

### 1.2 Accounts App (`apps/accounts/`)
- [ ] Create app: `python manage.py startapp accounts`
- [ ] Custom `User` model extending `AbstractUser`: fields `avatar`, `spaceship`, `bio`, `astronaut_name`
- [ ] Serializers: `RegisterSerializer`, `UserSerializer`, `ProfileSerializer`
- [ ] Views: `RegisterView`, `LoginView` (JWT), `ProfileView` (GET/PATCH)
- [ ] URLs: `/api/v1/auth/register/`, `/api/v1/auth/login/`, `/api/v1/auth/token/refresh/`, `/api/v1/auth/me/`
- [ ] Password validation rules wired to DRF

### 1.3 Courses App (`apps/courses/`)
- [ ] Create app: `python manage.py startapp courses`
- [ ] Models: `Level`, `Unit`, `Lesson`, `LessonSection`, `QuizQuestion`, `PracticeExercise`
- [ ] Mirror the TypeScript interfaces from `frontend/src/data/learningData.ts` exactly
- [ ] Django Admin for all models (so content can be managed)
- [ ] Read-only API (no auth required): `LevelViewSet`, `UnitViewSet`, `LessonViewSet`
- [ ] Management command: `load_initial_data` — seeds DB from existing frontend data files

### 1.4 Progress App (`apps/progress/`)
- [ ] Create app: `python manage.py startapp progress`
- [ ] Models: `UserLessonProgress` (user, lesson, score, is_mastered, completed_at), `UserUnitEnrollment`
- [ ] Views: get progress, complete lesson (POST), get unit progress
- [ ] All endpoints require JWT auth

### 1.5 Gamification App (`apps/gamification/`)
- [ ] Create app: `python manage.py startapp gamification`
- [ ] Models: `UserProfile` (xp, level, fuel, streak, last_play_date), `UserBadge`, `UserInventory`
- [ ] XP formula: `level = floor(sqrt(xp / 100)) + 1` (match frontend exactly)
- [ ] Views: get profile, add XP (internal), leaderboard (top 100 by XP), badges list
- [ ] Signal: on `UserLessonProgress` save → auto-add XP, check badges

### 1.6 Market App (`apps/market/`)
- [ ] Create app: `python manage.py startapp market`
- [ ] Models: `Item` (name, description, cost_fuel, item_type, image), `UserItem`
- [ ] Views: list items, purchase (deduct fuel, add to inventory)
- [ ] Seed items via fixture

### 1.7 Chat App (`apps/chat/`)
- [ ] Create app: `python manage.py startapp chat`
- [ ] Models: `ChatRoom` (name, is_global), `ChatMessage` (room, user, content, created_at)
- [ ] REST: list rooms, list messages (paginated)
- [ ] WebSocket consumer via Django Channels for real-time
- [ ] Use `channels_redis` for channel layer (or in-memory for demo)

---

## PHASE 2 — Frontend Auth

- [ ] **2.1** Create `src/views/auth/LoginView.jsx` — email + password form, submit to `/api/v1/auth/login/`
- [ ] **2.2** Create `src/views/auth/RegisterView.jsx` — username, email, password form, submit to `/api/v1/auth/register/`
- [ ] **2.3** Create `src/store/useAuthStore.js` — stores `accessToken`, `refreshToken`, `user`; persists in localStorage
- [ ] **2.4** Create `src/lib/api.js` — axios instance with base URL from `VITE_API_URL`, request interceptor (attach JWT), response interceptor (auto-refresh on 401)
- [ ] **2.5** Create `src/components/ProtectedRoute.jsx` — redirects to `/login` if no token
- [ ] **2.6** Wrap private routes in `App.jsx` with `ProtectedRoute`
- [ ] **2.7** Add `/login` and `/register` routes to `App.jsx`
- [ ] **2.8** Logout: clear tokens from store and localStorage, redirect to `/`

---

## PHASE 3 — TypeScript → JavaScript Migration

> Strategy: new .jsx/.js files take priority over .tsx/.ts via vite.config.js extension order.
> Run `rename-to-js.ps1` to finish bulk rename of remaining files.

- [x] **3.1** `vite.config.js` created — .jsx preferred over .tsx in resolve.extensions
- [x] **3.2** `jsconfig.json` created alongside tsconfig.json
- [ ] **3.3** Remove `typescript` from devDependencies, remove `tsc --noEmit` lint script in package.json
- [ ] **3.4** Migrate `src/lib/utils.ts` → `utils.js`
- [ ] **3.5** Migrate stores: `useUserStore`, `useGamificationStore`, `useLearningStore`, `useAIStore`
- [ ] **3.6** Migrate `src/hooks/useTranslation.ts` → `.js`
- [ ] **3.7** Migrate `src/i18n/translations.ts` → `.js`
- [ ] **3.8** Migrate all data files in `src/data/`
- [ ] **3.9** Delete `src/types/index.ts` (not needed in JS)
- [ ] **3.10** Migrate layout components (Navigation, PageTransition, ParticleBackground, GlobalLanguageBar)
- [ ] **3.11** Migrate all views (learn, explore, community, game, misc, profile)
- [ ] **3.12** Migrate game files (SpaceRun)
- [ ] **3.13** Migrate `src/features/ai/AskCosmos`
- [x] **3.14** `src/main.jsx` created, `index.html` updated to load main.jsx
- [x] **3.15** `src/App.jsx` created (no TypeScript)
- [x] **3.16** `HomeView` — rewritten in JS syntax, no type annotations
- [ ] **3.17** Run `rename-to-js.ps1` to bulk rename remaining .tsx → .jsx and .ts → .js
- [ ] **3.18** Full browser test after bulk rename

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

- [ ] **5.1** Create `/profile` page — user dashboard (XP bar, level, streak, radar chart of skills, recent badges)
- [ ] **5.2** Create `/chat` page — global chat room, message list, send message
- [ ] **5.3** Create `404.jsx` — "Lost in Space" styled not-found page, add to router
- [ ] **5.4** Video lesson player — embed YouTube or self-hosted video in `LessonSection` type `video`
- [ ] **5.5** Radar chart for skills on profile (use SVG or recharts — lightweight)
- [ ] **5.6** Error boundary component wrapping the whole app

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
