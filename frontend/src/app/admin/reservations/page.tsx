"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Hotel,
  CreditCard,
  Download,
  Edit,
  Trash,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { AdminService } from "@/services/admin-service"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"

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
  status: "confirmed" | "pending" | "cancelled" | "completed"
  paymentStatus: "paid" | "pending" | "refunded" | "failed"
  totalAmount: string
  createdAt: string
}

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()


  // Charger les réservations côté client uniquement
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true)
        const data = await AdminService.getReservations()
        
        // Formatage cohérent des dates
        const typedReservations: Reservation[] = data.map((res: any) => ({
          id: res.id || res._id,
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
          createdAt: res.createdAt
        }))

        setReservations(typedReservations)
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les réservations.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [toast])

  // Filtrer les réservations
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || reservation.status === selectedStatus

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "confirmed" && reservation.status === "confirmed") ||
      (activeTab === "pending" && reservation.status === "pending") ||
      (activeTab === "cancelled" && reservation.status === "cancelled") ||
      (activeTab === "completed" && reservation.status === "completed")

    return matchesSearch && matchesStatus && matchesTab
  })

  // Gérer la suppression d'une réservation
  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return

    try {
      await AdminService.deleteReservation(reservationToDelete)
      setReservations(reservations.filter((r) => r.id !== reservationToDelete))
      toast({
        title: "Succès",
        description: "La réservation a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setReservationToDelete(null)
    }
  }

  // Gérer la mise à jour du statut
  const handleUpdateStatus = async (id: string, status: "confirmed" | "pending" | "cancelled" | "completed") => {
    try {
      await AdminService.updateReservationStatus(id, status)
      setReservations(reservations.map(r => 
        r.id === id ? { ...r, status } : r
      ))
      toast({
        title: "Succès",
        description: "Statut de réservation mis à jour.",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      })
    }
  }

  // Formatage des dates pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy')
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Réservations</h1>
          <p className="text-gray-500">Gérez les réservations effectuées sur votre plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher une réservation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={selectedStatus} 
            onValueChange={setSelectedStatus}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onglets */}
      <Tabs 
        defaultValue="all" 
        className="space-y-4" 
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Hôtel</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Dates</th>
                      <th className="px-4 py-3">Détails</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Paiement</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((reservation) => (
                        <ReservationRow
                          key={reservation.id}
                          reservation={reservation}
                          onUpdateStatus={handleUpdateStatus}
                          onDelete={(id) => {
                            setReservationToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          formatDate={formatDate}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                          Aucune réservation ne correspond à vos critères de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autres onglets (contenu similaire) */}
        {["confirmed", "pending", "cancelled", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Hôtel</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Dates</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations
                        .filter(r => r.status === tab)
                        .map((reservation) => (
                          <tr key={reservation.id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-mono">{reservation.id}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center text-sm">
                                <Hotel className="h-4 w-4 mr-1 text-gray-500" />
                                {reservation.hotelName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-1 text-gray-500" />
                                {reservation.userName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                  {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                                className={reservation.status === "confirmed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : reservation.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : reservation.status === "cancelled"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-100"}
                              >
                                {reservation.status === "confirmed"
                                  ? "Confirmée"
                                  : reservation.status === "pending"
                                    ? "En attente"
                                    : reservation.status === "cancelled"
                                      ? "Annulée"
                                      : "Terminée"}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setReservationToDelete(reservation.id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        onConfirm={handleDeleteReservation}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
      />
    </div>
  )
}

function ReservationRow({ 
  reservation, 
  onUpdateStatus, 
  onDelete,
  formatDate 
}: {
  reservation: Reservation
  onUpdateStatus: (id: string, status: "confirmed" | "pending" | "cancelled" | "completed") => void
  onDelete: (id: string) => void
  formatDate: (dateString: string) => string
}) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
      <td className="px-4 py-4 text-sm font-mono">{reservation.id}</td>
      <td className="px-4 py-4">
        <div className="flex items-center text-sm">
          <Hotel className="h-4 w-4 mr-1 text-gray-500" />
          {reservation.hotelName}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-1 text-gray-500" />
          {reservation.userName}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Réservé le {formatDate(reservation.createdAt)}</div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm">
          <div>{reservation.guests} invités</div>
          <div>{reservation.rooms} chambre(s)</div>
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge
          className={reservation.status === "confirmed"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : reservation.status === "pending"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              : reservation.status === "cancelled"
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : "bg-blue-100 text-blue-800 hover:bg-blue-100"}
        >
          {reservation.status === "confirmed"
            ? "Confirmée"
            : reservation.status === "pending"
              ? "En attente"
              : reservation.status === "cancelled"
                ? "Annulée"
                : "Terminée"}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <Badge
          variant="outline"
          className={reservation.paymentStatus === "paid"
            ? "bg-green-50 text-green-700 hover:bg-green-50"
            : reservation.paymentStatus === "pending"
              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
              : reservation.paymentStatus === "refunded"
                ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                : "bg-red-50 text-red-700 hover:bg-red-50"}
        >
          <CreditCard className="h-3 w-3 mr-1" />
          {reservation.paymentStatus === "paid"
            ? "Payé"
            : reservation.paymentStatus === "pending"
              ? "En attente"
              : reservation.paymentStatus === "refunded"
                ? "Remboursé"
                : "Échoué"}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm font-medium">{reservation.totalAmount}</td>
      <td className="px-4 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {reservation.status === "pending" && (
              <>
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirmer
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </DropdownMenuItem>
              </>
            )}
            {reservation.status === "confirmed" && (
              <>
                <DropdownMenuItem
                  className="text-blue-600"
                  onClick={() => onUpdateStatus(reservation.id, "completed")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Marquer comme terminée
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(reservation.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

function DeleteConfirmationDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  title,
  description
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}