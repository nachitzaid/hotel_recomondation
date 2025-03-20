"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal, Calendar, User, Download, Check, X, AlertTriangle } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Définir l'interface pour les réservations
interface Hotel {
  name: string
  image: string
}

interface UserType {
  name: string
  email: string
  image: string
}

interface Reservation {
  id: string
  reservationId: string
  hotel: Hotel
  user: UserType
  checkIn: string
  checkOut: string
  guests: number
  amount: string
  commission: string
  status: "confirmed" | "pending" | "cancelled"
  paymentStatus: "paid" | "pending" | "refunded"
  createdAt: string
  dispute: boolean
  transferredToHotel?: boolean
}

// Données simulées pour les réservations
const reservations: Reservation[] = [
  {
    id: "P-12345",
    reservationId: "B-12345",
    hotel: {
      name: "Grand Hôtel Paris",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-06-15",
    checkOut: "2023-06-20",
    guests: 2,
    amount: "€1,250",
    commission: "€125",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-01",
    dispute: false,
  },
  {
    id: "P-12346",
    reservationId: "B-12346",
    hotel: {
      name: "Seaside Resort",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Marie Martin",
      email: "marie.martin@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-06-18",
    checkOut: "2023-06-25",
    guests: 3,
    amount: "€1,890",
    commission: "€189",
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2023-06-02",
    dispute: false,
  },
  {
    id: "P-12347",
    reservationId: "B-12347",
    hotel: {
      name: "Mountain Lodge",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Pierre Durand",
      email: "pierre.durand@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-06-20",
    checkOut: "2023-06-27",
    guests: 2,
    amount: "€1,540",
    commission: "€154",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-03",
    dispute: false,
  },
  {
    id: "P-12348",
    reservationId: "B-12348",
    hotel: {
      name: "City Center Hotel",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Sophie Petit",
      email: "sophie.petit@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-06-22",
    checkOut: "2023-06-24",
    guests: 1,
    amount: "€480",
    commission: "€48",
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2023-06-04",
    dispute: false,
  },
  {
    id: "P-12349",
    reservationId: "B-12349",
    hotel: {
      name: "Riverside Boutique",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Thomas Leroy",
      email: "thomas.leroy@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-06-25",
    checkOut: "2023-06-30",
    guests: 2,
    amount: "€1,350",
    commission: "€135",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-05",
    dispute: false,
  },
  {
    id: "P-12350",
    reservationId: "B-12350",
    hotel: {
      name: "Luxury Palace Hotel",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Claire Dubois",
      email: "claire.dubois@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-06-28",
    checkOut: "2023-07-05",
    guests: 4,
    amount: "€3,200",
    commission: "€320",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-06",
    dispute: true,
  },
  {
    id: "P-12351",
    reservationId: "B-12351",
    hotel: {
      name: "Historic Center Inn",
      image: "/placeholder.svg?height=40&width=40",
    },
    user: {
      name: "Lucas Moreau",
      email: "lucas.moreau@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2023-07-01",
    checkOut: "2023-07-03",
    guests: 2,
    amount: "€420",
    commission: "€42",
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2023-06-07",
    dispute: false,
  },
]

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filtrer les réservations en fonction des critères
  const filteredReservations = reservations.filter((reservation) => {
    // Filtre de recherche
    const matchesSearch =
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user.name.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de statut
    const matchesStatus = selectedStatus === "all" || reservation.status === selectedStatus

    // Filtre d'onglet
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "confirmed" && reservation.status === "confirmed") ||
      (activeTab === "pending" && reservation.status === "pending") ||
      (activeTab === "cancelled" && reservation.status === "cancelled") ||
      (activeTab === "disputes" && reservation.dispute)

    return matchesSearch && matchesStatus && matchesTab
  })

  // Nombre de litiges
  const disputesCount = reservations.filter((reservation) => reservation.dispute).length

  // Ouvrir les détails d'une réservation
  const openReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Réservations</h1>
          <p className="text-gray-500">Gérez les réservations effectuées sur votre plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
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
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Toutes les réservations</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          <TabsTrigger value="disputes" className="relative">
            Litiges
            {disputesCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {disputesCount}
              </Badge>
            )}
          </TabsTrigger>
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
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Paiement</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-4 font-medium">{reservation.id}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={reservation.hotel.image} />
                                <AvatarFallback>{reservation.hotel.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{reservation.hotel.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={reservation.user.image} />
                                <AvatarFallback>{reservation.user.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm">{reservation.user.name}</div>
                                <div className="text-xs text-gray-500">{reservation.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              {reservation.checkIn} - {reservation.checkOut}
                            </div>
                            <div className="text-xs text-gray-500">{reservation.guests} invités</div>
                          </td>
                          <td className="px-4 py-4 font-medium">{reservation.amount}</td>
                          <td className="px-4 py-4 text-sm">{reservation.commission}</td>
                          <td className="px-4 py-4">
                            <Badge
                              className={`${
                                reservation.status === "confirmed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : reservation.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                              }`}
                            >
                              {reservation.status === "confirmed"
                                ? "Confirmée"
                                : reservation.status === "pending"
                                  ? "En attente"
                                  : "Annulée"}
                            </Badge>
                            {reservation.dispute && (
                              <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 hover:bg-red-50">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Litige
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant="outline"
                              className={`${
                                reservation.paymentStatus === "paid"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : reservation.paymentStatus === "pending"
                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {reservation.paymentStatus === "paid"
                                ? "Payé"
                                : reservation.paymentStatus === "pending"
                                  ? "En attente"
                                  : "Remboursé"}
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
                                <DropdownMenuItem onClick={() => openReservationDetails(reservation)}>
                                  Voir les détails
                                </DropdownMenuItem>
                                {reservation.status === "pending" && (
                                  <DropdownMenuItem className="text-green-600">
                                    <Check className="mr-2 h-4 w-4" />
                                    Confirmer
                                  </DropdownMenuItem>
                                )}
                                {(reservation.status === "pending" || reservation.status === "confirmed") && (
                                  <DropdownMenuItem className="text-red-600">
                                    <X className="mr-2 h-4 w-4" />
                                    Annuler
                                  </DropdownMenuItem>
                                )}
                                {reservation.dispute && (
                                  <DropdownMenuItem>
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Gérer le litige
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Exporter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
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

        {/* Les autres onglets ont un contenu similaire mais filtré */}
        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de détails de réservation */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la réservation {selectedReservation.id}</DialogTitle>
                <DialogDescription>Créée le {selectedReservation.createdAt}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Hôtel</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedReservation.hotel.image} />
                        <AvatarFallback>{selectedReservation.hotel.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedReservation.hotel.name}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedReservation.user.image} />
                        <AvatarFallback>{selectedReservation.user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{selectedReservation.user.name}</div>
                        <div className="text-xs text-gray-500">{selectedReservation.user.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Dates</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Check-in: {selectedReservation.checkIn}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Check-out: {selectedReservation.checkOut}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Invités</h3>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{selectedReservation.guests} invités</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Montant</h3>
                    <div className="text-lg font-bold">{selectedReservation.amount}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Commission</h3>
                    <div className="text-lg font-bold">{selectedReservation.commission}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Statut</h3>
                    <Badge
                      className={`${
                        selectedReservation.status === "confirmed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : selectedReservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      {selectedReservation.status === "confirmed"
                        ? "Confirmée"
                        : selectedReservation.status === "pending"
                          ? "En attente"
                          : "Annulée"}
                    </Badge>
                    {selectedReservation.dispute && (
                      <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 hover:bg-red-50">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Litige
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Paiement</h3>
                    <Badge
                      variant="outline"
                      className={`${
                        selectedReservation.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700 hover:bg-green-50"
                          : selectedReservation.paymentStatus === "pending"
                            ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {selectedReservation.paymentStatus === "paid"
                        ? "Payé"
                        : selectedReservation.paymentStatus === "pending"
                          ? "En attente"
                          : "Remboursé"}
                    </Badge>
                  </div>
                </div>

                {selectedReservation.dispute && (
                  <div className="mt-2 p-4 bg-red-50 rounded-md border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-red-800">Litige en cours</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Le client a signalé un problème avec cette réservation. Veuillez examiner les détails et
                          contacter les deux parties pour résoudre ce litige.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fermer
                </Button>
                {selectedReservation.status === "pending" && (
                  <Button className="bg-green-600 hover:bg-green-700">Confirmer</Button>
                )}
                {(selectedReservation.status === "pending" || selectedReservation.status === "confirmed") && (
                  <Button variant="destructive">Annuler</Button>
                )}
                {selectedReservation.dispute && (
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                    Gérer le litige
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

