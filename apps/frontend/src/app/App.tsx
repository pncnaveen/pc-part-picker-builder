import { HealthStatus } from '../features/health/components/HealthStatus';
import { useApiHealth } from '../features/health/hooks/useApiHealth';

export function App() {
  const loadState = useApiHealth();

  return (
    <main>
      <h1>PC Part Picker Builder</h1>
      <section aria-live="polite">
        <h2>API health</h2>
        {loadState.phase === 'loading' ? (
          <p>Checking API…</p>
        ) : (
          <HealthStatus result={loadState.result} />
        )}
      </section>
    </main>
  );
}
