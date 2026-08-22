"""Checks on the repository itself.

A broken workflow file is the one failure CI cannot report, because a workflow
that does not parse never runs: GitHub records a zero-second "startup failure"
against it and every job in it silently does not happen. That is worse than a
red build — it looks like nothing is wrong.

It happened here. A `find -printf "%s\\t%p\\n"` was edited by a script that
wrote a real tab and a real newline into the YAML instead of the two-character
escapes, which split a line in half and made the whole file unparseable. Every
check in it — tests, migrations, deployment, the secret scan — stopped running,
and the only signal was a grey cross.

These run in the ordinary test suite, so `manage.py test` catches it before a
push does.
"""
from pathlib import Path

from django.test import SimpleTestCase

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
WORKFLOWS = REPO_ROOT / '.github' / 'workflows'


def workflow_files():
    if not WORKFLOWS.is_dir():
        return []
    return sorted(WORKFLOWS.glob('*.yml')) + sorted(WORKFLOWS.glob('*.yaml'))


class WorkflowFileTests(SimpleTestCase):
    def setUp(self):
        try:
            import yaml  # noqa: F401
        except ImportError:  # pragma: no cover
            self.skipTest('PyYAML is not installed')

    def test_there_is_at_least_one_workflow(self):
        self.assertTrue(workflow_files(), 'no workflow files found — has CI gone?')

    def test_every_workflow_parses(self):
        import yaml

        for path in workflow_files():
            with self.subTest(workflow=path.name):
                try:
                    parsed = yaml.safe_load(path.read_text(encoding='utf-8'))
                except yaml.YAMLError as exc:
                    self.fail(f'{path.name} is not valid YAML: {exc}')
                self.assertIsInstance(parsed, dict, f'{path.name} parsed to nothing useful')

    def test_no_workflow_contains_a_literal_tab(self):
        """YAML forbids tabs as indentation, and a tab that arrives inside a
        run block is almost always an escape sequence that was written out as
        the character it stands for."""
        for path in workflow_files():
            with self.subTest(workflow=path.name):
                lines = path.read_text(encoding='utf-8').splitlines()
                offenders = [i + 1 for i, line in enumerate(lines) if '\t' in line]
                self.assertEqual(offenders, [], f'{path.name} has tabs on lines {offenders}')

    def test_ci_still_runs_the_checks_it_is_supposed_to(self):
        """A workflow that parses but has quietly lost a job is the next way
        this goes wrong."""
        import yaml

        ci = WORKFLOWS / 'ci.yml'
        self.assertTrue(ci.exists(), 'ci.yml is missing')
        parsed = yaml.safe_load(ci.read_text(encoding='utf-8'))
        self.assertEqual(set(parsed['jobs']), {'backend', 'frontend', 'hygiene'})

        steps = [
            step.get('name', '')
            for job in parsed['jobs'].values()
            for step in job['steps']
        ]
        for required in ('Run tests', 'Check for missing migrations', 'Deployment checks',
                         'Build', 'Tests', 'Locale parity', 'Large files'):
            self.assertIn(required, steps, f'CI no longer runs "{required}"')

    def test_the_frontend_builds_before_it_tests(self):
        """`src/bundleSecrets.test.js` reads `dist/` to check that no answer key
        or credential reached the browser. Run the tests first and it has
        nothing to read, so it passes without checking anything."""
        import yaml

        parsed = yaml.safe_load((WORKFLOWS / 'ci.yml').read_text(encoding='utf-8'))
        names = [step.get('name', '') for step in parsed['jobs']['frontend']['steps']]
        self.assertLess(
            names.index('Build'), names.index('Tests'),
            'the bundle-secrets test needs a build before it runs',
        )


class TrackedFileTests(SimpleTestCase):
    """The hygiene job checks these on the server. Checking them here too means
    a mistake is caught before the push rather than after it."""

    def _tracked(self):
        import subprocess

        result = subprocess.run(
            ['git', 'ls-files'], cwd=REPO_ROOT, capture_output=True, text=True, check=False,
        )
        if result.returncode != 0:  # pragma: no cover — not a git checkout
            self.skipTest('not a git working tree')
        return result.stdout.splitlines()

    def test_no_database_or_env_file_is_tracked(self):
        """`backend/db.sqlite3` was committed once and is still in the history;
        see docs/SECURITY-INCIDENT-2026-08-22.md."""
        offenders = [
            path for path in self._tracked()
            if path.endswith('.sqlite3') or path.split('/')[-1] == '.env'
        ]
        self.assertEqual(offenders, [])

    def test_no_compiled_python_is_tracked(self):
        offenders = [
            path for path in self._tracked()
            if path.endswith('.pyc') or '__pycache__' in path
        ]
        self.assertEqual(offenders, [])
