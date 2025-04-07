// hooks/use-auth.ts
"use client"

import { useState, useEffect, useCallback } from "react"
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

// Type pour les résultats des opérations d'authentification
interface AuthResult {
  success: boolean
  message: string
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Fonction utilitaire pour vérifier l'état d'authentification
const checkAuthState = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData && userData.email) {
        return userData;
      }
    }
    return null;
  } catch (error) {
    console.error("Erreur de vérification d'authentification:", error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
    }
    return null;
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const userData = checkAuthState();
        
        if (userData) {
          setUser(userData)
        } else {
          // Assurez-vous que l'état est complètement réinitialisé
          setUser(null)
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error)
        setError("Erreur de chargement du profil utilisateur")
        // En cas d'erreur, on supprime les données potentiellement corrompues
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user")
        }
        setUser(null)
      } finally {
        setIsLoading(false)
        // Important: déclencher isReady après la vérification d'authentification
        setIsReady(true)
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Tentative de connexion avec:", email);
      
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Réponse du serveur:", data);

      if (!response.ok) {
        setError(data.error || "Échec de la connexion")
        setIsLoading(false)
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
      localStorage.setItem("user", JSON.stringify(userData))
      
      // Important: mettre à jour l'utilisateur après avoir sauvegardé en localStorage
      setUser(userData)
      
      // Navigation basée sur le rôle
      setTimeout(() => {
        router.push(userData.role === "admin" ? "/admin" : "/")
        setIsLoading(false)
      }, 10)

      return { 
        success: true, 
        message: "Connexion réussie" 
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setError("Erreur de connexion au serveur")
      setIsLoading(false)
      return { 
        success: false, 
        message: "Erreur de connexion au serveur" 
      }
    }
  }, [router])

  // Fonction d'inscription
  const signup = useCallback(async (signupData: SignupData): Promise<AuthResult> => {
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
        setIsLoading(false)
        return { 
          success: false, 
          message: "Le serveur a renvoyé une réponse non valide" 
        };
      }

      console.log("Données parsées:", data);

      if (!response.ok) {
        setError(data.error || "Échec de l'inscription");
        setIsLoading(false)
        return { 
          success: false, 
          message: data.error || "Échec de l'inscription" 
        };
      }

      setIsLoading(false)
      return { 
        success: true, 
        message: data.message || "Inscription réussie. Veuillez vous connecter." 
      };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setError("Erreur de connexion au serveur");
      setIsLoading(false)
      return { 
        success: false, 
        message: "Erreur de connexion au serveur" 
      };
    }
  }, [])

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
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

      // Important: d'abord effacer les données du localStorage
      localStorage.removeItem("user")
      
      // Puis mettre à jour l'état React
      setUser(null)
      
      // Attendre un court instant pour la transition visuelle
      setTimeout(() => {
        // Redirection vers la page d'accueil
        router.push("/")
      }, 10)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setError("Erreur lors de la déconnexion")
    }
  }, [router])

  // Méthodes utilitaires
  const clearError = useCallback(() => setError(null), [])

  return {
    user,
    isLoading,
    isReady,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }
}