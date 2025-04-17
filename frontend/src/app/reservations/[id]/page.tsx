"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  Calendar, 
  Users, 
  Home, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Download, 
  Printer,
  FileText,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ReservationService, ReservationResponse } from "@/services/reservation-service"
import { useAuth } from "@/hooks/use-auth"

export default function ReservationConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // États
  const [reservation, setReservation] = useState<ReservationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtenir l'ID de réservation depuis les paramètres d'URL
  const reservationId = Array.isArray(params.id) ? params.id[0] : params.id

  // Charger les détails de la réservation
  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await ReservationService.getReservation(reservationId)
        setReservation(data)
      } catch (err) {
        console.error("Erreur lors du chargement de la réservation:", err)
        setError("Impossible de charger les détails de votre réservation.")
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de votre réservation.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Vérifier l'authentification avant de charger la réservation
    if (!authLoading && isAuthenticated) {
      fetchReservation()
    } else if (!authLoading && !isAuthenticated) {
      // Rediriger vers la page de connexion si non authentifié
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour accéder à cette page.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [reservationId, toast, router, isAuthenticated, authLoading])

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  // Gérer l'état de chargement
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Chargement de votre réservation...</h2>
        </div>
      </div>
    )
  }

  // Gérer les erreurs
  if (error || !reservation) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center text-red-600">
              Réservation non trouvée
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              {error || "Cette réservation n'existe pas ou vous n'êtes pas autorisé à y accéder."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/reservations">Voir mes réservations</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Calculer le nombre de nuits
  const checkInDate = parseISO(reservation.checkIn)
  const checkOutDate = parseISO(reservation.checkOut)
  const nights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête avec confirmation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Réservation confirmée!</h1>
          <p className="text-gray-600 mt-2">
            Votre réservation a été enregistrée avec succès.
          </p>
        </div>

        {/* Carte de détails de réservation */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-xl">
              Détails de la réservation #{reservation.id.substring(0, 8)}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Hôtel */}
              <div className="flex items-start">
                <Home className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Hôtel</h3>
                  <p className="text-lg font-semibold">{reservation.hotelName}</p>
                </div>
              </div>
              
              {/* Dates */}
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Dates</h3>
                  <p>
                    <span className="font-semibold">{formatDate(reservation.checkIn)}</span>
                    <ArrowRight className="inline-block mx-2 h-4 w-4" />
                    <span className="font-semibold">{formatDate(reservation.checkOut)}</span>
                    <span className="ml-1 text-gray-600">({nights} nuits)</span>
                  </p>
                </div>
              </div>
              
              {/* Voyageurs */}
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Voyageurs</h3>
                  <p>
                    <span className="font-semibold">{reservation.guests}</span> personnes,{" "}
                    <span className="font-semibold">{reservation.rooms}</span>{" "}
                    {reservation.rooms > 1 ? "chambres" : "chambre"}
                  </p>
                </div>
              </div>
              
              {/* Statut */}
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Statut</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : reservation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {reservation.status === "confirmed" 
                        ? "Confirmée" 
                        : reservation.status === "pending"
                        ? "En attente"
                        : "Annulée"}
                    </span>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.paymentStatus === "paid" 
                        ? "bg-green-100 text-green-800" 
                        : reservation.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : reservation.paymentStatus === "refunded"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      Paiement: {
                        reservation.paymentStatus === "paid" 
                          ? "Payé" 
                          : reservation.paymentStatus === "pending"
                          ? "En attente"
                          : reservation.paymentStatus === "refunded"
                          ? "Remboursé"
                          : "Échoué"
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Prix total */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Prix total</span>
                  <span className="text-xl font-bold">{reservation.totalAmount}€</span>
                </div>
              </div>
              
              {/* Demandes spéciales */}
              {reservation.specialRequests && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Demandes spéciales</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{reservation.specialRequests}</p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 flex justify-between p-6">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              <span>Imprimer</span>
            </Button>
            
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Voir les détails de l'hôtel</span>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Actions supplémentaires */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/reservations">
              <Calendar className="h-4 w-4" />
              <span>Mes réservations</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}