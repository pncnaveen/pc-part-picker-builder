import { DEFAULT_API_BASE_URL } from './constants';

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  return configured && configured.length > 0 ? configured : DEFAULT_API_BASE_URL;
}
