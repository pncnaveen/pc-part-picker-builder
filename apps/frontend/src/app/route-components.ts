import { type ComponentType } from 'react';

import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { HomePage } from './HomePage';

export const routeComponents = {
  HomePage,
  RegisterPage,
} satisfies Record<string, ComponentType>;

export type RouteComponentName = keyof typeof routeComponents;

export function resolveRouteComponent(name: string): ComponentType {
  if (!(name in routeComponents)) {
    throw new Error(`Unknown route component: ${name}`);
  }
  return routeComponents[name as RouteComponentName];
}
