import { useEffect, useState } from 'react';

import { fetchHealth } from '../../../api/health/fetch-health';
import type { ApiHealthLoadState } from '../types';

export function useApiHealth(): ApiHealthLoadState {
  const [loadState, setLoadState] = useState<ApiHealthLoadState>({ phase: 'loading' });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await fetchHealth();
      if (!cancelled) {
        setLoadState({ phase: 'ready', result });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return loadState;
}
