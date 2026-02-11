import api from "../api/axios";

export const createOrder = (amount) => {
  return api.post("/payment/create-order", { amount });
};


