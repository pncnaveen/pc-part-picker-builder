import { getApiBaseUrl } from '../config';
import { API_PATHS } from '../paths';
import {
  REGISTER_ERROR_CODES,
  type RegisterFetchResult,
  type RegisterRequestBody,
  type RegisterResponseBody,
  type ApiErrorBody,
} from '../types/auth.types';
import { createHttpClient } from '../../infrastructure/http/create-http-client';
import { HttpRequestError, type HttpClient } from '../../ports/http-client.port';

function mapApiError(error: HttpRequestError): RegisterFetchResult {
  const body = error.data as ApiErrorBody | undefined;
  const code = body?.code ?? '';
  const message = body?.message ?? 'Registration failed.';
  const field = (body?.details as { field?: string } | undefined)?.field;

  if (code === REGISTER_ERROR_CODES.INVALID_EMAIL || field === 'email') {
    return { kind: 'field_error', code, message, field: 'email' };
  }
  if (code === REGISTER_ERROR_CODES.INVALID_PASSWORD || field === 'password') {
    return { kind: 'field_error', code, message, field: 'password' };
  }
  if (code === REGISTER_ERROR_CODES.EMAIL_ALREADY_REGISTERED) {
    return { kind: 'field_error', code, message, field: 'email' };
  }

  return { kind: 'recoverable_error', message };
}

export async function fetchRegister(
  payload: RegisterRequestBody,
  http: HttpClient = createHttpClient(getApiBaseUrl()),
): Promise<RegisterFetchResult> {
  try {
    const { data } = await http.post<RegisterResponseBody>(API_PATHS.register, payload);
    return { kind: 'success', response: data };
  } catch (error) {
    if (error instanceof HttpRequestError) {
      if (error.status >= 500 || error.status === 0) {
        return {
          kind: 'recoverable_error',
          message: 'Could not reach the server. Check your connection and try again.',
        };
      }
      return mapApiError(error);
    }

    return {
      kind: 'recoverable_error',
      message: error instanceof Error ? error.message : 'Registration failed.',
    };
  }
}
