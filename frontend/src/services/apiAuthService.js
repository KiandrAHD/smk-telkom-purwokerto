import { api } from './apiClient';

export async function apiLogin({ email, password }) {
  return api.post('/api/auth/login', { email, password });
}

export async function apiLogout() {
  return api.post('/api/auth/logout');
}

export async function apiMe() {
  return api.get('/api/auth/me');
}

export async function apiRegister({ email, password }) {
  return api.post('/api/auth/register', { email, password });
}
