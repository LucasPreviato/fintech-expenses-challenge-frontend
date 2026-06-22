import { env } from '@/lib/env';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
});
