import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useQuizzes = ({ category, sort, page, search }) => {
  return useQuery({
    queryKey: ["quizzes", category, sort, page, search],
    queryFn: async () => {
      const res = await api.get("/user/quizzes", {
        params: { category, sort, page, search },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
}