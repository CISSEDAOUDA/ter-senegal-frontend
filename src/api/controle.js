import api from "./client";

export const scannerBillet = (qrCode, gareId) =>
  api
    .post("/controle/scan/", { qr_code: qrCode, gare_id: gareId })
    .then((r) => r.data);

export const historiqueControles = () =>
  api.get("/controle/historique/").then((r) => r.data);
