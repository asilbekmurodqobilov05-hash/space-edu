# Contributing to UZ COSMOS

Rules for everyone working on this repository. Written after the 22 August 2026
audit, which found 42 defects — 20 reproducible by running the code, 4 of them
meaning the system was compromised. None were hard problems. They survived
because nothing checked: zero tests, no CI, no review step.

Full illustrated version, with before/after for every rule and the live board:
<https://claude.ai/code/artifact/4a85e840-04bb-4b32-a7bc-418c4b648eb3>

**The rule above all others:** a bug we have already fixed must never come back.
Every change ships with a test that fails before it and passes after.

---

# Part 1 — Working with AI

You will use AI. That is fine and expected. It makes you faster at the parts of
this job that are typing; it does not make you faster at the part that is
deciding, and it will confidently hand you the exact bugs we just removed.

**Why this section exists.** An AI suggests what was most common in the code it
learned from, and the most common patterns are also the most commonly wrong.
Nearly every serious defect in the audit is something an assistant would suggest
to you today, unprompted, as the natural way to write it:

| What AI will suggest | What it cost us |
|---|---|
| `random.randint(0, 999999)` for a sign-in code | Predictable codes; the generator's state is recoverable from a few outputs |
| `except Exception: pass` | Silent failures for months; on the frontend, one 502 logged every user out |
| `int(request.GET['min_price'])` | Eight endpoints returned 500 — and rendered the debug page with `SECRET_KEY` |
| `profile.xp += n; profile.save()` | Skipped the level recompute. Three perfect quizzes, still level 1 |
| `Model.objects.get(id=pk)` in a detail view | Anyone could read another student's answers by counting ids upward |
| `permission_classes = [AllowAny]` to make it work | An open proxy to a paid API, and a public answer key |
| A `ModelSerializer` listing every field | `correct_answer` and children's real names in anonymous responses |
| Check the balance, then subtract it | Two purchases for the price of one |
| `if ENV == 'production': ... else: dev` | A typo booted development in production |

**AI-1. You are the author.** Your name is on the commit. "The AI wrote it" is
not a review answer or a post-mortem answer.

**AI-2. If you cannot explain it line by line, it does not go in.** Your reviewer
will pick a line and ask. When you do not understand a suggestion, ask the AI to
explain it and then check that explanation against the docs.

**AI-3. Never accept the test and the fix in one breath.** Ask for the test
first, run it, **watch it fail**, then ask for the fix. An assistant that can see
your buggy code will write a test asserting the buggy behaviour — it passes
immediately and locks the bug in permanently.

**AI-4. It does not know our codebase.** It writes a new helper because it cannot
see that `add_xp()`, `spend_fuel()`, `validate_image_upload()` or
`_owned_session_or_none()` already exist. Grep before you accept. That is how we
got 700 lines of duplicated CRUD in `admin_api`.

**AI-5. Give it our rules, not just our question.** Paste the relevant rule from
Part 2 into the prompt along with the real file. A prompt with no context gets
you generic Django.

**AI-6. Run it before you believe it.** Assistants invent model fields, DRF
options and npm packages, fluently. Nothing counts until the suite runs it.

**AI-7. Never paste secrets or real user data into a prompt.** No `.env`, no
keys, no database rows. Our users are 10–18 and we hold their names, emails and
dates of birth. Make test data up, or use the test factories.

**AI-8. Small diffs.** Asked for a small change and got 400 lines? Ask again for
the minimal change. A diff nobody can review is a diff nobody did review.

**AI-9. Never weaken a check to make something pass.** If a security test is in
your way, the test is right. Relaxing or deleting an existing test needs the
reviewer's explicit agreement and a sentence saying why.

**AI-10. Its comments can be confidently wrong.** A wrong comment is worse than
none — the next reader trusts it instead of reading. Write the *why* yourself.

**AI-11. Say so in the PR.** One line: "drafted with AI, reviewed and tested by
me", or "written by hand". Nobody is judged for either; it tells the reviewer
where to look hardest.

**AI-12. Use it where it is genuinely strong:** explaining unfamiliar code,
enumerating edge cases ("what inputs would break this?" — exactly the question we
kept failing to ask), boring checkable work, and reviewing your own diff before a
human sees it. It is weak at deciding what to build and at judging whether a
trade-off suits *this* project.

---

# Part 2 — Writing code

1. **The client is never the source of truth.** The browser reports what
   happened; the server decides what it is worth.
   *We shipped `POST /gamification/grant/`, which awarded any XP the browser asked for.*

2. **Every object lookup checks who is asking.** Filter by owner in the query.
   *Quiz session ids are sequential and had no owner check.*

3. **Choose the serializer by role, everywhere the data appears** — list, detail
   and nested. Grep the field name before calling it fixed.
   *We fixed the answer-key leak in one app and left it live in three places in another.*

4. **Validate input with a serializer, not `int()`.** A caller mistake is a 400
   with a message; a 500 is our mistake.

5. **Read-modify-write on a balance is a bug.** `select_for_update()` in a
   transaction, or `F()`.

6. **One helper per state change.** If `add_xp()` exists, nothing else touches
   `profile.xp`.

7. **Configuration fails closed.** A missing or misspelled variable produces the
   safe behaviour, or refuses to start.

8. **Security randomness comes from `secrets`,** compared with
   `hmac.compare_digest`, with failed attempts counted.

9. **Know what your base class does before you inherit it.**
   *Our throttle extended `AnonRateThrottle`, whose `get_cache_key` returns `None` — no limit — for an authenticated caller.*

10. **Never swallow an exception.** `except Exception: pass` and empty `catch {}`
    are banned.

11. **Personal data is opt-in, children's doubly so.** Before a field enters a
    public response, ask what a stranger learns about a specific child.

12. **Delete dead code when you notice it.**
    *An unlinked page in `public/` reported a successful login for any password.*

## House conventions

- Files 200–400 lines, 800 hard maximum. Split by feature, not file type.
- Functions under 50 lines; nesting depth 4 maximum.
- Never mutate arguments or state — return a new object.
- No `console.log` in merged code. Python uses `logging`, never `print`.
- Comments explain **why**, never **what**.
- Code, comments, commits, tickets and PRs in English. UI strings only from the
  locale files.
- Every new i18n key lands in `en`, `uz` and `ru` in the same commit. CI enforces
  it — we are at 1007 keys with perfect parity.
- No secrets in the repo, never in a `VITE_*` variable.
- `select_related` / `prefetch_related` / `annotate(Count(...))`.
- Model change and its migration in the same commit.

---

# Part 3 — Running the project

## The six steps

1. **Claim** a ticket and assign it to yourself.
2. **Reproduce** the bug, or write down what the feature must do.
3. **Write the test first.** Run it. It must fail, for the reason you expect.
4. **Make it pass** with the smallest change. No unrelated tidying.
5. **Open a PR.** One reviewer; the lead also reviews auth, currency and personal
   data.
6. **Merge** on green CI plus approval. Squash.

Branches: `fix/<slug>`, `feat/<slug>`, `chore/<slug>`. Never commit to `main`.
Commits: `<type>: <what changed>` — `feat fix refactor docs test chore perf ci`.

CI runs all of this; run it yourself first, it is faster than waiting:

```bash
cd backend  && python manage.py test apps base        # 105/105
cd backend  && python manage.py check --deploy
cd backend  && python manage.py makemigrations --check --dry-run
cd frontend && npm run build
cd frontend && npm run check:locales
```

## Tickets

- One ticket, one concern. Found a second problem? File it, do not fold it in.
- A bug ticket needs reproduction steps. Without them it is a rumour.
- A feature ticket needs acceptance criteria written before any code.
- Nothing goes to review without a ticket.
- Anything found and not fixed becomes a ticket before you close yours.

## Talking to each other

- Daily, three sentences, written: finished / working on / blocked by.
- Blocked? Say it the same day, not at the deadline.
- Thirty minutes stuck, then ask. Nobody is judged for asking.
- Ask well: what you tried, what happened, exact error text pasted not
  screenshotted.
- "I do not understand this code" is a valid ticket.
- Disagree in the open, with a reason.

## Review checklist

- [ ] Does a test fail without this change? Revert the source file and check.
- [ ] Who is allowed to call this? If `AllowAny`, why is that correct?
- [ ] What does it do with rubbish input — empty, missing, wrong type, negative,
      10 000 items?
- [ ] What if two people do it at once?
- [ ] Does any new response field tell a stranger something about a child?
- [ ] Does the same bug exist elsewhere? Grep the pattern.
- [ ] Anything swallowed? Search for `except Exception` and `catch {}`.
- [ ] Would this break an existing client?
- [ ] Can the author explain it? Pick a line and ask — especially on an
      AI-assisted PR.

Be specific and be kind. Say what is good out loud; a review that is only ever
complaints stops being read carefully.

## Definition of done

1. It works, and you saw it work.
2. A test covers it, and fails without your change.
3. CI green: tests, deploy checks, migrations, build, locale parity.
4. Reviewed and approved.
5. New strings in all three locales.
6. The PR body says why, and how AI was used if it was.
7. Anything found but not fixed is a new ticket.

## Releases and incidents

- Never deploy on a Friday, or when the author is unreachable.
- Deploy small and often. One change rolls back trivially; twelve do not.
- Watch it after: load the site, sign in, open a lesson, finish a quiz.
- Production broke? Roll back first, diagnose second.
- Every incident gets a written note: what broke, how we noticed, what changed,
  and the test that now covers it. No blame — we look for the missing check.

---

# Part 4 — The five roles

One each. You own your lane's health, not only your tickets. Lanes rotate every
sprint: the two-content-systems problem is what happens when only one person
understands a part of the system.

### 1. Backend & API — `B1 B2 B3 B4 B5`

Every endpoint's authorisation is yours, regardless of who wrote the line.

- **Owns:** Django apps, views, serializers, permissions, throttles, the data
  model, migrations, the gamification economy.
- **Every change:** name the permission class, type every input field, lock every
  balance write, ship the migration alongside.
- **Never:** trust a number from the client; add `AllowAny` to make something
  work; fetch by id without an owner filter; put a secret field in a default
  serializer.

### 2. Frontend & UI — `F1 F3`

Everything a user touches, including when the cause turns out to be the API.

- **Owns:** views, components, routing, Zustand stores, the API client, the 3D
  scenes and the game, accessibility, mobile layout.
- **Every change:** check the endpoint's real response shape, handle loading /
  empty / error states, clean up every effect you start, test on a phone-sized
  viewport.
- **Never:** hardcode a user-facing string; treat local state as authoritative;
  assume a list endpoint is unpaginated; leave a `catch {}` empty.

### 3. Content & i18n — `C1 C2`

You decide what a lesson *is*. A bug-free app that teaches badly has failed.

- **Owns:** lessons, problems, quiz questions, all three locale files, seed
  commands, factual accuracy.
- **Every change:** all three languages in the same commit; every answer index in
  range; astronomy verified against a source; seeds idempotent and runnable.
- **Never:** ship a key in one language only; let a seed print success after doing
  nothing; put content in `src/data/*.js` — it belongs in the database.

### 4. Quality & release — `Q1 Q2 Q3`

You may block a merge, and you are expected to use that.

- **Owns:** the 105-test suite, CI, deploys and rollbacks, the asset pipeline and
  bundle size, incident notes.
- **Every week:** confirm CI is green on `main`; check no test was quietly
  deleted; watch bundle and repo size; run a full manual pass of the site.
- **Never:** approve a PR whose test you did not see fail; let a red build merge
  "just this once"; deploy something you cannot roll back.

### 5. Research & docs — `R1 R2`

You produce decisions, not features.

- **Owns:** spikes before large work, written decision records, keeping the README
  and this file true, evaluating libraries before adoption.
- **A spike ends with:** the options honestly stated, what each costs, your
  recommendation and why, and what you are still unsure about.
- **Never:** exceed the two-day timebox silently — needing longer is itself the
  finding; merge prototype code; recommend without having run it.

**Review pairing.** Backend reviews Frontend and vice versa. Content and Research
review each other. Quality reviews anyone; everyone reviews Quality. Nobody
reviews only their own lane.

---

## Setup

```bash
# backend
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env        # SECRET_KEY, DJANGO_ENV=development
python manage.py migrate
python manage.py seed         # 3 levels, 6 units, 12 lessons, 8 badges
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

Rules are versioned. If one gets in the way of good work, argue with it — bring
the case and we will change it. Not negotiable: tests before fixes, review before
merge, the server never trusting the client, and you understanding every line you
sign your name to.
