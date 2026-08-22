import { useEffect, useState } from 'react';

import api from '@/lib/api';

/**
 * Live lesson counts for the /learn landing cards, keyed by sphere slug.
 *
 * The cards carried hand-written counts, and every one of them was wrong by a
 * factor of three to six — physics claimed 24 lessons against 144 real ones,
 * astronomy 32 against 126. They were the fifth copy of content metadata in
 * the project (ADR 0001 removed the other three), and nothing kept them honest
 * because nothing else read them.
 *
 * `Sphere.lessons_count` is computed by `seed_learn_content` from the leaves of
 * the real tree, so this is the number that stays true as content is edited.
 *
 * Returns `{}` until the request lands, and on failure — the caller keeps its
 * own copy as the fallback, so a backend outage costs an out-of-date number
 * rather than a broken page.
 */
export function useSphereSummaries() {
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    let cancelled = false;

    api.get('/courses/spheres/')
      .then(({ data }) => {
        if (cancelled) return;
        // The list endpoint is paginated for anonymous callers and bare for
        // some others; accept both rather than silently reading nothing.
        const rows = Array.isArray(data) ? data : (data?.results ?? []);
        setSummaries(Object.fromEntries(rows.map((row) => [row.slug, row])));
      })
      .catch(() => {
        // Keep {} and let the caller fall back.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return summaries;
}
