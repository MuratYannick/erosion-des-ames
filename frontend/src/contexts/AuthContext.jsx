import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe au chargement
    const token = localStorage.getItem("token");
    if (token) {
      // Récupérer les infos utilisateur
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      } else if (response.status === 401) {
        // Token invalide ou expiré, le supprimer uniquement si erreur 401
        console.log("Token invalide ou expiré, déconnexion");
        localStorage.removeItem("token");
      } else {
        // Autre erreur (500, 503, etc.) - ne pas déconnecter
        console.error("Erreur serveur lors de la récupération du profil:", response.status);
      }
    } catch (error) {
      // Erreur réseau - ne pas déconnecter l'utilisateur
      console.error("Erreur réseau lors de la récupération du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur lors de la connexion");
    }

    localStorage.setItem("token", result.data.token);
    setUser({
      id: result.data.id,
      username: result.data.username,
      email: result.data.email,
      terms_accepted: result.data.terms_accepted,
      terms_accepted_at: result.data.terms_accepted_at,
    });
    return result;
  };

  const register = async (username, email, password) => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur lors de l'inscription");
    }

    localStorage.setItem("token", result.data.token);
    setUser({
      id: result.data.id,
      username: result.data.username,
      email: result.data.email,
      terms_accepted: result.data.terms_accepted,
      terms_accepted_at: result.data.terms_accepted_at,
    });
    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Fonction utilitaire pour faire des requêtes authentifiées
  // qui gère automatiquement la déconnexion en cas d'erreur 401
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // Si erreur 401, déconnecter l'utilisateur
    if (response.status === 401) {
      console.log("Token invalide ou expiré (401), déconnexion automatique");
      localStorage.removeItem("token");
      setUser(null);
    }

    return response;
  };

  const acceptTerms = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/api/auth/accept-terms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur lors de l'acceptation des CGU");
    }

    // Mettre à jour l'utilisateur avec terms_accepted = true
    setUser((prev) => ({
      ...prev,
      terms_accepted: true,
      terms_accepted_at: result.data.terms_accepted_at,
    }));

    return result;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    acceptTerms,
    authenticatedFetch,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
