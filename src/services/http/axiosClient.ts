import axios, { type AxiosInstance } from 'axios';
import { getServerEnv } from '@/lib/env';

let serverInstance: AxiosInstance | null = null;
let browserInstance: AxiosInstance | null = null;

function isServer(): boolean {
  return typeof window === 'undefined';
}

function getServerApiClient(): AxiosInstance {
  if (serverInstance) return serverInstance;
  const env = getServerEnv();
  serverInstance = axios.create({
    baseURL: env.PHONE_API_URL,
    timeout: 15_000,
    headers: {
      'x-api-key': env.PHONE_API_KEY,
      Accept: 'application/json',
    },
  });
  serverInstance.interceptors.response.use(
    (r) => r,
    (error) => {
      const status = error?.response?.status ?? 'network';
      const url = error?.config?.url ?? '';

      console.error(`[api] ${status} ${url}`);
      return Promise.reject(error);
    },
  );
  return serverInstance;
}

function getBrowserApiClient(): AxiosInstance {
  if (browserInstance) return browserInstance;
  browserInstance = axios.create({
    baseURL: '/api',
    timeout: 15_000,
    headers: { Accept: 'application/json' },
  });
  return browserInstance;
}

export function getApiClient(): AxiosInstance {
  return isServer() ? getServerApiClient() : getBrowserApiClient();
}

export function getApiErrorStatus(error: unknown): number {
  if (axios.isAxiosError(error) && typeof error.response?.status === 'number') {
    return error.response.status;
  }
  return 502;
}

export { getServerApiClient };
