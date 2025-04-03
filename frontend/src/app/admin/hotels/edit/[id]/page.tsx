"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { AdminService } from "@/services/admin-service"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function EditHotelPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hotel, setHotel] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
    rooms: 0,
    price: 0,
    status: "active",
    verified: false,
    image: "",
    rating: 0,
    amenities: [] as string[],
    country: "",
  })
  const { toast } = useToast()
  const router = useRouter()
  const { isAdmin } = useAuth()

  // Rediriger si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login")
    }
  }, [isAdmin, router])

  // Charger les détails de l'hôtel
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setIsLoading(true)
        const data = await AdminService.getHotelById(params.id)
        setHotel({
          id: data.id.toString(),
          name: data.name || "",
          location: data.location || "",
          description: data.description || "",
          rooms: data.rooms || 0,
          price: data.price || 0,
          status: data.status || "active",
          verified: data.verified || false,
          image: data.image || "",
          rating: data.rating || 0,
          amenities: data.amenities || [],
          country: data.country || "",
        })
      } catch (error) {
        console.error("Erreur lors du chargement de l'hôtel:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'hôtel.",
          variant: "destructive",
        })
        // Rediriger vers la liste des hôtels en cas d'erreur
        router.push("/admin/hotels")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotel()
  }, [params.id, router, toast])

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setHotel((prev) => ({ ...prev, [name]: value }))
  }

  // Gérer le changement de la case à cocher "vérifié"
  const handleVerifiedChange = (checked: boolean) => {
    setHotel((prev) => ({ ...prev, verified: checked }))
  }

  // Gérer le changement du statut
  const handleStatusChange = (value: string) => {
    setHotel((prev) => ({ ...prev, status: value }))
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Convertir les valeurs numériques
      const hotelData = {
        ...hotel,
        rooms: Number(hotel.rooms),
        price: Number(hotel.price),
      }

      await AdminService.updateHotel(params.id, hotelData)

      toast({
        title: "Succès",
        description: "L'hôtel a été mis à jour avec succès.",
      })

      // Rediriger vers la liste des hôtels
      router.push("/admin/hotels")
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'hôtel:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'hôtel. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-4" asChild>
            <Link href="/admin/hotels">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modifier l'hôtel</h1>
            <p className="text-gray-500">Modifiez les informations de l'hôtel {hotel.name}</p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations de l'hôtel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'hôtel</Label>
                <Input
                  id="name"
                  name="name"
                  value={hotel.name}
                  onChange={handleChange}
                  placeholder="Grand Hôtel Paris"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Emplacement</Label>
                <Input
                  id="location"
                  name="location"
                  value={hotel.location}
                  onChange={handleChange}
                  placeholder="Paris, France"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rooms">Nombre de chambres</Label>
                <Input
                  id="rooms"
                  name="rooms"
                  value={hotel.rooms}
                  onChange={handleChange}
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
                  value={hotel.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="250"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select name="status" value={hotel.status} onValueChange={handleStatusChange}>
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
                <Label htmlFor="country">Pays</Label>
                <Select
                  name="country"
                  value={hotel.country}
                  onValueChange={(value) => setHotel({ ...hotel, country: value })}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Espagne">Espagne</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Maroc">Maroc</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={hotel.description}
                onChange={handleChange}
                className="min-h-[100px]"
                placeholder="Description de l'hôtel..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                name="image"
                value={hotel.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {hotel.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Aperçu de l'image :</p>
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="h-40 w-auto object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" checked={hotel.verified} onCheckedChange={handleVerifiedChange} />
                <Label htmlFor="verified" className="font-medium">
                  Cet hôtel est vérifié
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/hotels")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

