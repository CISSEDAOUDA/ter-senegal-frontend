import api from "./client";

export const rechercherPassagers = (recherche) =>
  api.get(`/comptes/passagers/?recherche=${encodeURIComponent(recherche)}`).then((r) => r.data);