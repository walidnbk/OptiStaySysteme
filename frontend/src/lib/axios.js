import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Laravel Sanctum: after GET /sanctum/csrf-cookie, send X-XSRF-TOKEN from the cookie on mutating requests (SPA / cross-origin).
api.interceptors.request.use((config) => {
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  if (match?.[1]) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
  }
  return config;
});

export default api;
