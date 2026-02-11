import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import socket from "../socket";
import api from "../api/axios";

export function useNotifications() {
  const queryClient = useQueryClient();
  const { accessToken, authChecked } = useSelector(
    (state) => state.auth
  );

  const query = useQuery({
    queryKey: ["notifications"],
    enabled: authChecked && !!accessToken, 
    queryFn: async () => {
      const res = await api.get("/user/notifications");
      return res.data;
    },
  });

  useEffect(() => {
    if (!authChecked || !accessToken) return;

    socket.on("new_notification", (data) => {
      queryClient.setQueryData(["notifications"], (old = []) => [
        data,
        ...old,
      ]);
    });

    return () => socket.off("new_notification");
  }, [authChecked, accessToken, queryClient]);

  return query;
}
