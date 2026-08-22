import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Set lazily from useAuthStore to avoid circular dep
let _getAccess = () => null;
let _getRefresh = () => null;
let _onLogout = () => {};
let _onTokenRefresh = (_newAccess, _newRefresh) => {};

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
      // The backend runs ROTATE_REFRESH_TOKENS with BLACKLIST_AFTER_ROTATION, so
      // this response carries a NEW refresh token and the one we just sent is
      // now blacklisted. Dropping data.refresh meant the next refresh went out
      // with a dead token and every user was forced back to /login about an
      // hour after signing in. Persist both.
      _onTokenRefresh(data.access, data.refresh);
      error.config.headers.Authorization = `Bearer ${data.access}`;
      return api(error.config);
    } catch {
      _onLogout();
      return Promise.reject(error);
    }
  }
);

export default api;
