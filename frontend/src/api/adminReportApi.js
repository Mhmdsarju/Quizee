import api from "./axios";

export const fetchDashboardStats = () =>
  api.get("/admin/dashboard-stats");

export const fetchSummaryReport = (params = "") =>
  api.get(`/admin/reports/summary${params}`);

export const fetchReasonWiseReport = (params = "") =>
  api.get(`/admin/reports/reason-wise${params}`);

export const fetchMonthlyReport = () =>
  api.get("/admin/reports/monthly");

export const fetchDailyReport = () =>
  api.get("/admin/reports/daily");

export const fetchCustomReport = (from, to) =>
  api.get(`/admin/reports/custom?from=${from}&to=${to}`);
