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
  listerStatistiques,
} from "../../api/admin";
 
import {
  TrainFront,
  WalletCards,
  MapPinned,
  CalendarDays,
  BarChart3,
  Plus,
  RefreshCw,
  Building2,
  Armchair,
  CircleDollarSign,
  CreditCard,
  Clock3,
  ShieldAlert,
  Ticket,
  Route,
  ChevronRight,
  Settings2,
  Database,
  Gauge,
} from "lucide-react";
 
import "./AdminDashboard.css";
 
 
/* =========================================================
   ONGLETS
   ========================================================= */
 
const ONGLETS = [
  "Tarifs",
  "Gares",
  "Trains & Wagons",
  "Voyages",
  "Statistiques",
];
 
 
/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */
 
export default function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState(ONGLETS[0]);
 
  const getIcon = (onglet) => {
    switch (onglet) {
      case "Tarifs":
        return <WalletCards size={18} />;
      case "Gares":
        return <MapPinned size={18} />;
      case "Trains & Wagons":
        return <TrainFront size={18} />;
      case "Voyages":
        return <CalendarDays size={18} />;
      case "Statistiques":
        return <BarChart3 size={18} />;
      default:
        return null;
    }
  };
 
  return (
    <div className="admin-dashboard">
 
      {/* =====================================================
          HEADER
          ===================================================== */}
 
      <div className="admin-header">
 
        <div className="admin-header-background-circle circle-one"></div>
        <div className="admin-header-background-circle circle-two"></div>
 
        <div className="admin-header-content">
 
          <div className="admin-header-left">
 
            <div className="admin-badge">
              <Settings2 size={14} />
              <span>TER SENEGAL</span>
            </div>
 
            <h1>
              Tableau de bord
              <span>Administration</span>
            </h1>
 
            <p>
              Gérez les tarifs, les gares, les trains,
              les voyages et consultez les statistiques.
            </p>
 
          </div>
 
          <div className="admin-header-visual">
 
            <div className="header-icon-ring">
              <TrainFront size={42} />
            </div>
 
            <div className="header-status">
              <span className="status-live-dot"></span>
              Système actif
            </div>
 
          </div>
 
        </div>
 
      </div>
 
 
      {/* =====================================================
          NAVIGATION
          ===================================================== */}
 
      <div className="admin-tabs">
 
        {ONGLETS.map((onglet) => (
 
          <button
            key={onglet}
            onClick={() => setOngletActif(onglet)}
            className={`admin-tab ${
              ongletActif === onglet ? "active" : ""
            }`}
          >
 
            <span className="admin-tab-icon">
              {getIcon(onglet)}
            </span>
 
            <span className="admin-tab-label">
              {onglet}
            </span>
 
            {ongletActif === onglet && (
              <ChevronRight
                size={15}
                className="tab-arrow"
              />
            )}
 
          </button>
 
        ))}
 
      </div>
 
 
      {/* =====================================================
          CONTENU
          ===================================================== */}
 
      <div className="admin-content">
 
        {ongletActif === "Tarifs" && (
          <SectionTarifs />
        )}
 
        {ongletActif === "Gares" && (
          <SectionGares />
        )}
 
        {ongletActif === "Trains & Wagons" && (
          <SectionTrainsWagons />
        )}
 
        {ongletActif === "Voyages" && (
          <SectionVoyages />
        )}
 
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
      .catch((err) => {
 
        setErreur(
          err.response?.data?.detail ||
          "Impossible de charger les statistiques."
        );
 
      });
 
  }, []);
 
 
  if (erreur) {
 
    return (
      <div className="admin-section">
 
        <div className="admin-error-box">
          <ShieldAlert size={22} />
          <span>{erreur}</span>
        </div>
 
      </div>
    );
  }
 
 
  if (!stats) {
 
    return (
      <div className="admin-section admin-loading">
        <RefreshCw
          size={25}
          className="loading-spin"
        />
        <span>Chargement des statistiques...</span>
      </div>
    );
  }
 
 
  const LIBELLE_METHODE = {
 
    ORANGE_MONEY: "Orange Money",
 
    WAVE: "Wave",
 
    GUICHET: "Guichet",
 
    BORNE: "Borne automatique",
 
  };
 
 
  const recettesGare =
    stats.recettes_par_gare || [];
 
  const recettesMethode =
    stats.recettes_par_methode || [];
 
  const passagersTroncon =
    stats.passagers_par_troncon || [];
 
  const recettesJour =
    stats.recettes_par_jour || [];
 
  const heuresPointe =
    stats.heures_pointe || [];
 
 
  return (
 
    <div className="admin-section">
 
      {/* TITRE */}
 
      <div className="section-title">
 
        <div className="section-title-icon stats-title-icon">
          <BarChart3 size={23} />
        </div>
 
        <div>
 
          <span className="section-eyebrow">
            ANALYSE DU RÉSEAU
          </span>
 
          <h2>
            Statistiques
          </h2>
 
          <p>
            Vue d'ensemble des recettes,
            du trafic et des contrôles.
          </p>
 
        </div>
 
      </div>
 
 
      {/* CARTES RAPIDES */}
 
      <div className="stats-overview">
 
        <div className="stats-overview-card">
 
          <div className="stats-overview-icon green">
            <CircleDollarSign size={22} />
          </div>
 
          <div>
            <span>Recettes</span>
            <strong>
              {recettesJour.reduce(
                (total, item) =>
                  total + Number(item.montant_total || 0),
                0
              ).toLocaleString("fr-FR")} FCFA
            </strong>
          </div>
 
        </div>
 
 
        <div className="stats-overview-card">
 
          <div className="stats-overview-icon blue">
            <Ticket size={22} />
          </div>
 
          <div>
            <span>Billets vendus</span>
 
            <strong>
              {recettesGare.reduce(
                (total, item) =>
                  total + Number(item.nombre_billets || 0),
                0
              ).toLocaleString("fr-FR")}
            </strong>
 
          </div>
 
        </div>
 
 
        <div className="stats-overview-card">
 
          <div className="stats-overview-icon purple">
            <Gauge size={22} />
          </div>
 
          <div>
 
            <span>
              Remplissage moyen
            </span>
 
            <strong>
 
              {stats.taux_remplissage_moyen_pourcentage !== null
                ? `${stats.taux_remplissage_moyen_pourcentage}%`
                : "N/A"}
 
            </strong>
 
          </div>
 
        </div>
 
 
        <div className="stats-overview-card">
 
          <div className="stats-overview-icon red">
            <ShieldAlert size={22} />
          </div>
 
          <div>
 
            <span>
              Taux de fraude
            </span>
 
            <strong>
 
              {stats.taux_fraude?.taux_pourcentage || 0}%
 
            </strong>
 
          </div>
 
        </div>
 
      </div>
 
 
      {/* RECETTES PAR GARE */}
 
      <div className="subsection">
 
        <div className="subsection-header">
 
          <div className="subsection-heading">
 
            <div className="subsection-icon green">
              <Building2 size={19} />
            </div>
 
            <div>
 
              <h3>
                Recettes par gare
              </h3>
 
              <p>
                Analyse des ventes selon la gare de départ.
              </p>
 
            </div>
 
          </div>
 
        </div>
 
 
        <div className="admin-table-wrapper">
 
          <table className="admin-table">
 
            <thead>
 
              <tr>
                <th>Gare</th>
                <th>Recettes</th>
                <th>Billets vendus</th>
              </tr>
 
            </thead>
 
            <tbody>
 
              {recettesGare.map((g, i) => (
 
                <tr key={i}>
 
                  <td>
                    <div className="table-name">
                      <span className="table-number">
                        {i + 1}
                      </span>
                      <strong>{g.gare}</strong>
                    </div>
                  </td>
 
                  <td>
                    <span className="money">
                      {Number(
                        g.montant_total || 0
                      ).toLocaleString("fr-FR")} FCFA
                    </span>
                  </td>
 
                  <td>
                    <span className="number-badge">
                      {g.nombre_billets}
                    </span>
                  </td>
 
                </tr>
 
              ))}
 
            </tbody>
 
          </table>
 
        </div>
 
      </div>
 
 
      {/* MÉTHODES DE PAIEMENT */}
 
      <div className="subsection">
 
        <div className="subsection-heading">
 
          <div className="subsection-icon blue">
            <CreditCard size={19} />
          </div>
 
          <div>
 
            <h3>
              Recettes par méthode de paiement
            </h3>
 
            <p>
              Répartition des transactions.
            </p>
 
          </div>
 
        </div>
 
 
        <div className="payment-grid">
 
          {recettesMethode.map((m, i) => (
 
            <div
              key={i}
              className="payment-card"
            >
 
              <div className="payment-card-top">
 
                <div className="payment-method-icon">
                  <CreditCard size={19} />
                </div>
 
                <span>
                  {LIBELLE_METHODE[m.methode] ||
                    m.methode}
                </span>
 
              </div>
 
              <strong>
                {Number(
                  m.montant_total || 0
                ).toLocaleString("fr-FR")} FCFA
              </strong>
 
              <p>
                {m.nombre_billets} billet(s)
              </p>
 
            </div>
 
          ))}
 
        </div>
 
      </div>
 
 
      {/* TAUX REMPLISSAGE */}
 
      {stats.taux_remplissage_moyen_pourcentage !== null && (
 
        <div className="subsection">
 
          <div className="subsection-heading">
 
            <div className="subsection-icon purple">
              <Gauge size={19} />
            </div>
 
            <div>
 
              <h3>
                Taux de remplissage moyen
              </h3>
 
              <p>
                Wagon 1ère classe.
              </p>
 
            </div>
 
          </div>
 
 
          <div className="occupancy-card">
 
            <div className="occupancy-value">
 
              {stats.taux_remplissage_moyen_pourcentage}%
 
            </div>
 
            <div className="occupancy-progress">
 
              <div
                className="occupancy-progress-fill"
                style={{
                  width: `${Math.min(
                    Number(
                      stats.taux_remplissage_moyen_pourcentage
                    ),
                    100
                  )}%`,
                }}
              />
 
            </div>
 
            <p>
              Moyenne calculée sur les voyages
              ayant vendu au moins un billet.
            </p>
 
          </div>
 
        </div>
 
      )}
 
 
      {/* PASSAGERS PAR TRONÇON */}
 
      <div className="subsection">
 
        <div className="subsection-heading">
 
          <div className="subsection-icon orange">
            <Route size={19} />
          </div>
 
          <div>
 
            <h3>
              Passagers par tronçon
            </h3>
 
            <p>
              Nombre de billets par trajet.
            </p>
 
          </div>
 
        </div>
 
 
        <div className="admin-table-wrapper">
 
          <table className="admin-table">
 
            <thead>
 
              <tr>
                <th>Tronçon</th>
                <th>Nombre de billets</th>
              </tr>
 
            </thead>
 
            <tbody>
 
              {passagersTroncon.map((t, i) => (
 
                <tr key={i}>
 
                  <td>
                    <strong>
                      {t.troncon}
                    </strong>
                  </td>
 
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
 
 
      {/* RECETTES PAR JOUR */}
 
      <div className="subsection">
 
        <div className="subsection-heading">
 
          <div className="subsection-icon green">
            <CalendarDays size={19} />
          </div>
 
          <div>
 
            <h3>
              Recettes par jour
            </h3>
 
            <p>
              Évolution quotidienne des recettes.
            </p>
 
          </div>
 
        </div>
 
 
        <div className="admin-table-wrapper">
 
          <table className="admin-table">
 
            <thead>
 
              <tr>
                <th>Date</th>
                <th>Montant total</th>
              </tr>
 
            </thead>
 
            <tbody>
 
              {recettesJour.map((r, i) => (
 
                <tr key={i}>
 
                  <td>
                    <strong>
                      {r.date}
                    </strong>
                  </td>
 
                  <td>
 
                    <span className="money">
                      {Number(
                        r.montant_total || 0
                      ).toLocaleString("fr-FR")} FCFA
                    </span>
 
                  </td>
 
                </tr>
 
              ))}
 
            </tbody>
 
          </table>
 
        </div>
 
      </div>
 
 
      {/* HEURES DE POINTE */}
 
      <div className="subsection">
 
        <div className="subsection-heading">
 
          <div className="subsection-icon blue">
            <Clock3 size={19} />
          </div>
 
          <div>
 
            <h3>
              Heures de pointe
            </h3>
 
            <p>
              Périodes enregistrant le plus de ventes.
            </p>
 
          </div>
 
        </div>
 
 
        <div className="peak-grid">
 
          {heuresPointe.map((h, i) => (
 
            <div
              key={i}
              className="peak-card"
            >
 
              <Clock3 size={19} />
 
              <div>
 
                <strong>
                  {h.heure}h
                </strong>
 
                <span>
                  {h.nombre_billets} billet(s)
                </span>
 
              </div>
 
            </div>
 
          ))}
 
        </div>
 
      </div>
 
 
      {/* FRAUDE */}
 
      <div className="subsection">
 
        <div className="fraud-card">
 
          <div className="fraud-header">
 
            <div className="fraud-icon">
              <ShieldAlert size={22} />
            </div>
 
            <div>
 
              <span>
                CONTRÔLE DES BILLETS
              </span>
 
              <h3>
                Taux de fraude
              </h3>
 
            </div>
 
          </div>
 
 
          <div className="fraud-body">
 
            <strong>
              {stats.taux_fraude?.taux_pourcentage || 0}%
            </strong>
 
            <p>
 
              {stats.taux_fraude?.fraudes || 0}
              {" "}contrôle(s) non valide(s)
              sur{" "}
              {stats.taux_fraude?.total_controles || 0}
              {" "}contrôle(s).
 
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
        setErreur(
          "Impossible de charger les tarifs."
        )
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
 
        <div className="section-title-icon green-title">
          <WalletCards size={23} />
        </div>
 
        <div>
 
          <span className="section-eyebrow">
            GESTION FINANCIÈRE
          </span>
 
          <h2>
            Tarifs 1ère classe
          </h2>
 
          <p>
            Gérez les tarifs appliqués automatiquement
            aux achats de billets.
          </p>
 
        </div>
 
      </div>
 
 
      <div className="form-card">
 
        <div className="form-card-header">
 
          <div className="form-card-icon">
            <Plus size={19} />
          </div>
 
          <div>
 
            <h3>
              Ajouter un tarif
            </h3>
 
            <p>
              Définissez le montant et sa date d'entrée en vigueur.
            </p>
 
          </div>
 
        </div>
 
 
        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >
 
          <label>
 
            <span>
              Montant
            </span>
 
            <div className="input-with-icon">
 
              <WalletCards size={17} />
 
              <input
                type="number"
                value={montant}
                onChange={(e) =>
                  setMontant(e.target.value)
                }
                placeholder="Ex : 1500"
                required
              />
 
              <small>
                FCFA
              </small>
 
            </div>
 
          </label>
 
 
          <label>
 
            <span>
              Date d'effet
            </span>
 
            <div className="input-with-icon">
 
              <CalendarDays size={17} />
 
              <input
                type="date"
                value={dateEffet}
                onChange={(e) =>
                  setDateEffet(e.target.value)
                }
                required
              />
 
            </div>
 
          </label>
 
 
          <button
            type="submit"
            className="primary-button"
          >
 
            <Plus size={17} />
 
            Ajouter le tarif
 
          </button>
 
        </form>
 
      </div>
 
 
      {erreur && (
        <div className="admin-error-box">
 
          <ShieldAlert size={20} />
 
          <span>{erreur}</span>
 
        </div>
      )}
 
 
      <div className="data-header">
 
        <div>
 
          <h3>
            Historique des tarifs
          </h3>
 
          <p>
            Tarifs configurés dans le système.
          </p>
 
        </div>
 
        <div className="data-count">
          {tarifs.length} tarif(s)
        </div>
 
      </div>
 
 
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
 
                  <div className="money-cell">
 
                    <div className="money-icon">
                      <CircleDollarSign size={17} />
                    </div>
 
                    <strong className="money">
                      {Number(
                        t.montant
                      ).toLocaleString("fr-FR")} FCFA
                    </strong>
 
                  </div>
 
                </td>
 
 
                <td>
                  {t.date_effet}
                </td>
 
 
                <td>
 
                  {t.date_fin ? (
 
                    t.date_fin
 
                  ) : (
 
                    <span className="status-active">
 
                      <span className="status-dot"></span>
 
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
        setErreur(
          "Impossible de charger les gares."
        )
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
 
        <div className="section-title-icon blue-title">
          <MapPinned size={23} />
        </div>
 
        <div>
 
          <span className="section-eyebrow">
            RÉSEAU FERROVIAIRE
          </span>
 
          <h2>
            Gares de la ligne
          </h2>
 
          <p>
            Gérez les différentes gares desservies
            par le TER Sénégal.
          </p>
 
        </div>
 
      </div>
 
 
      <div className="form-card">
 
        <div className="form-card-header">
 
          <div className="form-card-icon blue">
            <Plus size={19} />
          </div>
 
          <div>
 
            <h3>
              Ajouter une gare
            </h3>
 
            <p>
              Définissez le nom et l'ordre de passage.
            </p>
 
          </div>
 
        </div>
 
 
        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >
 
          <label>
 
            <span>
              Nom de la gare
            </span>
 
            <div className="input-with-icon">
 
              <Building2 size={17} />
 
              <input
                value={nom}
                onChange={(e) =>
                  setNom(e.target.value)
                }
                placeholder="Ex : Dakar"
                required
              />
 
            </div>
 
          </label>
 
 
          <label>
 
            <span>
              Ordre
            </span>
 
            <div className="input-with-icon">
 
              <MapPinned size={17} />
 
              <input
                type="number"
                value={ordre}
                onChange={(e) =>
                  setOrdre(e.target.value)
                }
                placeholder="Ex : 1"
                required
              />
 
            </div>
 
          </label>
 
 
          <button
            type="submit"
            className="primary-button"
          >
 
            <Plus size={17} />
 
            Ajouter la gare
 
          </button>
 
        </form>
 
      </div>
 
 
      {erreur && (
 
        <div className="admin-error-box">
 
          <ShieldAlert size={20} />
 
          <span>{erreur}</span>
 
        </div>
 
      )}
 
 
      <div className="data-header">
 
        <div>
 
          <h3>
            Liste des gares
          </h3>
 
          <p>
            Ordre des gares sur la ligne.
          </p>
 
        </div>
 
        <div className="data-count">
          {gares.length} gare(s)
        </div>
 
      </div>
 
 
      <div className="stations-list">
 
        {[...gares]
          .sort((a, b) => a.ordre - b.ordre)
          .map((g, index) => (
 
            <div
              key={g.id}
              className="station-card"
            >
 
              <div className="station-order">
                {g.ordre}
              </div>
 
              <div className="station-line">
 
                {index !== 0 && (
                  <span className="station-line-top"></span>
                )}
 
                {index !== gares.length - 1 && (
                  <span className="station-line-bottom"></span>
                )}
 
              </div>
 
              <div className="station-info">
 
                <div className="station-icon">
                  <MapPinned size={18} />
                </div>
 
                <div>
 
                  <span>
                    GARE {String(g.ordre).padStart(2, "0")}
                  </span>
 
                  <strong>
                    {g.nom}
                  </strong>
 
                </div>
 
              </div>
 
            </div>
 
          ))}
 
      </div>
 
    </div>
  );
}
 
 
/* =========================================================
   TRAINS / WAGONS / SIÈGES
   ========================================================= */
 
function SectionTrainsWagons() {
 
  const [trains, setTrains] = useState([]);
 
  const [numeroTrain, setNumeroTrain] =
    useState("");
 
  const [erreur, setErreur] =
    useState(null);
 
 
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
        setErreur(
          "Impossible de charger les trains."
        )
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
 
 
  const tousWagons = trains.flatMap(
    (t) =>
      (t.wagons || []).map((w) => ({
        ...w,
        trainNumero: t.numero,
      }))
  );
 
 
  return (
 
    <div className="admin-section">
 
      <div className="section-title">
 
        <div className="section-title-icon train-title">
          <TrainFront size={23} />
        </div>
 
        <div>
 
          <span className="section-eyebrow">
            MATÉRIEL ROULANT
          </span>
 
          <h2>
            Trains, wagons et sièges
          </h2>
 
          <p>
            Configurez les trains et leurs places
            disponibles.
          </p>
 
        </div>
 
      </div>
 
 
      {erreur && (
 
        <div className="admin-error-box">
 
          <ShieldAlert size={20} />
 
          <span>{erreur}</span>
 
        </div>
 
      )}
 
 
      {/* TRAIN */}
 
      <div className="management-card">
 
        <div className="management-card-header">
 
          <div className="management-icon train">
            <TrainFront size={20} />
          </div>
 
          <div>
 
            <h3>
              Ajouter un train
            </h3>
 
            <p>
              Créez un nouveau train TER.
            </p>
 
          </div>
 
        </div>
 
 
        <form
          onSubmit={handleAjoutTrain}
          className="admin-form"
        >
 
          <label>
 
            <span>
              Numéro du train
            </span>
 
            <div className="input-with-icon">
 
              <TrainFront size={17} />
 
              <input
                value={numeroTrain}
                onChange={(e) =>
                  setNumeroTrain(e.target.value)
                }
                placeholder="Ex : TER01"
                required
              />
 
            </div>
 
          </label>
 
 
          <button
            type="submit"
            className="primary-button"
          >
 
            <Plus size={17} />
 
            Ajouter le train
 
          </button>
 
        </form>
 
      </div>
 
 
      {/* WAGON */}
 
      <div className="management-card">
 
        <div className="management-card-header">
 
          <div className="management-icon blue">
            <Database size={20} />
          </div>
 
          <div>
 
            <h3>
              Ajouter un wagon
            </h3>
 
            <p>
              Associez un wagon à un train.
            </p>
 
          </div>
 
        </div>
 
 
        <form
          onSubmit={handleAjoutWagon}
          className="admin-form"
        >
 
          <label>
 
            <span>
              Train
            </span>
 
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
 
            <span>
              Numéro du wagon
            </span>
 
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
 
            <span>
              Classe
            </span>
 
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
 
            <Plus size={17} />
 
            Ajouter le wagon
 
          </button>
 
        </form>
 
      </div>
 
 
      {/* SIEGE */}
 
      <div className="management-card">
 
        <div className="management-card-header">
 
          <div className="management-icon purple">
            <Armchair size={20} />
          </div>
 
          <div>
 
            <h3>
              Ajouter un siège
            </h3>
 
            <p>
              Ajoutez une place à un wagon.
            </p>
 
          </div>
 
        </div>
 
 
        <form
          onSubmit={handleAjoutSiege}
          className="admin-form"
        >
 
          <label>
 
            <span>
              Wagon
            </span>
 
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
 
                  Train {w.trainNumero}
                  {" - "}
                  Wagon {w.numero}
                  {" ("}
                  {w.classe}
                  {")"}
 
                </option>
 
              ))}
 
            </select>
 
          </label>
 
 
          <label>
 
            <span>
              Numéro du siège
            </span>
 
            <div className="input-with-icon">
 
              <Armchair size={17} />
 
              <input
                value={numeroSiege}
                onChange={(e) =>
                  setNumeroSiege(e.target.value)
                }
                placeholder="Ex : A01"
                required
              />
 
            </div>
 
          </label>
 
 
          <button
            type="submit"
            className="primary-button"
          >
 
            <Plus size={17} />
 
            Ajouter le siège
 
          </button>
 
        </form>
 
      </div>
 
 
      {/* VUE ENSEMBLE */}
 
      <div className="overview-section">
 
        <div className="data-header">
 
          <div>
 
            <h3>
              Vue d'ensemble
            </h3>
 
            <p>
              Configuration actuelle du parc.
            </p>
 
          </div>
 
          <div className="data-count">
            {trains.length} train(s)
          </div>
 
        </div>
 
 
        <div className="train-grid">
 
          {trains.map((t) => (
 
            <div
              key={t.id}
              className="train-card"
            >
 
              <div className="train-card-header">
 
                <div className="train-card-icon">
                  <TrainFront size={23} />
                </div>
 
                <div>
 
                  <span>
                    TRAIN
                  </span>
 
                  <strong>
                    {t.numero}
                  </strong>
 
                </div>
 
              </div>
 
 
              <div className="train-route-decoration">
 
                <span></span>
                <div></div>
                <span></span>
 
              </div>
 
 
              <div className="wagon-list">
 
                {(t.wagons || []).map((w) => (
 
                  <div
                    key={w.id}
                    className="wagon-item"
                  >
 
                    <div className="wagon-info">
 
                      <div className="wagon-icon">
                        <Database size={16} />
                      </div>
 
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
 
                    </div>
 
 
                    <div className="seat-count">
 
                      <Armchair size={14} />
 
                      {w.sieges?.length || 0}
 
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
  const [erreur, setErreur] = useState(null);
  const [filtre, setFiltre] = useState("TOUS"); // TOUS | A_VENIR | TERMINE
 
 
  function recharger() {
 
    setErreur(null);
 
    listerVoyagesAdmin()
 
      .then(setVoyages)
 
      .catch(() =>
        setErreur(
          "Impossible de charger les voyages."
        )
      );
 
  }
 
  useEffect(recharger, []);
 
 
  function formaterDate(date) {
 
    if (!date) {
      return "Non disponible";
    }
 
    const d = new Date(date);
 
    if (Number.isNaN(d.getTime())) {
      return "Non disponible";
    }
 
    return d.toLocaleString("fr-FR");
 
  }
 
  const nombreAVenir = voyages.filter((v) => v.statut_temporel === "A_VENIR").length;
  const nombreTermines = voyages.filter((v) => v.statut_temporel === "TERMINE").length;
  const voyagesAffiches = voyages.filter((v) => filtre === "TOUS" || v.statut_temporel === filtre);
 
 
  return (
 
    <div className="admin-section">
 
      <div className="section-title">
 
        <div className="section-title-icon calendar-title">
          <CalendarDays size={23} />
        </div>
 
        <div>
 
          <span className="section-eyebrow">
            PLANIFICATION
          </span>
 
          <h2>
            Voyages
          </h2>
 
          <p>
            Consultez les voyages générés automatiquement
            par le système.
          </p>
 
        </div>
 
      </div>
 
 
      <div className="voyages-info">
 
        <div className="voyages-info-icon">
          <RefreshCw size={21} />
        </div>
 
        <div>
 
          <strong>
            Génération automatique
          </strong>
 
          <p>
            Les voyages sont générés automatiquement
            toutes les 10 minutes, dans les deux sens
            Dakar ↔ Diamniadio, au fur et à mesure
            des recherches.
          </p>
 
        </div>
 
      </div>
 
 
      {erreur && (
 
        <div className="admin-error-box">
 
          <ShieldAlert size={20} />
 
          <span>{erreur}</span>
 
        </div>
 
      )}
 
 
      {/* CARTES RAPIDES - vue d'ensemble en un coup d'oeil */}
 
      <div className="stats-overview" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
 
        <div className="stats-overview-card">
          <div className="stats-overview-icon green">
            <CalendarDays size={22} />
          </div>
          <div>
            <span>Voyages au total</span>
            <strong>{voyages.length}</strong>
          </div>
        </div>
 
        <div className="stats-overview-card">
          <div className="stats-overview-icon blue">
            <Clock3 size={22} />
          </div>
          <div>
            <span>À venir</span>
            <strong>{nombreAVenir}</strong>
          </div>
        </div>
 
        <div className="stats-overview-card">
          <div className="stats-overview-icon purple">
            <Route size={22} />
          </div>
          <div>
            <span>Terminés</span>
            <strong>{nombreTermines}</strong>
          </div>
        </div>
 
      </div>
 
 
      {/* FILTRE */}
 
      <div className="admin-tabs" style={{ marginBottom: 20, maxWidth: 420 }}>
 
        {[
          ["TOUS", "Tous"],
          ["A_VENIR", "À venir"],
          ["TERMINE", "Terminés"],
        ].map(([valeur, libelle]) => (
 
          <button
            key={valeur}
            type="button"
            onClick={() => setFiltre(valeur)}
            className={`admin-tab ${filtre === valeur ? "active" : ""}`}
          >
            <span className="admin-tab-label">{libelle}</span>
          </button>
 
        ))}
 
      </div>
 
 
      <div className="voyages-toolbar">
 
        <div>
 
          <h3>
            Voyages disponibles
          </h3>
 
          <p>
            {voyagesAffiches.length} voyage(s) affiché(s) sur {voyages.length}
          </p>
 
        </div>
 
 
        <button
          type="button"
          onClick={recharger}
          className="secondary-button"
        >
 
          <RefreshCw size={16} />
 
          Actualiser
 
        </button>
 
      </div>
 
 
      <div className="voyages-list">
 
        {voyagesAffiches.map((v) => (
 
          <div
            key={v.id}
            className="voyage-card"
          >
 
            <div className="voyage-train">
 
              <div className="voyage-train-icon">
                <TrainFront size={21} />
              </div>
 
              <div>
 
                <span>
                  TRAIN
                </span>
 
                <strong>
                  {v.train}
                </strong>
 
              </div>
 
            </div>
 
 
            <div className="voyage-route">
 
              <div className="voyage-station">
 
                <span>
                  DÉPART
                </span>
 
                <strong>
                  {v.gare_depart?.nom}
                </strong>
 
              </div>
 
 
              <div className="voyage-line">
 
                <span className="voyage-dot"></span>
 
                <div></div>
 
                <TrainFront size={17} />
 
                <div></div>
 
                <span className="voyage-dot"></span>
 
              </div>
 
 
              <div className="voyage-station arrival">
 
                <span>
                  ARRIVÉE
                </span>
 
                <strong>
                  {v.gare_arrivee?.nom}
                </strong>
 
              </div>
 
            </div>
 
 
            <div className="voyage-times">
 
              <div>
 
                <Clock3 size={16} />
 
                <span>
                  Départ
                </span>
 
                <strong>
                  {formaterDate(
                    v.date_heure_depart
                  )}
                </strong>
 
              </div>
 
 
              <div>
 
                <Clock3 size={16} />
 
                <span>
                  Arrivée
                </span>
 
                <strong>
                  {formaterDate(
                    v.date_heure_arrivee
                  )}
                </strong>
 
              </div>
 
            </div>
 
 
            {/* Statut temporel + occupation */}
 
            <div style={{ display: "flex", alignItems: "center", gap: 10, gridColumn: "1 / -1", marginTop: 4 }}>
 
              {v.statut_temporel === "A_VENIR" ? (
                <span className="status-active">
                  <span className="status-dot"></span>
                  À venir
                </span>
              ) : (
                <span className="number-badge">
                  Terminé
                </span>
              )}
 
              <span className="seat-count">
                <Armchair size={14} />
                {v.nombre_billets_vendus} / {v.capacite} siège(s)
              </span>
 
            </div>
 
          </div>
 
        ))}
 
        {voyagesAffiches.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-light)", padding: "20px 0" }}>
            Aucun voyage à afficher pour ce filtre.
          </p>
        )}
 
      </div>
 
    </div>
  );
}
 