"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, addDays, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  Calendar as CalendarIcon, 
  Users, 
  Plus, 
  Minus, 
  Loader2,
  MapPin
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

import { HotelService } from "@/services/hotel-service"
import { ReservationService } from "@/services/reservation-service"
import { useAuth } from "@/hooks/use-auth"

// Types
type Hotel = {
  _id: string
  HotelName: string
  cityName: string
  countyName: string
  Description: string
  price: number
  image?: string
}

export default function ReservationPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  // États pour la réservation
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [checkInDate, setCheckInDate] = useState<Date>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 3))
  const [guests, setGuests] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")

  // États de disponibilité et de chargement
  const [isLoading, setIsLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(false)
  const [availableRooms, setAvailableRooms] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Obtenir l'ID de l'hôtel depuis les paramètres d'URL
  const hotelId = Array.isArray(params.id) ? params.id[0] : params.id

  // Charger les détails de l'hôtel
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId) {
        toast({
          title: "Erreur",
          description: "ID de l'hôtel manquant",
          variant: "destructive"
        })
        router.push("/hotels")
        return
      }

      try {
        const hotelData = await HotelService.getHotelById(hotelId)
        if (hotelData) {
          setHotel(hotelData)
          setIsLoading(false)
        } else {
          toast({
            title: "Erreur",
            description: "Hôtel non trouvé.",
            variant: "destructive"
          })
          router.push("/hotels")
        }
      } catch (error) {
        console.error("Erreur lors du chargement des détails de l'hôtel:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'hôtel.",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    fetchHotelDetails()
  }, [hotelId, toast, router])

  // Vérifier la disponibilité et calculer le prix
  useEffect(() => {
    const checkAvailability = async () => {
      if (!hotel || !hotelId) return

      try {
        const result = await ReservationService.checkAvailability(
          hotelId,
          format(checkInDate, 'yyyy-MM-dd'),
          format(checkOutDate, 'yyyy-MM-dd'),
          guests
        )

        setIsAvailable(result.available)
        setAvailableRooms(result.rooms)

        // Calculer le prix total
        const calculatedPrice = ReservationService.calculatePrice(
          checkInDate,
          checkOutDate,
          hotel.price || 100,
          guests,
          rooms
        )
        setTotalPrice(calculatedPrice)

        // Afficher un toast si l'hôtel n'est pas disponible
        if (!result.available) {
          toast({
            title: "Non disponible",
            description: "Cet hôtel n'est pas disponible pour les dates sélectionnées.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de disponibilité:", error)
        toast({
          title: "Erreur",
          description: "Impossible de vérifier la disponibilité de l'hôtel.",
          variant: "destructive"
        })
      }
    }

    // Vérifier la disponibilité si les dates sont valides
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      checkAvailability()
    }
  }, [checkInDate, checkOutDate, guests, hotelId, hotel, rooms, toast])

  // Gestion de la soumission de la réservation
  const handleReservation = async () => {
    // Vérifier l'authentification
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer une réservation.",
        variant: "destructive"
      })
      router.push("/login")
      return
    }

    // Vérifier que l'ID de l'hôtel existe
    if (!hotelId) {
      toast({
        title: "Erreur",
        description: "ID de l'hôtel manquant",
        variant: "destructive"
      })
      return
    }

    // Vérifier les dates
    if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
      toast({
        title: "Dates invalides",
        description: "Veuillez sélectionner des dates valides.",
        variant: "destructive"
      })
      return
    }

    try {
      // Vérifier la disponibilité
      const availabilityResult = await ReservationService.checkAvailability(
        hotelId,
        format(checkInDate, 'yyyy-MM-dd'),
        format(checkOutDate, 'yyyy-MM-dd'),
        guests
      )

      // Vérifier si l'hôtel est disponible
      if (!availabilityResult.available) {
        toast({
          title: "Non disponible",
          description: "Cet hôtel n'est pas disponible pour les dates sélectionnées.",
          variant: "destructive"
        })
        return
      }

      // Calculer le prix total
      const calculatedPrice = ReservationService.calculatePrice(
        checkInDate, 
        checkOutDate, 
        hotel?.price || 100, 
        guests, 
        rooms
      )

      // Préparer les données de réservation
      const reservationData = {
        hotelId: hotelId,
        checkIn: format(checkInDate, 'yyyy-MM-dd'),
        checkOut: format(checkOutDate, 'yyyy-MM-dd'),
        guests,
        rooms,
        totalPrice: calculatedPrice,
        specialRequests: specialRequests || undefined
      }

      // Créer la réservation
      const reservation = await ReservationService.createReservation(reservationData)
      
      // Afficher un message de succès
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été enregistrée avec succès.",
      })

      // Rediriger vers la page de confirmation de réservation
      router.push(`/reservations/${reservation.id}`)

    } catch (error) {
      // Gérer les erreurs de réservation
      console.error("Erreur lors de la réservation :", error)
      
      toast({
        title: "Erreur de réservation",
        description: "Impossible de créer la réservation. Veuillez réessayer.",
        variant: "destructive"
      })
    }
  }

  // Calcul du nombre de nuits
  const nights = checkOutDate && checkInDate 
    ? differenceInDays(checkOutDate, checkInDate) 
    : 0

  // Affichage du chargement si les détails de l'hôtel sont en cours de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Vérifier si l'hôtel existe
  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Hôtel introuvable</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informations de l'hôtel */}
        <div>
          <img 
            src={hotel.image || "/placeholder.svg"} 
            alt={hotel.HotelName} 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-2xl font-bold mb-2">{hotel.HotelName}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{hotel.cityName}, {hotel.countyName}</span>
          </div>
          <p className="text-gray-700 mb-4">{hotel.Description}</p>
        </div>

        {/* Formulaire de réservation */}
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Dates de séjour */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date d'arrivée</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={(date) => date && setCheckInDate(date)}
                      initialFocus
                      locale={fr}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Date de départ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={(date) => date && setCheckOutDate(date)}
                      initialFocus
                      locale={fr}
                      disabled={(date) => date <= checkInDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Voyageurs et chambres */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voyageurs</Label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 font-medium">{guests}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setGuests(Math.min(rooms * 4, guests + 1))}
                    disabled={guests >= rooms * 4}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Chambres</Label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      const newRooms = Math.max(1, rooms - 1)
                      setRooms(newRooms)
                      // Ajuster le nombre de voyageurs si nécessaire
                      setGuests(Math.min(guests, newRooms * 4))
                    }}
                    disabled={rooms <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 font-medium">{rooms}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setRooms(Math.min(availableRooms || 5, rooms + 1))}
                    disabled={rooms >= (availableRooms || 5)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Demandes spéciales */}
            <div className="space-y-2">
              <Label>Demandes spéciales</Label>
              <Textarea
                placeholder="Avez-vous des demandes particulières pour votre séjour ?"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>

          <Separator className="my-2" />

          <CardFooter className="p-6">
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix par nuit</span>
                <span className="font-medium">{hotel.price} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{nights} nuit(s)</span>
                <span className="font-medium">{hotel.price * nights} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{totalPrice} €</span>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleReservation}
                disabled={!isAvailable}
              >
                Réserver maintenant
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}