import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "../api/auth";
import { moi } from "../api/comptes";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [role, setRole] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setChargement(false);
      return;
    }
    moi()
      .then((data) => {
        setUtilisateur(data.utilisateur);
        setRole(data.role);
      })
      .catch(() => {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
      })
      .finally(() => setChargement(false));
  }, []);

  async function connecter(username, password) {
    const { access, refresh } = await apiLogin(username, password);
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
    const data = await moi();
    setUtilisateur(data.utilisateur);
    setRole(data.role);
    return data.role;
  }

  function deconnecter() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    setUtilisateur(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ utilisateur, role, chargement, connecter, deconnecter }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans un AuthProvider");
  return ctx;
}