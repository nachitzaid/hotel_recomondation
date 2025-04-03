"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Correction des importations pour utiliser les composants existants
import HotelDashboardHeader from "@/components/home/HotelDashboardHeader"
// Nous utiliserons le footer directement dans ce fichier pour l'instant

// Composants de la page d'accueil
import WorldCupBanner from "@/components/home/WorldcupBanner"
import HotDealsSection from "@/components/home/HotDealsSection"
import BookingTimesSection from "@/components/home/BookingTimesSection"
import PopularSearchesSection from "@/components/home/PopularSearchesSection"
import StadiumHotelsSection from "@/components/home/StadiumHotelsSection"
import WorldCupExperienceSection from "@/components/home/WorldcupExperienceSection"

// Données
import { hostCountries, hotels, hotDeals, bookingTimes, popularSearches} from "@/components/data/homeData"

// Hooks personnalisés - nous utiliserons une implémentation directe pour l'instant
// import { useFavorites } from "@/lib/hooks/use-favorites"

export default function HomePage() {
  const router = useRouter()
  // Implémentation directe des favoris au lieu d'utiliser un hook personnalisé
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("worldCupFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (searchParams: any) => {
    console.log("Search params:", searchParams)
    if (searchParams.destination) {
      router.push(`/hotels?location=${searchParams.destination}`)
    }
  }

  const handleViewDetails = (hotelId: number) => {
    router.push(`/hotels/${hotelId}`)
  }

  const toggleFavorite = (id: number) => {
    let newFavorites: number[]

    if (favorites.includes(id)) {
      newFavorites = favorites.filter((hotelId) => hotelId !== id)
    } else {
      newFavorites = [...favorites, id]
    }

    setFavorites(newFavorites)
    localStorage.setItem("worldCupFavorites", JSON.stringify(newFavorites))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HotelDashboardHeader onSearch={handleSearch} />
      <WorldCupBanner hostCountries={hostCountries} />

      <main className="container mx-auto py-16 px-4">
        <HotDealsSection
          hotDeals={hotDeals}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onViewDetails={handleViewDetails}
        />

        <BookingTimesSection bookingTimes={bookingTimes} />

        <PopularSearchesSection popularSearches={popularSearches} />

        <StadiumHotelsSection
          hotels={hotels}
          favorites={favorites}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleFavorite={toggleFavorite}
          onViewDetails={handleViewDetails}
        />

        <WorldCupExperienceSection />
      </main>

      {/* Footer intégré directement */}
      <footer className="bg-gradient-to-r from-red-900 to-green-900 text-white py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">WorldCup Hotels</h3>
              <p className="text-gray-300">
                Réservez votre séjour pour la Coupe du Monde 2030 en Espagne, Portugal et Maroc.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Hôtels
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Stades
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Calendrier des matchs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Villes Hôtes</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Madrid
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Lisbonne
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Casablanca
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Barcelone
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@worldcuphotels2030.com</li>
                <li>Téléphone: +33 1 23 45 67 89</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} WorldCup Hotels 2030. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

