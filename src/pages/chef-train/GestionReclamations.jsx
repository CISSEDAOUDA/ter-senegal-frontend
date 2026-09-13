import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  MessageSquareWarning,
  RefreshCw,
  Train,
  Wrench,
} from "lucide-react";

import {
  listerToutesReclamations,
  changerStatutReclamation,
} from "../../api/chefTrain";

import "./GestionReclamations.css";

const STATUTS = ["OUVERTE", "EN_COURS", "RESOLUE"];

const LIBELLE_STATUT = {
  OUVERTE: "Ouverte",
  EN_COURS: "En cours de traitement",
  RESOLUE: "Résolue",
};

const CLASSES_STATUT = {
  OUVERTE: "ouverte",
  EN_COURS: "en-cours",
  RESOLUE: "resolue",
};

export default function GestionReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [misAJourId, setMisAJourId] = useState(null);

  function charger() {
    setErreur(null);

    listerToutesReclamations()
      .then(setReclamations)
      .catch(() =>
        setErreur(
          "Impossible de charger les réclamations."
        )
      )
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger();
  }, []);

  async function handleChangerStatut(id, nouveauStatut) {
    setMisAJourId(id);

    try {
      await changerStatutReclamation(
        id,
        nouveauStatut
      );

      charger();
    } catch (err) {
      alert(
        "Impossible de mettre à jour le statut."
      );
    } finally {
      setMisAJourId(null);
    }
  }

  function getIconeStatut(statut) {
    if (statut === "RESOLUE") {
      return <CheckCircle2 size={16} />;
    }

    if (statut === "EN_COURS") {
      return <Clock size={16} />;
    }

    return <AlertCircle size={16} />;
  }

  /* =========================
     STATISTIQUES
  ========================= */

  const ouvertes = reclamations.filter(
    (r) => r.statut === "OUVERTE"
  ).length;

  const enCours = reclamations.filter(
    (r) => r.statut === "EN_COURS"
  ).length;

  const resolues = reclamations.filter(
    (r) => r.statut === "RESOLUE"
  ).length;

  /* =========================
     CHARGEMENT
  ========================= */

  if (chargement) {
    return (
      <div className="gestion-page">

        <div className="gestion-loading">

          <div className="gestion-loading-icon">
            <RefreshCw size={27} />
          </div>

          <h2>
            Chargement des réclamations
          </h2>

          <p>
            Récupération des incidents signalés...
          </p>

        </div>

      </div>
    );
  }

  /* =========================
     ERREUR
  ========================= */

  if (erreur) {
    return (
      <div className="gestion-page">

        <div className="gestion-error">

          <AlertCircle size={25} />

          <div>
            <h2>
              Une erreur est survenue
            </h2>

            <p>{erreur}</p>
          </div>

          <button
            className="retry-button"
            onClick={() => {
              setChargement(true);
              charger();
            }}
          >
            <RefreshCw size={16} />
            Réessayer
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="gestion-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="gestion-header">

        <div className="gestion-title">

          <div className="gestion-title-icon">
            <MessageSquareWarning size={29} />
          </div>

          <div>

            <p className="gestion-small-title">
              ESPACE CHEF DE TRAIN
            </p>

            <h1>
              Supervision des réclamations
            </h1>

            <p className="gestion-subtitle">
              Gérez les incidents et suivez leur traitement
              à bord du TER Sénégal.
            </p>

          </div>

        </div>

        <button
          className="refresh-button"
          onClick={() => {
            setChargement(true);
            charger();
          }}
        >
          <RefreshCw size={17} />
          Actualiser
        </button>

      </div>


      {/* =================================================
          STATISTIQUES
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon total">
            <MessageSquareWarning size={21} />
          </div>

          <div>
            <span>Total</span>
            <strong>{reclamations.length}</strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon ouverte">
            <AlertCircle size={21} />
          </div>

          <div>
            <span>Ouvertes</span>
            <strong>{ouvertes}</strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon encours">
            <Clock size={21} />
          </div>

          <div>
            <span>En cours</span>
            <strong>{enCours}</strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon resolue">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Résolues</span>
            <strong>{resolues}</strong>
          </div>

        </div>

      </div>


      {/* =================================================
          TITRE LISTE
      ================================================= */}

      <div className="liste-header">

        <div>

          <p className="gestion-small-title">
            INCIDENTS
          </p>

          <h2>
            Réclamations des passagers
          </h2>

        </div>

        <span className="liste-count">
          {reclamations.length}{" "}
          {reclamations.length <= 1
            ? "réclamation"
            : "réclamations"}
        </span>

      </div>


      {/* =================================================
          AUCUNE
      ================================================= */}

      {reclamations.length === 0 && (

        <div className="empty-gestion">

          <div className="empty-gestion-icon">
            <CheckCircle2 size={42} />
          </div>

          <h2>
            Aucun incident signalé
          </h2>

          <p>
            Toutes les situations sont actuellement
            sous contrôle.
          </p>

        </div>

      )}


      {/* =================================================
          LISTE
      ================================================= */}

      {reclamations.length > 0 && (

        <div className="gestion-list">

          {reclamations.map((r) => {

            const passager =
              `${r.passager?.utilisateur?.first_name || ""}
              ${r.passager?.utilisateur?.last_name || ""}`.trim();

            const dateCreation = r.date_creation
              ? new Date(r.date_creation)
              : null;

            return (
              <div
                className="gestion-card"
                key={r.id}
              >

                {/* ICÔNE */}

                <div className="gestion-card-icon">
                  <MessageSquareWarning size={23} />
                </div>


                {/* CONTENU */}

                <div className="gestion-card-content">

                  {/* TOP */}

                  <div className="gestion-card-top">

                    <div>

                      <p className="passager-label">
                        PASSAGER
                      </p>

                      <h3>
                        {passager || "Passager inconnu"}
                      </h3>

                    </div>


                    <span
                      className={`gestion-status ${
                        CLASSES_STATUT[r.statut] || ""
                      }`}
                    >
                      {getIconeStatut(r.statut)}

                      {LIBELLE_STATUT[r.statut] ||
                        r.statut}
                    </span>

                  </div>


                  {/* DESCRIPTION */}

                  <div className="description-box">

                    <p>
                      {r.description}
                    </p>

                  </div>


                  {/* SERVICE */}

                  {r.service_premium && (

                    <div className="gestion-service">

                      <div className="service-icon">
                        <Wrench size={16} />
                      </div>

                      <div>

                        <span>
                          SERVICE CONCERNÉ
                        </span>

                        <strong>
                          {r.service_premium.type}

                          {r.service_premium.wagon?.numero
                            ? ` • Wagon ${r.service_premium.wagon.numero}`
                            : ""}
                        </strong>

                      </div>

                    </div>

                  )}


                  {/* DATE */}

                  {dateCreation && (

                    <div className="gestion-date">

                      <Clock size={14} />

                      Signalée le{" "}
                      {dateCreation.toLocaleString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}

                    </div>

                  )}


                  {/* ACTION */}

                  <div className="gestion-action">

                    <div className="action-label">

                      <ArrowUpCircle size={15} />

                      Modifier le statut

                    </div>

                    <select
                      value={r.statut}
                      onChange={(e) =>
                        handleChangerStatut(
                          r.id,
                          e.target.value
                        )
                      }
                      disabled={
                        misAJourId === r.id
                      }
                      className={`status-select ${
                        CLASSES_STATUT[r.statut] ||
                        ""
                      }`}
                    >

                      {STATUTS.map((s) => (

                        <option
                          key={s}
                          value={s}
                        >
                          {LIBELLE_STATUT[s]}
                        </option>

                      ))}

                    </select>

                    {misAJourId === r.id && (
                      <span className="updating">
                        Mise à jour...
                      </span>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}


      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="chef-info">

        <div className="chef-info-icon">
          <Train size={21} />
        </div>

        <div>

          <strong>
            Supervision à bord
          </strong>

          <p>
            Mettez à jour le statut d'une réclamation
            après avoir traité l'incident avec le passager.
          </p>

        </div>

      </div>

    </div>
  );
}