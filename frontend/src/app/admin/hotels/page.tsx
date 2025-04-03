"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/components/ui/use-toast"
import { AdminService } from "@/services/admin-service"
import type { Hotel, HotelFormState } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { EditHotelDialog } from "@/components/edit-hotel-dialog"

interface HotelRowProps {
  hotel: Hotel
  onViewDetails: (hotel: Hotel) => void
  onToggleStatus: (id: string | number, status: string) => void
  onDelete: (id: string) => void
  onEdit: (hotel: Hotel) => void
  onApprove: (id: string | number) => void
  onReject: (id: string | number) => void
}

function HotelRow({ hotel, onViewDetails, onToggleStatus, onDelete, onEdit, onApprove, onReject }: HotelRowProps) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
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
      <td className="px-4 py-4 text-sm">{hotel.rooms || "N/A"}</td>
      <td className="px-4 py-4 text-sm">{hotel.price}€</td>
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
          {hotel.status === "active" ? "Actif" : hotel.status === "inactive" ? "Inactif" : "En attente"}
        </Badge>
        {hotel.pendingApproval && (
          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 hover:bg-red-50">
            Approbation requise
          </Badge>
        )}
      </td>
      <td className="px-4 py-4 text-sm">{hotel.bookings || 0}</td>
      <td className="px-4 py-4 text-sm font-medium">{hotel.revenue || "0€"}</td>
      <td className="px-4 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(hotel)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {hotel.pendingApproval && (
              <>
                <DropdownMenuItem className="text-green-600" onClick={() => onApprove(hotel.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Approuver
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => onReject(hotel.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Rejeter
                </DropdownMenuItem>
              </>
            )}
            {hotel.status === "active" ? (
              <DropdownMenuItem className="text-amber-600" onClick={() => onToggleStatus(hotel.id, "active")}>
                <X className="mr-2 h-4 w-4" />
                Désactiver
              </DropdownMenuItem>
            ) : (
              hotel.status === "inactive" && (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => onToggleStatus(hotel.id, "inactive")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Activer
                </DropdownMenuItem>
              )
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(hotel.id.toString())}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  const [newHotel, setNewHotel] = useState<HotelFormState>({
    name: "",
    location: "",
    rooms: "",
    price: "",
    status: "active",
    verified: false,
    description: "",
    image: "",
    rating: "4.5",
    pendingApproval: false,
  })
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true)
        const data = await AdminService.getHotels()

        const formattedHotels = data.map((hotel: any) => ({
          id: hotel.id || hotel._id,
          name: hotel.name || "Hôtel sans nom",
          location: hotel.location || "Emplacement non spécifié",
          rooms: hotel.rooms || 0,
          price: hotel.price || 0,
          status: hotel.status || "inactive",
          verified: hotel.verified || false,
          description: hotel.description || "",
          image: hotel.image || "/placeholder.svg?height=40&width=40",
          rating: hotel.rating ? hotel.rating.toString() : "0",
          pendingApproval: hotel.pendingApproval || false,
          bookings: hotel.bookings || 0,
          revenue: hotel.revenue || "0€",
          amenities: hotel.amenities || [],
          country: hotel.country || "",
        }))

        setHotels(formattedHotels)
      } catch (error) {
        console.error("Erreur lors du chargement des hôtels:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les hôtels. Utilisation de données de démonstration.",
          variant: "destructive",
        })

        setHotels([
          {
            id: "1",
            name: "Grand Hôtel Paris",
            location: "Paris, France",
            rooms: 120,
            price: 250,
            status: "active",
            verified: true,
            description: "Un hôtel luxueux au cœur de Paris",
            image: "/placeholder.svg?height=40&width=40",
            rating: "4.8",
            pendingApproval: false,
            bookings: 45,
            revenue: "11250€",
            amenities: [],
            country: "",
          },
          {
            id: "2",
            name: "Hôtel Méditerranée",
            location: "Marseille, France",
            rooms: 80,
            price: 180,
            status: "active",
            verified: true,
            description: "Vue imprenable sur la Méditerranée",
            image: "/placeholder.svg?height=40&width=40",
            rating: "4.5",
            pendingApproval: false,
            bookings: 32,
            revenue: "5760€",
            amenities: [],
            country: "",
          },
          {
            id: "3",
            name: "Résidence Alpes",
            location: "Chamonix, France",
            rooms: 50,
            price: 220,
            status: "inactive",
            verified: false,
            description: "Au pied des pistes de ski",
            image: "/placeholder.svg?height=40&width=40",
            rating: "4.2",
            pendingApproval: false,
            bookings: 0,
            revenue: "0€",
            amenities: [],
            country: "",
          },
          {
            id: "4",
            name: "Nouvel Hôtel Bordeaux",
            location: "Bordeaux, France",
            rooms: 65,
            price: 190,
            status: "pending",
            verified: false,
            description: "Au cœur du vignoble bordelais",
            image: "/placeholder.svg?height=40&width=40",
            rating: "0",
            pendingApproval: true,
            bookings: 0,
            revenue: "0€",
            amenities: [],
            country: "",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [toast])

  const handleNewHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewHotel((prev) => ({ ...prev, [name]: value }))
  }

  const handleVerifiedChange = (checked: boolean) => {
    setNewHotel((prev) => ({ ...prev, verified: checked }))
  }

  const handleStatusChange = (value: string) => {
    const validStatus =
      value === "active" || value === "inactive" || value === "pending"
        ? (value as "active" | "inactive" | "pending")
        : "active"
    setNewHotel((prev) => ({ ...prev, status: validStatus }))
  }

  const handleAddHotel = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const hotelData = {
        ...newHotel,
        rooms: Number.parseInt(newHotel.rooms) || 0,
        price: Number.parseInt(newHotel.price) || 0,
        rating: newHotel.rating.toString(),
      }

      const result = await AdminService.createHotel(hotelData)

      setHotels((prev) => [
        ...prev,
        {
          ...hotelData,
          id: result.id || Date.now().toString(),
          bookings: 0,
          revenue: "0€",
          rating: hotelData.rating.toString(),
          amenities: [],
          country: "",
        },
      ])

      setNewHotel({
        name: "",
        location: "",
        rooms: "",
        price: "",
        status: "active",
        verified: false,
        description: "",
        image: "",
        rating: "4.5",
        pendingApproval: false,
      })

      setIsAddHotelOpen(false)

      toast({
        title: "Succès",
        description: "L'hôtel a été ajouté avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'hôtel:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || hotel.status === selectedStatus

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && hotel.pendingApproval) ||
      (activeTab === "active" && hotel.status === "active" && !hotel.pendingApproval) ||
      (activeTab === "inactive" && hotel.status === "inactive" && !hotel.pendingApproval)

    return matchesSearch && matchesStatus && matchesTab
  })

  const pendingApprovalCount = hotels.filter((hotel) => hotel.pendingApproval).length

  const handleDeleteHotel = async () => {
    if (!hotelToDelete) return

    try {
      await AdminService.deleteHotel(hotelToDelete)
      setHotels(hotels.filter((hotel) => hotel.id.toString() !== hotelToDelete))
      toast({
        title: "Succès",
        description: "L'hôtel a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de l'hôtel:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setHotelToDelete(null)
    }
  }

  const handleSaveHotel = async (hotel: Hotel) => {
    try {
      await AdminService.updateHotel(hotel.id.toString(), hotel)
      setHotels(hotels.map((h) => (h.id === hotel.id ? hotel : h)))
      toast({
        title: "Succès",
        description: "L'hôtel a été mis à jour avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'hôtel:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleEditHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsEditHotelOpen(true)
  }

  const handleApproveHotel = async (id: number | string) => {
    try {
      await AdminService.updateHotel(id.toString(), {
        pendingApproval: false,
        status: "active",
      })

      setHotels(
        hotels.map((hotel) => {
          if (hotel.id === id) {
            return { ...hotel, pendingApproval: false, status: "active" }
          }
          return hotel
        }),
      )

      toast({
        title: "Succès",
        description: "L'hôtel a été approuvé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'approbation de l'hôtel:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleRejectHotel = async (id: number | string) => {
    try {
      await AdminService.updateHotel(id.toString(), {
        pendingApproval: false,
        status: "inactive",
      })

      setHotels(
        hotels.map((hotel) => {
          if (hotel.id === id) {
            return { ...hotel, pendingApproval: false, status: "inactive" }
          }
          return hotel
        }),
      )

      toast({
        title: "Succès",
        description: "L'hôtel a été rejeté avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors du rejet de l'hôtel:", error)
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleToggleHotelStatus = async (id: number | string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      await AdminService.updateHotel(id.toString(), { status: newStatus })

      setHotels(
        hotels.map((hotel) => {
          if (hotel.id === id) {
            return { ...hotel, pendingApproval: false, status: newStatus as "active" | "inactive" | "pending" }
          }
          return hotel
        }),
      )

      toast({
        title: "Succès",
        description: `L'hôtel a été ${newStatus === "active" ? "activé" : "désactivé"} avec succès.`,
      })
    } catch (error) {
      console.error(
        `Erreur lors de la ${newStatus === "active" ? "l'activation" : "la désactivation"} de l'hôtel:`,
        error,
      )
      toast({
        title: "Erreur",
        description: `Impossible de ${newStatus === "active" ? "activer" : "désactiver"} l'hôtel. Veuillez réessayer.`,
        variant: "destructive",
      })
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
      <EditHotelDialog
        open={isEditHotelOpen}
        onOpenChange={setIsEditHotelOpen}
        hotel={selectedHotel}
        onSave={handleSaveHotel}
      />
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
              <form onSubmit={handleAddHotel}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l'hôtel</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newHotel.name}
                        onChange={handleNewHotelChange}
                        placeholder="Grand Hôtel Paris"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Emplacement</Label>
                      <Input
                        id="location"
                        name="location"
                        value={newHotel.location}
                        onChange={handleNewHotelChange}
                        placeholder="Paris, France"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Nombre de chambres</Label>
                      <Input
                        id="rooms"
                        name="rooms"
                        value={newHotel.rooms}
                        onChange={handleNewHotelChange}
                        type="number"
                        placeholder="120"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix par nuit (€)</Label>
                      <Input
                        id="price"
                        name="price"
                        value={newHotel.price}
                        onChange={handleNewHotelChange}
                        type="number"
                        placeholder="250"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select name="status" value={newHotel.status} onValueChange={handleStatusChange}>
                        <SelectTrigger id="status">
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
                      <Label htmlFor="verified" className="block mb-2">
                        Vérifié
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verified" checked={newHotel.verified} onCheckedChange={handleVerifiedChange} />
                        <label
                          htmlFor="verified"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cet hôtel est vérifié
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newHotel.description}
                      onChange={handleNewHotelChange}
                      className="min-h-[100px]"
                      placeholder="Description de l'hôtel..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de l'image</Label>
                    <Input
                      id="image"
                      name="image"
                      value={newHotel.image}
                      onChange={handleNewHotelChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsAddHotelOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter l'hôtel</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                      <HotelRow
                        key={hotel.id}
                        hotel={hotel}
                        onViewDetails={() => {}}
                        onToggleStatus={handleToggleHotelStatus}
                        onDelete={(id) => {
                          setHotelToDelete(id)
                          setIsDeleteDialogOpen(true)
                        }}
                        onEdit={handleEditHotel}
                        onApprove={handleApproveHotel}
                        onReject={handleRejectHotel}
                      />
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
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
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
                    {filteredHotels
                      .filter((hotel) => hotel.status === "active" && !hotel.pendingApproval)
                      .map((hotel) => (
                        <HotelRow
                          key={hotel.id}
                          hotel={hotel}
                          onViewDetails={() => {}}
                          onToggleStatus={handleToggleHotelStatus}
                          onDelete={(id) => {
                            setHotelToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          onEdit={handleEditHotel}
                          onApprove={handleApproveHotel}
                          onReject={handleRejectHotel}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
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
                    {filteredHotels
                      .filter((hotel) => hotel.status === "inactive" && !hotel.pendingApproval)
                      .map((hotel) => (
                        <HotelRow
                          key={hotel.id}
                          hotel={hotel}
                          onViewDetails={() => {}}
                          onToggleStatus={handleToggleHotelStatus}
                          onDelete={(id) => {
                            setHotelToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          onEdit={handleEditHotel}
                          onApprove={handleApproveHotel}
                          onReject={handleRejectHotel}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
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
                    {filteredHotels
                      .filter((hotel) => hotel.pendingApproval)
                      .map((hotel) => (
                        <HotelRow
                          key={hotel.id}
                          hotel={hotel}
                          onViewDetails={() => {}}
                          onToggleStatus={handleToggleHotelStatus}
                          onDelete={(id) => {
                            setHotelToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          onEdit={handleEditHotel}
                          onApprove={handleApproveHotel}
                          onReject={handleRejectHotel}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet hôtel ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteHotel}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}