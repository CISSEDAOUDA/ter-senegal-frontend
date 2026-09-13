import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ArrowLeft,
  MessageSquare,
  CalendarDays,
  Info,
  Train,
} from "lucide-react";

import { listerNotifications } from "../../api/notifications";
import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    listerNotifications()
      .then(setNotifications)
      .catch(() =>
        setErreur("Impossible de charger les notifications.")
      )
      .finally(() => setChargement(false));
  }, []);

  /* =========================
     CHARGEMENT
  ========================= */

  if (chargement) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <div className="loading-icon">
            <Bell size={28} />
          </div>

          <h2>Chargement des notifications</h2>

          <p>Veuillez patienter...</p>
        </div>
      </div>
    );
  }

  /* =========================
     ERREUR
  ========================= */

  if (erreur) {
    return (
      <div className="notifications-page">
        <div className="notifications-error">
          <Info size={28} />

          <div>
            <h2>Une erreur est survenue</h2>
            <p>{erreur}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      {/* ================= HEADER ================= */}

      <div className="notifications-header">

        <div>
          <Link
            to="/passager/billets"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Retour à mes billets
          </Link>

          <div className="title-row">

            <div className="title-icon">
              <Bell size={28} />
            </div>

            <div>
              <p className="small-title">
                ESPACE PASSAGER
              </p>

              <h1>Notifications</h1>
            </div>

          </div>

          <p className="notifications-subtitle">
            Retrouvez ici les informations concernant vos billets
            et vos voyages avec TER Sénégal.
          </p>
        </div>

        {/* COMPTEUR */}

        <div className="notification-counter">
          <Bell size={20} />

          <div>
            <strong>{notifications.length}</strong>
            <span>
              {notifications.length <= 1
                ? "notification"
                : "notifications"}
            </span>
          </div>
        </div>

      </div>


      {/* ================= AUCUNE NOTIFICATION ================= */}

      {notifications.length === 0 && (
        <div className="empty-notifications">

          <div className="empty-notification-icon">
            <Bell size={42} />
          </div>

          <h2>Aucune notification</h2>

          <p>
            Vous n'avez aucune nouvelle notification
            pour le moment.
          </p>

          <Link
            to="/passager/billets"
            className="notifications-button"
          >
            <Train size={18} />
            Voir mes billets
          </Link>

        </div>
      )}


      {/* ================= LISTE ================= */}

      {notifications.length > 0 && (
        <div className="notifications-list">

          {notifications.map((n) => {

            const date = n.date_envoi
              ? new Date(n.date_envoi)
              : null;

            return (
              <div
                className="notification-card"
                key={n.id}
              >

                {/* ICÔNE */}

                <div className="notification-icon">
                  <MessageSquare size={23} />
                </div>


                {/* CONTENU */}

                <div className="notification-content">

                  <div className="notification-top">

                    <span className="notification-type">
                      {n.type || "Notification"}
                    </span>

                    {date && (
                      <span className="notification-date">
                        <CalendarDays size={14} />

                        {date.toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}

                  </div>


                  <p className="notification-message">
                    {n.message}
                  </p>


                  {date && (
                    <div className="notification-time">
                      Reçu le{" "}
                      {date.toLocaleString(
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

                </div>

              </div>
            );
          })}

        </div>
      )}


      {/* ================= BAS DE PAGE ================= */}

      <div className="notifications-footer">



      </div>

    </div>
  );
}