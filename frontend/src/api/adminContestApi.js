import api from "./axios";

export const toggleContestBlock = (contestId) =>
  api.patch(`/admin/contest/${contestId}/block`);

export const createContest = (formData) =>
  api.post("/admin/contest", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateContest = (contestId, formData) =>
  api.patch(`/admin/contest/${contestId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchAdminQuizzes = () =>
  api.get("/admin/quiz", { params: { limit: 100 } });
