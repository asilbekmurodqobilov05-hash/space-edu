# Handover — state of the work on 22 August 2026

Branch `fix/audit-critical`, 11 commits ahead of `main`, **not merged, not
pushed**. Everything below is committed on that branch.

---

## Start here

| Read | For |
|---|---|
| `docs/SECURITY-INCIDENT-2026-08-22.md` | The one thing that is still urgent |
| `CONTRIBUTING.md` | Team rules: AI use, code, process, the five roles |
| `docs/adr/0001-content-model.md` | The biggest architectural decision, awaiting a call |

Verify the state in one go:

```bash
cd backend  && python manage.py test apps base   # expect 131 OK
cd frontend && npm test                          # expect 71 OK
cd frontend && npm run build && npm run check:locales
```

---

## What changed

An audit on 22 August found 42 defects across ~30 000 lines; 20 were reproduced
by running the code. The project had **zero tests**. It now has **202**, and CI
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

### Correctness

- Rotated refresh tokens were discarded, so **every user was forced back to
  `/login` about an hour after signing in**.
- `/store` threw `ReferenceError` on its first product card and took the whole
  app down with it.
- Balance operations take a row lock; XP awards recompute the level.
- Eight endpoints returned `500` on ordinary bad input; the admin Missions tab
  raised `NameError` on every request.
- `manage.py seed` had **never** worked (unpacked 9 values from 8-element
  tuples, inside `@transaction.atomic`). It now produces 3 levels, 6 units,
  12 lessons, 13 questions, 8 badges.
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

---

## Open, and why

### Needs the lead — cannot be done for you

| | |
|---|---|
| **Q1 — credential exposure** | The repository is **public** and history holds a database with two superuser password hashes. **Step 1 of `docs/SECURITY-INCIDENT-2026-08-22.md` needs doing today**; it depends on nothing. Steps 2–3 rewrite history and should wait until this branch is merged. |
| **C1 — content model** | Approve or reject `docs/adr/0001-content-model.md`. It recommends keeping the Sphere branch, deleting the Level branch, and deleting `seed_courses` rather than repairing it. |
| **B1 — chat moderation** | The project ships a public chat *and* private messaging for 10–18 year-olds with no moderation of any kind: no profanity filter, no reporting, no blocking, no admin delete, no rate limit, and no consent step before a DM. Any account can find any other by a two-character name search and message them. This is the largest remaining risk and it needs product decisions, not code. Until it ships, keep DMs off. |

### Free to pick up

| | |
|---|---|
| **Q3 (tail)** | Working tree is 20 MB but history still carries the originals, so a fresh clone is ~250 MB. Bundle with Q1. Also: 30 texture files the game references and does not have, and texture compression inside the remaining texture-heavy models (libvips fails on Windows — run it on Linux or in CI). |
| **F4** | Extend the frontend suite past the five regression files: the auth store, the market paging helper, a first render test for each of the four largest views. |
| **R2** | Two award paths have no server endpoint at all — watching a live stream, and finishing a static lesson. Since `grant/` was removed they no longer persist. Propose the endpoints, or propose dropping the rewards. |
| **C2 (tail)** | `physicsTopicsData` has 14 topics and no sub-lessons while the other three subjects use them. Decide whether `SubLesson` survives before writing the content migration — see the open questions in the ADR. |

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
  Both are covered by tests in `apps/admin_api/tests.py`.
- **`grant/` is gone, so two client-side award paths silently do nothing now.**
  That is ticket R2, not a regression.
- **Locale parity is enforced by CI** at 1007 keys across `en`/`uz`/`ru`.
- **`gltf-transform --texture-compress` fails on Windows** with a libvips
  colourspace error. Geometry compression works fine.
- **`CACHES` falls back to the database** when `REDIS_URL` is absent, and the
  table is created by a migration. Set `REDIS_URL` on Railway when you can.

---

## Artifacts

- Audit report — <https://claude.ai/code/artifact/b80e12e0-2d30-48e7-8df3-1b86c2689067>
- Team handbook — <https://claude.ai/code/artifact/4a85e840-04bb-4b32-a7bc-418c4b648eb3>
  (same content as `CONTRIBUTING.md`)
- Ground comparison — <https://claude.ai/code/artifact/25974d1b-86cd-4426-af5f-0006126edc0c>
