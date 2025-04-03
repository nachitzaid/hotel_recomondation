// Service d'authentification pour communiquer avec le backend Flask
import type { User } from "@/types"

// URL de base de l'API
const API_URL = "http://localhost:5000"

// Interface pour les données d'inscription
interface SignupData {
  firstName: string
  phone: string
  email: string
  password: string
}

// Interface pour les données de connexion
interface LoginData {
  email: string
  password: string
}

// Interface pour la réponse de connexion
interface LoginResponse {
  message: string
  role: string
  email: string
  firstName: string
}

// Service d'authentification
export const AuthService = {
  // Fonction d'inscription
  async signup(userData: SignupData): Promise<{ message: string }> {
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
        throw new Error(data.message || "Erreur lors de l'inscription")
      }

      return data
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      throw error
    }
  },

  // Fonction de connexion
  async login(credentials: LoginData): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion")
      }

      // Stocker les informations de l'utilisateur dans le localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          role: data.role,
        }),
      )

      return data
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    }
  },

  // Fonction de déconnexion
  logout(): void {
    localStorage.removeItem("user")
  },

  // Fonction pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return localStorage.getItem("user") !== null
  },

  // Fonction pour obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error)
      return null
    }
  },

  // Fonction pour vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "admin"
  },
}

