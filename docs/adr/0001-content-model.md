# ADR 0001 — One content model

**Status:** accepted 22 August 2026 — Option A
**Date:** 2026-08-22
**Ticket:** R1
**Decides:** C1, and whether the `/learn` section can ever be edited without a deploy

---

## The problem

The project carries two complete content models plus a third copy of the actual
content, and no single one of them works end to end.

| | Branch A — `Sphere` | Branch B — `Level` | Static files |
|---|---|---|---|
| Shape | Sphere → Topic → TopicLesson → SubLesson | Level → Unit → Lesson → LessonSection → QuizQuestion | `src/data/*TopicsData.js` |
| Admin UI | **yes** — spheres, topics, lessons tabs | none | none, it is code |
| Frontend reads it | **never** — 0 of 5 endpoints | 2 endpoints, from 2 orphan routes | **11 of 13 learn screens** |
| Holds real content | empty | 3 levels, 6 units, 12 lessons from `seed` | 23 topics, 48 named items, 66 videos |
| Progress tracking | none | `UserLessonProgress`, `UserUnitEnrollment` | none |

Read the columns and the failure is obvious: **the branch with an editor has no
readers, the branch with readers has no editor, and the content lives in
neither.** An administrator can spend an afternoon writing lessons in the panel
and nothing changes on the site.

The two routes that do reach branch B — `/unit/:unitId` and
`/lesson/:unitId/:lessonId` — are not linked from the navigation. Progress
tracking and lesson XP therefore work only on pages a student cannot reach.

## Options

### A. Keep the Sphere branch, delete the Level branch

The content that exists is 23 topics containing lessons, containing sub-lessons,
each with a video URL. That is exactly the shape of Branch A. It is not the
shape of Branch B, which expects a Level → Unit hierarchy the content does not
have — which is also why `seed_courses` targets level slugs (`mercury`, `venus`)
that were never created.

Branch A already has the expensive half built: three working admin tabs.

**Cost.** Branch A has no progress tracking and no per-lesson quiz. Both need
adding:

- `UserLessonProgress.lesson` and `UserUnitEnrollment.unit` are the only two
  foreign keys pointing into Branch B from outside `courses`. Repoint them at
  `TopicLesson` and `Topic`. The tables hold no production rows worth keeping.
- Per-lesson quizzes: the `challenges` app already owns a question bank that is
  actually used, with categories, difficulties and a working submit flow. Add a
  nullable `TopicLesson` foreign key to `ChallengeQuestion` rather than reviving
  `courses.QuizQuestion`, which is a second question model nobody reads.

Then migrate `src/data/*TopicsData.js` into the database and point the 11 learn
screens at the API.

### B. Keep the Level branch, delete the Sphere branch

Branch B is richer on paper: `LessonSection` gives a lesson structured content
blocks, and it already has progress tracking wired.

**Cost.** Everything else. It has no admin UI, so one must be built from
nothing. The content does not fit its hierarchy, so 23 topics have to be
reshaped into levels and units — an editorial exercise, not a migration script.
And its `QuizQuestion` duplicates the `challenges` question bank, so keeping it
means maintaining two.

### C. Keep both, connect the Sphere branch to the frontend

Tempting because it looks like less work today. It is the current situation with
one more reader added, and it doubles the cost of every future content change:
two models, two admin surfaces, two migration paths, and a permanent question of
which one a given lesson lives in.

## Recommendation

**Option A.** The deciding fact is not that Branch A is better designed — it is
that Branch A's shape already matches the content, and its editor already
exists. Branch B's advantages are advantages on an empty table.

Suggested order, each step shippable on its own:

1. Point `UserLessonProgress` and `UserUnitEnrollment` at `TopicLesson` and
   `Topic`. Delete `Level`, `Unit`, `Lesson`, `LessonSection`,
   `courses.QuizQuestion` and their viewsets, serializers and routes.
2. Delete `seed_courses` — with the levels gone it has nothing to target, which
   is why it currently refuses to run (ticket C1 closes here).
3. Write a `seed_learn_content` command that loads the four `*TopicsData.js`
   files into `Sphere`/`Topic`/`TopicLesson`/`SubLesson`. Idempotent, keyed on a
   stable slug rather than `(parent, order)` — see the duplicate-key problem the
   audit found in the other seeds.
4. Move the 11 learn screens onto the API, one subject at a time. Keep the
   static file as the fallback until its subject is migrated, then delete it.
5. Add the nullable `TopicLesson` foreign key to `ChallengeQuestion` and wire
   the per-lesson quiz.

Steps 1–4 are done, and step 5 on the server. See "Still open" below.

Step 4 landed as an adapter rather than a rewrite of eleven screens. The API
tree is reshaped into the exact shape the static files gave (`lessons` of
strings, `lessons` with `subLessons`, or `sections` — chosen per topic by how
deep its content actually is), so each screen changed by one import. The static
file stays as the fallback when the API is unreachable, which also keeps the
site up during a backend outage. See `frontend/src/lib/learnContent.js`.

## What this does not settle

### Decided since, while implementing

**`SubLesson` does not survive.** It is replaced by a nullable
`TopicLesson.parent`. The deciding fact was not that four levels is one too
many — it is that four levels is also one too *few*. `interviewsTopicsData`
nests topic → section → lesson → sub-lesson, three levels below a topic, which
the fixed tree cannot hold at all. Measured off the generated fixture:

```
physics     max depth 1        astronomy   max depth 2
creativity  max depth 2        interviews  max depth 3
```

A self-reference holds all four, and the admin panel edits children through the
lessons tab it already has, so nothing had to be built for it. `topic` stays
set on every node, child included, so "every lesson in this topic" is one flat
filter rather than a recursive walk.

Only leaves are completable. A node with children is a heading; letting one be
completed would pay for the parent and each child, and would make the topic
total unreachable.

**How XP is earned.** `TopicLesson.xp_reward` (25) and `fuel_reward` (25),
matching what the client used to award itself, plus `Topic.fuel_reward` (50)
paid once when every leaf under a topic is done. All three are editable per row
in the admin panel. `POST /progress/lessons/<slug>/complete/` is the only way to
earn them and it reads the amount off the row — the caller sends a score and
nothing else. This also answers the first half of R2.

### Still open

**Where lesson text lives.** `TopicLesson.content` is still a bare `TextField`
described as "text/markdown", and nobody renders markdown. Unchanged by this
work: the seeded content is video-first and sets no lesson text at all. If
lessons need images, formulas and embedded quizzes, that field needs a real
answer before anyone writes into it.

**Per-lesson quizzes, on the client.** Step 5 is done server-side:
`ChallengeQuestion.lesson` exists, `POST /challenges/quiz/start/` takes a lesson
slug instead of a category, and the lesson tree carries `question_count` so a
screen can tell whether to offer one. Deleting a lesson is `SET_NULL`, so its
questions fall back into the category pool rather than disappearing.

What is missing is the screen. `QuizSessionView` runs entirely off the static
`quizData` and never calls the API, so putting a lesson quiz in front of a
student means moving that view onto the API first — a separate piece of work
with its own ten regression tests, not a step-5 tail. No question is attached to
a lesson yet either; that is content work for the admin panel.

## Measurements this is based on

Counted on 2026-08-22, commit `3a40d04`:

```
frontend references to /courses/ endpoints
  spheres 0   topics 0   topic-lessons 0   sub-lessons 0   problems 0
  levels  0   units  2   lessons       1   sections    0   questions 0

learn screens importing @/data/   11
learn screens importing @/lib/api  2

static content
  astronomyTopicsData    4 topics, 46 named items, 12 sub-lesson groups, 36 videos
  creativityTopicsData   2 topics,                  2 sub-lesson groups,  6 videos
  interviewsTopicsData   3 topics,  2 named items,  4 sub-lesson groups, 12 videos
  physicsTopicsData     14 topics,                  0 sub-lesson groups,  0 videos

foreign keys into the Level branch from outside apps/courses
  progress.UserLessonProgress.lesson -> courses.Lesson
  progress.UserUnitEnrollment.unit   -> courses.Unit
```
