import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "../api/axios";

export const useContest = ({ search, sort, page ,status}) => {
  const { accessToken, authChecked } = useSelector(
    (state) => state.auth
  );

  return useQuery({
    queryKey: ["contest", search, sort, page,status],
    enabled: authChecked && !!accessToken, 
    queryFn: async () => {
      const res = await api.get("/user/contest", {
        params: { search, sort, page ,status},
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};
