import api from "./client";

export const listerNotifications = () =>
  api.get("/notifications/").then((r) => r.data);
