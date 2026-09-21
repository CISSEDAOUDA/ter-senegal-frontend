import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrainFront,
  MapPin,
  CalendarDays,
  Clock3,
  Armchair,
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ArrowRight,
  Ticket,
  X,
  UserRound,
} from "lucide-react";

import {
  listerGares,
  rechercherVoyage,
  listerSiegesDisponibles,
  acheterBillet,
  tarifActuel,
} from "../../api/billetterie";

import { moi } from "../../api/comptes";

import "./AchatBillet.css";

const METHODES = [
  { value: "ORANGE_MONEY", label: "Orange Money" },
  { value: "WAVE", label: "Wave" },
  { value: "GUICHET", label: "Guichet" },
  { value: "BORNE", label: "Borne automatique" },
];

const METHODES_MOBILES = ["ORANGE_MONEY", "WAVE"];

const COULEURS_APP = {
  ORANGE_MONEY: { fond: "#ff6600", texte: "#fff" },
  WAVE: { fond: "#1dc8f2", texte: "#fff" },
};


/* =====================================================
   ECRAN PAIEMENT
===================================================== */

function EcranPaiementSimule({
  methode,
  montant,
  enCours,
  onConfirmer,
  onAnnuler,
}) {
  const [montantSaisi, setMontantSaisi] = useState("");

  const couleurs =
    COULEURS_APP[methode] || {
      fond: "#333",
      texte: "#fff",
    };

  const nomApp =
    methode === "WAVE" ? "Wave" : "Orange Money";

  const montantAttendu =
    montant != null ? Number(montant) : null;

  const montantValide =
    montantAttendu != null &&
    Number(montantSaisi) === montantAttendu;

  return (
    <div className="paiement-page">

      <div className="paiement-card">

        <div
          className="paiement-header"
          style={{ background: couleurs.fond }}
        >
          <div className="paiement-app-icon">
            <Smartphone size={30} />
          </div>

          <h2>{nomApp}</h2>

          <p>
            Paiement sécurisé de votre billet TER Sénégal
          </p>
        </div>

        <div className="paiement-content">

          <div className="paiement-ter">
            <TrainFront size={22} />
            <span>TER SENEGAL</span>
          </div>

          <p className="paiement-label">
            Montant à payer
          </p>

          <div className="paiement-montant">
            {montantAttendu != null
              ? `${montantAttendu.toLocaleString("fr-FR")} FCFA`
              : "—"}
          </div>

          <div className="paiement-beneficiaire">
            <UserRound size={22} />

            <div>
              <small>Bénéficiaire</small>
              <strong>TER Sénégal</strong>
            </div>
          </div>

          <label className="paiement-input-label">
            Montant à envoyer

            <div className="paiement-input-wrapper">
              <input
                type="number"
                value={montantSaisi}
                onChange={(e) =>
                  setMontantSaisi(e.target.value)
                }
                placeholder={
                  montantAttendu != null
                    ? String(montantAttendu)
                    : ""
                }
              />

              <span>FCFA</span>
            </div>
          </label>

          {montantSaisi && !montantValide && (
            <div className="paiement-error">
              <AlertCircle size={18} />

              <span>
                Le montant doit correspondre exactement
                au prix du billet.
              </span>
            </div>
          )}

          <button
            onClick={onConfirmer}
            disabled={enCours || !montantValide}
            className="paiement-confirm"
            style={{ background: couleurs.fond }}
          >
            {enCours ? (
              "Confirmation..."
            ) : (
              <>
                Confirmer le paiement
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            onClick={onAnnuler}
            disabled={enCours}
            className="paiement-annuler"
          >
            <X size={17} />
            Annuler
          </button>

        </div>
      </div>

    </div>
  );
}


/* =====================================================
   PAGE ACHAT
===================================================== */

export default function AchatBillet() {

  const [gares, setGares] = useState([]);

  const [gareEmbarquementId, setGareEmbarquementId] =
    useState("");

  const [gareDebarquementId, setGareDebarquementId] =
    useState("");

  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");

  const [rechercheEnCours, setRechercheEnCours] =
    useState(false);

  const [erreurRecherche, setErreurRecherche] =
    useState(null);

  const [resultatRecherche, setResultatRecherche] =
    useState(null);

  const [sieges, setSieges] = useState([]);
  const [siegeId, setSiegeId] = useState("");

  const [methode, setMethode] =
    useState(METHODES[0].value);

  const [tarif, setTarif] = useState(null);

  const [erreurTarif, setErreurTarif] =
    useState(null);

  const [erreur, setErreur] = useState(null);

  const [confirmation, setConfirmation] =
    useState(null);

  const [afficherAppPaiement, setAfficherAppPaiement] =
    useState(false);

  const [confirmationEnCours, setConfirmationEnCours] =
    useState(false);

  const navigate = useNavigate();


  /* =====================================================
     CHARGEMENT
  ===================================================== */

  useEffect(() => {

    listerGares()
      .then(setGares)
      .catch(() =>
        setErreurRecherche(
          "Impossible de charger les gares."
        )
      );

    tarifActuel()
      .then(setTarif)
      .catch((err) => {

        setTarif(null);

        setErreurTarif(
          `Impossible de récupérer le tarif (${
            err.response?.status ||
            "erreur réseau"
          }).`
        );
      });

  }, []);


  /* =====================================================
     RECHERCHE
  ===================================================== */

  async function handleRecherche(e) {

    e.preventDefault();

    setErreurRecherche(null);
    setResultatRecherche(null);
    setSieges([]);
    setSiegeId("");

    if (
      !gareEmbarquementId ||
      !gareDebarquementId ||
      !date ||
      !heure
    ) {
      return;
    }

    if (
      gareEmbarquementId === gareDebarquementId
    ) {

      setErreurRecherche(
        "La gare de départ et d'arrivée doivent être différentes."
      );

      return;
    }

    setRechercheEnCours(true);

    try {

      const dateHeureSouhaitee =
        `${date}T${heure}:00`;

      const resultat =
        await rechercherVoyage(
          Number(gareEmbarquementId),
          Number(gareDebarquementId),
          dateHeureSouhaitee
        );

      setResultatRecherche(resultat);

      const listeSieges =
        await listerSiegesDisponibles(
          resultat.voyage.id
        );

      setSieges(listeSieges);

    } catch (err) {

      const details = err.response?.data;

      setErreurRecherche(
        details
          ? JSON.stringify(details)
          : "Erreur lors de la recherche du voyage."
      );

    } finally {

      setRechercheEnCours(false);

    }
  }


  /* =====================================================
     ACHAT
  ===================================================== */

  async function finaliserAchat() {

    setConfirmationEnCours(true);
    setErreur(null);

    try {

      const passagerInfo = await moi();

      const billet = await acheterBillet({

        passager_id:
          passagerInfo.profil_id,

        gare_embarquement_id:
          Number(gareEmbarquementId),

        gare_debarquement_id:
          Number(gareDebarquementId),

        date_heure_souhaitee:
          `${date}T${heure}:00`,

        siege_id:
          Number(siegeId),

        methode_paiement:
          methode,

      });

      setConfirmation(billet);

    } catch (err) {

      const details = err.response?.data;

      setErreur(
        details
          ? JSON.stringify(details)
          : "Erreur lors de l'achat."
      );

    } finally {

      setConfirmationEnCours(false);
      setAfficherAppPaiement(false);

    }
  }


  function handleSubmit(e) {

    e.preventDefault();

    setErreur(null);

    if (
      METHODES_MOBILES.includes(methode)
    ) {

      setAfficherAppPaiement(true);

    } else {

      finaliserAchat();

    }
  }


  /* =====================================================
     PAIEMENT MOBILE
  ===================================================== */

  if (afficherAppPaiement) {

    return (
      <EcranPaiementSimule
        methode={methode}
        montant={tarif?.montant}
        enCours={confirmationEnCours}
        onConfirmer={finaliserAchat}
        onAnnuler={() =>
          setAfficherAppPaiement(false)
        }
      />
    );
  }


  /* =====================================================
     CONFIRMATION
  ===================================================== */

  if (confirmation) {

    return (

      <div className="confirmation-page">

        <div className="confirmation-card">

          <div className="confirmation-icon">
            <CheckCircle2 size={70} />
          </div>

          <div className="confirmation-badge">
            <Ticket size={16} />
            BILLET CONFIRMÉ
          </div>

          <h1>
            Votre voyage est confirmé !
          </h1>

          <p className="confirmation-text">
            Votre billet TER Sénégal a été
            enregistré avec succès.
          </p>

          <div className="confirmation-route">

            <div>
              <small>Départ</small>

              <strong>
                {confirmation.gare_embarquement?.nom}
              </strong>
            </div>

            <ArrowRight size={24} />

            <div>
              <small>Arrivée</small>

              <strong>
                {confirmation.gare_debarquement?.nom}
              </strong>
            </div>

          </div>


          <div className="confirmation-details">

            <div>
              <span>Embarquement</span>

              <strong>
                {new Date(
                  confirmation.heure_embarquement
                ).toLocaleString("fr-FR")}
              </strong>
            </div>

            <div>
              <span>Montant payé</span>

              <strong>
                {confirmation.paiement?.montant} FCFA
              </strong>
            </div>

            <div>
              <span>Statut</span>

              <strong className="statut-confirme">
                {confirmation.statut}
              </strong>
            </div>

            <div>
              <span>QR Code</span>

              <strong className="qr-code-text">
                {confirmation.qr_code}
              </strong>
            </div>

          </div>


          <button
            className="voir-billets-button"
            onClick={() =>
              navigate("/passager/billets")
            }
          >
            <Ticket size={20} />
            Voir mes billets
          </button>

        </div>

      </div>
    );
  }


  /* =====================================================
     PAGE PRINCIPALE
  ===================================================== */

  return (

    <div className="achat-page">

      <div className="achat-container">


        {/* HEADER */}

        <div className="achat-header">

          <div className="achat-header-icon">
            <TrainFront size={34} />
          </div>

          <div>

            <span className="achat-badge">
              TER SENEGAL
            </span>

            <h1>
              Acheter un billet
            </h1>

            <p>
              Réservez votre voyage simplement
              et rapidement.
            </p>

          </div>

        </div>


        {/* CARTE RECHERCHE */}

        <div className="achat-card">

          <div className="section-title">

            <div className="section-icon">
              <Search size={20} />
            </div>

            <div>
              <h2>
                Rechercher un voyage
              </h2>

              <p>
                Choisissez votre trajet et votre horaire.
              </p>
            </div>

          </div>


          <form
            onSubmit={handleRecherche}
            className="achat-form"
          >


            <div className="form-grid">


              {/* DEPART */}

              <div className="achat-group">

                <label>
                  <MapPin size={17} />
                  Gare de départ
                </label>

                <select
                  value={gareEmbarquementId}
                  onChange={(e) =>
                    setGareEmbarquementId(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Choisir une gare
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

              </div>


              {/* ARRIVEE */}

              <div className="achat-group">

                <label>
                  <MapPin size={17} />
                  Gare d'arrivée
                </label>

                <select
                  value={gareDebarquementId}
                  onChange={(e) =>
                    setGareDebarquementId(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Choisir une gare
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

              </div>


              {/* DATE */}

              <div className="achat-group">

                <label>
                  <CalendarDays size={17} />
                  Date du voyage
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  required
                />

              </div>


              {/* HEURE */}

              <div className="achat-group">

                <label>
                  <Clock3 size={17} />
                  Heure souhaitée
                </label>

                <input
                  type="time"
                  value={heure}
                  onChange={(e) =>
                    setHeure(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {erreurRecherche && (

              <div className="achat-error">

                <AlertCircle size={18} />

                <span>
                  {erreurRecherche}
                </span>

              </div>

            )}


            <button
              type="submit"
              disabled={rechercheEnCours}
              className="rechercher-button"
            >

              <Search size={19} />

              {rechercheEnCours
                ? "Recherche en cours..."
                : "Rechercher un voyage"}

            </button>

          </form>

        </div>


        {/* RESULTAT */}

        {resultatRecherche && (

          <div className="resultat-card">

            <div className="resultat-header">

              <div className="resultat-icon">
                <TrainFront size={22} />
              </div>

              <div>

                <span>
                  VOYAGE DISPONIBLE
                </span>

                <h2>
                  {resultatRecherche.gare_embarquement.nom}
                  <ArrowRight size={19} />
                  {resultatRecherche.gare_debarquement.nom}
                </h2>

              </div>

            </div>


            <div className="resultat-infos">

              <div>
                <Clock3 size={19} />

                <div>
                  <small>Embarquement</small>

                  <strong>
                    {new Date(
                      resultatRecherche.heure_embarquement
                    ).toLocaleString("fr-FR")}
                  </strong>
                </div>
              </div>

              <div>
                <Clock3 size={19} />

                <div>
                  <small>Débarquement</small>

                  <strong>
                    {new Date(
                      resultatRecherche.heure_debarquement
                    ).toLocaleString("fr-FR")}
                  </strong>
                </div>
              </div>

            </div>

          </div>

        )}


        {/* RESERVATION */}

        {resultatRecherche && (

          <div className="achat-card reservation-card">

            <div className="section-title">

              <div className="section-icon">
                <Armchair size={20} />
              </div>

              <div>

                <h2>
                  Finaliser votre réservation
                </h2>

                <p>
                  Sélectionnez votre siège et votre moyen de paiement.
                </p>

              </div>

            </div>


            <form
              onSubmit={handleSubmit}
              className="achat-form"
            >


              {/* SIEGE */}

              <div className="achat-group">

                <label>
                  <Armchair size={17} />
                  Choisissez votre siège
                </label>

                <select
                  value={siegeId}
                  onChange={(e) =>
                    setSiegeId(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Choisir un siège
                  </option>

                  {sieges.map((s) => (

                    <option
                      key={s.id}
                      value={s.id}
                    >
                      Siège {s.numero}
                    </option>

                  ))}

                </select>

                {sieges.length === 0 && (

                  <div className="achat-warning">

                    <AlertCircle size={18} />

                    <span>
                      Aucun siège disponible pour ce voyage.
                    </span>

                  </div>

                )}

              </div>


              {/* TARIF */}

              {tarif && (

                <div className="tarif-card">

                  <div>

                    <span>
                      Prix du billet
                    </span>

                    <strong>
                      {Number(
                        tarif.montant
                      ).toLocaleString("fr-FR")} FCFA
                    </strong>

                  </div>

                  <Ticket size={40} />

                </div>

              )}


              {erreurTarif && (

                <div className="achat-error">

                  <AlertCircle size={18} />

                  {erreurTarif}

                </div>

              )}


              {/* PAIEMENT */}

              <div className="achat-group">

                <label>
                  <CreditCard size={17} />
                  Méthode de paiement
                </label>

                <select
                  value={methode}
                  onChange={(e) =>
                    setMethode(e.target.value)
                  }
                >

                  {METHODES.map((m) => (

                    <option
                      key={m.value}
                      value={m.value}
                    >
                      {m.label}
                    </option>

                  ))}

                </select>

              </div>


              {erreur && (

                <div className="achat-error">

                  <AlertCircle size={18} />

                  <span>
                    {erreur}
                  </span>

                </div>

              )}


              <button
                type="submit"
                disabled={!siegeId}
                className="acheter-button"
              >

                <CreditCard size={20} />

                Payer et confirmer

                <ArrowRight size={19} />

              </button>

            </form>

          </div>

        )}

      </div>

    </div>
  );
}