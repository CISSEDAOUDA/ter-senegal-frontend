import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoutePrivee({ rolesAutorises, children }) {
  const { role, chargement, utilisateur } = useAuth();

  console.log("=== ROUTE PRIVÉE ===");
  console.log("Utilisateur :", utilisateur);
  console.log("Role :", role);
  console.log("Roles autorisés :", rolesAutorises);

  if (chargement) return <p>Chargement...</p>;

  if (!utilisateur) {
    console.log("❌ Utilisateur non connecté");
    return <Navigate to="/connexion" replace />;
  }

  if (rolesAutorises && !rolesAutorises.includes(role)) {
    console.log("❌ Role non autorisé :", role);
    return <Navigate to="/" replace />;
  }

  console.log("✅ Accès autorisé");

  return children;
}