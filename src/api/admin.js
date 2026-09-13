import api from "./client";

// Tarifs
export const listerTarifs = () => api.get("/billetterie/tarifs/").then((r) => r.data);
export const creerTarif = (donnees) => api.post("/billetterie/tarifs/", donnees).then((r) => r.data);

// Gares
export const listerGares = () => api.get("/billetterie/gares/").then((r) => r.data);
export const creerGare = (donnees) => api.post("/billetterie/gares/", donnees).then((r) => r.data);

// Trains
export const listerTrains = () => api.get("/billetterie/trains/").then((r) => r.data);
export const creerTrain = (donnees) => api.post("/billetterie/trains/", donnees).then((r) => r.data);

// Wagons
export const creerWagon = (donnees) => api.post("/billetterie/wagons/", donnees).then((r) => r.data);

// Sieges
export const creerSiege = (donnees) => api.post("/billetterie/sieges/", donnees).then((r) => r.data);

// Voyages
export const listerVoyagesAdmin = () => api.get("/billetterie/voyages/").then((r) => r.data);
export const creerVoyage = (donnees) => api.post("/billetterie/voyages/", donnees).then((r) => r.data);

// Statistiques
export const listerStatistiques = () => api.get("/billetterie/statistiques/").then((r) => r.data);