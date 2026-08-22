# Credential exposure — 22 August 2026

**Status:** open. Step 1 has not been done yet and does not depend on anything else.

---

## What happened

`backend/db.sqlite3` was committed and later deleted in `a9f301f`
("fix: remove database from git tracking"). Deleting a file in a later commit
removes it from the working tree, not from history — the blob is still one
command away:

```bash
git show a9f301f^:backend/db.sqlite3 > leaked.sqlite3
```

757,760 bytes, a valid SQLite file. It contains:

| | |
|---|---|
| `accounts_user` | 9 rows |
| password hashes | 12 × `pbkdf2_sha256` |
| **superusers** | **2** — `qweqwe` / admin@admin.admin, `admin1` / admin1@admin.com |
| personal data | email addresses and dates of birth, including of minors |
| `django_session` | 2 rows |

**The repository is public.** `github.com/asilbekmurodqobilov05-hash/space-edu`
reports `visibility: public`, forking allowed. Anyone who clones it has this
file. This is not a hypothetical risk; treat every credential in it as known to
third parties.

Some of the rows look like throwaway test accounts (`qwe`, `qqq`, `john.doe`).
Two do not: a personal Gmail address, and both superusers.

---

## Step 1 — do this first, it needs nothing else

Rotating the credentials is what actually ends the exposure. It is independent
of anything to do with git, and it should not wait for the history rewrite.

```bash
cd backend

# 1. Change both superuser passwords
python manage.py changepassword qweqwe
python manage.py changepassword admin1

# 2. Force every other listed account to reset
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

leaked = [
    'cosmonauttest', 'yusuf', 'alisher', 'shokhanasserprojr',
    'john.doe', 'qweqweqwe', 'qqq',
]
# set_unusable_password() means the old hash stops working and the account can
# only come back through the e-mail sign-in flow.
for u in User.objects.filter(username__in=leaked):
    u.set_unusable_password()
    u.save(update_fields=['password'])

# 3. Clear sessions and blacklist outstanding refresh tokens
from django.contrib.sessions.models import Session
Session.objects.all().delete()

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
for token in OutstandingToken.objects.all():
    BlacklistedToken.objects.get_or_create(token=token)
```

If the same password was reused anywhere else — Railway, Vercel, the GitHub
account itself — change it there too.

Also rotate anything that was ever in a `.env` alongside this: `SECRET_KEY`
(rotating it invalidates every existing session and JWT, which is what we want
here), the Cloudflare R2 keys, and `GEMINI_API_KEY`.

---

## Step 2 — remove the blob from history

Do this **after** `fix/audit-critical` is reviewed and merged into `main`.
Rewriting history renames every commit, so doing it while a branch is
outstanding means rebasing that branch onto a history it no longer shares.

`git-filter-repo` is not installed:

```bash
pip install git-filter-repo
```

Then, from a fresh clone — `filter-repo` refuses to run on a repository with
extra remotes or uncommitted work, by design:

```bash
git clone https://github.com/asilbekmurodqobilov05-hash/space-edu.git space-edu-clean
cd space-edu-clean

# check what is about to go
git rev-list --objects --all | grep db.sqlite3

git filter-repo --invert-paths --path backend/db.sqlite3

# filter-repo drops the remote on purpose, so it cannot force-push by accident
git remote add origin https://github.com/asilbekmurodqobilov05-hash/space-edu.git

# verify before pushing: this must print nothing
git rev-list --objects --all | grep db.sqlite3

git push --force --all
git push --force --tags
```

Everyone else then re-clones. Do not merge an old clone back in — it would
reintroduce the whole rewritten history.

### While you are there: the 246 MB of old assets

The same rewrite is the moment to drop the superseded binaries. The working tree
is already down to 20 MB, but history still carries the originals, so a fresh
clone is around 250 MB:

```bash
git filter-repo --invert-paths \
  --path backend/db.sqlite3 \
  --path-glob 'frontend/public/images/**/*.png' \
  --path-glob 'frontend/public/models/**/*.glb'
```

The current compressed versions are in the latest commit and are unaffected —
only the historical blobs go.

---

## Step 3 — what the rewrite does not fix

**GitHub keeps unreferenced objects reachable by SHA.** After a force-push, the
old commit is no longer on any branch, but
`github.com/<owner>/<repo>/commit/<sha>` and the API still serve it until
GitHub's garbage collection runs, which is not on a schedule you control.

Two ways to close that:

1. **Ask GitHub Support** to purge the cached views, quoting the repository and
   saying credentials were exposed. This is the documented route and they do it.
2. **Delete and recreate the repository.** Fastest and certain. Costs the stars,
   the issues and the watch list — currently 1 star, 0 issues, 0 forks, so the
   cost here is close to nothing.

**Forks would keep a full copy.** There are 0 today. Check again before you
start; if one has appeared, the fork's owner has to delete it themselves.

---

## Why this happened, and what stops the next one

`.gitignore` listed `backend/db.sqlite3`, but a file that is *already tracked*
stays tracked — `.gitignore` only affects untracked files. Nobody ran
`git rm --cached`.

CI now fails the build if a `.env` or a `*.sqlite3` is tracked, if compiled
Python is tracked, if a `VITE_*` secret has a value outside `.env.example`, or
if something matching an API key pattern is committed. See the `hygiene` job in
`.github/workflows/ci.yml`.
