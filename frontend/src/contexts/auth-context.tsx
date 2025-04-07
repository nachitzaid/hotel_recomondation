"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Use the environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface User {
  id: string
  firstName: string
  email: string
  phone: string
  role: "user" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isReady: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (userData: { email: string; password: string; firstName: string; phone: string }) => Promise<{
    success: boolean
    message: string
  }>
  logout: () => void
  clearError: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        // Check for stored user data
        const userData = checkAuthState();
        if (userData) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user")
        }
      } finally {
        setIsLoading(false)
        setIsReady(true)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        setIsLoading(false)
        return { success: false, message: data.error || "Login failed" }
      }

      // Create user object from response
      const userData: User = {
        id: data.user._id || data.user.id || "user123",
        firstName: data.user.firstName || email.split("@")[0],
        email: data.user.email || email,
        phone: data.user.phone || "",
        role: data.user.role || "user",
        avatar:
          data.user.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.firstName)}&background=random`,
      }

      // Important: d'abord sauvegarder dans localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      
      // Ensuite mettre à jour l'état React
      setUser(userData)
      
      // Naviguer après un court délai pour permettre au React de mettre à jour son état
      setTimeout(() => {
        router.push(userData.role === "admin" ? "/admin" : "/")
        setIsLoading(false)
      }, 10)

      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login error:", error)
      setError("Server connection error")
      setIsLoading(false)
      return { success: false, message: "Server connection error" }
    }
  }, [router])

  const signup = useCallback(async (userData: { email: string; password: string; firstName: string; phone: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      // Récupérer le texte brut et tenter de le parser en JSON
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
        setIsLoading(false);
        return { 
          success: false, 
          message: "Le serveur a renvoyé une réponse non valide" 
        };
      }

      if (!response.ok) {
        setError(data.error || "Registration failed")
        setIsLoading(false)
        return { success: false, message: data.error || "Registration failed" }
      }

      setIsLoading(false)
      return { success: true, message: "Registration successful. Please log in." }
    } catch (error) {
      console.error("Signup error:", error)
      setError("Server connection error")
      setIsLoading(false)
      return { success: false, message: "Server connection error" }
    }
  }, [])

  const logout = useCallback(() => {
    try {
      // Tentative de déconnexion côté serveur si nécessaire
      fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(error => {
        console.log("Erreur de déconnexion côté serveur:", error)
        // On continue quand même avec la déconnexion côté client
      });

      // Important: d'abord nettoyer le localStorage
      localStorage.removeItem("user")
      
      // Ensuite mettre à jour l'état React
      setUser(null)
      
      // Rediriger après un court délai
      setTimeout(() => {
        router.push("/")
      }, 10)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setError("Erreur lors de la déconnexion")
    }
  }, [router])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}