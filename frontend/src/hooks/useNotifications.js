import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import socket from "../socket";
import api from "../api/axios";

export function useNotifications() {
  const queryClient = useQueryClient();

  //  Initial fetch from DB
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/user/notifications");
      return res.data;
    },
  });

  //  Socket realtime update
  useEffect(() => {
    socket.on("new_notification", (data) => {
      queryClient.setQueryData(["notifications"], (old = []) => [
        data,
        ...old,
      ]);
    });

    return () => socket.off("new_notification");
  }, [queryClient]);

  return query;
}
