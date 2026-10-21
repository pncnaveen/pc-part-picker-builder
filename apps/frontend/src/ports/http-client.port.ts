export type HttpResponse<T> = {
  data: T;
  status: number;
};

export class HttpRequestError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'HttpRequestError';
    this.status = status;
    this.data = data;
  }
}

/** Transport port — application code depends on this, not on axios. */
export interface HttpClient {
  get<T>(path: string): Promise<HttpResponse<T>>;
}
