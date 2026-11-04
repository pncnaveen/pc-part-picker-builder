import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { HealthStatus } from '../features/health/components/HealthStatus';
import { useApiHealth } from '../features/health/hooks/useApiHealth';

export function HomePage() {
  const loadState = useApiHealth();

  return (
    <main className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">PC Part Picker Builder</h1>
        <p className="text-sm text-muted-foreground">
          India catalog POC — plan builds with server-owned compatibility.
        </p>
      </div>

      <Card aria-live="polite">
        <CardHeader>
          <CardTitle>API health</CardTitle>
          <CardDescription>Live status from the Nest API health endpoint.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadState.phase === 'loading' ? (
            <p className="text-sm text-muted-foreground">Checking API…</p>
          ) : (
            <HealthStatus result={loadState.result} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
