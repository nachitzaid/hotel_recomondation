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

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored user data
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            setUser(userData)
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        await logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important pour les cookies
      })

      const data = await response.json()

      if (!response.ok) {
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
          `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.firstName || email.split("@")[0])}&background=random`,
      }

      // Save user data
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Server connection error" }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: { email: string; password: string; firstName: string; phone: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.error || "Registration failed" }
      }

      return { success: true, message: "Registration successful. Please log in." }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, message: "Server connection error" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Tentative d'appel à l'API de déconnexion (si disponible)
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          credentials: "include", // Important pour les cookies
        })
      } catch (error) {
        console.log("Pas d'API de déconnexion disponible ou erreur:", error)
        // On continue même si l'API échoue
      }

      // Nettoyage des données locales
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
        sessionStorage.removeItem("userRole")
        sessionStorage.removeItem("userEmail")
      }

      // Redirection vers la page de connexion
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }
}

