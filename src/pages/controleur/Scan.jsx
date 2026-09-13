import { useState, useEffect, useCallback } from "react";
import {
  ScanLine,
  MapPin,
  Camera,
  CameraOff,
  ClipboardPaste,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  User,
  Clock,
  Train,
} from "lucide-react";

import { scannerBillet } from "../../api/controle";
import { listerVoyages } from "../../api/billetterie";
import ScannerCamera from "../../components/ScannerCamera";

import "./Scan.css";

const LIBELLE_RESULTAT = {
  VALIDE: "Billet valide",
  BILLET_EXPIRE: "Billet expiré / non confirmé",
  MAUVAISE_CLASSE: "Passager en mauvaise classe",
  DEJA_VALIDE: "Billet déjà utilisé",
};

const TYPE_RESULTAT = {
  VALIDE: "success",
  BILLET_EXPIRE: "warning",
  MAUVAISE_CLASSE: "warning",
  DEJA_VALIDE: "danger",
};

export default function Scan() {
  const [qrCode, setQrCode] = useState("");
  const [gareId, setGareId] = useState("");
  const [gares, setGares] = useState([]);
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    listerVoyages()
      .then((voyages) => {
        const uniques = new Map();

        voyages.forEach((v) => {
          if (v.gare_depart) {
            uniques.set(v.gare_depart.id, v.gare_depart);
          }

          if (v.gare_arrivee) {
            uniques.set(v.gare_arrivee.id, v.gare_arrivee);
          }
        });

        setGares([...uniques.values()]);
      })
      .catch(() => {
        setErreur("Impossible de charger les gares.");
      });
  }, []);

  const effectuerScan = useCallback(
    async (code, gare) => {
      setErreur(null);
      setResultat(null);

      try {
        const controle = await scannerBillet(
          code.trim(),
          Number(gare)
        );

        setResultat(controle);
      } catch (err) {
        const details = err.response?.data;

        setErreur(
          details?.qr_code?.[0] ||
            details?.detail ||
            "Erreur lors du scan."
        );
      }
    },
    []
  );

  const handleDecodeCamera = useCallback(
    (texteDecode) => {
      setQrCode(texteDecode);
      setCameraActive(false);

      if (gareId) {
        effectuerScan(texteDecode, gareId);
      }
    },
    [gareId, effectuerScan]
  );

  function handleSubmit(e) {
    e.preventDefault();

    effectuerScan(qrCode, gareId);
  }

  const typeResultat = resultat
    ? TYPE_RESULTAT[resultat.resultat] || "default"
    : "";

  return (
    <div className="scan-page">

      <div className="scan-container">

        {/* HEADER */}

        <div className="scan-header">

          <div className="scan-header-icon">
            <ScanLine size={38} />
          </div>

          <div>
            <span className="scan-badge">
              CONTRÔLE DES BILLETS
            </span>

            <h1>Scanner un billet</h1>

            <p>
              Vérifiez rapidement les billets des passagers.
            </p>
          </div>

        </div>


        {/* CARTE */}

        <div className="scan-card">


          {/* GARE */}

          <div className="scan-group">

            <label>
              <MapPin size={18} />
              Gare d'embarquement
            </label>

            <select
              value={gareId}
              onChange={(e) => setGareId(e.target.value)}
              required
            >
              <option value="">
                -- Choisir une gare --
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


          {/* CAMERA */}

          <div className="camera-section">

            <div className="camera-section-header">

              <div>
                <h3>
                  <Camera size={20} />
                  Scanner avec la caméra
                </h3>

                <p>
                  Utilisez la caméra pour lire automatiquement
                  le QR code du billet.
                </p>
              </div>

              <button
                type="button"
                className={`camera-button ${
                  cameraActive ? "active" : ""
                }`}
                onClick={() =>
                  setCameraActive((v) => !v)
                }
                disabled={!gareId}
              >
                {cameraActive ? (
                  <>
                    <CameraOff size={18} />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Scanner
                  </>
                )}
              </button>

            </div>


            {!gareId && (
              <div className="scan-info">
                <MapPin size={18} />
                Choisissez d'abord une gare pour activer la caméra.
              </div>
            )}


            {cameraActive && (
              <div className="camera-wrapper">
                <ScannerCamera
                  actif={cameraActive}
                  onDecode={handleDecodeCamera}
                />
              </div>
            )}

          </div>


          {/* OU */}

          <div className="scan-divider">
            <span>OU</span>
          </div>


          {/* FORMULAIRE QR */}

          <form
            onSubmit={handleSubmit}
            className="scan-form"
          >

            <div className="scan-group">

              <label>
                <ClipboardPaste size={18} />
                QR code manuel
              </label>

              <input
                value={qrCode}
                onChange={(e) =>
                  setQrCode(e.target.value)
                }
                placeholder="Collez le code QR du billet"
                required
              />

            </div>


            <button
              type="submit"
              className="scan-submit"
              disabled={!gareId || !qrCode.trim()}
            >
              <ScanLine size={20} />
              Vérifier le billet
            </button>

          </form>


          {/* ERREUR */}

          {erreur && (

            <div className="scan-error">

              <XCircle size={22} />

              <span>{erreur}</span>

            </div>

          )}


          {/* RESULTAT */}

          {resultat && (

            <div
              className={`resultat-card ${typeResultat}`}
            >

              <div className="resultat-header">

                <div className="resultat-icon">

                  {resultat.resultat === "VALIDE" && (
                    <CheckCircle2 size={38} />
                  )}

                  {resultat.resultat === "DEJA_VALIDE" && (
                    <XCircle size={38} />
                  )}

                  {[
                    "BILLET_EXPIRE",
                    "MAUVAISE_CLASSE",
                  ].includes(resultat.resultat) && (
                    <AlertTriangle size={38} />
                  )}

                </div>

                <div>

                  <span>
                    RÉSULTAT DU CONTRÔLE
                  </span>

                  <h2>
                    {LIBELLE_RESULTAT[resultat.resultat] ||
                      resultat.resultat}
                  </h2>

                </div>

              </div>


              <div className="resultat-details">

                <div className="resultat-detail">

                  <User size={20} />

                  <div>
                    <small>Passager</small>

                    <strong>
                      {resultat.billet?.passager || "Non disponible"}
                    </strong>
                  </div>

                </div>


                <div className="resultat-detail">

                  <Train size={20} />

                  <div>
                    <small>Gare</small>

                    <strong>
                      {resultat.gare?.nom || "Non disponible"}
                    </strong>
                  </div>

                </div>


                <div className="resultat-detail">

                  <Clock size={20} />

                  <div>
                    <small>Date du contrôle</small>

                    <strong>
                      {resultat.date_controle
                        ? new Date(
                            resultat.date_controle
                          ).toLocaleString("fr-FR")
                        : "Non disponible"}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}