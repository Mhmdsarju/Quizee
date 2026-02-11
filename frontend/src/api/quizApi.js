import api from "../api/axios";

export const getQuizIntro = (quizId) =>
  api.get(`/user/quiz/${quizId}`);

export const getQuizPlay = (quizId) =>
  api.get(`/user/quiz/${quizId}/play`);

export const submitQuiz = (quizId, payload) =>
  api.post(`/user/quiz/${quizId}/submit`, payload);

export const validateQuestion = (quizId, questionId) =>
  api.post(`/user/quiz/${quizId}/validate-question`, { questionId });

export const getContestQuizPlay = (contestId) =>
  api.get(`/user/contest/${contestId}/play`);

export const submitContestQuizResult = (contestId, payload) =>
  api.post(`/user/contest/${contestId}/submit`, payload);
