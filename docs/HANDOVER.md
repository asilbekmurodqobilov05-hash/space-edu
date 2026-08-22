# Handover — state of the work on 22 August 2026

Branch `fix/audit-critical`, 20 commits ahead of `origin/main`, **not merged
back, not pushed**. `origin/main` has been merged *in*, so the branch contains
everyone's work. Everything below is committed on it.

---

## Start here

| Read | For |
|---|---|
| `docs/SECURITY-INCIDENT-2026-08-22.md` | The one thing that is still urgent |
| `CONTRIBUTING.md` | Team rules: AI use, code, process, the five roles |
| `docs/adr/0001-content-model.md` | The content model, now decided and built |

Verify the state in one go:

```bash
cd backend  && python manage.py test apps base   # expect 252 OK
cd frontend && npm test                          # expect 161 OK
cd frontend && npm run build && npm run check:locales && npm run content:check
```

---

## What changed

An audit on 22 August found 42 defects across ~30 000 lines; 20 were reproduced
by running the code. The project had **zero tests**. It now has **413**, and CI
that blocks a red merge.

### Security

- `POST /gamification/grant/` **deleted**. It let the browser award itself any
  XP and fuel — one request produced level 101. Not validated, deleted: there
  was no safe version of that shape.
- Answer keys were readable anonymously in **two** apps (`challenges` and,
  separately, `courses` in three places). Serializers are now role-based
  everywhere, including nested.
- Quiz sessions had no ownership check on submit or result; ids are sequential.
- The login throttle was bypassable **two independent ways** — `AnonRateThrottle`
  returns no key for an authenticated caller, and `NUM_PROXIES` was unset so DRF
  keyed on a client-supplied header.
- Settings failed **open**: a typo in `DJANGO_ENV` booted development, which
  turned on `DEBUG`, opened CORS and returned the e-mail sign-in code in the
  response body.
- Sign-in codes moved from `random.randint` to `secrets`, constant-time
  comparison, attempt counting.
- The AI endpoint was `AllowAny` — an open proxy to a paid Google API — and
  spliced caller-supplied `context` into the model's system instruction.
- Uploads had no size, pixel or format limit and the caller chose the stored
  filename, which decided the served `Content-Type`.
- `cosmic-silk-road.html` reported a successful login for any password and took
  its API base from `?api=`. Both holes closed; the page no longer ships.
- The public leaderboard published children's real names and photos.
- **Chat had no moderation of any kind** — see B1 below.

### Correctness

- Rotated refresh tokens were discarded, so **every user was forced back to
  `/login` about an hour after signing in**.
- `/store` threw `ReferenceError` on its first product card and took the whole
  app down with it.
- Balance operations take a row lock; XP awards recompute the level.
- Eight endpoints returned `500` on ordinary bad input; the admin Missions tab
  raised `NameError` on every request.
- `manage.py seed` had **never** worked (unpacked 9 values from 8-element
  tuples, inside `@transaction.atomic`).
- Production `STORAGES` had no `default` alias, so every upload raised
  `InvalidStorageError` once R2 was unconfigured.

### Performance and delivery

- Served assets **246 MB → 20 MB**. Star photographs were stored at up to
  16000×9000 and rendered in a ~700 px box; models are Draco-compressed
  (rocket.glb 55.6 MB → 0.32 MB) with the decoder served from `/draco/`.
  Verified in a real browser, not just built.
- The game leaked a compiled shader program and a canvas texture on every
  unmount, never emptied its texture cache, accumulated ~1400 dead closures per
  ten minutes of music, and never closed its `AudioContext`.
- Sphere and conversation lists no longer scale their query count with row
  count (18→38 queries became a flat 14; 3N+1 became a flat 9).
- `admin_api` rebuilt on DRF serializers: 706 lines → 481.

### The content model, and the tickets that hung off it

**ADR 0001 accepted as Option A and built.** The project carried two complete
content models: the one with an admin UI had no readers, the one with readers
had no editor, and the content lived in neither. An administrator could spend an
afternoon writing lessons in the panel and nothing changed on the site.

- `Level`, `Unit`, `Lesson`, `LessonSection` and `courses.QuizQuestion` are
  gone, with their viewsets, serializers, routes, admin, seeds, and the two
  orphan frontend routes that reached them. Progress points at `TopicLesson`
  and `Topic`.
- `SubLesson` is gone too, replaced by a nullable `TopicLesson.parent`. Four
  levels was not one too many, it was also one too *few* — `interviewsTopicsData`
  nests topic → section → lesson → sub-lesson, which the fixed tree could not
  hold. Measured depths across the four subjects: 1, 2, 2, 3.
- Content had **four** copies (static files, a hand-written copy inside
  `seed_learn_data`, and an inline list in `PhysicsView`). It has one:
  `npm run content:export` turns `src/data/*TopicsData.js` into a fixture,
  `manage.py seed_learn_content` loads it keyed on slug, and CI fails if the
  committed fixture is stale.
- The learn screens read `GET /courses/spheres/<slug>/tree/` — the whole subject
  in three queries — through an adapter that reshapes it into the exact shape
  the static files gave. Each screen changed by one import, and the static file
  remains the fallback when the API is unreachable.
- XP is server-decided: `TopicLesson.xp_reward`/`fuel_reward` plus a `Topic`
  bonus paid once when every leaf is done, all editable per row. Only leaves are
  completable; a node with children is a heading.
- **R2 closed.** Finishing a static lesson now posts to
  `POST /progress/lessons/<slug>/complete/`. The other award path —
  `LiveSpaceView` granting 20 XP on mount, for the page rendering rather than
  for watching anything — was removed rather than given an endpoint; there is
  nothing to verify server-side.
- Quiz questions can attach to a lesson (`ChallengeQuestion.lesson`), and
  `POST /challenges/quiz/start/` takes a lesson slug.

### The redesign merged from `main`

One commit on `main` ("backend changes baby") is a frontend redesign of the nine
learn screens, written against the pre-audit tree. It is merged in: his layout,
our data path, resolved file by file.

Three things in it were **not** taken, and the reasons matter if he asks:

- **`zustand` had been dropped from `package.json`.** Seven modules import it,
  including every store the app has. A clean `npm ci` would have produced a
  build that cannot start.
- **`three` 0.183.2 → 0.184.0 and `@react-three/fiber` 9.5.0 → 9.6.1** were
  picked up incidentally by an `npm install` during a CSS change. Nothing in the
  redesign needs them. Worth doing, in its own commit, with the game exercised.
- **`.agent/skills/ui-ux-pro-max/`** — 31 files of AI tooling, three of them
  compiled `.pyc`. CI's hygiene job fails on any tracked `__pycache__`, so this
  alone would have turned `main` red. Untracked; `.agent/` and `.claude/` are
  now in `.gitignore`.

Two of his changes would have quietly reverted work on this branch and were
re-applied on top of his layout: `UniversalLessonView` was back to awarding XP
client-side with no server call (R2), and `PhysicsView` was back to its inline
copy of the physics curriculum. Everything else of his is kept as written,
including the locale edits that drop the unsupportable "Managed by
NASA-Inspired Learning Systems" line from all three languages.

**Before he pulls:** he is working from the old tree, so tell him to re-clone or
hard-reset onto this branch rather than merging his local copy forward — a
second merge from the old base would reintroduce all three of the above.

---

## Open, and why

### Needs the lead — cannot be done for you

| | |
|---|---|
| **Q1 — credential exposure** | The repository is **public** and history holds a database with two superuser password hashes. **Step 1 of `docs/SECURITY-INCIDENT-2026-08-22.md` needs doing today**; it is now one command, `manage.py rotate_leaked_credentials`, and depends on nothing. It deliberately will not set the two superuser passwords — run `changepassword` for those. Steps 2–3 rewrite history and should wait until this branch is merged. |
| **B1 — review, then decide about DMs** | The moderation floor is built and DMs are **off** (`DM_ENABLED=false`). Turning them on is a product decision about a duty of care to 10-to-18-year-olds, not a code change. Before flipping it: decide who reads `GET /chat/reports/queue/` and how often, and what happens to an account after a report is actioned — there is no suspension mechanism, only message deletion. |

### Free to pick up

| | |
|---|---|
| **Q3 (tail)** | History still carries the originals, so a fresh clone is ~250 MB — bundle that with Q1 step 2. Ten `.glb` models still hold 48 MB of uncompressed texture data; `npm run assets:compress` does it, **on Linux or WSL only** (libvips fails on Windows). CI now fails if that total grows. |
| **C2 (tail)** | 31 assets the game references and does not have are pinned in `spaceRunAssets.test.js`; loading degrades rather than 404-ing, but the art is still missing. |
| **Step 5, client half** | Lesson quizzes work server-side but no screen offers one: `QuizSessionView` runs entirely off the static `quizData` and never calls the API. Moving it over is the remaining work, plus attaching actual questions to lessons in the admin panel. |
| **Lesson text** | `TopicLesson.content` is a bare `TextField` described as "text/markdown" and nobody renders markdown. Decide what a lesson body is before anyone writes into it. |
| **SpaceLabView's textures** | It loads three Earth textures from `unpkg.com` at runtime, on every visit. That is a third-party dependency in the render path and a CSP problem waiting to happen. Host them, or accept it deliberately. |

---

## Things worth knowing before you touch anything

- **Design is deliberately parked.** The owner reviewed three ground options and
  chose to keep the current dark theme, made *warmer and lighter*, closer to the
  "observatory dusk" option — not the light editorial direction picked earlier
  in the conversation. Do not restart the redesign from a light ground.
  Comparison: <https://claude.ai/code/artifact/25974d1b-86cd-4426-af5f-0006126edc0c>
- **Two contracts the admin panel depends on.** Responses must stay bare arrays
  (the dashboard does `items.map(...)`; turning DRF pagination on empties every
  table silently), and it posts `sphere_id` / `topic_id`, not `sphere` / `topic`.
  Both are covered by tests in `apps/admin_api/tests.py`. The panel also posts
  no slug — `Topic` and `TopicLesson` derive one from the title on save, which
  is what keeps that contract working.
- **Editing content now changes the site.** That was the point of ADR 0001, and
  it means a mistake in the admin panel is visible immediately. `seed_learn_content`
  will not delete admin-authored rows unless you pass `--prune`.
- **Locale parity is enforced by CI** at 1017 keys across `en`/`uz`/`ru`.
- **The learn fixture is generated.** Edit `src/data/*TopicsData.js`, then run
  `npm run content:export` and commit the result, or CI fails.
- **`gltf-transform --texture-compress` fails on Windows** with a libvips
  colourspace error. Geometry compression works fine.
- **`CACHES` falls back to the database** when `REDIS_URL` is absent, and the
  table is created by a migration. Set `REDIS_URL` on Railway when you can — the
  chat rate limits are cache-backed, and a database cache makes them slower than
  they need to be.
- **The profanity filter is a floor, not a solution.** It catches the lazy case
  and it has a documented limit (a swapped vowel) with a test of its own. What
  it misses is what the report queue is for, and the report queue only works if
  somebody reads it.

---

## Artifacts

- Audit report — <https://claude.ai/code/artifact/b80e12e0-2d30-48e7-8df3-1b86c2689067>
- Team handbook — <https://claude.ai/code/artifact/4a85e840-04bb-4b32-a7bc-418c4b648eb3>
  (same content as `CONTRIBUTING.md`)
- Ground comparison — <https://claude.ai/code/artifact/25974d1b-86cd-4426-af5f-0006126edc0c>
