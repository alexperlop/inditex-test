import axios, { type AxiosInstance } from 'axios';
import { API, LOG } from '@/constants';
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
    timeout: API.TIMEOUT_MS,
    headers: {
      [API.HEADERS.API_KEY_HEADER]: env.PHONE_API_KEY,
      Accept: API.HEADERS.ACCEPT,
    },
  });
  serverInstance.interceptors.response.use(
    (r) => r,
    (error) => {
      const status = error?.response?.status ?? LOG.API_NETWORK;
      const url = error?.config?.url ?? '';

      console.error(`${LOG.API_PREFIX} ${status} ${url}`);
      return Promise.reject(error);
    },
  );
  return serverInstance;
}

function getBrowserApiClient(): AxiosInstance {
  if (browserInstance) return browserInstance;
  browserInstance = axios.create({
    baseURL: API.BROWSER_BASE_URL,
    timeout: API.TIMEOUT_MS,
    headers: { Accept: API.HEADERS.ACCEPT },
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
  return API.FALLBACK_STATUS;
}

export { getServerApiClient };
