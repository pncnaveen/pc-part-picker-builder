import type { HttpClient } from '../../ports/http-client.port';
import { AxiosHttpClient } from './axios-http-client';

export function createHttpClient(baseUrl: string): HttpClient {
  return new AxiosHttpClient(baseUrl);
}
