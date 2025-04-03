import type { Hotel } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const fetchOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  mode: "cors" as RequestMode,
  credentials: "include" as RequestCredentials,
}

interface Reservation {
  id: string
  hotelName: string
  hotelId: string
  userName: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  totalAmount: string
  createdAt: string
}

interface Payment {
  id: string
  reservationId: string
  userId: string
  userName: string
  amount: string
  method: "card" | "paypal" | "bank_transfer" | "other"
  status: "completed" | "pending" | "failed" | "refunded"
  transactionId: string
  date: string
}

interface AdminUser {
  id: string
  firstName: string
  email: string
  phone: string
  location?: string
  type: "customer" | "hotel"
  status: "active" | "inactive" | "blocked"
  registeredAt: string
  bookings?: number
  totalSpent?: string
  properties?: number
  totalRevenue?: string
  image?: string
}

interface DashboardStats {
  hotels_count: number
  users_count: number
  reservations_count: number
  total_revenue: number
}

// Service d'administration
export const AdminService = {
  // GESTION DES HÔTELS
  async getHotels(): Promise<Hotel[]> {
    const response = await fetch(`${API_URL}/admin/hotels`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  async getHotelById(id: string): Promise<Hotel> {
    const response = await fetch(`${API_URL}/admin/hotels/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  async createHotel(hotelData: Partial<Hotel>): Promise<Hotel> {
    const response = await fetch(`${API_URL}/admin/hotels`, {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(hotelData),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  async updateHotel(id: string, hotelData: Partial<Hotel>): Promise<Hotel> {
    const response = await fetch(`${API_URL}/admin/hotels/${id}`, {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify(hotelData),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  async deleteHotel(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/admin/hotels/${id}`, {
      ...fetchOptions,
      method: "DELETE",
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
  },

  // GESTION DES RÉSERVATIONS
  async getReservations(): Promise<Reservation[]> {
    const response = await fetch(`${API_URL}/admin/reservations`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const data = await response.json()
    return data.map((res: any) => ({
      id: res._id || res.id,
      hotelName: res.hotelName,
      hotelId: res.hotelId,
      userName: res.userName,
      userId: res.userId,
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      guests: res.guests,
      rooms: res.rooms,
      status: res.status,
      paymentStatus: res.paymentStatus,
      totalAmount: res.totalAmount,
      createdAt: res.createdAt,
    }))
  },

  async getReservationById(id: string): Promise<Reservation> {
    const response = await fetch(`${API_URL}/admin/reservations/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const res = await response.json()
    return {
      id: res._id || res.id,
      hotelName: res.hotelName,
      hotelId: res.hotelId,
      userName: res.userName,
      userId: res.userId,
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      guests: res.guests,
      rooms: res.rooms,
      status: res.status,
      paymentStatus: res.paymentStatus,
      totalAmount: res.totalAmount,
      createdAt: res.createdAt,
    }
  },

  async deleteReservation(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/admin/reservations/${id}`, {
      ...fetchOptions,
      method: "DELETE",
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
  },

  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    const response = await fetch(`${API_URL}/admin/reservations/${id}/status`, {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  // GESTION DES PAIEMENTS
  async getPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_URL}/admin/payments`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const data = await response.json()
    return data.map((payment: any) => ({
      id: payment._id || payment.id,
      reservationId: payment.reservationId,
      userId: payment.userId,
      userName: payment.userName,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      date: payment.date,
    }))
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const payment = await response.json()
    return {
      id: payment._id || payment.id,
      reservationId: payment.reservationId,
      userId: payment.userId,
      userName: payment.userName,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      date: payment.date,
    }
  },

  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}/status`, {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  async refundPayment(id: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}/refund`, {
      ...fetchOptions,
      method: "POST",
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  // GESTION DES UTILISATEURS
  async getUsers(): Promise<AdminUser[]> {
    const response = await fetch(`${API_URL}/admin/users`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

    const users = await response.json()
    return users.map((user: any) => ({
      id: user._id || user.id,
      firstName: user.firstName,
      email: user.email,
      phone: user.phone,
      location: user.location || "Non spécifié",
      type: user.type || (user.role === "hotel" ? "hotel" : "customer"),
      status: user.status || "active",
      registeredAt: user.registeredAt || new Date().toLocaleDateString(),
      bookings: user.bookings || 0,
      totalSpent: user.totalSpent ? `${user.totalSpent}€` : "0€",
      properties: user.properties || 0,
      totalRevenue: user.totalRevenue ? `${user.totalRevenue}€` : "0€",
      image: user.image || "/placeholder.svg?height=40&width=40",
    }))
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

    const user = await response.json()
    return {
      id: user._id || user.id,
      firstName: user.firstName,
      email: user.email,
      phone: user.phone,
      location: user.location || "Non spécifié",
      type: user.type || (user.role === "hotel" ? "hotel" : "customer"),
      status: user.status || "active",
      registeredAt: user.registeredAt || new Date().toLocaleDateString(),
      bookings: user.bookings || 0,
      totalSpent: user.totalSpent ? `${user.totalSpent}€` : "0€",
      properties: user.properties || 0,
      totalRevenue: user.totalRevenue ? `${user.totalRevenue}€` : "0€",
      image: user.image || "/placeholder.svg?height=40&width=40",
    }
  },

  async updateUser(id: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      ...fetchOptions,
      method: "DELETE",
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
  },

  // STATISTIQUES DU DASHBOARD
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_URL}/admin/dashboard/stats`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    return response.json()
  },

  // NOUVELLES MÉTHODES POUR AJOUTER DES UTILISATEURS ET DES RÉSERVATIONS
  async createUser(userData: Omit<AdminUser, "id">): Promise<AdminUser> {
    try {
      // Try to connect to the real backend
      const response = await fetch(`${API_URL}/admin/users`, {
        ...fetchOptions,
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn("Backend connection failed, using development mode:", error)

      // In development mode, create a mock user with an ID
      if (process.env.NODE_ENV === "development") {
        const mockId = `dev-${Date.now()}`
        return {
          id: mockId,
          ...userData,
          // Ensure all required fields are present
          bookings: userData.bookings || 0,
          totalSpent: userData.totalSpent || "0€",
          properties: userData.properties || 0,
          totalRevenue: userData.totalRevenue || "0€",
          image: userData.image || "/placeholder.svg?height=40&width=40",
        }
      }

      throw error
    }
  },

  async createReservation(reservationData: Omit<Reservation, "id">): Promise<Reservation> {
    try {
      const response = await fetch(`${API_URL}/admin/reservations`, {
        ...fetchOptions,
        method: "POST",
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn("Backend connection failed, using development mode:", error)

      // In development mode, create a mock reservation with an ID
      if (process.env.NODE_ENV === "development") {
        const mockId = `res-${Date.now()}`
        return {
          id: mockId,
          ...reservationData,
          createdAt: reservationData.createdAt || new Date().toLocaleDateString(),
        } as Reservation
      }

      throw error
    }
  },

  async processPayment(paymentData: Omit<Payment, "id">): Promise<Payment> {
    try {
      const response = await fetch(`${API_URL}/admin/payments`, {
        ...fetchOptions,
        method: "POST",
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn("Backend connection failed, using development mode:", error)

      // In development mode, create a mock payment with an ID
      if (process.env.NODE_ENV === "development") {
        const mockId = `pay-${Date.now()}`
        return {
          id: mockId,
          ...paymentData,
          date: paymentData.date || new Date().toISOString(),
        } as Payment
      }

      throw error
    }
  },
}

