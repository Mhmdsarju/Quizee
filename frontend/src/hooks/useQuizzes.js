import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "../api/axios";

export const useQuizzes = ({ category, sort, page, search }) => {
  const { accessToken, authChecked } = useSelector(
    (state) => state.auth
  );

  return useQuery({
    queryKey: ["quizzes", category, sort, page, search],
    enabled: authChecked && !!accessToken,
    queryFn: async () => {
      const res = await api.get("/user/quizzes", {
        params: { category, sort, page, search },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};
