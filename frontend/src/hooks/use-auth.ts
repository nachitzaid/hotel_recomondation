"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Types
interface User {
  id: string
  firstName: string
  email: string
  phone: string
  role: "user" | "admin"
  avatar?: string
}

// Type pour les données d'inscription
interface SignupData {
  email: string
  password: string
  firstName: string
  phone: string
}

// Type pour les données de connexion
interface LoginData {
  email: string
  password: string
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [layoutTransition, setLayoutTransition] = useState(false)
  const router = useRouter()

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const storedUser = localStorage.getItem("user")
        
        if (storedUser) {
          const userData: User = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error)
        setError("Erreur de chargement du profil utilisateur")
        // En cas d'erreur, on supprime les données potentiellement corrompues
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    const loginData: LoginData = { email, password };

    try {
      console.log("Tentative de connexion avec:", email);
      
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Réponse du serveur:", data);

      if (!response.ok) {
        setError(data.error || "Échec de la connexion")
        return { 
          success: false, 
          message: data.error || "Échec de la connexion" 
        }
      }

      // Création de l'objet utilisateur
      const userData: User = {
        id: data.user?._id || data.user?.id || "user123",
        firstName: data.user?.firstName || email.split("@")[0],
        email: data.user?.email || email,
        phone: data.user?.phone || "",
        role: data.user?.role || "user",
        avatar: data.user?.avatar || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.user?.firstName || email.split("@")[0]
          )}&background=random`,
      }

      // Sauvegarde des données utilisateur
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      
      // Activer la transition
      setLayoutTransition(true)
      
      // Attendre un court instant pour la transition visuelle
      setTimeout(() => {
        // Navigation basée sur le rôle après un court délai pour l'animation
        router.push(userData.role === "admin" ? "/admin" : "/")
      }, 300)

      return { 
        success: true, 
        message: "Connexion réussie" 
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setError("Erreur de connexion au serveur")
      return { 
        success: false, 
        message: "Erreur de connexion au serveur" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction d'inscription
  // Dans la fonction signup de use-auth.ts
const signup = async (signupData: SignupData) => {
  setIsLoading(true)
  setError(null)

  try {
    console.log("Données d'inscription envoyées:", signupData);
    
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    // Récupérer le texte brut de la réponse d'abord
    const responseText = await response.text();
    console.log("Réponse brute du serveur:", responseText);

    // Essayer de parser le JSON seulement si c'est possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Erreur de parsing JSON:", e);
      return { 
        success: false, 
        message: "Le serveur a renvoyé une réponse non valide" 
      };
    }

    console.log("Données parsées:", data);

    if (!response.ok) {
      setError(data.error || "Échec de l'inscription");
      return { 
        success: false, 
        message: data.error || "Échec de l'inscription" 
      };
    }

    return { 
      success: true, 
      message: data.message || "Inscription réussie. Veuillez vous connecter." 
    };
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    setError("Erreur de connexion au serveur");
    return { 
      success: false, 
      message: "Erreur de connexion au serveur" 
    };
  } finally {
    setIsLoading(false);
  }
};

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Activer la transition
      setLayoutTransition(true)
      
      // Tentative de déconnexion côté serveur si nécessaire
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.log("Erreur de déconnexion côté serveur:", error)
        // On continue quand même avec la déconnexion côté client
      }

      // Attendre un court instant pour la transition visuelle
      setTimeout(() => {
        // Nettoyage des données locales
        setUser(null)
        localStorage.removeItem("user")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("userEmail")

        // Redirection vers la page d'accueil
        router.push("/")
      }, 300)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setError("Erreur lors de la déconnexion")
    }
  }

  // Méthodes utilitaires
  const clearError = () => setError(null)

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    layoutTransition,
  }
}