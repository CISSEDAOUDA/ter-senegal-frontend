import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoTer from "../assets/logo-ter.png";
import "./Layout.css";

export default function Layout({ children }) {
  const { utilisateur, role, deconnecter } = useAuth();
  const navigate = useNavigate();

  function handleDeconnexion() {
    deconnecter();
    navigate("/connexion");
  }

  return (
    <div className="layout">

      {/* ================= HEADER ================= */}
      <header className="site-header">

        {/* LOGO + NOM */}
        <Link to="/" className="site-brand">
          <img
            src={logoTer}
            alt="TER Senegal"
            className="site-logo"
          />

          <div className="brand-text">
            <span className="brand-title">TER SENEGAL</span>
            <span className="brand-subtitle">
              Train Express Régional
            </span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="site-nav">

          {!utilisateur ? (
            <>
              <Link to="/connexion" className="nav-link">
                Connexion
              </Link>

              <Link to="/inscription" className="nav-link nav-inscription">
                Inscription
              </Link>
            </>
          ) : (
            <>
              {/* PASSAGER */}
              {role === "PASSAGER" && (
                <>
                  <Link
                    to="/passager/billets"
                    className="nav-link"
                  >
                    Mes billets
                  </Link>

                  <Link
                    to="/passager/achat"
                    className="nav-link nav-achat"
                  >
                    Acheter
                  </Link>

                  <Link
                    to="/passager/reclamations"
                    className="nav-link"
                  >
                    Réclamations
                  </Link>

                  <Link
                    to="/passager/notifications"
                    className="nav-link"
                  >
                    Notifications
                  </Link>
                </>
              )}

              {/* CONTROLEUR */}
              {role === "CONTROLEUR" && (
                <Link
                  to="/controleur/scan"
                  className="nav-link"
                >
                  Scanner
                </Link>
              )}

              {/* ADMIN */}
              {role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="nav-link"
                >
                  Administration
                </Link>
              )}

              {/* AGENT GARE */}
              {role === "AGENT_GARE" && (
                <Link
                  to="/agent-gare/vente"
                  className="nav-link"
                >
                  Vente guichet
                </Link>
              )}

              {/* CHEF TRAIN */}
              {role === "CHEF_TRAIN" && (
                <Link
                  to="/chef-train/reclamations"
                  className="nav-link"
                >
                  Réclamations
                </Link>
              )}

              {/* UTILISATEUR */}
              <div className="user-area">
                <div className="user-info">
                  <span className="user-name">
                    {utilisateur.first_name || utilisateur.username}
                  </span>

                  <span className="user-role">
                    {role}
                  </span>
                </div>

                <button
                  onClick={handleDeconnexion}
                  className="logout-btn"
                >
                  Déconnexion
                </button>
              </div>
            </>
          )}

        </nav>
      </header>

      {/* ================= CONTENU ================= */}
      <main className="site-main">
        {children}
      </main>

    </div>
  );
}