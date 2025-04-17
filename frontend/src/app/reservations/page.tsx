"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  Hotel, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Plus,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ReservationService, ReservationResponse } from "@/services/reservation-service"
import { useAuth } from "@/hooks/use-auth"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function UserReservationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // États
  const [reservations, setReservations] = useState<ReservationResponse[]>([])
  const [filteredReservations, setFilteredReservations] = useState<ReservationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [reservationToCancel, setReservationToCancel] = useState<ReservationResponse | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Charger les réservations de l'utilisateur
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await ReservationService.getUserReservations()
        setReservations(data)
        setFilteredReservations(data)
      } catch (err) {
        console.error("Erreur lors du chargement des réservations:", err)
        setError("Impossible de charger vos réservations.")
        toast({
          title: "Erreur",
          description: "Impossible de charger vos réservations.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Vérifier l'authentification avant de charger les réservations
    if (!authLoading && isAuthenticated) {
      fetchReservations()
    } else if (!authLoading && !isAuthenticated) {
      // Rediriger vers la page de connexion si non authentifié
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour accéder à cette page.",
        variant: "destructive",
      })
      router.push("/login?redirect=/reservations")
    }
  }, [toast, router, isAuthenticated, authLoading])

  // Filtrer les réservations en fonction de l'onglet actif et de la recherche
  useEffect(() => {
    let filtered = [...reservations]
    
    // Filtrer par statut
    if (activeTab !== "all") {
      filtered = filtered.filter(reservation => reservation.status === activeTab)
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(reservation => 
        reservation.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredReservations(filtered)
  }, [reservations, activeTab, searchTerm])

  // Fonction pour annuler une réservation
  const handleCancelReservation = async () => {
    if (!reservationToCancel) return
    
    try {
      setIsCancelling(true)
      
      await ReservationService.cancelReservation(reservationToCancel.id)
      
      // Mettre à jour les réservations
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === reservationToCancel.id
            ? { ...res, status: "cancelled" }
            : res
        )
      )
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès.",
      })
    } catch (err) {
      console.error("Erreur lors de l'annulation de la réservation:", err)
      toast({
        title: "Erreur",
        description: "Impossible d'annuler cette réservation.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
      setReservationToCancel(null)
    }
  }

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  // Calculer les comptages par statut
  const pendingCount = reservations.filter(res => res.status === "pending").length
  const confirmedCount = reservations.filter(res => res.status === "confirmed").length
  const cancelledCount = reservations.filter(res => res.status === "cancelled").length
  const completedCount = reservations.filter(res => res.status === "completed").length

  // Gérer l'état de chargement
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium">Chargement de vos réservations...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes réservations</h1>
          <p className="text-gray-500">Gérez vos réservations d'hôtels</p>
        </div>
        
        <Button asChild>
          <Link href="/hotels" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouvelle réservation</span>
          </Link>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par nom d'hôtel ou numéro de réservation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent p-0">
          <TabsTrigger 
            value="all" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none pb-2 px-4"
          >
            Toutes ({reservations.length})
          </TabsTrigger>
          <TabsTrigger 
            value="confirmed" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:shadow-none pb-2 px-4"
          >
            Confirmées ({confirmedCount})
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-600 data-[state=active]:text-yellow-600 data-[state=active]:shadow-none pb-2 px-4"
          >
            En attente ({pendingCount})
          </TabsTrigger>
          <TabsTrigger 
            value="cancelled" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 data-[state=active]:shadow-none pb-2 px-4"
          >
            Annulées ({cancelledCount})
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none pb-2 px-4"
          >
            Terminées ({completedCount})
          </TabsTrigger>
        </TabsList>

        {error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg text-center">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-8 rounded-lg text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Aucune réservation trouvée</h3>
            <p>
              {searchTerm 
                ? "Aucune réservation ne correspond à votre recherche." 
                : activeTab !== "all" 
                  ? `Vous n'avez pas de réservation avec le statut "${
                      activeTab === "confirmed" ? "confirmée" : 
                      activeTab === "pending" ? "en attente" : 
                      activeTab === "cancelled" ? "annulée" : "terminée"
                    }".`
                  : "Vous n'avez pas encore effectué de réservation."}
            </p>
            {(!searchTerm && activeTab === "all") && (
              <Button 
                className="mt-4"
                asChild
              >
                <Link href="/hotels">Réserver un hôtel</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex-row justify-between items-start space-y-0">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hotel className="h-4 w-4 text-gray-500" />
                      {reservation.hotelName}
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      Réservation #{reservation.id.substring(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {reservation.status === "confirmed" && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmée
                      </span>
                    )}
                    {reservation.status === "pending" && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </span>
                    )}
                    {reservation.status === "cancelled" && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                        <XCircle className="h-3 w-3 mr-1" />
                        Annulée
                      </span>
                    )}
                    {reservation.status === "completed" && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Terminée
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{formatDate(reservation.checkIn)}</span>
                      <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
                      <span className="font-medium">{formatDate(reservation.checkOut)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {reservation.guests} personnes, {reservation.rooms} chambre(s)
                        </span>
                      </div>
                      <span className="font-bold">
                        {reservation.totalAmount}€
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <Separator />
                
                <CardFooter className="p-3 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link href={`/reservations/${reservation.id}`} className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Détails</span>
                    </Link>
                  </Button>
                  
                  {(reservation.status === "confirmed" || reservation.status === "pending") && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={() => setReservationToCancel(reservation)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      <span>Annuler</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
      
      {/* Dialogue de confirmation d'annulation */}
      <Dialog open={!!reservationToCancel} onOpenChange={(open) => !open && setReservationToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          {reservationToCancel && (
            <div className="bg-gray-50 p-4 rounded-md my-4">
              <p className="font-medium">{reservationToCancel.hotelName}</p>
              <p className="text-sm text-gray-600">
                {formatDate(reservationToCancel.checkIn)} - {formatDate(reservationToCancel.checkOut)}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReservationToCancel(null)}
              disabled={isCancelling}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReservation}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Annulation en cours...
                </>
              ) : (
                "Confirmer l'annulation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}