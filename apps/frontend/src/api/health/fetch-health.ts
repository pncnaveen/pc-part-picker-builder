import { getApiBaseUrl } from '../config';
import { API_PATHS } from '../paths';
import type { HealthFetchResult, HealthResponse } from '../types/health.types';
import { createHttpClient } from '../../infrastructure/http/create-http-client';
import { HttpRequestError, type HttpClient } from '../../ports/http-client.port';

export async function fetchHealth(
  http: HttpClient = createHttpClient(getApiBaseUrl()),
): Promise<HealthFetchResult> {
  try {
    const { data } = await http.get<HealthResponse>(API_PATHS.health);
    return { kind: 'ok', health: data };
  } catch (error) {
    if (error instanceof HttpRequestError) {
      const health = error.data as HealthResponse;
      return {
        kind: 'error',
        message: `API health check failed (${error.status})`,
        health,
      };
    }

    const message = error instanceof Error ? error.message : 'Failed to reach API';
    return { kind: 'error', message };
  }
}
