"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem("userRole")
    if (role === "admin") {
      router.push("/admin")
    } else if (role === "user") {
      router.push("/dashboard")
    }
  }, [])

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "" }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide"
      isValid = false
    }
    if (formData.password.length < 1) {
      newErrors.password = "Le mot de passe est requis"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Réponse du serveur:", data) // Affiche tout l'objet retourné par le serveur
        console.log("Role récupéré:", data.role) // Affiche spécifiquement le rôle
        sessionStorage.setItem("userRole", data.role)
        sessionStorage.setItem("userEmail", formData.email)
      
        setTimeout(() => {
          if (data.role === "admin") {
            console.log("Redirection après 1 minute vers /admin")
            router.push("/admin")
          } else {
            console.log("Redirection après 1 minute vers /dashboard")
            router.push("/dashboard")
          }
        }, 6) // Pause de 1 minute
      } else {
        const data = await response.json()
        console.log("Erreur de connexion:", data)
        alert(data.message)
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error)
      alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-gray-500 mt-1">Entrez vos identifiants pour accéder à votre compte</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-500 underline">Mot de passe oublié?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center" disabled={isSubmitting}>
            {isSubmitting ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  )
}
