"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  MoreHorizontal,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  ShieldAlert,
  Download,
  Edit,
  Trash,
  Ban,
  Hotel,
  Plus,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
interface AdminUser {
  id: string
  firstName: string
  email: string
  phone: string
  location?: string
  type: "customer" | "hotel"
  status: "active" | "inactive" | "blocked"
  registeredAt: string
  bookings?: number
  totalSpent?: string
  properties?: number
  totalRevenue?: string
  image?: string
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState<Omit<AdminUser, "id">>({
    firstName: "",
    email: "",
    phone: "",
    type: "customer", // Changed from role to type
    status: "active",
    registeredAt: new Date().toLocaleDateString(), // Added required field
    location: "",
    bookings: 0,
    totalSpent: "0€",
    image: "/placeholder.svg?height=40&width=40",
  })

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const data = await AdminService.getUsers()
        setUsers(data)
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = selectedType === "all" || user.type === selectedType

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "customers" && user.type === "customer") ||
      (activeTab === "hotels" && user.type === "hotel") ||
      (activeTab === "blocked" && user.status === "blocked")

    return matchesSearch && matchesType && matchesTab
  })

  const blockedUsersCount = users.filter((user) => user.status === "blocked").length

  const openUserDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await AdminService.deleteUser(userToDelete)
      setUsers(users.filter((user) => user.id !== userToDelete))
      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleToggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked"

    try {
      await AdminService.updateUser(id, { status: newStatus })
      setUsers(users.map((user) => (user.id === id ? { ...user, status: newStatus } : user)))
      toast({
        title: "Succès",
        description: `L'utilisateur a été ${newStatus === "active" ? "débloqué" : "bloqué"} avec succès.`,
      })
    } catch (error) {
      console.error(`Erreur lors du ${newStatus === "active" ? "déblocage" : "blocage"} de l'utilisateur:`, error)
      toast({
        title: "Erreur",
        description: `Impossible de ${newStatus === "active" ? "débloquer" : "bloquer"} l'utilisateur. Veuillez réessayer.`,
        variant: "destructive",
      })
    }
  }

  const handleAddUser = async () => {
    try {
      const result = await AdminService.createUser(newUser)
      setUsers([...users, result])
      setIsAddUserOpen(false)
      toast({
        title: "Succès",
        description: "L'utilisateur a été ajouté avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'utilisateur. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
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
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Gérez les clients et les hôtels inscrits sur votre plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour ajouter un nouvel utilisateur à la plateforme.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleNewUserChange}
                      placeholder="Prénom"
                    />
                  </div>
              
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleNewUserChange}
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'utilisateur</Label>
                  <Select
                    name="type"
                    value={newUser.type}
                    onValueChange={(value) => setNewUser({ ...newUser, type: value as "customer" | "hotel" })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Client</SelectItem>
                      <SelectItem value="hotel">Hôtel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddUser}>Ajouter l'utilisateur</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="customer">Clients</SelectItem>
              <SelectItem value="hotel">Hôtels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous les utilisateurs</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="hotels">Hôtels</TabsTrigger>
          <TabsTrigger value="blocked" className="relative">
            Bloqués
            {blockedUsersCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {blockedUsersCount}
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
                      <th className="px-4 py-3">Utilisateur</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Inscription</th>
                      <th className="px-4 py-3">Activité</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          onViewDetails={openUserDetails}
                          onToggleStatus={handleToggleUserStatus}
                          onDelete={(id) => {
                            setUserToDelete(id)
                            setIsDeleteDialogOpen(true)
                          }}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Aucun utilisateur ne correspond à vos critères de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autres onglets */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Contenu filtré pour les clients */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Contenu filtré pour les hôtels */}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardContent className="p-0">{/* Contenu filtré pour les utilisateurs bloqués */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserDetailsDialog
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onToggleStatus={handleToggleUserStatus}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}

// Composant pour une ligne d'utilisateur
function UserRow({
  user,
  onViewDetails,
  onToggleStatus,
  onDelete,
}: {
  user: AdminUser
  onViewDetails: (user: AdminUser) => void
  onToggleStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.firstName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.firstName}</div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {user.location || "Non spécifié"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Mail className="h-4 w-4 mr-1" />
          {user.email}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Phone className="h-4 w-4 mr-1" />
          {user.phone}
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge
          variant="outline"
          className={
            user.type === "customer"
              ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
              : "bg-purple-50 text-purple-700 hover:bg-purple-50"
          }
        >
          {user.type === "customer" ? (
            <>
              <User className="h-3 w-3 mr-1" />
              Client
            </>
          ) : (
            <>
              <Hotel className="h-3 w-3 mr-1" />
              Hôtel
            </>
          )}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <Badge
          className={
            user.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : user.status === "inactive"
                ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          {user.status === "active" ? (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Actif
            </>
          ) : user.status === "inactive" ? (
            "Inactif"
          ) : (
            <>
              <ShieldAlert className="h-3 w-3 mr-1" />
              Bloqué
            </>
          )}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {user.registeredAt}
        </div>
      </td>
      <td className="px-4 py-4">
        {user.type === "customer" ? (
          <div>
            <div className="text-sm">{user.bookings || 0} réservations</div>
            <div className="text-sm font-medium">{user.totalSpent || "0€"}</div>
          </div>
        ) : (
          <div>
            <div className="text-sm">{user.properties || 0} propriétés</div>
            <div className="text-sm font-medium">{user.totalRevenue || "0€"}</div>
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(user)}>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {user.status !== "blocked" ? (
              <DropdownMenuItem className="text-amber-600" onClick={() => onToggleStatus(user.id, user.status)}>
                <Ban className="mr-2 h-4 w-4" />
                Bloquer
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600" onClick={() => onToggleStatus(user.id, user.status)}>
                <Shield className="mr-2 h-4 w-4" />
                Débloquer
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(user.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

// Composant pour les détails de l'utilisateur
function UserDetailsDialog({
  user,
  open,
  onOpenChange,
  onToggleStatus,
}: {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleStatus: (id: string, status: string) => void
}) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
          <DialogDescription>Informations complètes sur {user.firstName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.firstName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.firstName}</h2>
              <Badge
                variant="outline"
                className={`mt-1 ${
                  user.type === "customer"
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-50"
                }`}
              >
                {user.type === "customer" ? "Client" : "Hôtel"}
              </Badge>
              <Badge
                className={`ml-2 ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : user.status === "inactive"
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                }`}
              >
                {user.status === "active" ? "Actif" : user.status === "inactive" ? "Inactif" : "Bloqué"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Téléphone</h3>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Localisation</h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{user.location || "Non spécifié"}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date d'inscription</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{user.registeredAt}</span>
              </div>
            </div>
          </div>

          {user.type === "customer" ? (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Réservations</h3>
                <p className="text-lg font-bold">{user.bookings || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total dépensé</h3>
                <p className="text-lg font-bold">{user.totalSpent || "0€"}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Propriétés</h3>
                <p className="text-lg font-bold">{user.properties || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Revenus totaux</h3>
                <p className="text-lg font-bold">{user.totalRevenue || "0€"}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          {user.status !== "blocked" ? (
            <Button
              variant="destructive"
              onClick={() => {
                onToggleStatus(user.id, user.status)
                onOpenChange(false)
              }}
            >
              <Ban className="mr-2 h-4 w-4" />
              Bloquer
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onToggleStatus(user.id, user.status)
                onOpenChange(false)
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Débloquer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Composant pour la confirmation de suppression
function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
          </DialogDescription>
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

