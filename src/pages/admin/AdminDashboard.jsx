import { useEffect, useState } from "react";
import {
  listerTarifs,
  creerTarif,
  listerGares,
  creerGare,
  listerTrains,
  creerTrain,
  creerWagon,
  creerSiege,
  listerVoyagesAdmin,
  creerVoyage,
  listerStatistiques,
} from "../../api/admin";

import "./AdminDashboard.css";

const ONGLETS = [
  "Tarifs",
  "Gares",
  "Trains & Wagons",
  "Voyages",
  "Statistiques",
];

export default function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState(ONGLETS[0]);

  return (
    <div className="admin-dashboard">

      {/* EN-TÊTE */}
      <div className="admin-header">
        <div>
          <span className="admin-badge">TER SENEGAL</span>
          <h1>Administration</h1>
          <p>Gérez les tarifs, les gares, les trains et les voyages.</p>
        </div>

        <div className="admin-header-icon">
          🚆
        </div>
      </div>

      {/* ONGLETS */}
      <div className="admin-tabs">
        {ONGLETS.map((o) => (
          <button
            key={o}
            onClick={() => setOngletActif(o)}
            className={`admin-tab ${
              ongletActif === o ? "active" : ""
            }`}
          >
            {o === "Tarifs" && "💰"}
            {o === "Gares" && "🏢"}
            {o === "Trains & Wagons" && "🚆"}
            {o === "Voyages" && "🗓️"}
            {o === "Statistiques" && "📊"}

            <span>{o}</span>
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <div className="admin-content">
        {ongletActif === "Tarifs" && <SectionTarifs />}
        {ongletActif === "Gares" && <SectionGares />}
        {ongletActif === "Trains & Wagons" && (
          <SectionTrainsWagons />
        )}
        {ongletActif === "Voyages" && <SectionVoyages />}
        {ongletActif === "Statistiques" && (
          <SectionStatistiques />
        )}
      </div>
    </div>
  );
}


/* =========================================================
   STATISTIQUES
   ========================================================= */

function SectionStatistiques() {
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    listerStatistiques()
      .then(setStats)
      .catch((err) =>
        setErreur(
          err.response?.data?.detail ||
            "Impossible de charger les statistiques."
        )
      );
  }, []);

  if (erreur) {
    return <p className="admin-error">{erreur}</p>;
  }

  if (!stats) {
    return (
      <div className="admin-loading">
        Chargement des statistiques...
      </div>
    );
  }

  return (
    <div className="admin-section">

      <div className="section-title">
        <div>
          <span className="section-icon">📊</span>
          <h2>Statistiques</h2>
          <p>Vue générale de l'activité du réseau TER.</p>
        </div>
      </div>

      <div className="stats-grid">

        {/* PASSAGERS */}
        <div className="stats-card">
          <div className="stats-card-header">
            <div className="stats-icon green">
              🎫
            </div>
            <div>
              <h3>Passagers par tronçon</h3>
              <p>Nombre de billets vendus</p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tronçon</th>
                  <th>Billets</th>
                </tr>
              </thead>

              <tbody>
                {stats.passagers_par_troncon.map((t, i) => (
                  <tr key={i}>
                    <td>{t.troncon}</td>
                    <td>
                      <span className="number-badge">
                        {t.nombre_billets}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* RECETTES */}
        <div className="stats-card">
          <div className="stats-card-header">
            <div className="stats-icon blue">
              💰
            </div>

            <div>
              <h3>Recettes par jour</h3>
              <p>Montant total des ventes</p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Montant</th>
                </tr>
              </thead>

              <tbody>
                {stats.recettes_par_jour.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>
                      <strong className="money">
                        {r.montant_total} FCFA
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* HEURES DE POINTE */}
        <div className="stats-card">
          <div className="stats-card-header">
            <div className="stats-icon orange">
              ⏰
            </div>

            <div>
              <h3>Heures de pointe</h3>
              <p>Nombre de départs par heure</p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Billets</th>
                </tr>
              </thead>

              <tbody>
                {stats.heures_pointe.map((h, i) => (
                  <tr key={i}>
                    <td>{h.heure}h</td>
                    <td>
                      <span className="number-badge">
                        {h.nombre_billets}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* FRAUDE */}
        <div className="fraud-card">
          <div className="stats-card-header">
            <div className="stats-icon red">
              🛡️
            </div>

            <div>
              <h3>Taux de fraude</h3>
              <p>Contrôles des billets</p>
            </div>
          </div>

          <div className="fraud-content">
            <div className="fraud-value">
              {stats.taux_fraude.taux_pourcentage}%
            </div>

            <p>
              {stats.taux_fraude.fraudes} contrôle(s) non
              valide(s) sur{" "}
              {stats.taux_fraude.total_controles} au total.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   TARIFS
   ========================================================= */

function SectionTarifs() {
  const [tarifs, setTarifs] = useState([]);
  const [montant, setMontant] = useState("");
  const [dateEffet, setDateEffet] = useState("");
  const [erreur, setErreur] = useState(null);

  function recharger() {
    listerTarifs()
      .then(setTarifs)
      .catch(() =>
        setErreur("Impossible de charger les tarifs.")
      );
  }

  useEffect(recharger, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);

    try {
      await creerTarif({
        montant: Number(montant),
        date_effet: dateEffet,
      });

      setMontant("");
      setDateEffet("");

      recharger();
    } catch (err) {
      setErreur(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur."
      );
    }
  }

  return (
    <div className="admin-section">

      <div className="section-title">
        <div>
          <span className="section-icon">💰</span>
          <h2>Tarifs 1ère classe</h2>
          <p>
            Gérez les tarifs appliqués automatiquement aux
            achats de billets.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <label>
          Montant (FCFA)
          <input
            type="number"
            value={montant}
            onChange={(e) =>
              setMontant(e.target.value)
            }
            placeholder="Ex : 1500"
            required
          />
        </label>

        <label>
          Date d'effet
          <input
            type="date"
            value={dateEffet}
            onChange={(e) =>
              setDateEffet(e.target.value)
            }
            required
          />
        </label>

        <button type="submit" className="primary-button">
          + Ajouter ce tarif
        </button>
      </form>

      {erreur && (
        <p className="admin-error">{erreur}</p>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Montant</th>
              <th>Date d'effet</th>
              <th>Date de fin</th>
            </tr>
          </thead>

          <tbody>
            {tarifs.map((t) => (
              <tr key={t.id}>
                <td>
                  <strong className="money">
                    {t.montant} FCFA
                  </strong>
                </td>

                <td>{t.date_effet}</td>

                <td>
                  {t.date_fin ? (
                    t.date_fin
                  ) : (
                    <span className="status-active">
                      En vigueur
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}


/* =========================================================
   GARES
   ========================================================= */

function SectionGares() {
  const [gares, setGares] = useState([]);
  const [nom, setNom] = useState("");
  const [ordre, setOrdre] = useState("");
  const [erreur, setErreur] = useState(null);

  function recharger() {
    listerGares()
      .then(setGares)
      .catch(() =>
        setErreur("Impossible de charger les gares.")
      );
  }

  useEffect(recharger, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);

    try {
      await creerGare({
        nom,
        ordre: Number(ordre),
      });

      setNom("");
      setOrdre("");

      recharger();
    } catch (err) {
      setErreur(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur."
      );
    }
  }

  return (
    <div className="admin-section">

      <div className="section-title">
        <div>
          <span className="section-icon">🏢</span>
          <h2>Gares de la ligne</h2>
          <p>
            Gérez les différentes gares desservies par le TER.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <label>
          Nom de la gare
          <input
            value={nom}
            onChange={(e) =>
              setNom(e.target.value)
            }
            placeholder="Ex : Dakar"
            required
          />
        </label>

        <label>
          Ordre
          <input
            type="number"
            value={ordre}
            onChange={(e) =>
              setOrdre(e.target.value)
            }
            placeholder="Ex : 1"
            required
          />
        </label>

        <button
          type="submit"
          className="primary-button"
        >
          + Ajouter la gare
        </button>
      </form>

      {erreur && (
        <p className="admin-error">{erreur}</p>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ordre</th>
              <th>Nom de la gare</th>
            </tr>
          </thead>

          <tbody>
            {gares
              .sort((a, b) => a.ordre - b.ordre)
              .map((g) => (
                <tr key={g.id}>
                  <td>
                    <span className="order-badge">
                      {g.ordre}
                    </span>
                  </td>

                  <td>
                    <strong>{g.nom}</strong>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}


/* =========================================================
   TRAINS / WAGONS / SIEGES
   ========================================================= */

function SectionTrainsWagons() {
  const [trains, setTrains] = useState([]);
  const [numeroTrain, setNumeroTrain] = useState("");
  const [erreur, setErreur] = useState(null);

  const [trainWagonId, setTrainWagonId] =
    useState("");
  const [numeroWagon, setNumeroWagon] =
    useState("");
  const [classeWagon, setClasseWagon] =
    useState("PREMIERE");

  const [wagonSiegeId, setWagonSiegeId] =
    useState("");
  const [numeroSiege, setNumeroSiege] =
    useState("");

  function recharger() {
    listerTrains()
      .then(setTrains)
      .catch(() =>
        setErreur("Impossible de charger les trains.")
      );
  }

  useEffect(recharger, []);

  async function handleAjoutTrain(e) {
    e.preventDefault();
    setErreur(null);

    try {
      await creerTrain({
        numero: numeroTrain,
      });

      setNumeroTrain("");
      recharger();
    } catch (err) {
      setErreur(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur."
      );
    }
  }

  async function handleAjoutWagon(e) {
    e.preventDefault();
    setErreur(null);

    try {
      await creerWagon({
        train: Number(trainWagonId),
        numero: numeroWagon,
        classe: classeWagon,
      });

      setNumeroWagon("");
      recharger();
    } catch (err) {
      setErreur(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur."
      );
    }
  }

  async function handleAjoutSiege(e) {
    e.preventDefault();
    setErreur(null);

    try {
      await creerSiege({
        wagon: Number(wagonSiegeId),
        numero: numeroSiege,
      });

      setNumeroSiege("");
      recharger();
    } catch (err) {
      setErreur(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur."
      );
    }
  }

  const tousWagons = trains.flatMap((t) =>
    t.wagons.map((w) => ({
      ...w,
      trainNumero: t.numero,
    }))
  );

  return (
    <div className="admin-section">

      <div className="section-title">
        <div>
          <span className="section-icon">🚆</span>
          <h2>Trains, wagons et sièges</h2>
          <p>
            Configurez les trains et leurs places disponibles.
          </p>
        </div>
      </div>

      {erreur && (
        <p className="admin-error">{erreur}</p>
      )}

      {/* TRAIN */}
      <div className="subsection">
        <h3>🚆 Ajouter un train</h3>

        <form
          onSubmit={handleAjoutTrain}
          className="admin-form"
        >
          <label>
            Numéro du train
            <input
              value={numeroTrain}
              onChange={(e) =>
                setNumeroTrain(e.target.value)
              }
              placeholder="Ex : TER01"
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
          >
            + Ajouter le train
          </button>
        </form>
      </div>

      {/* WAGON */}
      <div className="subsection">
        <h3>🚌 Ajouter un wagon</h3>

        <form
          onSubmit={handleAjoutWagon}
          className="admin-form"
        >
          <label>
            Train
            <select
              value={trainWagonId}
              onChange={(e) =>
                setTrainWagonId(e.target.value)
              }
              required
            >
              <option value="">
                -- Choisir un train --
              </option>

              {trains.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                >
                  {t.numero}
                </option>
              ))}
            </select>
          </label>

          <label>
            Numéro du wagon
            <input
              value={numeroWagon}
              onChange={(e) =>
                setNumeroWagon(e.target.value)
              }
              placeholder="Ex : W01"
              required
            />
          </label>

          <label>
            Classe
            <select
              value={classeWagon}
              onChange={(e) =>
                setClasseWagon(e.target.value)
              }
            >
              <option value="PREMIERE">
                1ère classe (premium)
              </option>

              <option value="DEUXIEME">
                2e classe
              </option>
            </select>
          </label>

          <button
            type="submit"
            className="primary-button"
          >
            + Ajouter le wagon
          </button>
        </form>
      </div>

      {/* SIEGE */}
      <div className="subsection">
        <h3>💺 Ajouter un siège</h3>

        <form
          onSubmit={handleAjoutSiege}
          className="admin-form"
        >
          <label>
            Wagon
            <select
              value={wagonSiegeId}
              onChange={(e) =>
                setWagonSiegeId(e.target.value)
              }
              required
            >
              <option value="">
                -- Choisir un wagon --
              </option>

              {tousWagons.map((w) => (
                <option
                  key={w.id}
                  value={w.id}
                >
                  Train {w.trainNumero} - Wagon{" "}
                  {w.numero} ({w.classe})
                </option>
              ))}
            </select>
          </label>

          <label>
            Numéro du siège
            <input
              value={numeroSiege}
              onChange={(e) =>
                setNumeroSiege(e.target.value)
              }
              placeholder="Ex : A01"
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
          >
            + Ajouter le siège
          </button>
        </form>
      </div>

      {/* VUE ENSEMBLE */}
      <div className="overview">
        <h3>📋 Vue d'ensemble</h3>

        <div className="train-grid">
          {trains.map((t) => (
            <div
              key={t.id}
              className="train-card"
            >
              <div className="train-card-header">
                <div className="train-circle">
                  🚆
                </div>

                <div>
                  <span>TRAIN</span>
                  <strong>{t.numero}</strong>
                </div>
              </div>

              <div className="wagon-list">
                {t.wagons.map((w) => (
                  <div
                    key={w.id}
                    className="wagon-item"
                  >
                    <div>
                      <strong>
                        Wagon {w.numero}
                      </strong>

                      <span>
                        {w.classe === "PREMIERE"
                          ? "1ère classe"
                          : "2e classe"}
                      </span>
                    </div>

                    <div className="seat-count">
                      💺 {w.sieges.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


/* =========================================================
   VOYAGES
   ========================================================= */

function SectionVoyages() {
  const [voyages, setVoyages] = useState([]);
  const [trains, setTrains] = useState([]);
  const [gares, setGares] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [gareDepartId, setGareDepartId] =
    useState("");
  const [gareArriveeId, setGareArriveeId] =
    useState("");

  const [dateHeureDepart, setDateHeureDepart] =
    useState("");
  const [dateHeureArrivee, setDateHeureArrivee] =
    useState("");

  const [erreur, setErreur] = useState(null);

  function recharger() {
    listerVoyagesAdmin()
      .then(setVoyages)
      .catch(() =>
        setErreur(
          "Impossible de charger les voyages."
        )
      );

    listerTrains()
      .then(setTrains)
      .catch(() => {});

    listerGares()
      .then(setGares)
      .catch(() => {});
  }

  useEffect(recharger, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);

    try {
      await creerVoyage({
        train: Number(trainId),
        gare_depart_id: Number(gareDepartId),
        gare_arrivee_id: Number(gareArriveeId),
        date_heure_depart: dateHeureDepart,
        date_heure_arrivee: dateHeureArrivee,
      });

      setDateHeureDepart("");
      setDateHeureArrivee("");

      recharger();
    } catch (err) {
      setErreur(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Erreur."
      );
    }
  }

  return (
    <div className="admin-section">

      <div className="section-title">
        <div>
          <span className="section-icon">🗓️</span>
          <h2>Voyages</h2>
          <p>
            Planifiez et gérez les départs et arrivées.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="admin-form voyage-form"
      >
        <label>
          Train
          <select
            value={trainId}
            onChange={(e) =>
              setTrainId(e.target.value)
            }
            required
          >
            <option value="">
              -- Choisir --
            </option>

            {trains.map((t) => (
              <option
                key={t.id}
                value={t.id}
              >
                {t.numero}
              </option>
            ))}
          </select>
        </label>

        <label>
          Gare de départ
          <select
            value={gareDepartId}
            onChange={(e) =>
              setGareDepartId(e.target.value)
            }
            required
          >
            <option value="">
              -- Choisir --
            </option>

            {gares.map((g) => (
              <option
                key={g.id}
                value={g.id}
              >
                {g.nom}
              </option>
            ))}
          </select>
        </label>

        <label>
          Gare d'arrivée
          <select
            value={gareArriveeId}
            onChange={(e) =>
              setGareArriveeId(e.target.value)
            }
            required
          >
            <option value="">
              -- Choisir --
            </option>

            {gares.map((g) => (
              <option
                key={g.id}
                value={g.id}
              >
                {g.nom}
              </option>
            ))}
          </select>
        </label>

        <label>
          Départ
          <input
            type="datetime-local"
            value={dateHeureDepart}
            onChange={(e) =>
              setDateHeureDepart(e.target.value)
            }
            required
          />
        </label>

        <label>
          Arrivée
          <input
            type="datetime-local"
            value={dateHeureArrivee}
            onChange={(e) =>
              setDateHeureArrivee(e.target.value)
            }
            required
          />
        </label>

        <button
          type="submit"
          className="primary-button"
        >
          + Ajouter le voyage
        </button>
      </form>

      {erreur && (
        <p className="admin-error">{erreur}</p>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Train</th>
              <th>Trajet</th>
              <th>Départ</th>
              <th>Arrivée</th>
            </tr>
          </thead>

          <tbody>
            {voyages.map((v) => (
              <tr key={v.id}>
                <td>
                  <span className="train-number">
                    {v.train}
                  </span>
                </td>

                <td>
                  <strong>
                    {v.gare_depart?.nom}
                  </strong>

                  <span className="arrow">
                    →
                  </span>

                  <strong>
                    {v.gare_arrivee?.nom}
                  </strong>
                </td>

                <td>
                  {new Date(
                    v.date_heure_depart
                  ).toLocaleString("fr-FR")}
                </td>

                <td>
                  {new Date(
                    v.date_heure_arrivee
                  ).toLocaleString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}