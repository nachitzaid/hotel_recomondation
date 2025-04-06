// services/admin-service.ts
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

// Interface pour la réponse paginée
interface PaginatedResponse<T> {
  hotels: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
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

// Fonction utilitaire pour nettoyer les clés avec des espaces
function cleanObjectKeys(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanObjectKeys);
  }

  const cleanedObj: any = {};
  
  Object.keys(obj).forEach(key => {
    const cleanKey = key.trim();
    cleanedObj[cleanKey] = cleanObjectKeys(obj[key]);
  });

  return cleanedObj;
}

// Fonction de normalisation des hôtels AMÉLIORÉE pour conserver les données originales
function normalizeHotel(hotel: any): Hotel {
  if (!hotel) return null as any;
  
  const cleanHotel = cleanObjectKeys(hotel);
  
  // Afficher les données brutes pour le débogage
  console.log('Données hôtel brutes:', JSON.stringify(cleanHotel, null, 2));
  
  // Utiliser les opérateurs logiques OR (||) pour appliquer des valeurs par défaut UNIQUEMENT si les propriétés sont nulles ou indéfinies
  // Cela évite de remplacer des chaînes vides ou des zéros valides par des valeurs par défaut
  return {
    _id: cleanHotel._id || 
         cleanHotel.id || 
         cleanHotel.HotelCode?.toString() || 
         `id-${Math.random().toString(36).substring(2, 9)}`,
    countyCode: cleanHotel.countyCode || "MA",
    countyName: cleanHotel.countyName || "Morocco",
    cityCode: cleanHotel.cityCode ?? 0, // Utiliser ?? pour conserver 0 s'il est défini
    cityName: cleanHotel.cityName || "Ville inconnue",
    HotelCode: cleanHotel.HotelCode ?? 0, // Utiliser ?? pour conserver 0 s'il est défini
    HotelName: cleanHotel.HotelName || cleanHotel.name || "Hôtel sans nom",
    HotelRating: cleanHotel.HotelRating || cleanHotel.rating || "ThreeStar",
    Address: cleanHotel.Address || cleanHotel.address || "",
    Attractions: cleanHotel.Attractions || cleanHotel.attractions || "",
    Description: cleanHotel.Description || cleanHotel.description || "",
    FaxNumber: cleanHotel.FaxNumber || cleanHotel.faxNumber || "",
    HotelFacilities: cleanHotel.HotelFacilities || cleanHotel.facilities || "",
    Map: cleanHotel.Map || cleanHotel.map || "",
    PhoneNumber: cleanHotel.PhoneNumber || cleanHotel.phoneNumber || "",
    PinCode: cleanHotel.PinCode ?? cleanHotel.pinCode ?? 0, // Utiliser ?? pour conserver 0 s'il est défini
    HotelWebsiteUrl: cleanHotel.HotelWebsiteUrl || cleanHotel.website || "",
    status: cleanHotel.status || "inactive",
    verified: cleanHotel.verified ?? false, // Utiliser ?? pour conserver false s'il est défini
    pendingApproval: cleanHotel.pendingApproval ?? false, // Utiliser ?? pour conserver false s'il est défini
    image: cleanHotel.image || cleanHotel.imageUrl || "/placeholder.svg?height=40&width=40",
    rooms: cleanHotel.rooms ?? 0, // Utiliser ?? pour conserver 0 s'il est défini
    price: cleanHotel.price ?? 0, // Utiliser ?? pour conserver 0 s'il est défini
    bookings: cleanHotel.bookings ?? 0, // Utiliser ?? pour conserver 0 s'il est défini
    revenue: cleanHotel.revenue || "0€"
  };
}

// Fonction pour normaliser une réservation
function normalizeReservation(res: any): Reservation {
  const cleanRes = cleanObjectKeys(res);
  
  return {
    id: cleanRes._id || cleanRes.id,
    hotelName: cleanRes.hotelName,
    hotelId: cleanRes.hotelId,
    userName: cleanRes.userName,
    userId: cleanRes.userId,
    checkIn: cleanRes.checkIn,
    checkOut: cleanRes.checkOut,
    guests: cleanRes.guests,
    rooms: cleanRes.rooms,
    status: cleanRes.status,
    paymentStatus: cleanRes.paymentStatus,
    totalAmount: cleanRes.totalAmount,
    createdAt: cleanRes.createdAt,
  };
}

// Fonction pour normaliser un paiement
function normalizePayment(payment: any): Payment {
  const cleanPayment = cleanObjectKeys(payment);
  
  return {
    id: cleanPayment._id || cleanPayment.id,
    reservationId: cleanPayment.reservationId,
    userId: cleanPayment.userId,
    userName: cleanPayment.userName,
    amount: cleanPayment.amount,
    method: cleanPayment.method,
    status: cleanPayment.status,
    transactionId: cleanPayment.transactionId,
    date: cleanPayment.date,
  };
}

// Fonction pour normaliser un utilisateur
function normalizeUser(user: any): AdminUser {
  const cleanUser = cleanObjectKeys(user);
  
  return {
    id: cleanUser._id || cleanUser.id,
    firstName: cleanUser.firstName,
    email: cleanUser.email,
    phone: cleanUser.phone,
    location: cleanUser.location || "Non spécifié",
    type: cleanUser.type || (cleanUser.role === "hotel" ? "hotel" : "customer"),
    status: cleanUser.status || "active",
    registeredAt: cleanUser.registeredAt || new Date().toLocaleDateString(),
    bookings: cleanUser.bookings || 0,
    totalSpent: cleanUser.totalSpent ? `${cleanUser.totalSpent}€` : "0€",
    properties: cleanUser.properties || 0,
    totalRevenue: cleanUser.totalRevenue ? `${cleanUser.totalRevenue}€` : "0€",
    image: cleanUser.image || "/placeholder.svg?height=40&width=40",
  };
}

// Service d'administration complet avec amélioration du débogage
export const AdminService = {
  // GESTION DES HÔTELS
  async getHotels(limit = 10, page = 1): Promise<PaginatedResponse<Hotel> | Hotel[]> {
    try {
      const skip = (page - 1) * limit;
      console.log(`Récupération des hôtels: limite=${limit}, page=${page}, skip=${skip}`);
      
      const response = await fetch(`${API_URL}/admin/hotels?limit=${limit}&skip=${skip}`, fetchOptions);
      
      if (!response.ok) {
        console.error(`Erreur HTTP: ${response.status}`);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const rawData = await response.json();
      console.log("Données brutes reçues:", typeof rawData, Array.isArray(rawData) ? rawData.length : 'non-array');
      
      // Afficher un échantillon des données pour le débogage
      if (Array.isArray(rawData) && rawData.length > 0) {
        console.log("Exemple de données (premier élément):", JSON.stringify(rawData[0], null, 2));
      } else if (rawData.hotels && Array.isArray(rawData.hotels) && rawData.hotels.length > 0) {
        console.log("Exemple de données (premier élément des hôtels):", JSON.stringify(rawData.hotels[0], null, 2));
      }
      
      const data = cleanObjectKeys(rawData);
      
      // Normalisation et vérification du format de la réponse
      if (Array.isArray(data)) {
        console.log("Réponse reçue sous forme de tableau avec", data.length, "éléments");
        const normalizedHotels = data.map(hotel => {
          const normalized = normalizeHotel(hotel);
          // Vérifier si l'hôtel a bien été normalisé avec les vraies données
          console.log(`Hôtel normalisé: ${normalized.HotelName} (id: ${normalized._id})`);
          return normalized;
        });
        
        return {
          hotels: normalizedHotels,
          total: normalizedHotels.length,
          page: page,
          limit: limit,
          pages: Math.ceil(normalizedHotels.length / limit)
        };
      } else if (data.hotels && Array.isArray(data.hotels)) {
        console.log("Réponse reçue sous forme paginée avec", data.hotels.length, "éléments");
        // Normaliser les hôtels dans la réponse paginée
        const normalizedHotels = data.hotels.map((hotel: any) => {
          const normalized = normalizeHotel(hotel);
          // Vérifier si l'hôtel a bien été normalisé avec les vraies données
          console.log(`Hôtel normalisé: ${normalized.HotelName} (id: ${normalized._id})`);
          return normalized;
        });
        
        return {
          hotels: normalizedHotels,
          total: data.total || normalizedHotels.length,
          page: data.page || page,
          limit: data.limit || limit,
          pages: data.pages || Math.ceil(normalizedHotels.length / limit)
        };
      } else {
        console.error("Format de réponse non reconnu:", data);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des hôtels:", error);
      throw error;
    }
  },

  async getHotelById(id: string): Promise<Hotel> {
    try {
      console.log(`Récupération de l'hôtel avec ID: ${id}`);
      const response = await fetch(`${API_URL}/admin/hotels/${id}`, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const rawData = await response.json();
      console.log("Données brutes de l'hôtel:", JSON.stringify(rawData, null, 2));
      
      return normalizeHotel(rawData);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'hôtel ${id}:`, error);
      throw error;
    }
  },

  async createHotel(hotelData: Partial<Hotel>): Promise<Hotel> {
    try {
      console.log("Création d'un nouvel hôtel avec les données:", JSON.stringify(hotelData, null, 2));
      
      // Suppression de l'ID s'il est présent
      const { _id, ...dataToCreate } = hotelData;
      
      // Mapper les champs pour correspondre à ce que le backend attend
      const mappedData = {
        name: dataToCreate.HotelName,
        location: dataToCreate.cityName,
        description: dataToCreate.Description,
        phoneNumber: dataToCreate.PhoneNumber,
        website: dataToCreate.HotelWebsiteUrl,
        address: dataToCreate.Address,
        rating: dataToCreate.HotelRating,
        countyCode: dataToCreate.countyCode,
        countyName: dataToCreate.countyName,
        HotelCode: dataToCreate.HotelCode ? Number(dataToCreate.HotelCode) : undefined,
        status: dataToCreate.status,
        verified: dataToCreate.verified,
        rooms: dataToCreate.rooms ? Number(dataToCreate.rooms) : undefined,
        price: dataToCreate.price ? Number(dataToCreate.price) : undefined
      };
      
      const response = await fetch(`${API_URL}/admin/hotels`, {
        ...fetchOptions,
        method: "POST",
        body: JSON.stringify(mappedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur HTTP: ${response.status} - ${errorText}`);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      
      const rawData = await response.json();
      console.log("Données de l'hôtel créé:", JSON.stringify(rawData, null, 2));
      
      return normalizeHotel(rawData);
    } catch (error) {
      console.error("Erreur lors de la création de l'hôtel:", error);
      throw error;
    }
  },

  async updateHotel(id: string, hotelData: Partial<Hotel>): Promise<Hotel> {
    try {
      // Suppression de l'ID s'il est présent
      const { _id, ...dataToUpdate } = hotelData;
  
      const response = await fetch(`${API_URL}/admin/hotels/${id}`, {
        ...fetchOptions,
        method: "PUT",
        body: JSON.stringify(dataToUpdate),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur HTTP: ${response.status} - ${errorText}`);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      
      const rawData = await response.json();
      console.log("Données de l'hôtel mis à jour:", JSON.stringify(rawData, null, 2));
      
      return normalizeHotel(rawData);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'hôtel ${id}:`, error);
      throw error;
    }
  },

  async deleteHotel(id: string): Promise<void> {
    try {
      console.log(`Suppression de l'hôtel avec ID: ${id}`);
      
      const response = await fetch(`${API_URL}/admin/hotels/${id}`, {
        ...fetchOptions,
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      console.log(`Hôtel ${id} supprimé avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'hôtel ${id}:`, error);
      throw error;
    }
  },

  // Reste des méthodes inchangées
  // GESTION DES RÉSERVATIONS
  async getReservations(): Promise<Reservation[]> {
    try {
      const response = await fetch(`${API_URL}/admin/reservations`, fetchOptions)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const rawData = await response.json()
      const data = cleanObjectKeys(rawData)
      return Array.isArray(data) ? data.map(normalizeReservation) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error)
      throw error
    }
  },

  async getReservationById(id: string): Promise<Reservation> {
    const response = await fetch(`${API_URL}/admin/reservations/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const rawData = await response.json()
    return normalizeReservation(rawData)
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
    const rawData = await response.json()
    return normalizeReservation(rawData)
  },

  // GESTION DES PAIEMENTS
  async getPayments(): Promise<Payment[]> {
    try {
      const response = await fetch(`${API_URL}/admin/payments`, fetchOptions)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const rawData = await response.json()
      const data = cleanObjectKeys(rawData)
      return Array.isArray(data) ? data.map(normalizePayment) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error)
      throw error
    }
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const rawData = await response.json()
    return normalizePayment(rawData)
  },

  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}/status`, {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const rawData = await response.json()
    return normalizePayment(rawData)
  },

  async refundPayment(id: string): Promise<Payment> {
    const response = await fetch(`${API_URL}/admin/payments/${id}/refund`, {
      ...fetchOptions,
      method: "POST",
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const rawData = await response.json()
    return normalizePayment(rawData)
  },

  // GESTION DES UTILISATEURS
  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await fetch(`${API_URL}/admin/users`, fetchOptions)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const rawData = await response.json()
      const data = cleanObjectKeys(rawData)
      return Array.isArray(data) ? data.map(normalizeUser) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
      throw error
    }
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, fetchOptions)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const rawData = await response.json()
    return normalizeUser(rawData)
  },

  async updateUser(id: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      ...fetchOptions,
      method: "PUT",
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const rawData = await response.json()
    return normalizeUser(rawData)
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
    try {
      const response = await fetch(`${API_URL}/admin/dashboard/stats`, fetchOptions)
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      const rawData = await response.json()
      return cleanObjectKeys(rawData)
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      throw error
    }
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

      const rawData = await response.json()
      return normalizeUser(rawData)
    } catch (error) {
      console.warn("Backend connection failed, using development mode:", error)

      // In development mode, create a mock user with an ID
      if (process.env.NODE_ENV === "development") {
        const mockId = `dev-${Date.now()}`
        return normalizeUser({
          id: mockId,
          ...userData,
        })
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

      const rawData = await response.json()
      return normalizeReservation(rawData)
    } catch (error) {
      console.warn("Backend connection failed, using development mode:", error)

      // In development mode, create a mock reservation with an ID
      if (process.env.NODE_ENV === "development") {
        const mockId = `res-${Date.now()}`
        return normalizeReservation({
          id: mockId,
          ...reservationData,
          createdAt: reservationData.createdAt || new Date().toLocaleDateString(),
        })
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

      const rawData = await response.json()
      return normalizePayment(rawData)
    } catch (error) {
      console.warn("Backend connection failed, using development mode:", error)

      // In development mode, create a mock payment with an ID
      if (process.env.NODE_ENV === "development") {
        const mockId = `pay-${Date.now()}`
        return normalizePayment({
          id: mockId,
          ...paymentData,
          date: paymentData.date || new Date().toISOString(),
        })
      }

      throw error
    }
  },
}