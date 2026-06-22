const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
} as const;

export { env };
