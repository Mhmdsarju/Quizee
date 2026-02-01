import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useContest = ({ search, sort, page }) => {
    return useQuery({
        queryKey: ["contest", search, sort, page],
        queryFn: async () => {
            const res = await api.get("/user/contest", {
                params: { search, sort, page },
            });
            return res.data;
        },
        keepPreviousData: true,
    });
}