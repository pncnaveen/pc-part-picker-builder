import type { HealthFetchResult } from '../../api/types/health.types';

/** UI/hook state for the health feature — not part of the HTTP API contract. */
export type ApiHealthLoadState =
  { phase: 'loading' } | { phase: 'ready'; result: HealthFetchResult };
