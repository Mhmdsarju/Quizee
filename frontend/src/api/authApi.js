import api from "./axios";

export const signupApi = (data) => api.post("/auth/signup", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const refreshApi = () => api.post("/auth/refresh");
export const logoutApi = () => api.post("/auth/logout");
export const otpVerify = (data) => api.post("/auth/verify-otp", data);
export const resendOtpApi = (data) =>api.post("/auth/resend-otp", data);
export const forgotPasswordApi = (data) =>api.post("/auth/forgot-password", data);
export const verifyForgotOtpApi = (data) =>api.post("/auth/forgot-password/verify-otp", data);
export const resetPasswordApi = (data) =>api.post("/auth/reset-password", data);
export const resendForgotOtpApi = (data) =>api.post("/auth/forgot-password/resend-otp", data);
