import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Train,
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  IdCard,
  AlertCircle,
  UserPlus,
} from "lucide-react";

import { inscrirePassager } from "../../api/comptes";
import "./Inscription.css";

const CHAMPS_INITIAUX = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  telephone: "",
  numero_piece_identite: "",
  numero_ter_card: "",
};

export default function Inscription() {
  const [champs, setChamps] = useState(CHAMPS_INITIAUX);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setChamps({
      ...champs,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      const donnees = { ...champs };

      if (!donnees.numero_ter_card) {
        delete donnees.numero_ter_card;
      }

      await inscrirePassager(donnees);

      navigate("/connexion");

    } catch (err) {
      const details = err.response?.data;

      setErreur(
        details
          ? JSON.stringify(details)
          : "Erreur lors de l'inscription."
      );
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="inscription-page">

      <div className="inscription-container">

        {/* HEADER */}
        <div className="inscription-header">

          <div className="inscription-header-content">

            <div className="inscription-icon">
              <Train size={40} />
            </div>

            <p className="inscription-seter">
              SETER
            </p>

            <h1>TER SENEGAL</h1>

            <p>
              Créez votre compte et voyagez simplement
            </p>

          </div>

        </div>


        {/* CARTE FORMULAIRE */}
        <div className="inscription-card">

          <div className="inscription-title">

            <h2>Créer un compte</h2>

            <p>
              Renseignez vos informations pour devenir passager TER.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="inscription-form"
          >

            {/* NOM + PRENOM */}

            <div className="form-row">

              <div className="form-group">

                <label>Prénom</label>

                <div className="input-container">

                  <User className="input-icon" size={19} />

                  <input
                    name="first_name"
                    value={champs.first_name}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label>Nom</label>

                <div className="input-container">

                  <User className="input-icon" size={19} />

                  <input
                    name="last_name"
                    value={champs.last_name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                  />

                </div>

              </div>

            </div>


            {/* USERNAME */}

            <div className="form-group">

              <label>Nom d'utilisateur</label>

              <div className="input-container">

                <User className="input-icon" size={19} />

                <input
                  name="username"
                  value={champs.username}
                  onChange={handleChange}
                  placeholder="Votre identifiant"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>Adresse email</label>

              <div className="input-container">

                <Mail className="input-icon" size={19} />

                <input
                  type="email"
                  name="email"
                  value={champs.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>Mot de passe</label>

              <div className="input-container">

                <Lock className="input-icon" size={19} />

                <input
                  type="password"
                  name="password"
                  value={champs.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />

              </div>

            </div>


            {/* TELEPHONE */}

            <div className="form-group">

              <label>Téléphone</label>

              <div className="input-container">

                <Phone className="input-icon" size={19} />

                <input
                  name="telephone"
                  value={champs.telephone}
                  onChange={handleChange}
                  placeholder="+221 XX XXX XX XX"
                  required
                />

              </div>

            </div>


            {/* CNI */}

            <div className="form-group">

              <label>Numéro pièce d'identité (CNI)</label>

              <div className="input-container">

                <IdCard className="input-icon" size={19} />

                <input
                  name="numero_piece_identite"
                  value={champs.numero_piece_identite}
                  onChange={handleChange}
                  placeholder="Votre numéro CNI"
                  required
                />

              </div>

            </div>


            {/* TER CARD */}

            <div className="form-group">

              <label>
                Numéro TER Card
                <span className="optional"> (optionnel)</span>
              </label>

              <div className="input-container">

                <CreditCard className="input-icon" size={19} />

                <input
                  name="numero_ter_card"
                  value={champs.numero_ter_card}
                  onChange={handleChange}
                  placeholder="Numéro de votre TER Card"
                />

              </div>

            </div>


            {/* ERREUR */}

            {erreur && (

              <div className="inscription-error">

                <AlertCircle size={20} />

                <span>{erreur}</span>

              </div>

            )}


            {/* BUTTON */}

            <button
              type="submit"
              disabled={chargement}
              className="inscription-button"
            >

              <UserPlus size={20} />

              {chargement
                ? "Création du compte..."
                : "Créer mon compte"
              }

            </button>

          </form>


          {/* CONNEXION */}

          <div className="inscription-login">

            <p>
              Vous avez déjà un compte ?
            </p>

            <Link to="/connexion">
              Se connecter →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}