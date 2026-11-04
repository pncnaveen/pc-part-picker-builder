import { Route, Routes } from 'react-router-dom';

import { resolveRouteComponent } from './route-components';
import routeConfig from './routes.json';

export function AppRoutes() {
  return (
    <Routes>
      {routeConfig.map(({ path, component }) => {
        const Page = resolveRouteComponent(component);
        return <Route key={path} path={path} element={<Page />} />;
      })}
    </Routes>
  );
}
