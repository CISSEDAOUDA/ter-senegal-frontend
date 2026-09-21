
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  QrCode,
  ShoppingCart,
  Ticket,
  Trash2,
  TrainFront,
  UserRound,
} from "lucide-react";

import {
  listerBilletsPassager,
  supprimerBillet,
} from "../../api/billetterie";

import "./MesBillets.css";

const LIBELLE_STATUT = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirmé",
  ANNULE: "Annulé",
};

function formaterDate(date) {
  if (!date) return "Non disponible";

  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Non disponible";
  }

  return valeur.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formaterHeure(date) {
  if (!date) return "--:--";

  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "--:--";
  }

  return valeur.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formaterDateHeure(date) {
  if (!date) return "Non disponible";

  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Non disponible";
  }

  return valeur.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getClasseStatut(statut) {
  switch (statut) {
    case "CONFIRME":
      return "statut-confirme";

    case "EN_ATTENTE":
      return "statut-attente";

    case "ANNULE":
      return "statut-annule";

    default:
      return "statut-attente";
  }
}

export default function MesBillets() {
  const [billets, setBillets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(null);

  useEffect(() => {
    listerBilletsPassager()
      .then(setBillets)
      .catch(() => {
        setErreur("Impossible de charger vos billets.");
      })
      .finally(() => {
        setChargement(false);
      });
  }, []);

  async function handleSupprimer(id) {
    if (!window.confirm("Supprimer définitivement ce billet ?")) {
      return;
    }

    setSuppressionEnCours(id);

    try {
      await supprimerBillet(id);

      setBillets((liste) =>
        liste.filter((b) => b.id !== id)
      );
    } catch (err) {
      alert("Impossible de supprimer ce billet.");
    } finally {
      setSuppressionEnCours(null);
    }
  }

  /* =====================================================
     CHARGEMENT
  ===================================================== */

  if (chargement) {
    return (
      <div className="billets-page">
        <div className="billets-loading">
          <div className="loading-train">
            <TrainFront size={34} />
          </div>

          <h2>Chargement de vos billets...</h2>

          <p>
            Nous récupérons vos réservations TER Sénégal.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERREUR
  ===================================================== */

  if (erreur) {
    return (
      <div className="billets-page">
        <div className="billets-error">
          <Ticket size={30} />

          <div>
            <h2>Une erreur est survenue</h2>
            <p>{erreur}</p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="billets-page">

      <div className="billets-container">

        {/* =================================================
            RETOUR
        ================================================= */}

        <Link
          to="/"
          className="billets-back"
        >
          <ArrowLeft size={17} />
          Retour à l'accueil
        </Link>


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="billets-header">

          <div className="billets-title-area">

            <div className="billets-title-icon">
              <Ticket size={30} />
            </div>

            <div>
              <span className="billets-eyebrow">
                ESPACE PASSAGER
              </span>

              <h1>Mes billets</h1>

              <p>
                Retrouvez ici toutes vos réservations TER Sénégal.
              </p>
            </div>

          </div>


          <Link
            to="/passager/achat"
            className="billets-buy-button"
          >
            <ShoppingCart size={18} />
            Acheter un billet
          </Link>

        </header>


        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <div className="billets-summary">

          <div className="summary-card">

            <div className="summary-icon">
              <Ticket size={21} />
            </div>

            <div>
              <strong>{billets.length}</strong>
              <span>
                {billets.length > 1
                  ? "billets"
                  : "billet"}
              </span>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              <QrCode size={21} />
            </div>

            <div>
              <strong>
                {billets.filter(
                  (b) => b.statut === "CONFIRME"
                ).length}
              </strong>

              <span>confirmé(s)</span>
            </div>

          </div>

        </div>


        {/* =================================================
            AUCUN BILLET
        ================================================= */}

        {billets.length === 0 && (

          <div className="empty-billets">

            <div className="empty-icon">
              <Ticket size={42} />
            </div>

            <h2>Aucun billet pour le moment</h2>

            <p>
              Vous n'avez encore effectué aucune réservation.
              Achetez votre premier billet TER Sénégal.
            </p>

            <Link
              to="/passager/achat"
              className="empty-button"
            >
              <ShoppingCart size={18} />
              Acheter un billet
            </Link>

          </div>

        )}


        {/* =================================================
            LISTE DES BILLETS
        ================================================= */}

        {billets.length > 0 && (

          <div className="billets-list">

            {billets.map((b) => (

              <article
                key={b.id}
                className="billet-card"
              >

                {/* =========================================
                    BANDEAU
                ========================================= */}

                <div className="billet-top">

                  <div className="billet-number">

                    <div className="billet-small-icon">
                      <TrainFront size={17} />
                    </div>

                    <div>
                      <span>Billet TER Sénégal</span>

                      <strong>
                        #{String(b.id).padStart(4, "0")}
                      </strong>
                    </div>

                  </div>


                  <span
                    className={`billet-status ${getClasseStatut(
                      b.statut
                    )}`}
                  >
                    <span className="status-dot"></span>

                    {LIBELLE_STATUT[b.statut] ||
                      b.statut}
                  </span>

                </div>


                {/* =========================================
                    CORPS
                ========================================= */}

                <div className="billet-body">

                  {/* QR CODE */}

                  <div className="billet-qr-section">

                    <div className="qr-wrapper">

                      <QRCodeSVG
                        value={b.qr_code || String(b.id)}
                        size={150}
                        bgColor="#ffffff"
                        fgColor="#294a63"
                        level="M"
                      />

                    </div>

                    <div className="qr-label">
                      <QrCode size={14} />
                      Scanner pour contrôler
                    </div>

                  </div>


                  {/* TRAJET + INFOS */}

                  <div className="billet-main">

                    {/* TRAJET */}

                    <div className="trajet-section">

                      <span className="section-label">
                        TRAJET
                      </span>

                      <div className="trajet">

                        <div className="gare">

                          <span className="gare-label">
                            Départ
                          </span>

                          <strong>
                            {b.gare_embarquement?.nom ||
                              "Non disponible"}
                          </strong>

                        </div>


                        <div className="trajet-line">

                          <span className="line-dot"></span>

                          <span className="line">
                            <ArrowRight size={19} />
                          </span>

                          <span className="line-dot"></span>

                        </div>


                        <div className="gare gare-arrivee">

                          <span className="gare-label">
                            Arrivée
                          </span>

                          <strong>
                            {b.gare_debarquement?.nom ||
                              "Non disponible"}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* INFORMATIONS */}

                    <div className="billet-info-grid">

                      <div className="info-box">

                        <div className="info-icon">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <span>Date</span>

                          <strong>
                            {formaterDate(
                              b.heure_embarquement
                            )}
                          </strong>
                        </div>

                      </div>


                      <div className="info-box">

                        <div className="info-icon">
                          <Clock3 size={17} />
                        </div>

                        <div>
                          <span>Embarquement</span>

                          <strong>
                            {formaterHeure(
                              b.heure_embarquement
                            )}
                          </strong>
                        </div>

                      </div>


                      <div className="info-box">

                        <div className="info-icon">
                          <Clock3 size={17} />
                        </div>

                        <div>
                          <span>Débarquement</span>

                          <strong>
                            {formaterHeure(
                              b.heure_debarquement
                            )}
                          </strong>
                        </div>

                      </div>


                      <div className="info-box">

                        <div className="info-icon">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <span>Siège</span>

                          <strong>
                            {b.siege?.numero ||
                              "Non attribué"}
                          </strong>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =========================================
                    FOOTER
                ========================================= */}

                <div className="billet-footer">

                  <div className="purchase-date">

                    <CalendarDays size={15} />

                    <span>
                      Acheté le{" "}
                      {formaterDateHeure(
                        b.date_achat
                      )}
                    </span>

                  </div>


                  {b.deja_utilise && (

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleSupprimer(b.id)
                      }
                      disabled={
                        suppressionEnCours === b.id
                      }
                    >

                      <Trash2 size={16} />

                      {suppressionEnCours === b.id
                        ? "Suppression..."
                        : "Supprimer"}

                    </button>

                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

