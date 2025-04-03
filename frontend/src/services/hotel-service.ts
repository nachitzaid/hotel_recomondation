// Service pour gérer les hôtels avec le backend Flask
import type { Hotel } from "@/types"

// URL de base de l'API
const API_URL = "http://localhost:5000"

// Service pour les hôtels
export const HotelService = {
  // Fonction pour récupérer tous les hôtels
  async getHotels(): Promise<Hotel[]> {
    try {
      const response = await fetch(`${API_URL}/hotels`)

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des hôtels")
      }

      const data = await response.json()

      // Adapter les données du backend au format attendu par le frontend
      return this.adaptHotelsData(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des hôtels:", error)
      throw error
    }
  },

  // Fonction pour adapter les données des hôtels du format backend au format frontend
  adaptHotelsData(hotelsData: any[]): Hotel[] {
    return hotelsData.map((hotel, index) => ({
      id: hotel.id || index + 1,
      name: hotel.hotel_name || hotel.name || "Nom inconnu",
      location: hotel.city_name ? `${hotel.city_name}, ${hotel.country_name}` : hotel.location || "Emplacement inconnu",
      country: hotel.country_name || hotel.country || "Non spécifié",
      price: hotel.price || Math.floor(Math.random() * 300) + 100,
      originalPrice: hotel.originalPrice || hotel.price || 0,
      rating: hotel.star_rating || hotel.rating || 4.0,
      image:
        hotel.hotel_image_url?.[0] ||
        hotel.image ||
        `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(hotel.hotel_name || hotel.name || "Hotel")}`,
      amenities: hotel.hotel_amenity_list || hotel.amenities || ["Wifi", "Breakfast"],
      deal: hotel.deal || false,
      worldCupVenue: hotel.worldCupVenue || false,
      distanceToStadium: hotel.distanceToStadium || "N/A",
      matchesHosted: hotel.matchesHosted || [],

      // Propriétés manquantes ajoutées
      description: hotel.description || "Aucune description disponible",
      status: hotel.status || "pending",
      verified: hotel.verified ?? false,
      pendingApproval: hotel.pendingApproval ?? true,
      rooms: hotel.rooms || Math.floor(Math.random() * 50) + 10, // Valeur par défaut aléatoire
      bookings: hotel.bookings || 0,
      revenue: hotel.revenue || "$0",
    }))
  },

  // Fonction pour obtenir les offres spéciales (hôtels avec des réductions)
  async getHotDeals(): Promise<Hotel[]> {
    try {
      const hotels = await this.getHotels()
      // Filtrer pour ne garder que les hôtels avec des offres spéciales ou en créer artificiellement
      const hotDeals = hotels.filter((hotel) => hotel.deal || Math.random() > 0.7)

      // Ajouter des prix originaux pour les hôtels qui n'en ont pas
      return hotDeals
        .map((hotel) => {
          if (!hotel.originalPrice) {
            return {
              ...hotel,
              originalPrice: Math.floor(hotel.price * 1.3),
              deal: true,
            }
          }
          return hotel
        })
        .slice(0, 6) // Limiter à 6 offres
    } catch (error) {
      console.error("Erreur lors de la récupération des offres spéciales:", error)
      throw error
    }
  },
}
