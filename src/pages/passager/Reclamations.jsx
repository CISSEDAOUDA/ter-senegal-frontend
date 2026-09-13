import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  AlertCircle,
  Train,
  Wrench,
} from "lucide-react";

import {
  listerReclamations,
  creerReclamation,
  listerServicesPremium,
} from "../../api/premium";

import "./Reclamations.css";

const LIBELLE_STATUT = {
  OUVERTE: "Ouverte",
  EN_COURS: "En cours de traitement",
  RESOLUE: "Résolue",
};

const COULEUR_STATUT = {
  OUVERTE: "ouverte",
  EN_COURS: "en-cours",
  RESOLUE: "resolue",
};

export default function Reclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [services, setServices] = useState([]);
  const [description, setDescription] = useState("");
  const [servicePremiumId, setServicePremiumId] = useState("");
  const [erreur, setErreur] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [chargement, setChargement] = useState(true);

  function chargerReclamations() {
    listerReclamations()
      .then(setReclamations)
      .catch(() =>
        setErreur("Impossible de charger vos réclamations.")
      )
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerReclamations();

    listerServicesPremium()
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setErreur(null);
    setEnvoiEnCours(true);

    try {
      const donnees = {
        description,
      };

      if (servicePremiumId) {
        donnees.service_premium_id = Number(servicePremiumId);
      }

      await creerReclamation(donnees);

      setDescription("");
      setServicePremiumId("");

      setChargement(true);
      chargerReclamations();

    } catch (err) {
      const details = err.response?.data;

      setErreur(
        details
          ? JSON.stringify(details)
          : "Erreur lors de l'envoi de la réclamation."
      );
    } finally {
      setEnvoiEnCours(false);
    }
  }

  function getStatusIcon(statut) {
    if (statut === "RESOLUE") {
      return <CheckCircle2 size={16} />;
    }

    if (statut === "EN_COURS") {
      return <Clock size={16} />;
    }

    return <AlertCircle size={16} />;
  }

  return (
    <div className="reclamations-page">

      {/* =========================================
          RETOUR
      ========================================== */}

      <Link
        to="/passager/billets"
        className="reclamations-back"
      >
        <ArrowLeft size={17} />
        Retour à mes billets
      </Link>


      {/* =========================================
          HEADER
      ========================================== */}

      <div className="reclamations-header">

        <div className="reclamations-title-area">

          <div className="reclamations-title-icon">
            <MessageSquareWarning size={29} />
          </div>

          <div>
            <p className="reclamations-small-title">
              ESPACE PASSAGER
            </p>

            <h1>
              Réclamations
            </h1>
          </div>

        </div>

        <div className="premium-badge">
          <Wrench size={16} />
          Service Premium
        </div>

      </div>


      <p className="reclamations-introduction">
        Signalez facilement un problème rencontré pendant votre
        voyage. Notre équipe pourra traiter votre demande dans
        les meilleurs délais.
      </p>


      {/* =========================================
          FORMULAIRE
      ========================================== */}

      <div className="reclamation-form-card">

        <div className="form-card-header">

          <div className="form-icon">
            <MessageSquareWarning size={22} />
          </div>

          <div>
            <h2>
              Signaler un problème
            </h2>

            <p>
              Décrivez-nous ce qui s'est passé.
            </p>
          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="reclamation-form"
        >

          {/* SERVICE */}

          <div className="form-group">

            <label htmlFor="service">
              Service concerné
              <span>Optionnel</span>
            </label>

            <select
              id="service"
              value={servicePremiumId}
              onChange={(e) =>
                setServicePremiumId(e.target.value)
              }
            >

              <option value="">
                Réclamation générale
              </option>

              {services.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                >
                  {s.type}
                  {s.wagon?.numero
                    ? ` - Wagon ${s.wagon.numero}`
                    : ""}
                </option>
              ))}

            </select>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <div className="label-description">

              <label htmlFor="description">
                Description du problème
              </label>

              <span>
                {description.length}/1000
              </span>

            </div>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
              rows={6}
              maxLength={1000}
              placeholder="Exemple : La climatisation ne fonctionne pas dans mon wagon..."
            />

          </div>


          {/* MESSAGE ERREUR */}

          {erreur && (
            <div className="reclamation-error">
              <AlertCircle size={19} />
              <span>{erreur}</span>
            </div>
          )}


          {/* BOUTON */}

          <button
            type="submit"
            disabled={
              envoiEnCours ||
              !description.trim()
            }
            className="reclamation-submit"
          >

            {envoiEnCours ? (
              <>
                <span className="button-spinner"></span>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={18} />
                Envoyer la réclamation
              </>
            )}

          </button>

        </form>

      </div>


      {/* =========================================
          MES RECLAMATIONS
      ========================================== */}

      <div className="mes-reclamations-header">

        <div>
          <p className="reclamations-small-title">
            HISTORIQUE
          </p>

          <h2>
            Mes réclamations
          </h2>
        </div>

        <div className="reclamation-count">
          {reclamations.length}
          <span>
            {reclamations.length <= 1
              ? "demande"
              : "demandes"}
          </span>
        </div>

      </div>


      {/* CHARGEMENT */}

      {chargement && (
        <div className="reclamations-loading">

          <div className="loading-circle">
            <MessageSquareWarning size={25} />
          </div>

          <h3>
            Chargement de vos réclamations
          </h3>

          <p>
            Veuillez patienter...
          </p>

        </div>
      )}


      {/* AUCUNE */}

      {!chargement &&
        reclamations.length === 0 && (
          <div className="empty-reclamations">

            <div className="empty-reclamation-icon">
              <MessageSquareWarning size={40} />
            </div>

            <h2>
              Aucune réclamation
            </h2>

            <p>
              Vous n'avez encore envoyé aucune réclamation.
            </p>

          </div>
        )}


      {/* LISTE */}

      {!chargement &&
        reclamations.length > 0 && (

          <div className="reclamations-list">

            {reclamations.map((r) => {

              const date = r.date_creation
                ? new Date(r.date_creation)
                : null;

              return (
                <div
                  className="reclamation-card"
                  key={r.id}
                >

                  {/* ICÔNE */}

                  <div className="reclamation-icon">
                    <MessageSquareWarning size={23} />
                  </div>


                  {/* CONTENU */}

                  <div className="reclamation-content">

                    <div className="reclamation-top">

                      <span
                        className={`status-badge ${
                          COULEUR_STATUT[r.statut] ||
                          ""
                        }`}
                      >
                        {getStatusIcon(r.statut)}

                        {LIBELLE_STATUT[r.statut] ||
                          r.statut}
                      </span>

                      {date && (
                        <span className="reclamation-date">
                          {date.toLocaleString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      )}

                    </div>


                    <p className="reclamation-description">
                      {r.description}
                    </p>


                    {r.service_premium && (
                      <div className="service-info">

                        <Wrench size={15} />

                        <span>
                          {r.service_premium.type}

                          {r.service_premium.wagon?.numero
                            ? ` • Wagon ${r.service_premium.wagon.numero}`
                            : ""}
                        </span>

                      </div>
                    )}


                    {date && (
                      <p className="reclamation-created">
                        Réclamation envoyée le{" "}
                        {date.toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}


      {/* =========================================
          INFORMATION
      ========================================== */}

      <div className="reclamation-information">

        <div className="information-icon">
          <Train size={21} />
        </div>

        <div>

          <strong>
            Besoin d'aide ?
          </strong>

          <p>
            Votre réclamation est transmise à l'équipe
            responsable pour traitement.
          </p>

        </div>

      </div>

    </div>
  );
}