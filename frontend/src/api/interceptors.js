import api from "./axios";
import { refreshToken, logout } from "../redux/authSlice";
import Swal from "sweetalert2";
let blockedAlertShown=false;

export const setupInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message?.toLowerCase();

    // 🚫 BLOCKED USER → DO NOTHING
    if (
      error.response?.status === 403 &&
      message?.includes("blocked")
    ) {
      return Promise.reject(error);
    }

    // 🔐 TOKEN EXPIRED → REFRESH
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await store.dispatch(refreshToken());
        const newToken = res.payload.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

};



