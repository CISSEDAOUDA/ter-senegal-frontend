import { useEffect, useState } from "react";
import {
  Search,
  User,
  Train,
  Armchair,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  listerVoyages,
  listerSiegesDisponibles,
  acheterBillet,
  tarifActuel,
} from "../../api/billetterie";

import { rechercherPassagers } from "../../api/agentGare";

import "./VenteGuichet.css";

const METHODES = [
  {
    value: "GUICHET",
    label: "Espèces au guichet",
  },
  {
    value: "ORANGE_MONEY",
    label: "Orange Money",
  },
  {
    value: "WAVE",
    label: "Wave",
  },
];

export default function VenteGuichet() {
  const [recherche, setRecherche] = useState("");
  const [resultats, setResultats] = useState([]);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const [passagerChoisi, setPassagerChoisi] = useState(null);

  const [voyages, setVoyages] = useState([]);
  const [voyageId, setVoyageId] = useState("");

  const [sieges, setSieges] = useState([]);
  const [siegeId, setSiegeId] = useState("");

  const [methode, setMethode] = useState(
    METHODES[0].value
  );

  const [tarif, setTarif] = useState(null);

  const [erreur, setErreur] = useState(null);
  const [venteEnCours, setVenteEnCours] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

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
      .catch(() => setTarif(null));
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
        setSiegeId("");
      });
  }, [voyageId]);

  async function handleRecherche(e) {
    e.preventDefault();

    if (!recherche.trim()) return;

    setRechercheEnCours(true);
    setErreur(null);

    try {
      const data = await rechercherPassagers(
        recherche.trim()
      );

      setResultats(data);

      if (data.length === 0) {
        setErreur(
          "Aucun passager trouvé pour cette recherche."
        );
      }
    } catch (err) {
      setErreur(
        "Erreur lors de la recherche du passager."
      );
    } finally {
      setRechercheEnCours(false);
    }
  }

  async function handleVente(e) {
    e.preventDefault();

    setErreur(null);
    setVenteEnCours(true);

    try {
      const billet = await acheterBillet({
        passager_id: passagerChoisi.id,
        voyage_id: Number(voyageId),
        siege_id: Number(siegeId),
        methode_paiement: methode,
      });

      setConfirmation(billet);
    } catch (err) {
      const details = err.response?.data;

      setErreur(
        details
          ? JSON.stringify(details)
          : "Erreur lors de la vente."
      );
    } finally {
      setVenteEnCours(false);
    }
  }

  function nouvelleVente() {
    setPassagerChoisi(null);
    setResultats([]);
    setRecherche("");
    setVoyageId("");
    setSiegeId("");
    setConfirmation(null);
    setErreur(null);
    setMethode(METHODES[0].value);
  }

  /* =====================================================
     CONFIRMATION
  ===================================================== */

  if (confirmation) {
    return (
      <div className="guichet-page">

        <div className="vente-confirmation">

          <div className="confirmation-icon">
            <CheckCircle2 size={48} />
          </div>

          <p className="guichet-small-title">
            TRANSACTION TERMINÉE
          </p>

          <h1>
            Vente confirmée
          </h1>

          <p className="confirmation-text">
            Le billet a été créé avec succès.
          </p>


          <div className="confirmation-card">

            <div className="confirmation-passager">

              <div className="confirmation-user-icon">
                <User size={20} />
              </div>

              <div>
                <span>PASSAGER</span>

                <strong>
                  {passagerChoisi?.utilisateur?.first_name}{" "}
                  {passagerChoisi?.utilisateur?.last_name}
                </strong>
              </div>

            </div>


            <div className="confirmation-price">

              <span>MONTANT ENCAISSÉ</span>

              <strong>
                {confirmation.paiement?.montant || tarif?.montant || "---"} FCFA
              </strong>

            </div>


            <div className="confirmation-qr">

              <span>QR CODE DU BILLET</span>

              <code>
                {confirmation.qr_code}
              </code>

            </div>

          </div>


          <button
            className="new-sale-button"
            onClick={nouvelleVente}
          >
            <RefreshCw size={18} />
            Effectuer une nouvelle vente
          </button>

        </div>

      </div>
    );
  }


  /* =====================================================
     RECHERCHE PASSAGER
  ===================================================== */

  if (!passagerChoisi) {
    return (
      <div className="guichet-page">

        <div className="guichet-header">

          <div className="guichet-title">

            <div className="guichet-title-icon">
              <CreditCard size={28} />
            </div>

            <div>

              <p className="guichet-small-title">
                ESPACE AGENT DE GARE
              </p>

              <h1>
                Vente au guichet
              </h1>

              <p>
                Recherchez un passager pour commencer
                la vente d'un billet.
              </p>

            </div>

          </div>

        </div>


        {/* RECHERCHE */}

        <div className="search-card">

          <div className="card-title">

            <div className="card-title-icon">
              <Search size={20} />
            </div>

            <div>
              <h2>
                Rechercher un passager
              </h2>

              <p>
                CNI, nom, prénom ou nom d'utilisateur
              </p>
            </div>

          </div>


          <form
            onSubmit={handleRecherche}
            className="passenger-search-form"
          >

            <div className="search-input-wrapper">

              <Search size={19} />

              <input
                value={recherche}
                onChange={(e) =>
                  setRecherche(e.target.value)
                }
                placeholder="Ex. : CNI, nom ou prénom..."
              />

            </div>

            <button
              type="submit"
              disabled={
                rechercheEnCours ||
                !recherche.trim()
              }
              className="search-button"
            >

              {rechercheEnCours ? (
                <>
                  <span className="mini-spinner"></span>
                  Recherche...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Rechercher
                </>
              )}

            </button>

          </form>


          {erreur && (
            <div className="guichet-error">
              <AlertCircle size={18} />
              {erreur}
            </div>
          )}

        </div>


        {/* RÉSULTATS */}

        {resultats.length > 0 && (

          <div className="results-section">

            <div className="results-header">

              <div>
                <p className="guichet-small-title">
                  RÉSULTATS
                </p>

                <h2>
                  Passagers trouvés
                </h2>
              </div>

              <span className="results-count">
                {resultats.length}
              </span>

            </div>


            <div className="passengers-list">

              {resultats.map((p) => (

                <button
                  key={p.id}
                  className="passenger-card"
                  onClick={() =>
                    setPassagerChoisi(p)
                  }
                >

                  <div className="passenger-avatar">
                    <User size={22} />
                  </div>


                  <div className="passenger-info">

                    <strong>
                      {p.utilisateur?.first_name}{" "}
                      {p.utilisateur?.last_name}
                    </strong>

                    <span>
                      {p.utilisateur?.email}
                    </span>

                    <small>
                      CNI : {p.numero_piece_identite}
                    </small>

                  </div>


                  <div className="passenger-arrow">
                    →
                  </div>

                </button>

              ))}

            </div>

          </div>

        )}

      </div>
    );
  }


  /* =====================================================
     VENTE
  ===================================================== */

  return (
    <div className="guichet-page">

      {/* HEADER */}

      <div className="guichet-header">

        <div className="guichet-title">

          <div className="guichet-title-icon">
            <Train size={28} />
          </div>

          <div>

            <p className="guichet-small-title">
              NOUVELLE VENTE
            </p>

            <h1>
              Émettre un billet
            </h1>

            <p>
              Sélectionnez le voyage, le siège et le
              moyen de paiement.
            </p>

          </div>

        </div>

      </div>


      {/* PASSAGER CHOISI */}

      <div className="selected-passenger">

        <div className="selected-passenger-icon">
          <User size={22} />
        </div>

        <div className="selected-passenger-info">

          <span>PASSAGER SÉLECTIONNÉ</span>

          <strong>
            {passagerChoisi.utilisateur?.first_name}{" "}
            {passagerChoisi.utilisateur?.last_name}
          </strong>

          <small>
            CNI : {passagerChoisi.numero_piece_identite}
          </small>

        </div>

        <button
          type="button"
          onClick={() =>
            setPassagerChoisi(null)
          }
          className="change-passenger"
        >
          <ArrowLeft size={15} />
          Changer
        </button>

      </div>


      {/* FORMULAIRE */}

      <form
        onSubmit={handleVente}
        className="sale-form-card"
      >

        <div className="sale-form-header">

          <div className="form-section-number">
            1
          </div>

          <div>
            <h2>
              Choisir le voyage
            </h2>

            <p>
              Sélectionnez le trajet souhaité.
            </p>
          </div>

        </div>


        <div className="form-field">

          <label>
            Voyage
          </label>

          <div className="select-wrapper">
            <Train size={18} />

            <select
              value={voyageId}
              onChange={(e) =>
                setVoyageId(e.target.value)
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
                  {" — "}
                  {new Date(
                    v.date_heure_depart
                  ).toLocaleString("fr-FR")}
                </option>

              ))}

            </select>
          </div>

        </div>


        {/* SIÈGE */}

        <div className="sale-form-header second">

          <div className="form-section-number">
            2
          </div>

          <div>
            <h2>
              Choisir le siège
            </h2>

            <p>
              Sélectionnez une place disponible.
            </p>
          </div>

        </div>


        <div className="form-field">

          <label>
            Siège
          </label>

          <div className="select-wrapper">

            <Armchair size={18} />

            <select
              value={siegeId}
              onChange={(e) =>
                setSiegeId(e.target.value)
              }
              required
              disabled={!voyageId}
            >

              <option value="">
                {voyageId
                  ? "-- Choisir un siège --"
                  : "Choisissez d'abord un voyage"}
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

        </div>


        {voyageId &&
          sieges.length === 0 && (

            <div className="no-seat-warning">
              <AlertCircle size={17} />
              Aucun siège disponible pour ce voyage.
            </div>

          )}


        {/* PAIEMENT */}

        <div className="sale-form-header second">

          <div className="form-section-number">
            3
          </div>

          <div>
            <h2>
              Paiement
            </h2>

            <p>
              Choisissez le moyen de paiement.
            </p>
          </div>

        </div>


        <div className="payment-options">

          {METHODES.map((m) => (

            <button
              type="button"
              key={m.value}
              className={`payment-option ${
                methode === m.value
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setMethode(m.value)
              }
            >

              <CreditCard size={19} />

              <span>
                {m.label}
              </span>

              <div className="payment-radio">
                {methode === m.value && (
                  <div></div>
                )}
              </div>

            </button>

          ))}

        </div>


        {/* PRIX */}

        {tarif && (

          <div className="price-summary">

            <div>

              <span>
                PRIX DU BILLET
              </span>

              <strong>
                {tarif.montant} FCFA
              </strong>

            </div>

            <Train size={32} />

          </div>

        )}


        {/* ERREUR */}

        {erreur && (

          <div className="guichet-error">
            <AlertCircle size={18} />
            {erreur}
          </div>

        )}


        {/* BOUTON */}

        <button
          type="submit"
          disabled={
            venteEnCours ||
            !voyageId ||
            !siegeId
          }
          className="sale-submit"
        >

          {venteEnCours ? (
            <>
              <span className="mini-spinner"></span>
              Vente en cours...
            </>
          ) : (
            <>
              <CheckCircle2 size={19} />
              Encaisser et émettre le billet
            </>
          )}

        </button>

      </form>

    </div>
  );
}