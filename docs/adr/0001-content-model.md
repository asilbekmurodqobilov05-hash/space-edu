# ADR 0001 — One content model

**Status:** proposed, awaiting the lead's decision
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

Steps 1–3 are a few days. Step 4 is the bulk and is safely incremental.

## What this does not settle

- **Whether `SubLesson` should exist at all.** Three of the four subject files
  use it; `physicsTopicsData` has 14 topics and no sub-lessons. A flat
  Topic → Lesson tree with an optional parent might be simpler. Worth deciding
  before step 3, because it changes the seed.
- **Where lesson text lives.** `TopicLesson.content` is a bare `TextField`
  described as "text/markdown". Nobody renders markdown today. If lessons need
  images, formulas and embedded quizzes, that field needs a real answer first.
- **How XP is earned in the new tree.** Branch B awarded per lesson via
  `Lesson.xp_reward`; `TopicLesson` has no such field. Related to spike R2,
  which asks the same question about the two award paths that currently have no
  server endpoint at all.

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
