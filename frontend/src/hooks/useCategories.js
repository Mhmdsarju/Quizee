import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useCategories(token) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/admin/categories");
      return res.data.data || res.data;
    },
    enabled: !!token, 
  });
}
