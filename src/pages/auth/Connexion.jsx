import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Train,
  User,
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
} from "lucide-react";

import "./Connexion.css";

const ACCUEIL_PAR_ROLE = {
  PASSAGER: "/passager/billets",
  CONTROLEUR: "/controleur/scan",
};

export default function Connexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(false);

  const { connecter } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setErreur(null);
    setChargement(true);

    try {
      const role = await connecter(username, password);
      navigate(ACCUEIL_PAR_ROLE[role] || "/");
    } catch (err) {
      setErreur("Identifiants incorrects.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="connexion-page">
      <div className="connexion-container">

        {/* CARTE */}
        <div className="connexion-card">

          {/* HEADER */}
          <div className="connexion-header">

            <div className="connexion-decoration decoration-top"></div>
            <div className="connexion-decoration decoration-bottom"></div>

            <div className="connexion-header-content">

              <div className="connexion-icon">
                <Train size={42} />
              </div>

              <p className="connexion-seter">SETER</p>

              <h1>TER SENEGAL</h1>

              <p className="connexion-subtitle">
                Connectez-vous à votre espace
              </p>

            </div>
          </div>


          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="connexion-form"
          >

            <div className="form-title">

              <h2>Connexion</h2>

              <p>
                Accédez à votre compte TER Sénégal
              </p>

            </div>


            {/* USERNAME */}
            <div className="form-group">

              <label>Nom d'utilisateur</label>

              <div className="input-container">

                <User className="input-icon" size={20} />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                  placeholder="Votre identifiant"
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="form-group">

              <label>Mot de passe</label>

              <div className="input-container">

                <Lock className="input-icon" size={20} />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  placeholder="••••••••"
                />

              </div>

            </div>


            {/* ERREUR */}
            {erreur && (

              <div className="error-message">

                <AlertCircle size={20} />

                <span>{erreur}</span>

              </div>

            )}


            {/* BOUTON */}
            <button
              type="submit"
              disabled={chargement}
              className="connexion-button"
            >

              {chargement ? (
                <>
                  <Loader2
                    size={20}
                    className="spinner"
                  />

                  Connexion...
                </>
              ) : (
                <>
                  <LogIn size={20} />

                  Se connecter
                </>
              )}

            </button>

          </form>

        </div>


        {/* INSCRIPTION */}
        <div className="connexion-inscription">

          <p>
            Vous n'avez pas encore de compte ?
          </p>

          <Link to="/inscription">
            Créer un compte →
          </Link>

        </div>

      </div>
    </div>
  );
}