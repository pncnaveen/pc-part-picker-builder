import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './AppRoutes';
import { AppShell } from './AppShell';

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  );
}
