"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (userData: { email: string; password: string; firstName: string; phone: string }) => Promise<{
    success: boolean
    message: string
  }>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token first
        const token = localStorage.getItem("authToken")
        if (!token) {
          setIsLoading(false)
          return
        }

        // Try to get user data from stored user or from API
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))

          // Optionally validate token with backend
          validateToken(token).catch(() => {
            // If token validation fails, log out
            logout()
          })
        } else {
          // If we have a token but no user, fetch user data
          await fetchUserData(token)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Validate token with backend
  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/validate-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Invalid token")
      }

      return true
    } catch (error) {
      console.error("Token validation failed:", error)
      return false
    }
  }

  // Fetch user data from backend
  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Error fetching user data:", error)
      logout()
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Try to connect to the real backend
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          return { success: false, message: data.message || "Login failed" }
        }

        // Save the auth token
        if (data.token) {
          localStorage.setItem("authToken", data.token)
        }

        // Save user data
        const userData: User = data.user || {
          id: data.id || "user123",
          firstName: data.firstName || email.split("@")[0],
          email: email,
          phone: data.phone || "",
          role: data.role || (email.includes("admin") ? "admin" : "user"),
          avatar:
            data.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split("@")[0])}&background=random`,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))

        return { success: true, message: "Login successful" }
      } catch (error) {
        console.warn("Backend connection failed, using development mode:", error)

        // Development mode - simulate login
        if (process.env.NODE_ENV === "development") {
          // Simple validation
          if (!email || !password) {
            return { success: false, message: "Email and password are required" }
          }

          // Mock successful login
          const mockUser: User = {
            id: "dev-user-123",
            firstName: email.split("@")[0],
            email: email,
            phone: "+1234567890",
            role: email.includes("admin") ? "admin" : "user",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split("@")[0])}&background=random`,
          }

          setUser(mockUser)
          localStorage.setItem("user", JSON.stringify(mockUser))
          localStorage.setItem("authToken", "mock-token-for-development")

          return { success: true, message: "Development mode: Login successful" }
        }

        return { success: false, message: "Error connecting to server" }
      }
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
      // Try to connect to the real backend
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
          return { success: false, message: data.message || "Registration failed" }
        }

        return { success: true, message: "Registration successful. Please log in." }
      } catch (error) {
        console.warn("Backend connection failed, using development mode:", error)

        // Development mode - simulate signup
        if (process.env.NODE_ENV === "development") {
          // Simple validation
          if (!userData.email || !userData.password) {
            return { success: false, message: "Email and password are required" }
          }

          return { success: true, message: "Development mode: Registration successful. Please log in." }
        }

        return { success: false, message: "Error connecting to server" }
      }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, message: "Server connection error" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
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

