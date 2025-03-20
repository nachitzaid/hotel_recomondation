"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, User, Phone, Mail, Lock, ArrowRight } from "lucide-react"

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    firstName: "",
    phone: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      firstName: "",
      phone: "",
      email: "",
      password: "",
    }

    // First name validation
    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Le prénom doit contenir au moins 2 caractères"
      isValid = false
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Veuillez entrer un numéro de téléphone valide"
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide"
      isValid = false
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
      isValid = false
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir des majuscules, minuscules et chiffres"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/login")
      } else {
        const data = await response.json()
        alert(data.message)
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription", error)
      alert("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = () => {
    const { password } = formData
    if (!password) return { strength: 0, label: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    let label = ""
    let color = ""

    switch (strength) {
      case 1:
        label = "Faible"
        color = "bg-red-500"
        break
      case 2:
        label = "Moyen"
        color = "bg-orange-500"
        break
      case 3:
        label = "Bon"
        color = "bg-yellow-500"
        break
      case 4:
        label = "Fort"
        color = "bg-green-500"
        break
      case 5:
        label = "Très fort"
        color = "bg-emerald-500"
        break
      default:
        label = ""
        color = ""
    }

    return { strength: (strength / 5) * 100, label, color }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-gray-500 mt-1">Entrez vos informations pour créer votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User className="h-5 w-5" />
              </span>
              <input
                id="firstName"
                name="firstName"
                placeholder="John"
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Phone className="h-5 w-5" />
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+33 123 456 789"
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Force du mot de passe:</span>
                  <span
                    className={`font-medium ${passwordStrength.label === "Faible" || passwordStrength.label === "Moyen" ? "text-red-500" : passwordStrength.label === "Bon" ? "text-yellow-500" : "text-green-500"}`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300 ease-in-out`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Création du compte...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                S'inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            En vous inscrivant, vous acceptez nos{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Politique de confidentialité
            </a>
            .
          </p>
        </div>

        <div className="mt-4 text-center text-sm">
          <p>
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

