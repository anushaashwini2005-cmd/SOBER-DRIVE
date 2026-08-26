import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Central Axios instance for the future FastAPI + MongoDB backend.
// Every service file below wraps this instance. If the backend is
// unreachable (e.g. during a hackathon demo), callers should catch
// the rejection and fall back to local/mock data — see each service
// file's `withFallback` usage.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('saferide_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Wraps an API call; if it rejects (backend not running), resolves
// with the provided fallback value instead of throwing, so the UI
// can keep working in demo/offline mode.
export async function withFallback(promise, fallbackValue) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    console.warn('[SafeRide] API unavailable, using fallback data.', err?.message);
    return fallbackValue;
  }
}

export default api;
