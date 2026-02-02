import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "../api/axios";

export const useContest = ({ search, sort, page }) => {
  const { accessToken, authChecked } = useSelector(
    (state) => state.auth
  );

  return useQuery({
    queryKey: ["contest", search, sort, page],
    enabled: authChecked && !!accessToken, 
    queryFn: async () => {
      const res = await api.get("/user/contest", {
        params: { search, sort, page },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};
