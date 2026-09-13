import axios from "axios";

/**
 * Login separe du client "api" principal : pas besoin d'intercepteur
 * ici puisqu'on n'a justement pas encore de token.
 */
export const login = (username, password) =>
  axios.post("/api/auth/token/", { username, password }).then((r) => r.data);
