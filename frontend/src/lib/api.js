import axios from 'axios';
import { getCosmicSilkRoadUrl } from '@/lib/externalAuthUrl';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Set lazily from useAuthStore to avoid circular dep
let _getAccess = () => null;
let _getRefresh = () => null;
let _onLogout = () => { window.location.href = getCosmicSilkRoadUrl(); };

export const setupApiAuth = (getAccess, getRefresh, onLogout) => {
  _getAccess = getAccess;
  _getRefresh = getRefresh;
  _onLogout = onLogout;
};

api.interceptors.request.use((config) => {
  const token = _getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status !== 401) return Promise.reject(error);
    const refresh = _getRefresh();
    if (!refresh) { _onLogout(); return Promise.reject(error); }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
        { refresh }
      );
      _getAccess = () => data.access;
      error.config.headers.Authorization = `Bearer ${data.access}`;
      return api(error.config);
    } catch {
      _onLogout();
      return Promise.reject(error);
    }
  }
);

export default api;
