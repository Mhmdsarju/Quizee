import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useQuizHistory(token) {
  return useQuery({
    queryKey: ["quiz-history"],
    queryFn: async () => {
      const res = await api.get("/user/quiz-history");
      return res.data.map((q) => q.quiz._id);
    },
    enabled: !!token,
  });
}
