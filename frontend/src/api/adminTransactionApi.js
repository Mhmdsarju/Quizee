import api from "./axios";

export const fetchTransactionSummary = () =>
  api.get("/admin/reports/summary");

export const fetchTransactions = (page, limit = 10) =>
  api.get("/admin/reports/transactions", {
    params: { page, limit },
  });
