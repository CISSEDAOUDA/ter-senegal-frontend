import api from "./client";

export const listerToutesReclamations = () =>
  api.get("/premium/reclamations/").then((r) => r.data);

export const changerStatutReclamation = (id, statut) =>
  api.patch(`/premium/reclamations/${id}/changer-statut/`, { statut }).then((r) => r.data);