# Contributing to UZ COSMOS

Rules for everyone working on this repository. Written after the 22 August 2026
audit, which found 42 defects — 20 of them reproducible by running the code.
Every rule below exists because we already shipped the bug it prevents.

Full illustrated version, with the before/after for each rule and the current
ticket board: <https://claude.ai/code/artifact/4a85e840-04bb-4b32-a7bc-418c4b648eb3>

---

## The workflow

1. **Claim** a ticket and assign it to yourself.
2. **Reproduce** the bug, or write down exactly what the feature must do.
3. **Write the test first.** Run it. It must fail, for the reason you expect.
4. **Make it pass** with the smallest change. No unrelated tidying in the same branch.
5. **Open a PR.** One reviewer; the lead also reviews anything touching auth,
   currency or personal data.
6. **Merge** on green CI plus approval. Squash.

Branches: `fix/<slug>`, `feat/<slug>`, `chore/<slug>`. Never commit to `main`.

Commits: `<type>: <what changed>` where type is one of
`feat fix refactor docs test chore perf ci`. The body explains **why**.

Before every push:

```bash
cd backend  && python manage.py test apps base        # 81/81 or better
cd backend  && python manage.py check --deploy
cd backend  && python manage.py makemigrations --check --dry-run
cd frontend && npm run build
```

---

## Lanes

| Lane | Owns |
|---|---|
| Backend & API | Django apps, serializers, permissions, data model, migrations. Every endpoint's authorisation. |
| Frontend & UI | React views, stores, routing, the API client. |
| Content & data | Lessons, problems, questions, the three locale files, seed commands. |
| QA & release | Test suite, CI, asset pipeline, deploys. May block a merge. |
| Research | Timeboxed spikes. Produces a written recommendation, not merged code. |

Lanes rotate each sprint. Nobody should be the only person who understands a
part of the system.

---

## The twelve rules

1. **The client is never the source of truth.** The browser reports what
   happened; the server decides what it is worth. Never store a score, amount,
   price or permission taken from a request body.
   *We shipped `POST /gamification/grant/`, which awarded any XP the browser asked for.*

2. **Every object lookup checks who is asking.** Filter by owner in the query.
   An id in a URL is a request, not a permission.
   *Quiz session ids are sequential and had no owner check — anyone could read a classmate's answers.*

3. **Choose the serializer by role, everywhere the data appears** — list, detail,
   and nested. Grep the field name before calling it fixed.
   *We fixed the answer-key leak in one app and left the identical leak live in three places in another.*

4. **Validate input with a serializer, not `int()`.** A caller mistake is a 400
   with a message. A 500 is our mistake.
   *Eight endpoints returned 500 to `?min_price=abc`.*

5. **Read-modify-write on a balance is a bug.** Use `select_for_update()` in a
   transaction, or `F()`.
   *Two concurrent purchases both passed the same balance check.*

6. **One helper per state change.** If `add_xp()` exists, nothing else touches
   `profile.xp`.
   *Three call sites wrote the field directly and skipped the level recompute.*

7. **Configuration fails closed.** A missing or misspelled variable produces the
   safe behaviour, or refuses to start.
   *A typo in `DJANGO_ENV` booted development: DEBUG on, CORS open, sign-in codes in the response body.*

8. **Security randomness comes from `secrets`,** compared with
   `hmac.compare_digest`, with failed attempts counted.
   *Sign-in codes came from `random.randint`, whose state is recoverable from a few outputs.*

9. **Know what your base class does before you inherit it.**
   *Our login throttle extended `AnonRateThrottle`, whose `get_cache_key` returns `None` — no limit — for an authenticated caller.*

10. **Never swallow an exception.** `except Exception: pass` and empty `catch {}`
    are banned. Catch the specific error; handle it or log it.
    *The frontend caught everything from `fetchMe` and logged users out on a single 502.*

11. **Personal data is opt-in, children's doubly so.** Our users are 10–18.
    Before a field enters a public response, ask what a stranger learns about a
    specific child.
    *The public leaderboard returned real names and photos of the top 100 users.*

12. **Delete dead code when you notice it.** Unreachable code gets read, trusted
    and re-enabled.
    *An unlinked page in `public/` reported a successful login for any password and would post credentials to any host given in `?api=`.*

---

## House conventions

- Files 200–400 lines, 800 hard maximum. Split by feature, not by file type.
- Functions under 50 lines; nesting depth 4 maximum.
- Never mutate arguments or state — return a new object.
- No `console.log` in merged code. Python uses `logging`, never `print`.
- Comments explain **why**, never **what**.
- Code, comments, commits, tickets and PRs in English. UI strings only from the
  locale files — never hardcoded in a component.
- Every new i18n key lands in `en`, `uz` and `ru` in the same commit. We are at
  1006 keys with perfect parity.
- No secrets in the repo, and never in a `VITE_*` variable — Vite inlines those
  into the public bundle.
- `select_related` / `prefetch_related` / `annotate(Count(...))`. A `.count()`
  inside a serializer field runs once per row.
- Model change and its migration in the same commit.

---

## Review checklist

- [ ] Does a test fail without this change? Revert the source file and check.
- [ ] Who is allowed to call this? If `AllowAny`, why is that correct?
- [ ] What does it do with rubbish input — empty, missing, wrong type, negative, 10 000 items?
- [ ] What happens if two people do it at once?
- [ ] Does any new response field tell a stranger something about a child?
- [ ] Does the same bug exist elsewhere? Grep the pattern across both apps.
- [ ] Anything swallowed? Search for `except Exception` and `catch {}`.
- [ ] Would this break an existing client? Response-shape changes need the
      frontend change in the same PR.
- [ ] Can you explain the change back in one sentence? If not, ask.

Be specific and be kind. "This crashes when `answers` is empty" beats "needs
validation". Say what you would do, not only what is wrong.

---

## Definition of done

1. It works, and you saw it work.
2. A test covers it, and fails without your change.
3. Suite green, plus `check --deploy`, `makemigrations --check`, `npm run build`.
4. Reviewed and approved.
5. New strings in all three locales.
6. The PR body says why.
7. Anything found but not fixed is a new ticket.

---

## Setup

```bash
# backend
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env        # set SECRET_KEY, DJANGO_ENV=development
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# frontend
cd frontend
npm install
copy .env.example .env        # VITE_API_URL=http://localhost:8000/api/v1
npm run dev
```

Generate a real secret key — never reuse the example:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

---

## Asking for help

Thirty minutes stuck, then ask. Nobody is judged for asking; people are judged
for burning a day on a two-minute question. Say what you were doing, what you
tried, what happened, and paste the exact error text.

Flag a blocker the same day, not at the deadline.

"I do not understand this code" is a valid ticket. If you cannot follow it,
neither will the next person.
