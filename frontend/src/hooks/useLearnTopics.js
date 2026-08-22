import { useEffect, useState } from 'react';

import { STATIC_TOPICS, fetchSubjectTopics } from '@/lib/learnContent';

/**
 * The topics for one subject, from the API, falling back to the file.
 *
 * Returns the static data on the first render rather than a loading state: the
 * screens render synchronously from a module today, and handing them `null`
 * while a request is in flight would put a spinner on every learn page. The
 * API answer replaces it when it lands.
 *
 * `source` says which one you are looking at, which is what the tests assert on.
 */
export function useLearnTopics(subject) {
  const [topics, setTopics] = useState(() => STATIC_TOPICS[subject] ?? {});
  const [source, setSource] = useState('static');

  useEffect(() => {
    let cancelled = false;
    setTopics(STATIC_TOPICS[subject] ?? {});
    setSource('static');

    fetchSubjectTopics(subject)
      .then((fromApi) => {
        if (cancelled || !fromApi) return;
        setTopics(fromApi);
        setSource('api');
      })
      .catch(() => {
        // Keep the static copy. A learn page that renders slightly stale
        // content beats one that renders nothing because the API is down.
      });

    return () => {
      cancelled = true;
    };
  }, [subject]);

  return { topics, source };
}
