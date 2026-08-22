import { useCallback, useEffect, useState } from 'react';

import api from '@/lib/api';

/**
 * The Masalalar set, from the server.
 *
 * It used to come from `src/data/problemsData.js`, which carried the answer to
 * every problem straight into the browser bundle — the same solution key
 * `ProblemSerializer` had been hardened to keep out of the API. Closing one
 * door and leaving the other open is not closing it.
 *
 * The list endpoint returns questions only. Grading happens at
 * `POST /courses/problems/<id>/check/`.
 *
 * That file also held 145 entries of which 115 were generated filler —
 * "Masala #47: Bu yerda fizika masalasi matni bo'ladi" with an answer taken off
 * a cycling list. Only the 30 written ones were seeded, so the set is honestly
 * 30 now rather than dishonestly 145.
 */
export function useProblems() {
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    api.get('/courses/problems/?sphere=problems')
      .then(({ data }) => {
        if (cancelled) return;
        const rows = Array.isArray(data) ? data : (data?.results ?? []);
        setProblems([...rows].sort((a, b) => a.number - b.number));
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { problems, state };
}

/**
 * Grade one answer. Returns `{ correct, answer, explanation }`, or null if the
 * request failed — the caller has to say so rather than mark a correct answer
 * wrong because the network dropped.
 */
export async function checkProblem(problemId, answer) {
  try {
    const { data } = await api.post(`/courses/problems/${problemId}/check/`, { answer });
    return data;
  } catch (err) {
    if (err?.response?.status === 429) {
      return { throttled: true };
    }
    return null;
  }
}
