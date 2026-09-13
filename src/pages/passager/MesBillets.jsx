import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Trash2 } from "lucide-react";
import { listerBilletsPassager, supprimerBillet } from "../../api/billetterie";
import "./MesBillets.css";

const LIBELLE_STATUT = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirmé",
  ANNULE: "Annulé",
};

export default function MesBillets() {
  const [billets, setBillets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(null);

  useEffect(() => {
    listerBilletsPassager()
      .then(setBillets)
      .catch(() => setErreur("Impossible de charger vos billets."))
      .finally(() => setChargement(false));
  }, []);

  async function handleSupprimer(id) {
    if (!window.confirm("Supprimer definitivement ce billet ?")) return;
    setSuppressionEnCours(id);
    try {
      await supprimerBillet(id);
      setBillets((liste) => liste.filter((b) => b.id !== id));
    } catch (err) {
      alert("Impossible de supprimer ce billet.");
    } finally {
      setSuppressionEnCours(null);
    }
  }

  if (chargement) {
    return (
      <div className="mes-billets-loading">
        Chargement de vos billets...
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="mes-billets-error">
        {erreur}
      </div>
    );
  }

  return (
    <div className="mes-billets-page">

      <div className="billets-header">
        <div>
          <p className="small-title">BILLETTERIE</p>
          <h1>Mes billets</h1>
          <p className="subtitle">
            Retrouvez tous vos billets TER Sénégal
          </p>
        </div>

        <Link to="/passager/achat">
          <button className="acheter-btn">
            + Acheter un billet
          </button>
        </Link>
      </div>

      {billets.length === 0 && (
        <div className="empty-billet">
          <h2>Aucun billet pour le moment 🚆</h2>
          <p>Vous n'avez encore acheté aucun billet.</p>

          <Link to="/passager/achat">
            <button className="acheter-btn">
              Acheter mon premier billet
            </button>
          </Link>
        </div>
      )}

      <div className="billets-container">

        {billets.map((b) => {
          const depart = b.voyage?.gare_depart?.nom || "Départ";
          const arrivee = b.voyage?.gare_arrivee?.nom || "Arrivée";

          const dateDepart = b.voyage?.date_heure_depart
            ? new Date(b.voyage.date_heure_depart)
            : null;

          const date = dateDepart
            ? dateDepart.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "---";

          const heure = dateDepart
            ? dateDepart.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "---";

          const dateAchat = b.date_achat
            ? new Date(b.date_achat).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "---";

          return (
            <div className="ticket-card" key={b.id}>

              <div className="ticket-top">

                <div className="ticket-brand">
                  <span className="brand-small">SETER</span>
                  <h2>TER SENEGAL</h2>
                  <p>Train Express Régional</p>
                </div>

                <div className="train-icon">
                  🚆
                </div>

              </div>

              <div className="trip-section">

                <div className="station">
                  <span>DÉPART</span>
                  <strong>{depart}</strong>
                </div>

                <div className="trip-arrow">
                  <div className="line"></div>
                  <span>→</span>
                  <small>TER</small>
                </div>

                <div className="station station-arrivee">
                  <span>ARRIVÉE</span>
                  <strong>{arrivee}</strong>
                </div>

              </div>

              <div className="ticket-divider">
                <div className="circle left"></div>
                <div className="dashed-line"></div>
                <div className="circle right"></div>
              </div>

              <div className="ticket-info">

                <div className="info-item">
                  <span>DATE</span>
                  <strong>{date}</strong>
                </div>

                <div className="info-item">
                  <span>HEURE</span>
                  <strong>{heure}</strong>
                </div>

                <div className="info-item">
                  <span>SIÈGE</span>
                  <strong>
                    {b.siege?.numero || "---"}
                  </strong>
                </div>

              </div>

              <div className="ticket-bottom-info">

                <div>
                  <span>CLASSE</span>
                  <strong>
                    {b.classe || "1ère classe"}
                  </strong>
                </div>

                <div className="status-container">
                  <span>STATUT</span>

                  <strong
                    className={`status ${b.statut?.toLowerCase()}`}
                  >
                    ✓ {LIBELLE_STATUT[b.statut] || b.statut}
                  </strong>
                </div>

              </div>

              <p style={{ fontSize: 12, color: "#888", textAlign: "center", margin: "8px 0 0" }}>
                Acheté le {dateAchat}
              </p>

              <div className="qr-section">

                <div className="qr-box">
                  <QRCodeSVG
                    value={
                      b.qr_code ||
                      `TER-${b.id}`
                    }
                    size={85}
                  />
                </div>

                <div className="ticket-number">
                  <span>N° BILLET</span>
                  <strong>
                    TER-{String(b.id).padStart(5, "0")}
                  </strong>

                  <p>
                    Présentez ce QR code au contrôleur à bord.
                  </p>
                </div>

              </div>

              {b.deja_utilise && (
                <button
                  onClick={() => handleSupprimer(b.id)}
                  disabled={suppressionEnCours === b.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    width: "100%", marginTop: 12, padding: 10,
                    background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
                    borderRadius: 8, cursor: "pointer",
                  }}
                >
                  <Trash2 size={16} />
                  {suppressionEnCours === b.id ? "Suppression..." : "Supprimer ce billet deja utilise"}
                </button>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}