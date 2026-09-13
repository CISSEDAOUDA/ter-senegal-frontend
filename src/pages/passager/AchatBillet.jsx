import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Train,
  MapPin,
  Armchair,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Ticket,
} from "lucide-react";

import {
  listerVoyages,
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
      fond: "#294a63",
      texte: "#fff",
    };

  const nomApp =
    methode === "WAVE" ? "Wave" : "Orange Money";

  const montantAttendu = montant != null ? Number(montant) : null;
  const montantValide =
    montantAttendu != null && Number(montantSaisi) === montantAttendu;

  return (
    <div className="paiement-page">

      <div className="paiement-card">

        <div
          className="paiement-header"
          style={{ background: couleurs.fond }}
        >
          <Wallet size={42} />

          <h2>{nomApp}</h2>

          <p>Paiement TER Sénégal</p>
        </div>

        <div className="paiement-content">

          <p className="paiement-label">
            Montant à envoyer (FCFA)
          </p>

          <input
            type="number"
            className="paiement-montant"
            value={montantSaisi}
            onChange={(e) => setMontantSaisi(e.target.value)}
            placeholder={montantAttendu != null ? String(montantAttendu) : ""}
            style={{
              width: "100%",
              border: "none",
              textAlign: "center",
              background: "transparent",
              boxSizing: "border-box",
            }}
          />

          {montantSaisi && !montantValide && (
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 4 }}>
              Le montant doit correspondre exactement au prix du billet
              ({montantAttendu} FCFA).
            </p>
          )}

          <div className="paiement-beneficiaire">

            <Train size={22} />

            <div>
              <small>Bénéficiaire</small>
              <strong>TER Sénégal</strong>
            </div>

          </div>

          <button
            className="paiement-confirm"
            style={{ background: couleurs.fond, opacity: !montantValide ? 0.5 : 1 }}
            onClick={onConfirmer}
            disabled={enCours || !montantValide}
          >
            <CheckCircle2 size={20} />

            {enCours
              ? "Confirmation..."
              : `Confirmer avec ${nomApp}`}
          </button>

          <button
            className="paiement-annuler"
            onClick={onAnnuler}
            disabled={enCours}
          >
            Annuler
          </button>

        </div>

      </div>

    </div>
  );
}


export default function AchatBillet() {

  const [voyages, setVoyages] = useState([]);
  const [voyageId, setVoyageId] = useState("");

  const [sieges, setSieges] = useState([]);
  const [siegeId, setSiegeId] = useState("");

  const [methode, setMethode] =
    useState(METHODES[0].value);

  const [erreur, setErreur] = useState(null);

  const [confirmation, setConfirmation] =
    useState(null);

  const [afficherAppPaiement,
    setAfficherAppPaiement] =
    useState(false);

  const [confirmationEnCours,
    setConfirmationEnCours] =
    useState(false);

  const [tarif, setTarif] = useState(null);

  const [erreurTarif,
    setErreurTarif] =
    useState(null);

  const navigate = useNavigate();


  useEffect(() => {

    listerVoyages()
      .then(setVoyages)
      .catch(() =>
        setErreur(
          "Impossible de charger les voyages."
        )
      );


    tarifActuel()
      .then(setTarif)
      .catch(() => {

        setTarif(null);

        setErreurTarif(
          "Impossible de récupérer le tarif."
        );

      });

  }, []);


  useEffect(() => {

    if (!voyageId) {

      setSieges([]);
      setSiegeId("");

      return;
    }


    listerSiegesDisponibles(voyageId)

      .then((data) => {

        setSieges(data);

        setSiegeId("");

      })

      .catch(() => {

        setSieges([]);

      });

  }, [voyageId]);


  async function finaliserAchat() {

    setConfirmationEnCours(true);

    setErreur(null);

    try {

      const passagerInfo = await moi();

      const billet = await acheterBillet({

        passager_id:
          passagerInfo.profil_id,

        voyage_id:
          Number(voyageId),

        siege_id:
          Number(siegeId),

        methode_paiement:
          methode,

      });


      setConfirmation(billet);

    }

    catch (err) {

      const details =
        err.response?.data;

      setErreur(

        details
          ? JSON.stringify(details)
          : "Erreur lors de l'achat."

      );

    }

    finally {

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

    }

    else {

      finaliserAchat();

    }

  }


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


  if (confirmation) {

    return (

      <div className="confirmation-page">

        <div className="confirmation-card">

          <div className="confirmation-icon">

            <CheckCircle2 size={70} />

          </div>

          <h1>
            Billet confirmé !
          </h1>

          <p className="confirmation-text">

            Votre réservation a été effectuée
            avec succès.

          </p>


          <div className="confirmation-details">

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

              <span>Acheté le</span>

              <strong>
                {new Date(confirmation.date_achat).toLocaleString("fr-FR")}
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


  return (

    <div className="achat-page">

      <div className="achat-container">


        <div className="achat-header">

          <div className="achat-header-icon">

            <Train size={38} />

          </div>

          <div>

            <span className="achat-badge">
              BILLETTERIE
            </span>

            <h1>
              Acheter un billet
            </h1>

            <p>
              Réservez votre voyage en première classe.
            </p>

          </div>

        </div>


        <div className="achat-card">


          <form
            onSubmit={handleSubmit}
            className="achat-form"
          >


            <div className="achat-group">

              <label>

                <MapPin size={18} />

                Choisir votre voyage

              </label>


              <select
                value={voyageId}

                onChange={(e) =>
                  setVoyageId(
                    e.target.value
                  )
                }

                required
              >

                <option value="">
                  -- Choisir un voyage --
                </option>


                {voyages.map((v) => (

                  <option
                    key={v.id}

                    value={v.id}
                  >

                    {v.gare_depart?.nom}

                    {" → "}

                    {v.gare_arrivee?.nom}

                    {" ("}

                    {new Date(
                      v.date_heure_depart
                    ).toLocaleString(
                      "fr-FR"
                    )}

                    {")"}

                  </option>

                ))}

              </select>

            </div>


            <div className="achat-group">

              <label>

                <Armchair size={18} />

                Choisir votre siège

              </label>


              <select

                value={siegeId}

                onChange={(e) =>
                  setSiegeId(
                    e.target.value
                  )
                }

                required

                disabled={!voyageId}

              >

                <option value="">
                  -- Choisir un siège --
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

            </div>


            {voyageId &&
              sieges.length === 0 && (

                <div className="achat-warning">

                  Aucun siège disponible pour
                  ce voyage.

                </div>

              )}


            {tarif && (

              <div className="tarif-card">

                <span>
                  Prix du billet
                </span>

                <strong>
                  {tarif.montant} FCFA
                </strong>

              </div>

            )}


            {erreurTarif && (

              <div className="achat-error">

                <AlertCircle size={20} />

                {erreurTarif}

              </div>

            )}


            <div className="achat-group">

              <label>

                <CreditCard size={18} />

                Méthode de paiement

              </label>


              <select

                value={methode}

                onChange={(e) =>
                  setMethode(
                    e.target.value
                  )
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

                <AlertCircle size={20} />

                {erreur}

              </div>

            )}


            <button

              type="submit"

              disabled={
                !voyageId ||
                !siegeId
              }

              className="acheter-button"
            >

              <CreditCard size={20} />

              Payer et confirmer

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}