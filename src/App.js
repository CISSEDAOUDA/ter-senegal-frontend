import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import RoutePrivee from "./components/RoutePrivee";

import Connexion from "./pages/auth/Connexion";
import Inscription from "./pages/passager/Inscription";
import MesBillets from "./pages/passager/MesBillets";
import AchatBillet from "./pages/passager/AchatBillet";
import Reclamations from "./pages/passager/Reclamations";
import Notifications from "./pages/passager/Notifications";
import Scan from "./pages/controleur/Scan";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VenteGuichet from "./pages/agent-gare/VenteGuichet";
import GestionReclamations from "./pages/chef-train/GestionReclamations";

import "./App.css";

function Accueil() {
  const { utilisateur, role } = useAuth();

  if (!utilisateur) {
    return (
      <div className="app-accueil">
        <div className="accueil-container">

          <div className="accueil-badge">
            TER SENEGAL
          </div>

          <div className="accueil-icon">
            🚆
          </div>

          <h1>
            Voyagez avec <span>TER Sénégal</span>
          </h1>

          <p className="accueil-description">
            Bienvenue sur votre espace TER Sénégal.
            Achetez vos billets, consultez vos voyages et profitez
            d'une expérience simple, rapide et moderne.
          </p>

          <div className="accueil-features">
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Billets</h3>
              <p>Achetez votre billet facilement.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚆</div>
              <h3>Voyages</h3>
              <p>Consultez vos trajets TER.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>QR Code</h3>
              <p>Présentez votre billet rapidement.</p>
            </div>
          </div>

          <div className="accueil-actions">

            <Link to="/connexion">
              <button className="btn-connexion">
                Se connecter
              </button>
            </Link>

            <Link to="/inscription">
              <button className="btn-inscription">
                Créer un compte
              </button>
            </Link>

          </div>

        </div>
      </div>
    );
  }

  if (role === "PASSAGER") {
    return <Navigate to="/passager/billets" replace />;
  }

  if (role === "CONTROLEUR") {
    return <Navigate to="/controleur/scan" replace />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "AGENT_GARE") {
    return <Navigate to="/agent-gare/vente" replace />;
  }

  if (role === "CHEF_TRAIN") {
    return <Navigate to="/chef-train/reclamations" replace />;
  }

  return (
    <div className="role-non-supporte">
      <div className="role-card">
        <div className="role-icon">⚠️</div>

        <h2>Rôle non pris en charge</h2>

        <p>
          Cette interface n'est pas encore disponible pour votre rôle.
        </p>

        <Link to="/connexion">
          <button className="btn-connexion">
            Retour à la connexion
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Layout>

          <Routes>

            {/* ACCUEIL */}
            <Route
              path="/"
              element={<Accueil />}
            />

            {/* AUTHENTIFICATION */}
            <Route
              path="/connexion"
              element={<Connexion />}
            />

            <Route
              path="/inscription"
              element={<Inscription />}
            />

            {/* PASSAGER */}

            <Route
              path="/passager/billets"
              element={
                <RoutePrivee rolesAutorises={["PASSAGER"]}>
                  <MesBillets />
                </RoutePrivee>
              }
            />

            <Route
              path="/passager/achat"
              element={
                <RoutePrivee rolesAutorises={["PASSAGER"]}>
                  <AchatBillet />
                </RoutePrivee>
              }
            />

            <Route
              path="/passager/reclamations"
              element={
                <RoutePrivee rolesAutorises={["PASSAGER"]}>
                  <Reclamations />
                </RoutePrivee>
              }
            />

            <Route
              path="/passager/notifications"
              element={
                <RoutePrivee rolesAutorises={["PASSAGER"]}>
                  <Notifications />
                </RoutePrivee>
              }
            />

            {/* CONTROLEUR */}

            <Route
              path="/controleur/scan"
              element={
                <RoutePrivee rolesAutorises={["CONTROLEUR"]}>
                  <Scan />
                </RoutePrivee>
              }
            />

            {/* ADMIN */}

            <Route
              path="/admin"
              element={
                <RoutePrivee rolesAutorises={["ADMIN"]}>
                  <AdminDashboard />
                </RoutePrivee>
              }
            />

            {/* AGENT DE GARE */}

            <Route
              path="/agent-gare/vente"
              element={
                <RoutePrivee rolesAutorises={["AGENT_GARE"]}>
                  <VenteGuichet />
                </RoutePrivee>
              }
            />

            {/* CHEF DE TRAIN */}

            <Route
              path="/chef-train/reclamations"
              element={
                <RoutePrivee rolesAutorises={["CHEF_TRAIN"]}>
                  <GestionReclamations />
                </RoutePrivee>
              }
            />

            {/* PAGE INTRouvable */}

            <Route
              path="*"
              element={
                <div className="page-introuvable">
                  <div>
                    <span>404</span>
                    <h1>Page introuvable</h1>
                    <p>
                      La page que vous recherchez n'existe pas.
                    </p>

                    <Link to="/">
                      <button className="btn-connexion">
                        Retour à l'accueil
                      </button>
                    </Link>
                  </div>
                </div>
              }
            />

          </Routes>

        </Layout>

      </AuthProvider>

    </BrowserRouter>
  );
}