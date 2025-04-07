"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Define user type
type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: "admin" | "user"
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  isReady: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  isReady: false,
  login: async () => {},
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        // Get user from local storage if available
        const storedUser = localStorage.getItem("user")
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
        setIsReady(true)
      }
    }

    // Only run in browser environment
    if (typeof window !== "undefined") {
      checkAuth()
    } else {
      // Set isReady to true for server-side rendering
      setIsLoading(false)
      setIsReady(true)
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // Simulate API call to authenticate
      // In production, you would make a real API call here
      
      // For demonstration purposes, mock the user based on email
      let mockUser: User
      
      if (email.includes("admin")) {
        mockUser = {
          id: "admin-1",
          email,
          firstName: "Admin",
          lastName: "User",
          role: "admin"
        }
        
        // Store user in local storage
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)
        router.push("/admin")
      } else {
        mockUser = {
          id: "user-1",
          email,
          firstName: "Regular",
          lastName: "User",
          role: "user"
        }
        
        // Store user in local storage
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true)
      
      // Clear local storage
      localStorage.removeItem("user")
      setUser(null)
      
      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Compute derived authentication states
  const isAuthenticated = !!user
  const isAdmin = isAuthenticated && user?.role === "admin"

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    isReady,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)