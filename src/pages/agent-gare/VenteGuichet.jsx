import { useEffect, useState } from "react";
import {
  listerGares,
  rechercherVoyage,
  listerSiegesDisponibles,
  acheterBillet,
  tarifActuel,
} from "../../api/billetterie";
import { rechercherPassagers } from "../../api/agentGare";

const METHODES = [
  { value: "GUICHET", label: "Especes au guichet" },
  { value: "ORANGE_MONEY", label: "Orange Money (au guichet)" },
  { value: "WAVE", label: "Wave (au guichet)" },
];

export default function VenteGuichet() {
  const [recherche, setRecherche] = useState("");
  const [resultats, setResultats] = useState([]);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const [passagerChoisi, setPassagerChoisi] = useState(null);

  const [gares, setGares] = useState([]);
  const [gareEmbarquementId, setGareEmbarquementId] = useState("");
  const [gareDebarquementId, setGareDebarquementId] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [resultatVoyage, setResultatVoyage] = useState(null);
  const [rechercheVoyageEnCours, setRechercheVoyageEnCours] = useState(false);

  const [sieges, setSieges] = useState([]);
  const [siegeId, setSiegeId] = useState("");
  const [methode, setMethode] = useState(METHODES[0].value);
  const [tarif, setTarif] = useState(null);

  const [erreur, setErreur] = useState(null);
  const [venteEnCours, setVenteEnCours] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    listerGares().then(setGares).catch(() => {});
    tarifActuel().then(setTarif).catch(() => setTarif(null));
  }, []);

  async function handleRecherchePassager(e) {
    e.preventDefault();
    if (!recherche.trim()) return;
    setRechercheEnCours(true);
    setErreur(null);
    try {
      const data = await rechercherPassagers(recherche.trim());
      setResultats(data);
      if (data.length === 0) setErreur("Aucun passager trouve pour cette recherche.");
    } catch (err) {
      setErreur("Erreur lors de la recherche.");
    } finally {
      setRechercheEnCours(false);
    }
  }

  async function handleRechercheVoyage(e) {
    e.preventDefault();
    setErreur(null);
    setResultatVoyage(null);
    setSieges([]);
    setSiegeId("");
    if (!gareEmbarquementId || !gareDebarquementId || !date || !heure) return;
    if (gareEmbarquementId === gareDebarquementId) {
      setErreur("La gare de depart et d'arrivee doivent etre differentes.");
      return;
    }
    setRechercheVoyageEnCours(true);
    try {
      const dateHeureSouhaitee = `${date}T${heure}:00`;
      const resultat = await rechercherVoyage(Number(gareEmbarquementId), Number(gareDebarquementId), dateHeureSouhaitee);
      setResultatVoyage(resultat);
      const listeSieges = await listerSiegesDisponibles(resultat.voyage.id);
      setSieges(listeSieges);
    } catch (err) {
      const details = err.response?.data;
      setErreur(details ? JSON.stringify(details) : "Erreur lors de la recherche du voyage.");
    } finally {
      setRechercheVoyageEnCours(false);
    }
  }

  async function handleVente(e) {
    e.preventDefault();
    setErreur(null);
    setVenteEnCours(true);
    try {
      const billet = await acheterBillet({
        passager_id: passagerChoisi.id,
        gare_embarquement_id: Number(gareEmbarquementId),
        gare_debarquement_id: Number(gareDebarquementId),
        date_heure_souhaitee: `${date}T${heure}:00`,
        siege_id: Number(siegeId),
        methode_paiement: methode,
      });
      setConfirmation(billet);
    } catch (err) {
      const details = err.response?.data;
      setErreur(details ? JSON.stringify(details) : "Erreur lors de la vente.");
    } finally {
      setVenteEnCours(false);
    }
  }

  function nouvelleVente() {
    setPassagerChoisi(null);
    setResultats([]);
    setRecherche("");
    setGareEmbarquementId("");
    setGareDebarquementId("");
    setDate("");
    setHeure("");
    setResultatVoyage(null);
    setSieges([]);
    setSiegeId("");
    setConfirmation(null);
    setErreur(null);
  }

  if (confirmation) {
    return (
      <div>
        <h1>Vente confirmee</h1>
        <p>Passager : {passagerChoisi?.utilisateur?.first_name} {passagerChoisi?.utilisateur?.last_name}</p>
        <p>{confirmation.gare_embarquement?.nom} → {confirmation.gare_debarquement?.nom}</p>
        <p>Embarquement prevu : {new Date(confirmation.heure_embarquement).toLocaleString("fr-FR")}</p>
        <p>Montant encaisse : {confirmation.paiement?.montant} FCFA</p>
        <p>QR code : <code>{confirmation.qr_code}</code></p>
        <button onClick={nouvelleVente}>Nouvelle vente</button>
      </div>
    );
  }

  if (!passagerChoisi) {
    return (
      <div>
        <h1>Vente au guichet</h1>
        <p>Recherchez le passager par CNI, nom d'utilisateur, nom ou prenom.</p>
        <form onSubmit={handleRecherchePassager} style={{ display: "flex", gap: 10, maxWidth: 450 }}>
          <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="CNI, nom, prenom..." style={{ flex: 1, padding: 8 }} />
          <button type="submit" disabled={rechercheEnCours}>{rechercheEnCours ? "Recherche..." : "Rechercher"}</button>
        </form>
        {erreur && <p style={{ color: "red" }}>{erreur}</p>}
        <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
          {resultats.map((p) => (
            <li key={p.id} onClick={() => setPassagerChoisi(p)} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 8, cursor: "pointer" }}>
              <strong>{p.utilisateur?.first_name} {p.utilisateur?.last_name}</strong> - CNI {p.numero_piece_identite}
              <br /><span style={{ fontSize: 13, color: "#666" }}>{p.utilisateur?.email}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1>Vente au guichet</h1>
      <p>
        Passager : <strong>{passagerChoisi.utilisateur?.first_name} {passagerChoisi.utilisateur?.last_name}</strong>
        {" "}(CNI {passagerChoisi.numero_piece_identite})
        {" - "}
        <button type="button" onClick={() => setPassagerChoisi(null)} style={{ fontSize: 13 }}>Changer de passager</button>
      </p>

      <form onSubmit={handleRechercheVoyage} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, marginBottom: 20 }}>
        <label>Gare de depart
          <select value={gareEmbarquementId} onChange={(e) => setGareEmbarquementId(e.target.value)} required>
            <option value="">-- Choisir --</option>
            {gares.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </select>
        </label>
        <label>Gare d'arrivee
          <select value={gareDebarquementId} onChange={(e) => setGareDebarquementId(e.target.value)} required>
            <option value="">-- Choisir --</option>
            {gares.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </select>
        </label>
        <label>Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>Heure souhaitee
          <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} required />
        </label>
        <button type="submit" disabled={rechercheVoyageEnCours}>
          {rechercheVoyageEnCours ? "Recherche..." : "Rechercher un voyage"}
        </button>
      </form>

      {resultatVoyage && (
        <form onSubmit={handleVente} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
          <p>Embarquement prevu : {new Date(resultatVoyage.heure_embarquement).toLocaleString("fr-FR")}</p>
          <label>Siege
            <select value={siegeId} onChange={(e) => setSiegeId(e.target.value)} required>
              <option value="">-- Choisir --</option>
              {sieges.map((s) => <option key={s.id} value={s.id}>{s.numero}</option>)}
            </select>
          </label>
          {sieges.length === 0 && <p style={{ color: "orange" }}>Aucun siege disponible.</p>}
          {tarif && <p style={{ fontWeight: "bold" }}>Prix du billet : {tarif.montant} FCFA</p>}
          <label>Methode de paiement
            <select value={methode} onChange={(e) => setMethode(e.target.value)}>
              {METHODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>
          {erreur && <p style={{ color: "red" }}>{erreur}</p>}
          <button type="submit" disabled={venteEnCours || !siegeId}>
            {venteEnCours ? "Vente en cours..." : "Encaisser et emettre le billet"}
          </button>
        </form>
      )}
    </div>
  );
}
