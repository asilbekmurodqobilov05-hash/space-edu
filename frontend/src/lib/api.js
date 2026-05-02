import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Set lazily from useAuthStore to avoid circular dep
let _getAccess = () => null;
let _getRefresh = () => null;
let _onLogout = () => {};
let _onTokenRefresh = (_newAccess) => {};

export const setupApiAuth = (getAccess, getRefresh, onLogout, onTokenRefresh) => {
  _getAccess = getAccess;
  _getRefresh = getRefresh;
  _onLogout = onLogout;
  if (onTokenRefresh) _onTokenRefresh = onTokenRefresh;
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
    // Only redirect to login if user was authenticated (had an access token).
    // Unauthenticated requests that get 401 should fail silently.
    if (!refresh) {
      if (_getAccess()) _onLogout();
      return Promise.reject(error);
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
        { refresh }
      );
      // Persist new access token in store — do NOT reassign _getAccess (breaks dynamic reads)
      _onTokenRefresh(data.access);
      error.config.headers.Authorization = `Bearer ${data.access}`;
      return api(error.config);
    } catch {
      _onLogout();
      return Promise.reject(error);
    }
  }
);

export default api;
