import api from "./axios";

export const getWalletBalance = () =>
  api.get("/wallet");

export const getWalletTransactions = ({ page = 1, limit = 5 }) =>
  api.get("/wallet/transactions", {
    params: { page, limit },
  });
