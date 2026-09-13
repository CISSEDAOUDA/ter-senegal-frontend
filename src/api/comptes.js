import api from "./client";

export const inscrirePassager = (donnees) =>
  api.post("/comptes/inscription/", donnees).then((r) => r.data);

export const moi = () => api.get("/comptes/moi/").then((r) => r.data);
