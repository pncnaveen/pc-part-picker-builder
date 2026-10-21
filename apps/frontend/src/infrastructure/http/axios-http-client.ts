import axios, { type AxiosInstance } from 'axios';

import { HttpRequestError, type HttpClient, type HttpResponse } from '../../ports/http-client.port';

export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance;

  constructor(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl.replace(/\/$/, ''),
      withCredentials: true,
    });
  }

  async get<T>(path: string): Promise<HttpResponse<T>> {
    try {
      const response = await this.instance.get<T>(path);
      return { data: response.data, status: response.status };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpRequestError(error.message, error.response.status, error.response.data);
      }
      throw error;
    }
  }
}
