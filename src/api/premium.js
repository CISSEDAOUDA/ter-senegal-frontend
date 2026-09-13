import api from "./client";

export const listerReclamations = () =>
  api.get("/premium/reclamations/").then((r) => r.data);

export const creerReclamation = (donnees) =>
  api.post("/premium/reclamations/", donnees).then((r) => r.data);

export const listerServicesPremium = () =>
  api.get("/premium/services/").then((r) => r.data);