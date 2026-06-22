import { env } from '@/lib/env';
import axios, { AxiosHeaders } from 'axios';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
});

let accessToken: string | null = null;
const unauthorizedHandlers = new Set<() => void>();

export function setApiClientAccessToken(token: string | null) {
  accessToken = token;
}

export function onApiUnauthorized(handler: () => void) {
  unauthorizedHandlers.add(handler);

  return () => {
    unauthorizedHandlers.delete(handler);
  };
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const message = error.response?.data?.message;

  if (
    Array.isArray(message) &&
    message.every((item) => typeof item === 'string')
  ) {
    return message.join(' ');
  }

  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  return fallbackMessage;
}

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  } else {
    headers.delete('Authorization');
  }

  config.headers = headers;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      unauthorizedHandlers.forEach((handler) => {
        handler();
      });
    }

    return Promise.reject(error);
  },
);
