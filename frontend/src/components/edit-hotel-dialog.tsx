"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { Hotel, HotelFormState } from "@/types"

interface EditHotelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotel: Hotel | null
  onSave: (hotel: Hotel) => void
}

export function EditHotelDialog({ open, onOpenChange, hotel, onSave }: EditHotelDialogProps) {
  const [editHotel, setEditHotel] = useState<HotelFormState>({
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
    if (hotel) {
      setEditHotel({
        name: hotel.name,
        location: hotel.location,
        rooms: hotel.rooms.toString(),
        price: hotel.price.toString(),
        status: hotel.status,
        verified: hotel.verified,
        description: hotel.description,
        image: hotel.image,
        rating: hotel.rating,
        pendingApproval: hotel.pendingApproval,
      })
    }
  }, [hotel])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditHotel((prev) => ({ ...prev, [name]: value }))
  }

  const handleVerifiedChange = (checked: boolean) => {
    setEditHotel((prev) => ({ ...prev, verified: checked }))
  }

  const handleStatusChange = (value: string) => {
    const validStatus =
      value === "active" || value === "inactive" || value === "pending"
        ? (value as "active" | "inactive" | "pending")
        : ("active" as const)

    setEditHotel((prev) => ({ ...prev, status: validStatus }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hotel) {
      onSave({
        ...hotel,
        name: editHotel.name,
        location: editHotel.location,
        rooms: Number(editHotel.rooms),
        price: Number(editHotel.price),
        status: editHotel.status,
        verified: editHotel.verified,
        description: editHotel.description,
        image: editHotel.image,
        rating: editHotel.rating,
        pendingApproval: editHotel.pendingApproval,
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'hôtel</DialogTitle>
          <DialogDescription>Modifier les informations de l'hôtel.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'hôtel</Label>
                <Input
                  id="name"
                  name="name"
                  value={editHotel.name}
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
                  value={editHotel.location}
                  onChange={handleChange}
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
                  value={editHotel.rooms}
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
                  value={editHotel.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="250"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select name="status" value={editHotel.status} onValueChange={handleStatusChange}>
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
                <Label htmlFor="rating">Note (sur 5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  value={editHotel.rating}
                  onChange={handleChange}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" checked={editHotel.verified} onCheckedChange={handleVerifiedChange} />
                <label
                  htmlFor="verified"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Cet hôtel est vérifié
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editHotel.description}
                onChange={handleChange}
                className="min-h-[150px]"
                placeholder="Description de l'hôtel..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                name="image"
                value={editHotel.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Modifier l'hôtel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

