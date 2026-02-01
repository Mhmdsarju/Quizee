import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useQuizHistory = ({ page, search }) => {
  return useQuery({
    queryKey: ["quiz-history", page, search],
    queryFn: async () => {
      const res = await api.get("/user/quiz-history", {
        params: { page, limit: 5, search },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export const useContestHistory = ({ page, search }) => {
  return useQuery({
    queryKey: ["contest-history", page, search],
    queryFn: async () => {
      const res = await api.get("/user/contest-history", {
        params: { page, limit: 5, search },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};
