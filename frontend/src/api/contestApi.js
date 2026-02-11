import api from "../api/axios";

export const getContestStatus = (contestId) =>
  api.get(`/user/contest/${contestId}/status`);

export const joinContest = (contestId) =>
  api.post(`/user/contest/${contestId}/join`);

export const getLeaderboard = (contestId) =>
  api.get(`/user/contest/${contestId}/leaderboard`);

export const getMyResult = (contestId) =>
  api.get(`/user/contest/${contestId}/result`);

export const getContestQuiz = (contestId) =>
  api.get(`/user/contest/${contestId}/play`);

export const submitContestQuiz = (contestId, payload) =>
  api.post(`/user/contest/${contestId}/submit`, payload);

export const sendCertificate = (certificateUrl) =>
  api.post("/user/send-certificate", { certificateUrl });
