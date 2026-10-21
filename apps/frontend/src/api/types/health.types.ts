/** Wire shapes for `GET /health` — keep aligned with `apps/api/src/health/health-response.types.ts`. */

export type HealthChecks = {
  database: 'ok' | 'error';
};

export type HealthResponse = {
  status: 'ok' | 'error';
  checks: HealthChecks;
};

/** Client-side outcome of calling the health endpoint (not returned by the API). */
export type HealthFetchResult =
  | { kind: 'ok'; health: HealthResponse }
  | { kind: 'error'; message: string; health?: HealthResponse };
