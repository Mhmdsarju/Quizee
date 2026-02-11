import api from "./axios";

export const markNotificationRead = (id) =>
  api.patch(`/user/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.patch("/user/notifications/read-all");
