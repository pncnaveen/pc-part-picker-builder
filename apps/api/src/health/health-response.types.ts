export type HealthChecks = {
  database: 'ok' | 'error';
};

export type HealthResponse = {
  status: 'ok' | 'error';
  checks: HealthChecks;
};
