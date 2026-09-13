import api from "./client";

export const listerVoyages = () =>
  api.get("/billetterie/voyages/").then((r) => r.data);

export const listerSiegesDisponibles = (voyageId) =>
  api.get(`/billetterie/voyages/${voyageId}/sieges-disponibles/`).then((r) => r.data);

export const listerBilletsPassager = () =>
  api.get("/billetterie/billets/").then((r) => r.data);

export const supprimerBillet = (id) =>
  api.delete(`/billetterie/billets/${id}/`).then(() => id);

export const acheterBillet = (donnees) =>
  api.post("/billetterie/achat/", donnees).then((r) => r.data);

export const tarifActuel = () =>
  api.get("/billetterie/tarifs/actuel/").then((r) => r.data);