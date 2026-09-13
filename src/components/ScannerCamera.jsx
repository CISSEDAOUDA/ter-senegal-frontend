import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ID_CONTENEUR = "lecteur-qr-camera";

export default function ScannerCamera({ onDecode, actif }) {
  const scannerRef = useRef(null);
  const demarreRef = useRef(false);
  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState(null);
  const [erreurCamera, setErreurCamera] = useState(null);

  useEffect(() => {
    if (!actif) return;
    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(devices);
        if (devices.length > 0) setCameraId(devices[0].id);
      })
      .catch(() => setErreurCamera("Impossible de lister les cameras. Autorise l'acces camera dans le navigateur."));
  }, [actif]);

  useEffect(() => {
    if (!actif || !cameraId) return;

    const scanner = new Html5Qrcode(ID_CONTENEUR);
    scannerRef.current = scanner;
    demarreRef.current = false;

    scanner
      .start(
        cameraId,
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (texteDecode) => {
          onDecode(texteDecode);
        },
        () => {}
      )
      .then(() => {
        demarreRef.current = true;
      })
      .catch((err) => {
        console.error("Impossible de demarrer la camera :", err);
        setErreurCamera("Impossible de demarrer cette camera.");
      });

    return () => {
      if (demarreRef.current) {
        try {
          const resultat = scanner.stop();
          if (resultat && typeof resultat.catch === "function") {
            resultat.catch(() => {});
          }
        } catch (e) {
          // Rien a faire : le scanner n'etait de toute facon pas actif.
        }
        demarreRef.current = false;
      }
    };
  }, [actif, cameraId, onDecode]);

  if (!actif) return null;

  return (
    <div style={{ textAlign: "center" }}>
      {cameras.length > 1 && (
        <select
          value={cameraId || ""}
          onChange={(e) => setCameraId(e.target.value)}
          style={{ marginBottom: 10 }}
        >
          {cameras.map((cam) => (
            <option key={cam.id} value={cam.id}>{cam.label || cam.id}</option>
          ))}
        </select>
      )}
      {erreurCamera && <p style={{ color: "red" }}>{erreurCamera}</p>}
      <div id={ID_CONTENEUR} style={{ width: 280, margin: "0 auto" }} />
    </div>
  );
}