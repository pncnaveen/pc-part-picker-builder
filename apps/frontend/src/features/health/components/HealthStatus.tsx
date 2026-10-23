import type { HealthFetchResult } from '../../../api/types/health.types';

export function HealthStatus({ result }: { result: HealthFetchResult }) {
  if (result.kind === 'ok') {
    const { health } = result;
    return (
      <>
        <p>Status: {health.status}</p>
        <p>Database: {health.checks.database}</p>
      </>
    );
  }

  return (
    <>
      <p>{result.message}</p>
      {result.health ? (
        <>
          <p>Status: {result.health.status}</p>
          <p>Database: {result.health.checks.database}</p>
        </>
      ) : null}
    </>
  );
}
