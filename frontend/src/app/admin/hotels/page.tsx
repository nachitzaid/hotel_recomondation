"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  MoreHorizontal,
  Star,
  MapPin,
  Check,
  Edit,
  Trash,
  Download,
  ChevronLeft,
  ChevronRight,
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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { AdminService } from "@/services/admin-service"
import { Textarea } from "@/components/ui/textarea"
import { EditHotelDialog } from "@/components/edit-hotel-dialog"

interface HotelRowProps {
  hotel: Hotel
  onViewDetails: (hotel: Hotel) => void
  onToggleStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
  onEdit: (hotel: Hotel) => void
}

interface Hotel {
  _id: string
  countyCode: string
  countyName: string
  cityCode: number
  cityName: string
  HotelCode: number
  HotelName: string
  HotelRating: string
  Address: string
  Attractions: string
  Description: string
  FaxNumber: string
  HotelFacilities: string
  Map: string
  PhoneNumber: string
  PinCode: number
  HotelWebsiteUrl: string
  status: "active" | "inactive" | "pending" // On garde "pending" pour la compatibilité avec l'API
  verified: boolean
  pendingApproval?: boolean // Gardé pour compatibilité avec l'API existante
  image?: string
  rooms?: number
  price?: number
  bookings?: number
  revenue?: string
}

interface HotelFormState {
  HotelName: string
  cityName: string
  countyName: string
  countyCode: string
  HotelCode: number | string
  HotelRating: string
  Address: string
  Description: string
  PhoneNumber: string
  HotelWebsiteUrl: string
  status: "active" | "inactive"
  verified: boolean
  image?: string
  rooms?: number | string
  price?: number | string
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function HotelRow({ hotel, onViewDetails, onToggleStatus, onDelete, onEdit }: HotelRowProps) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={hotel.image || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback>{hotel.HotelName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center">
              {hotel.HotelName}
              {hotel.verified && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50">
                  <Check className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {hotel.HotelRating.replace("Star", " Étoiles")}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {hotel.cityName}, {hotel.countyName}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">{hotel.Address || "N/A"}</td>
      <td className="hidden"></td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {hotel.Description ? hotel.Description.substring(0, 50) + (hotel.Description.length > 50 ? "..." : "") : "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">{hotel.FaxNumber || "N/A"}</td>
      <td className="hidden"></td>
      <td className="px-4 py-4 text-sm text-gray-500">{hotel.Map || "N/A"}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{hotel.PhoneNumber || "N/A"}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{hotel.PinCode || "N/A"}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{hotel.HotelWebsiteUrl || "N/A"}</td>
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

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(hotel._id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-6 gap-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>

      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Calcul pour afficher les pages autour de la page courante
          let pageToShow = currentPage
          if (currentPage < 3) {
            pageToShow = i + 1
          } else if (currentPage > totalPages - 2) {
            pageToShow = totalPages - 4 + i
          } else {
            pageToShow = currentPage - 2 + i
          }

          // S'assurer que pageToShow est dans les limites
          if (pageToShow <= 0) pageToShow = i + 1
          if (pageToShow > totalPages) return null

          return (
            <Button
              key={pageToShow}
              variant={currentPage === pageToShow ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => onPageChange(pageToShow)}
            >
              {pageToShow}
            </Button>
          )
        })}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <span className="mx-1">...</span>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalHotels, setTotalHotels] = useState(0)
  const [limit] = useState(10) // Nombre d'hôtels par page

  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  const [newHotel, setNewHotel] = useState<HotelFormState>({
    HotelName: "",
    cityName: "",
    countyName: "",
    countyCode: "MA",
    HotelCode: "",
    HotelRating: "FourStar",
    Address: "",
    Description: "",
    PhoneNumber: "",
    HotelWebsiteUrl: "",
    status: "active",
    verified: false,
    rooms: "",
    price: "",
  })

  // La variable pendingApprovalCount n'est plus nécessaire car nous avons supprimé l'onglet "En attente"

  const fetchHotels = async (page = 1) => {
    try {
      setIsLoading(true)
      console.log(`Chargement des hôtels (page ${page}, limite ${limit})...`)

      // Appel du service avec les paramètres de pagination
      const response = await AdminService.getHotels(limit, page)
      console.log("Réponse API:", response)

      // Traitement des différents formats de réponse possibles
      let hotelsData: Hotel[] = []
      let totalCount = 0
      let totalPagesCount = 0
      let currentPageNumber = page

      if (Array.isArray(response)) {
        // Si la réponse est directement un tableau d'hôtels
        console.log("Format de réponse: tableau d'hôtels")
        hotelsData = response
        totalCount = response.length
        totalPagesCount = Math.ceil(totalCount / limit)
      } else if (response.hotels && Array.isArray(response.hotels)) {
        // Si la réponse est au format paginé attendu
        console.log("Format de réponse: objet paginé")
        hotelsData = response.hotels
        totalCount = response.total || response.hotels.length
        totalPagesCount = response.pages || Math.ceil(totalCount / limit)
        currentPageNumber = response.page || page
      } else {
        console.error("Format de réponse non reconnu:", response)
        toast({
          title: "Erreur",
          description: "Format de données non reconnu.",
          variant: "destructive",
        })
        return
      }

      console.log(`${hotelsData.length} hôtels récupérés pour la page ${currentPageNumber}`)

      // Utiliser directement les données retournées et convertir "pending" en "inactive"
      const formattedHotels = hotelsData.map((hotel) => ({
        ...hotel,
        // Convertir le statut "pending" en "inactive" (car nous supprimons l'option "pending")
        status: hotel.status === "pending" ? ("inactive" as const) : hotel.status,
      }))

      setHotels(formattedHotels)
      setTotalHotels(totalCount)
      setTotalPages(totalPagesCount)
      setCurrentPage(currentPageNumber)
    } catch (error) {
      console.error("Erreur lors du chargement des hôtels:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les hôtels. Veuillez réessayer ou vérifier votre connexion.",
        variant: "destructive",
      })
      setHotels([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels(1) // Charger la première page au montage
  }, [])

  const handlePageChange = (page: number) => {
    if (page === currentPage) return

    setCurrentPage(page)
    fetchHotels(page)

    // Remonter en haut de la page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewHotel((prev) => ({ ...prev, [name]: value }))
  }

  const handleVerifiedChange = (checked: boolean) => {
    setNewHotel((prev) => ({ ...prev, verified: checked }))
  }

  const handleStatusChange = (value: string) => {
    // Ne permettre que "active" ou "inactive"
    setNewHotel((prev) => ({
      ...prev,
      status: value as "active" | "inactive",
    }))
  }

  const handleRatingChange = (value: string) => {
    setNewHotel((prev) => ({ ...prev, HotelRating: value }))
  }

  const handleAddHotel = async (e: FormEvent) => {
    e.preventDefault()

    try {
      // Fermer la boîte de dialogue immédiatement pour une meilleure expérience utilisateur
      setIsAddHotelOpen(false)

      const hotelData = {
        ...newHotel,
        HotelCode: Number(newHotel.HotelCode) || 0,
        cityCode: 100000 + Math.floor(Math.random() * 900000), // Génère un code de ville aléatoire
        PinCode: 10000 + Math.floor(Math.random() * 90000), // Génère un code postal aléatoire
        rooms: Number(newHotel.rooms) || 0,
        price: Number(newHotel.price) || 0,
        FaxNumber: "", // Peut être rempli plus tard
        Attractions: "", // Peut être rempli plus tard
        HotelFacilities: "", // Peut être rempli plus tard
        Map: "", // Peut être rempli plus tard
      }

      // Mettre à jour l'interface de manière optimiste
      const tempId = `temp-${Date.now()}`
      const tempHotel = {
        _id: tempId,
        ...hotelData,
        status: hotelData.status as "active" | "inactive",
        HotelCode: Number(hotelData.HotelCode),
        rooms: Number(hotelData.rooms) || 0,
        price: Number(hotelData.price) || 0,
      } as Hotel

      setHotels((prevHotels) => [tempHotel, ...prevHotels])

      // Envoyer les données au serveur
      const result = await AdminService.createHotel(hotelData)

      // Actualiser la liste avec les données réelles
      fetchHotels(1)
      setCurrentPage(1)

      // Réinitialiser le formulaire
      setNewHotel({
        HotelName: "",
        cityName: "",
        countyName: "",
        countyCode: "MA",
        HotelCode: "",
        HotelRating: "FourStar",
        Address: "",
        Description: "",
        PhoneNumber: "",
        HotelWebsiteUrl: "",
        status: "active",
        verified: false,
        rooms: "",
        price: "",
      })

      toast({
        title: "Succès",
        description: "L'hôtel a été ajouté avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'hôtel:", error)

      // Supprimer l'hôtel temporaire en cas d'erreur
      setHotels((prevHotels) => prevHotels.filter((h) => !h._id.startsWith("temp-")))

      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.HotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.countyName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || hotel.status === selectedStatus

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && hotel.status === "active") ||
      (activeTab === "inactive" && hotel.status === "inactive")

    return matchesSearch && matchesStatus && matchesTab
  })

  const handleDeleteHotel = async () => {
    if (!hotelToDelete) return

    try {
      // Mettre à jour l'interface de manière optimiste
      setHotels((prevHotels) => prevHotels.filter((hotel) => hotel._id !== hotelToDelete))

      // Fermer la boîte de dialogue immédiatement
      setIsDeleteDialogOpen(false)
      setHotelToDelete(null)

      // Envoyer la demande de suppression
      await AdminService.deleteHotel(hotelToDelete)

      toast({
        title: "Succès",
        description: "L'hôtel a été supprimé avec succès.",
      })

      // Vérifier si la page actuelle est maintenant vide et si oui, charger la page précédente
      if (filteredHotels.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
        fetchHotels(currentPage - 1)
      } else {
        // Sinon recharger la page actuelle
        fetchHotels(currentPage)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'hôtel:", error)

      // Recharger les données en cas d'erreur
      fetchHotels(currentPage)

      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleSaveHotel = async (hotel: Hotel) => {
    try {
      // Mettre à jour l'interface de manière optimiste
      setHotels((prevHotels) => prevHotels.map((h) => (h._id === hotel._id ? hotel : h)))

      // Fermer la boîte de dialogue immédiatement
      setIsEditHotelOpen(false)

      // Envoyer la mise à jour au serveur
      await AdminService.updateHotel(hotel._id, hotel)

      toast({
        title: "Succès",
        description: "L'hôtel a été mis à jour avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'hôtel:", error)

      // Recharger les données en cas d'erreur
      fetchHotels(currentPage)

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

  const handleToggleHotelStatus = async (id: string, currentStatus: string) => {
    // Toujours basculer entre active et inactive seulement
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      // Mettre à jour l'interface de manière optimiste
      setHotels((prevHotels) =>
        prevHotels.map((hotel) => {
          if (hotel._id === id) {
            return { ...hotel, status: newStatus as "active" | "inactive" }
          }
          return hotel
        }),
      )

      // Envoyer la mise à jour au serveur
      await AdminService.updateHotel(id, { status: newStatus as "active" | "inactive" })

      toast({
        title: "Succès",
        description: `L'hôtel a été ${newStatus === "active" ? "activé" : "désactivé"} avec succès.`,
      })
    } catch (error) {
      console.error(`Erreur lors de ${newStatus === "active" ? "l'activation" : "la désactivation"} de l'hôtel:`, error)

      // Recharger les données en cas d'erreur
      fetchHotels(currentPage)

      toast({
        title: "Erreur",
        description: `Impossible de ${newStatus === "active" ? "activer" : "désactiver"} l'hôtel. Veuillez réessayer.`,
        variant: "destructive",
      })
    }
  }

  const handleExportData = () => {
    try {
      // Créer un CSV des hôtels
      let csvContent =
        "HotelName,cityName,countyName,HotelCode,Address,Attractions,Description,FaxNumber,HotelFacilities,Map,PhoneNumber,PinCode,HotelWebsiteUrl,status,verified\n"

      filteredHotels.forEach((hotel) => {
        csvContent += `"${hotel.HotelName}","${hotel.cityName}","${hotel.countyName}",${hotel.HotelCode},"${hotel.Address}","${hotel.Attractions || ""}","${hotel.Description || ""}","${hotel.FaxNumber || ""}","${hotel.HotelFacilities || ""}","${hotel.Map || ""}","${hotel.PhoneNumber || ""}",${hotel.PinCode || ""},"${hotel.HotelWebsiteUrl || ""}","${hotel.status}",${hotel.verified}\n`
      })

      // Créer un blob et le télécharger
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `hotels_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Succès",
        description: "Les données ont été exportées avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'exportation des données:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  if (isLoading && hotels.length === 0) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const safeSelectedHotel = selectedHotel
    ? {
        ...selectedHotel,
        pendingApproval: selectedHotel.pendingApproval ?? false,
      }
    : null

  return (
    <div className="space-y-6">
      <EditHotelDialog
        open={isEditHotelOpen}
        onOpenChange={setIsEditHotelOpen}
        hotel={safeSelectedHotel}
        onSave={handleSaveHotel}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Hôtels</h1>
          <p className="text-gray-500">
            Affichage de {filteredHotels.length} hôtels sur {totalHotels} • Page {currentPage} sur {totalPages}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
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
                      <Label htmlFor="HotelName">Nom de l'hôtel</Label>
                      <Input
                        id="HotelName"
                        name="HotelName"
                        value={newHotel.HotelName}
                        onChange={handleNewHotelChange}
                        placeholder="Chems Le Tazarkount"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="HotelCode">Code de l'hôtel</Label>
                      <Input
                        id="HotelCode"
                        name="HotelCode"
                        value={newHotel.HotelCode}
                        onChange={handleNewHotelChange}
                        placeholder="1224821"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cityName">Ville</Label>
                      <Input
                        id="cityName"
                        name="cityName"
                        value={newHotel.cityName}
                        onChange={handleNewHotelChange}
                        placeholder="Afourer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countyName">Pays</Label>
                      <Input
                        id="countyName"
                        name="countyName"
                        value={newHotel.countyName}
                        onChange={handleNewHotelChange}
                        placeholder="Maroc"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="HotelRating">Classement</Label>
                      <Select value={newHotel.HotelRating} onValueChange={handleRatingChange}>
                        <SelectTrigger id="HotelRating">
                          <SelectValue placeholder="Sélectionner un classement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OneStar">1 Étoile</SelectItem>
                          <SelectItem value="TwoStar">2 Étoiles</SelectItem>
                          <SelectItem value="ThreeStar">3 Étoiles</SelectItem>
                          <SelectItem value="FourStar">4 Étoiles</SelectItem>
                          <SelectItem value="FiveStar">5 Étoiles</SelectItem>
                        </SelectContent>
                      </Select>
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
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Address">Adresse</Label>
                    <Input
                      id="Address"
                      name="Address"
                      value={newHotel.Address}
                      onChange={handleNewHotelChange}
                      placeholder="Bp 54 Afourer Centre BP 5422050 AfourerAfourer Centre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PhoneNumber">Numéro de téléphone</Label>
                    <Input
                      id="PhoneNumber"
                      name="PhoneNumber"
                      value={newHotel.PhoneNumber}
                      onChange={handleNewHotelChange}
                      placeholder="212-212-523440101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="HotelWebsiteUrl">Site web</Label>
                    <Input
                      id="HotelWebsiteUrl"
                      name="HotelWebsiteUrl"
                      value={newHotel.HotelWebsiteUrl}
                      onChange={handleNewHotelChange}
                      placeholder="http://www.tazarkount.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Description">Description</Label>
                    <Textarea
                      id="Description"
                      name="Description"
                      value={newHotel.Description}
                      onChange={handleNewHotelChange}
                      className="min-h-[100px]"
                      placeholder="Description de l'hôtel..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" checked={newHotel.verified} onCheckedChange={handleVerifiedChange} />
                    <Label htmlFor="verified">Hôtel vérifié</Label>
                  </div>
                  {/* Option "Nécessite approbation" supprimée */}
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
            onKeyDown={(e) => e.key === "Enter" && console.log("Recherche:", searchTerm)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading && (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      <th className="px-4 py-3">Hôtel</th>
                      <th className="px-4 py-3">Emplacement</th>
                      <th className="px-4 py-3">Adresse</th>
                      <th className="hidden">Attractions</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Fax</th>
                      <th className="hidden">Équipements</th>
                      <th className="px-4 py-3">Map</th>
                      <th className="px-4 py-3">Téléphone</th>
                      <th className="px-4 py-3">Code Postal</th>
                      <th className="px-4 py-3">Site Web</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.length > 0 ? (
                      filteredHotels.map((hotel) => (
                        <HotelRow
                          key={hotel._id}
                          hotel={hotel}
                          onViewDetails={() => {}}
                          onToggleStatus={handleToggleHotelStatus}
                          onDelete={(id) => {
                            setHotelToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          onEdit={handleEditHotel}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                          {isLoading
                            ? "Chargement des hôtels..."
                            : "Aucun hôtel ne correspond à vos critères de recherche."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}
            </CardContent>
          </Card>
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
                      <th className="px-4 py-3">Adresse</th>
                      <th className="hidden">Attractions</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Fax</th>
                      <th className="hidden">Équipements</th>
                      <th className="px-4 py-3">Map</th>
                      <th className="px-4 py-3">Téléphone</th>
                      <th className="px-4 py-3">Code Postal</th>
                      <th className="px-4 py-3">Site Web</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.length > 0 ? (
                      filteredHotels.map((hotel) => (
                        <HotelRow
                          key={hotel._id}
                          hotel={hotel}
                          onViewDetails={() => {}}
                          onToggleStatus={handleToggleHotelStatus}
                          onDelete={(id) => {
                            setHotelToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          onEdit={handleEditHotel}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                          Aucun hôtel actif ne correspond à vos critères de recherche.
                        </td>
                      </tr>
                    )}
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
                      <th className="px-4 py-3">Adresse</th>
                      <th className="hidden">Attractions</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Fax</th>
                      <th className="hidden">Équipements</th>
                      <th className="px-4 py-3">Map</th>
                      <th className="px-4 py-3">Téléphone</th>
                      <th className="px-4 py-3">Code Postal</th>
                      <th className="px-4 py-3">Site Web</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.length > 0 ? (
                      filteredHotels.map((hotel) => (
                        <HotelRow
                          key={hotel._id}
                          hotel={hotel}
                          onViewDetails={() => {}}
                          onToggleStatus={handleToggleHotelStatus}
                          onDelete={(id) => {
                            setHotelToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                          onEdit={handleEditHotel}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                          Aucun hôtel inactif ne correspond à vos critères de recherche.
                        </td>
                      </tr>
                    )}
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

