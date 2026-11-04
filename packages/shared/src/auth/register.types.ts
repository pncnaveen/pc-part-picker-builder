export type RegisterRequestBody = {
  email: string;
  password: string;
};

export type RegisterResponseBody = {
  accountId: string;
  message: string;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};
