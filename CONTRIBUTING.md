# UZ COSMOS — Team Handbook

Rules for everyone working on this repository. Written after the 22 August 2026
audit, which found 42 defects — 20 reproducible by running the code, 4 of them
meaning the system was compromised. None were hard problems. They survived
because nothing checked: zero tests, no CI, no review step.

There are now 202 regression tests (131 backend, 71 frontend) and CI that blocks
a red merge.

**Contents**

1. [Working with AI](#part-1--working-with-ai)
2. [Writing code](#part-2--writing-code)
3. [Running the project](#part-3--running-the-project)
4. [The five roles](#part-4--the-five-roles)
5. [Getting set up](#part-5--getting-set-up)

**The rule above all others:** a bug we have already fixed must never come back.
Every change ships with a test that fails before it and passes after. If you
cannot write that test, you do not yet understand the bug.

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

None of that is the assistant being bad at its job. It is the assistant doing
exactly what it is for — giving you the common answer — on a project where the
common answer is not good enough, because our users are children and our server
holds their data.

### AI-1. You are the author. Always.

Your name is on the commit. "The AI wrote it" is not a review answer, not a
post-mortem answer, and not an excuse. If you would not have written it by hand
knowing what it does, do not merge it.

### AI-2. If you cannot explain it line by line, it does not go in.

Your reviewer will pick a line and ask what it does and why it is there. That is
not a trap; it is the whole point. Code nobody on the team understands is a
liability the day it breaks — and it will break at the worst moment, to the
person who understands it least.

When you do not understand a suggestion, that is a good moment: ask the AI to
explain it, then check the explanation against the docs. Learning is the point
of this job.

### AI-3. Never accept the test and the fix in one breath.

Ask for the test first. Run it. **Watch it fail.** Only then ask for the fix.

An assistant that can see your buggy code will happily write a test asserting
the buggy behaviour — it looks like a real test, it passes immediately, and it
locks the bug in permanently. A test you never saw fail proves nothing.

```
Trap                                  Do
"write a test and fix this"           "write a failing test for this bug"
→ passes on the first run             → run it, see red, read the message
→ you feel finished                   → "now fix it"
→ the bug is protected by a test      → run it, see green
```

### AI-4. It does not know our codebase. Search before you accept.

An assistant writes a new helper because it cannot see that `add_xp()`,
`spend_fuel()`, `validate_image_upload()` or `_owned_session_or_none()` already
exist. That is how we ended up with 700 lines of duplicated CRUD in `admin_api`.

Before accepting anything that looks like a utility: grep for it. If it exists,
use it. If the existing one is wrong, fix that one — do not add a second.

### AI-5. Give it our rules, not just our question.

An assistant with no context writes generic Django. Paste the relevant rule from
Part 2 into your prompt, along with the actual file you are editing.

```
Weak                          Good
"add an endpoint to buy an    "Add a purchase endpoint. Our rules:
 item"                         - the client never sends the price
                               - balance check and debit in one transaction
                                 with select_for_update
                               - use the existing spend_fuel() helper
                               - validate with a DRF serializer, never int()
                              Here is the current view and models file: ..."
```

### AI-6. Run it before you believe it.

Assistants invent things that sound right: model fields we do not have, DRF
options that do not exist, npm packages nobody published. It will be fluent and
specific about all of them. Nothing counts until the test suite runs it. "It
looks correct" is not evidence.

### AI-7. Never paste secrets or real user data into a prompt.

No `.env` contents, no API keys, no database dumps, no rows from
`accounts_user`. Our users are 10 to 18 years old and we hold their names, email
addresses and dates of birth. Sending that to a third party is not a style
question.

Need realistic data to debug with? Make it up, or use the test factories.

### AI-8. Small diffs. Refuse the big rewrite.

When you ask for a small change and get 400 lines back, do not paste it in. Ask
again for the minimal change. A diff nobody can review is a diff nobody did
review.

Same rule as everyone else: one ticket, one concern, one branch. An assistant
will happily "improve while it is in there". Do not let it.

### AI-9. Never weaken a check to make something pass.

Ask an assistant why a test fails and it may suggest loosening the assertion,
widening a permission, or deleting the awkward case. If a security test is in
your way, the test is right and your change is wrong.

Deleting or relaxing an existing test needs the reviewer's explicit agreement,
and a sentence in the PR saying why the behaviour it protected is no longer
wanted.

### AI-10. Its comments can be confidently wrong.

Generated comments describe what the code was probably meant to do, which is not
always what it does. A wrong comment is worse than no comment — the next reader
trusts it instead of reading. Read every comment you keep. Delete the ones that
restate the code. Write the *why* yourself.

### AI-11. Say so in the PR.

One line: *"structure drafted with AI, reviewed and tested by me"*, or *"written
by hand"*. Nobody is judged for either. It tells the reviewer where to look
hardest, and that is worth more than the appearance of having done it all
yourself.

### AI-12. What it is genuinely good at — use it there.

- **Explaining unfamiliar code.** Paste a file you inherited and ask what it
  does. Then verify.
- **Enumerating edge cases.** "What inputs would break this?" is where it
  shines, and it is exactly the question we kept failing to ask.
- **Boring, checkable work.** Test scaffolding, repetitive serializers,
  translation stubs.
- **Being a rubber duck at 2am** when nobody is awake to answer.
- **Reviewing your own diff before a human sees it.** "What is wrong with this?"
  catches the embarrassing ones.

Where it is weak: deciding what to build, judging whether a trade-off suits
*our* project, and anything where being plausible is easier than being right.

---

# Part 2 — Writing code

Twelve rules. Each is followed by the bug in this repository that it would have
stopped.

### C-1. The client is never the source of truth

The browser reports *what happened*. The server decides *what it is worth*.
Never accept a score, an amount, a price or a permission from a request body and
store it as fact.

```python
# was                              # now
xp = int(request.data.get('xp'))   score = grade(session, answers)
profile.add_xp(xp)                 profile.add_xp(score * XP_PER_CORRECT)
```

> **Where it bit us:** `POST /gamification/grant/` took any number the browser
> sent. One request produced level 101. The endpoint is deleted, not validated —
> there was no safe version of that shape.

### C-2. Every object lookup checks who is asking

An id in a URL is a request, not a permission. Filter by owner in the query —
never fetch first and check later, and never rely on ids being hard to guess.

```python
# was                                       # now
QuizSession.objects.get(id=session_id)      QuizSession.objects.filter(
                                                id=session_id, user=request.user
                                            ).first()
```

> **Where it bit us:** quiz session ids are sequential and both submit and result
> were `AllowAny`. Anyone could read a classmate's answers by counting upwards,
> or close their unfinished test for them.

### C-3. Choose the serializer by role, everywhere the data appears

If a field is secret it is secret in the list endpoint, the detail endpoint, and
anywhere it is nested inside another serializer. Grep the field name before you
call it fixed.

> **Where it bit us:** we fixed the answer-key leak in the challenges app and
> shipped it. The identical leak was still live in the courses app in three more
> places, one of them nested inside the lesson detail.

### C-4. Validate input with a serializer, not `int()`

Anything from a query string or a request body is a string of unknown shape.
Give it a typed field with bounds. A caller mistake is a `400` with a message; a
`500` is our mistake.

> **Where it bit us:** eight endpoints returned `500` to `?min_price=abc`. With
> the settings bug below, each rendered Django's debug page carrying
> `SECRET_KEY` and the database URL.

### C-5. Read-modify-write on a balance is a bug

Any counter two requests can touch needs `select_for_update()` inside a
transaction, or an `F()` expression.

```python
# was                          # now
if profile.fuel < cost:        with transaction.atomic():
    return error                   row = Profile.objects.select_for_update().get(pk=pk)
profile.fuel -= cost               if row.fuel < cost:
profile.save()                         return False
                                   row.fuel -= cost
                                   row.save(update_fields=['fuel'])
```

> **Where it bit us:** two purchases fired together both read the same balance
> and both passed. The user got two items for the price of one.

### C-6. One helper per state change — never write the field directly

If `add_xp()` exists, nothing else may touch `profile.xp`. The moment there are
two paths, one of them forgets a step.

> **Where it bit us:** `add_xp()` recomputed the level; three call sites wrote
> `profile.xp += n` instead. Three perfect quizzes left a student on 450 XP and
> still level 1.

### C-7. Configuration fails closed

A missing or misspelled environment variable produces the *safe* behaviour, or
refuses to start. Never the permissive one.

```python
# was                                  # now
if DJANGO_ENV == 'production':         if DJANGO_ENV.strip().lower() == 'development':
    from .production import *              from .development import *
else:                                  else:
    from .development import *             from .production import *
```

> **Where it bit us:** a typo, a trailing space or an unset variable silently
> booted development — `DEBUG=True`, CORS open to everyone, and the sign-in code
> returned in the response body. That last one is a two-request takeover of any
> account.

### C-8. Security randomness comes from `secrets`

`random` is for shuffling quiz questions. Codes, tokens and anything an attacker
gains from predicting use `secrets`, compared with `hmac.compare_digest`, with
failed attempts counted.

> **Where it bit us:** sign-in codes came from `random.randint`, whose internal
> state is recoverable from a handful of observed outputs.

### C-9. Know what your base class does before you inherit it

Read the parent method you are relying on, especially anything that returns
`None` to mean "skip".

> **Where it bit us:** our login throttle extended `AnonRateThrottle`, whose
> `get_cache_key()` returns `None` — no limit — as soon as the caller is
> authenticated. One throwaway account bought unlimited password guesses, and the
> code looked perfectly correct.

### C-10. Never swallow an exception

`except Exception: pass` is banned, and so is an empty `catch {}`. Catch the
specific error; handle it or log it.

> **Where it bit us:** the frontend caught every failure from `fetchMe` and
> logged the user out. One 502 from a cold-starting backend threw people out of
> their account.

### C-11. Personal data is opt-in, children's doubly so

Our users are 10 to 18. Before any field enters a public response, ask what it
lets a stranger learn about a specific child. Real names, photos, email
fragments and locations do not belong in anonymous endpoints.

> **Where it bit us:** the public leaderboard returned first name, last name and
> a link to the child's photo in a public bucket, with a username generated from
> their email address.

### C-12. Delete dead code the moment you notice it

Unreachable code is not free. It gets read, trusted, and eventually re-enabled
by someone who assumes it works.

> **Where it bit us:** `cosmic-silk-road.html` sat unlinked in `public/` for
> months. Nobody used it, so nobody maintained it, so nobody noticed it reported
> a successful login for any password and would post credentials to any host
> given in a query parameter — on the real domain.

## House conventions

| Area | Rule |
|---|---|
| File size | 200–400 lines normal, 800 hard ceiling. Split by feature, not by file type. `SpaceRunScene.jsx` at 2097 lines is the counter-example. |
| Functions | Under 50 lines, nesting depth 4 maximum. |
| Immutability | Never mutate arguments or state. `return {...user, name}`. |
| Logging | No `console.log` in merged code. Python uses `logging`, never `print`. |
| Comments | Explain *why*, never *what*. A comment naming the bug it prevents is worth ten that restate the code. |
| Naming | Name things the way a user would: a person manages *notifications*, not *webhook config*. |
| Language | Code, comments, commits, tickets and PRs in English. UI strings only from the locale files. |
| i18n | Every new key lands in `en`, `uz` and `ru` in the same commit. CI enforces it. We are at 1007 keys with perfect parity. |
| Secrets | Never in the repo. Never in a `VITE_*` variable — Vite inlines those into the public bundle. |
| Queries | `select_related` / `prefetch_related` / `annotate(Count(...))`. A `.count()` inside a serializer field runs once per row. |
| Migrations | Model change and its migration in the same commit. |
| Dependencies | Adding one needs a reason in the PR. Removing an unused one needs none. |

---

# Part 3 — Running the project

## The six steps

1. **Claim** a ticket and assign it to yourself.
2. **Reproduce** the bug, or write down exactly what the feature must do.
3. **Write the test first.** Run it. It must fail, for the reason you expect.
4. **Make it pass** with the smallest change. No unrelated tidying.
5. **Open a PR.** One reviewer; the lead also reviews auth, currency and
   personal data.
6. **Merge** on green CI plus approval. Squash.

Branches: `fix/<slug>`, `feat/<slug>`, `chore/<slug>`. Never commit to `main`.

Commits: `<type>: <what changed>` where type is one of
`feat fix refactor docs test chore perf ci`. The body explains **why** and names
the ticket.

CI runs all of this; run it yourself first, it is faster than waiting:

```bash
cd backend  && python manage.py test apps base        # 131/131
cd backend  && python manage.py check --deploy
cd backend  && python manage.py makemigrations --check --dry-run
cd frontend && npm test                               # 71/71
cd frontend && npm run build
cd frontend && npm run check:locales
```

## Tickets

- One ticket, one concern. Found a second problem? File it, do not fold it in.
- A bug ticket needs reproduction steps. Without them it is a rumour.
- A feature ticket needs acceptance criteria written before any code. "Done"
  must be checkable by someone who is not you.
- Nothing goes to review without a ticket. Untracked work is invisible work, and
  invisible work gets done twice.
- Anything you found and did not fix becomes a ticket before you close yours.

## Talking to each other

- **Daily, three sentences, written:** what you finished, what you are on, what
  is in your way.
- **Blocked? Say it the same day,** not at the deadline. A blocked ticket nobody
  knows about is the most expensive kind.
- **Thirty minutes stuck, then ask.** Nobody is judged for asking. People are
  judged for burning a day on a two-minute question.
- **Ask well:** what you are trying to do, what you tried, what happened, and the
  exact error text — pasted, not screenshotted.
- **"I do not understand this code" is a valid ticket.** If you cannot follow it,
  neither will the next person.
- **Disagree in the open,** with a reason. A decision nobody argued with usually
  means nobody read it.

## Review checklist

The reviewer's job is not to admire the code. It is to find the thing that will
break. If you approve without reading the diff, the bug is yours too.

- [ ] **Does a test fail without this change?** Check out the branch, revert the
      source file, run the test. If it still passes, the test is decoration.
- [ ] **Who is allowed to call this?** Name the permission class out loud. If it
      is `AllowAny`, say why that is correct.
- [ ] **What does it do with rubbish input?** Empty, missing, wrong type,
      negative, 10 000 items.
- [ ] **What if two people do this at once?** Especially a balance, a counter or
      a unique row.
- [ ] **Does any new response field tell a stranger something about a child?**
- [ ] **Does the same bug exist elsewhere?** Grep the pattern across both apps.
      Ours usually did.
- [ ] **Is anything swallowed?** Search the diff for `except Exception` and
      `catch {}`.
- [ ] **Would this break an existing client?** A changed response shape needs the
      frontend change in the same PR.
- [ ] **Can the author explain it?** Pick a line and ask. Especially on an
      AI-assisted PR.

Be specific and be kind. "This crashes when `answers` is empty" beats "needs
validation". Say what you would do, not only what is wrong. Say what is good out
loud — a review that is only ever complaints stops being read carefully.

As the author: a review comment is not an attack. Disagree with a reason, or
just fix it. No apologies needed.

## Definition of done

Seven things. Six out of seven is not done.

1. It works, and you saw it work — not "should work".
2. A test covers it, and fails without your change.
3. CI is green: tests, deploy checks, migrations, build, locale parity.
4. Someone else reviewed and approved the diff.
5. New user-facing strings exist in all three locales.
6. The PR body says why, and how AI was used if it was.
7. Anything found but not fixed is a new ticket.

## Releases and incidents

- **Never deploy on a Friday** or when the person who wrote the change is
  unreachable.
- **Deploy small and often.** A release containing one change is trivial to roll
  back; one containing twelve is a debugging session.
- **Watch it after.** Load the site, sign in, open a lesson, finish a quiz. Two
  minutes.
- **Something broke in production?** Roll back first, diagnose second. Users come
  before curiosity.
- **Every incident gets a written note:** what broke, how we noticed, what we
  changed, and the test that now covers it. No blame — we are looking for the
  missing check, not the guilty person.

---

# Part 4 — The five roles

One each. You own your lane's health, not only your tickets: if something in
your area is broken and unticketed, that is yours to notice. Lanes rotate every
sprint, because the two-content-models problem is exactly what happens when only
one person understands a part of the system.

## 1. Backend & API

> Every endpoint's authorisation is yours. If a stranger can read something they
> should not, that is your lane regardless of who wrote the line.

- **Owns:** Django apps, views, serializers, permissions and throttles, the data
  model, migrations, the gamification economy.
- **Every change:** name the permission class; type every input field; lock every
  balance write; ship the migration alongside.
- **Never:** trust a number from the client; add `AllowAny` to make something
  work; fetch by id without an owner filter; put a secret field in a default
  serializer.

## 2. Frontend & UI

> Everything a user touches. If the app shows a wrong number or a blank screen,
> it is yours to find — even when the cause turns out to be the API.

- **Owns:** views, components, routing, Zustand stores, the API client, the 3D
  scenes and the game, accessibility, mobile layout.
- **Every change:** check the endpoint's real response shape; handle loading,
  empty and error states; clean up every effect you start; test on a phone-sized
  viewport.
- **Never:** hardcode a user-facing string; treat local state as authoritative;
  assume a list endpoint is unpaginated; leave a `catch {}` empty.

## 3. Content & i18n

> You decide what a lesson *is*. The teaching quality of this platform is your
> lane — a bug-free app that teaches badly has failed.

- **Owns:** lessons, problems, quiz questions, all three locale files, seed
  commands, factual accuracy of every claim.
- **Every change:** all three languages in the same commit; every answer index in
  range; astronomy verified against a source; seeds idempotent and runnable.
- **Never:** ship a key in one language only; let a seed print success after
  doing nothing; put content in `src/data/*.js` — it belongs in the database.

## 4. Quality & release

> You are allowed to block a merge, and you are expected to use that. You are the
> reason a fixed bug stays fixed.

- **Owns:** the 202-test suite and CI, deploys and rollbacks, the asset pipeline
  and bundle size, incident notes.
- **Every week:** confirm CI is green on `main`; check no test was quietly
  deleted; watch the bundle and repo size; run a full manual pass of the site.
- **Never:** approve a PR whose test you did not see fail; let a red build merge
  "just this once"; deploy a change you cannot roll back.

## 5. Research & docs

> You produce decisions, not features. When the team is about to build something
> big, you are the one who finds out what it actually costs first.

- **Owns:** spikes before large work, written decision records in `docs/adr/`,
  keeping the README and this file true, evaluating libraries before adoption.
- **A spike ends with:** the options honestly stated, what each costs, your
  recommendation and why, and what you are still unsure about.
- **Never:** exceed the two-day timebox silently — needing longer is itself the
  finding; merge prototype code; recommend without having run it.

**Review pairing.** Backend reviews Frontend and vice versa. Content and
Research review each other. Quality reviews anyone; everyone reviews Quality.
Nobody reviews only their own lane — you find more in code you did not expect.

---

# Part 5 — Getting set up

```bash
# backend
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env        # set SECRET_KEY, DJANGO_ENV=development
python manage.py migrate
python manage.py seed         # 3 levels, 6 units, 12 lessons, 8 badges
python manage.py createsuperuser
python manage.py runserver

# frontend, second terminal
cd frontend
npm install
copy .env.example .env        # VITE_API_URL=http://localhost:8000/api/v1
npm run dev                   # http://localhost:3000
```

Generate a real secret key — never reuse the example one:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Run one test class while you work:

```bash
python manage.py test apps.challenges.tests.QuizScoringTests -v2
npx vitest run src/lib/api.test.js
```

---

Rules are versioned. If one of these gets in the way of good work, argue with
it — bring the case and we will change it. What is not negotiable: tests before
fixes, review before merge, the server never trusting the client, and you
understanding every line you sign your name to.
