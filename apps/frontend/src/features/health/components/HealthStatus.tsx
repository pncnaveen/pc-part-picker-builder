import type { HealthFetchResult } from '../../../api/types/health.types';

export function HealthStatus({ result }: { result: HealthFetchResult }) {
  if (result.kind === 'ok') {
    const { health } = result;
    return (
      <dl className="grid gap-3 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium tabular-nums">{health.status}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Database</dt>
          <dd className="font-medium tabular-nums">{health.checks.database}</dd>
        </div>
      </dl>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      <p className="text-destructive" role="alert">
        {result.message}
      </p>
      {result.health ? (
        <dl className="grid gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium tabular-nums">{result.health.status}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Database</dt>
            <dd className="font-medium tabular-nums">{result.health.checks.database}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
