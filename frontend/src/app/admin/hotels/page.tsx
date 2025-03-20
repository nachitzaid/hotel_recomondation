"use client"

import { useState } from "react"
import { Search, Plus, Filter, MoreHorizontal, Star, MapPin, Check, X, Edit, Trash, Download } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Données simulées pour les hôtels
const hotels = [
  {
    id: 1,
    name: "Grand Hôtel Paris",
    location: "Paris, France",
    rating: 4.8,
    rooms: 120,
    price: "€200-€500",
    status: "active",
    verified: true,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 248,
    revenue: "€42,890",
    pendingApproval: false,
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Nice, France",
    rating: 4.9,
    rooms: 85,
    price: "€180-€450",
    status: "active",
    verified: true,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 186,
    revenue: "€38,450",
    pendingApproval: false,
  },
  {
    id: 3,
    name: "Mountain Lodge",
    location: "Chamonix, France",
    rating: 4.7,
    rooms: 42,
    price: "€150-€350",
    status: "active",
    verified: true,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 142,
    revenue: "€29,780",
    pendingApproval: false,
  },
  {
    id: 4,
    name: "City Center Hotel",
    location: "Lyon, France",
    rating: 4.6,
    rooms: 68,
    price: "€120-€280",
    status: "inactive",
    verified: true,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 124,
    revenue: "€26,540",
    pendingApproval: false,
  },
  {
    id: 5,
    name: "Riverside Boutique",
    location: "Bordeaux, France",
    rating: 4.5,
    rooms: 32,
    price: "€140-€320",
    status: "active",
    verified: true,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 98,
    revenue: "€21,350",
    pendingApproval: false,
  },
  {
    id: 6,
    name: "Luxury Palace Hotel",
    location: "Cannes, France",
    rating: 4.8,
    rooms: 150,
    price: "€300-€800",
    status: "pending",
    verified: false,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 0,
    revenue: "€0",
    pendingApproval: true,
  },
  {
    id: 7,
    name: "Historic Center Inn",
    location: "Strasbourg, France",
    rating: 4.4,
    rooms: 28,
    price: "€110-€240",
    status: "pending",
    verified: false,
    image: "/placeholder.svg?height=60&width=60",
    bookings: 0,
    revenue: "€0",
    pendingApproval: true,
  },
]

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false)

  // Filtrer les hôtels en fonction des critères
  const filteredHotels = hotels.filter((hotel) => {
    // Filtre de recherche
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de statut
    const matchesStatus = selectedStatus === "all" || hotel.status === selectedStatus

    // Filtre d'onglet
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && hotel.pendingApproval) ||
      (activeTab === "active" && hotel.status === "active" && !hotel.pendingApproval) ||
      (activeTab === "inactive" && hotel.status === "inactive" && !hotel.pendingApproval)

    return matchesSearch && matchesStatus && matchesTab
  })

  // Nombre d'hôtels en attente d'approbation
  const pendingApprovalCount = hotels.filter((hotel) => hotel.pendingApproval).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Hôtels</h1>
          <p className="text-gray-500">Gérez les hôtels partenaires de votre plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isAddHotelOpen} onOpenChange={setIsAddHotelOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un hôtel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel hôtel</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour ajouter un nouvel hôtel à la plateforme.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-name">Nom de l'hôtel</Label>
                    <Input id="hotel-name" placeholder="Grand Hôtel Paris" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotel-location">Emplacement</Label>
                    <Input id="hotel-location" placeholder="Paris, France" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-rooms">Nombre de chambres</Label>
                    <Input id="hotel-rooms" type="number" placeholder="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotel-price-range">Fourchette de prix</Label>
                    <Input id="hotel-price-range" placeholder="€200-€500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-status">Statut</Label>
                    <Select>
                      <SelectTrigger id="hotel-status">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotel-verified" className="block mb-2">
                      Vérifié
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hotel-verified" />
                      <label
                        htmlFor="hotel-verified"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Cet hôtel est vérifié
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-description">Description</Label>
                  <textarea
                    id="hotel-description"
                    className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description de l'hôtel..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-image">Image de l'hôtel</Label>
                  <Input id="hotel-image" type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddHotelOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddHotelOpen(false)}>Ajouter l'hôtel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un hôtel..."
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
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous les hôtels</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            En attente
            {pendingApprovalCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {pendingApprovalCount}
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
                      <th className="px-4 py-3">Hôtel</th>
                      <th className="px-4 py-3">Emplacement</th>
                      <th className="px-4 py-3">Chambres</th>
                      <th className="px-4 py-3">Prix</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Réservations</th>
                      <th className="px-4 py-3">Revenus</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.length > 0 ? (
                      filteredHotels.map((hotel) => (
                        <tr key={hotel.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={hotel.image} />
                                <AvatarFallback>{hotel.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center">
                                  {hotel.name}
                                  {hotel.verified && (
                                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50">
                                      <Check className="h-3 w-3 mr-1" />
                                      Vérifié
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {hotel.rating}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {hotel.location}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">{hotel.rooms}</td>
                          <td className="px-4 py-4 text-sm">{hotel.price}</td>
                          <td className="px-4 py-4">
                            <Badge
                              className={`${
                                hotel.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : hotel.status === "inactive"
                                    ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }`}
                            >
                              {hotel.status === "active"
                                ? "Actif"
                                : hotel.status === "inactive"
                                  ? "Inactif"
                                  : "En attente"}
                            </Badge>
                            {hotel.pendingApproval && (
                              <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 hover:bg-red-50">
                                Approbation requise
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm">{hotel.bookings}</td>
                          <td className="px-4 py-4 text-sm font-medium">{hotel.revenue}</td>
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
                                {hotel.pendingApproval && (
                                  <>
                                    <DropdownMenuItem className="text-green-600">
                                      <Check className="mr-2 h-4 w-4" />
                                      Approuver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <X className="mr-2 h-4 w-4" />
                                      Rejeter
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {hotel.status === "active" ? (
                                  <DropdownMenuItem className="text-amber-600">
                                    <X className="mr-2 h-4 w-4" />
                                    Désactiver
                                  </DropdownMenuItem>
                                ) : (
                                  hotel.status === "inactive" && (
                                    <DropdownMenuItem className="text-green-600">
                                      <Check className="mr-2 h-4 w-4" />
                                      Activer
                                    </DropdownMenuItem>
                                  )
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          Aucun hôtel ne correspond à vos critères de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* Contenu identique mais filtré pour les hôtels actifs */}
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {/* Contenu identique mais filtré pour les hôtels inactifs */}
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {/* Contenu identique mais filtré pour les hôtels en attente */}
          <Card>
            <CardContent className="p-0">{/* Table content similar to "all" tab but filtered */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

