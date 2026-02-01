import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useAttemptedQuizIds(token) {
  return useQuery({
    queryKey: ["attempted-quiz-ids"],
    queryFn: async () => {
      const res = await api.get("/user/quiz-history");
      return res.data.data.map((q) => q.quiz._id);
    },
    enabled: !!token,
  });
}
