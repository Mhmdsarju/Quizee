import api from "./axios";

export const updateProfile = (payload) =>api.patch("/user/profile", payload);
export const fetchUserRank = () =>api.get("/user/rank");
