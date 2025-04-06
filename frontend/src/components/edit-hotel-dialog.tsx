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
import { Textarea } from "@/components/ui/textarea"
import type { Hotel } from "@/types"

interface EditHotelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotel: Hotel | null
  onSave: (hotel: Hotel) => void
}

export function EditHotelDialog({ open, onOpenChange, hotel, onSave }: EditHotelDialogProps) {
  const [editHotel, setEditHotel] = useState({
    HotelName: "",
    countyCode: "MA",
    countyName: "Morocco",
    cityCode: 0,
    cityName: "",
    HotelCode: 0,
    HotelRating: "FourStar",
    Address: "",
    Attractions: "",
    Description: "",
    FaxNumber: "",
    HotelFacilities: "",
    Map: "",
    PhoneNumber: "",
    PinCode: 0,
    HotelWebsiteUrl: ""
  })

  useEffect(() => {
    if (hotel) {
      setEditHotel({
        HotelName: hotel.HotelName,
        countyCode: hotel.countyCode || "MA",
        countyName: hotel.countyName || "Morocco",
        cityCode: hotel.cityCode ?? 0,
        cityName: hotel.cityName || "Ville inconnue",
        HotelCode: hotel.HotelCode ?? 0,
        HotelRating: hotel.HotelRating || "ThreeStar",
        Address: hotel.Address || "",
        Attractions: hotel.Attractions || "",
        Description: hotel.Description || "",
        FaxNumber: hotel.FaxNumber || "",
        HotelFacilities: hotel.HotelFacilities || "",
        Map: hotel.Map || "",
        PhoneNumber: hotel.PhoneNumber || "",
        PinCode: hotel.PinCode ?? 0,
        HotelWebsiteUrl: hotel.HotelWebsiteUrl || ""
      })
    }
  }, [hotel])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditHotel((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (value: string) => {
    setEditHotel((prev) => ({ ...prev, HotelRating: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hotel) {
      const updatedHotel: Hotel = {
        ...hotel,
        ...editHotel,
        // Conversion explicite pour les nombres
        cityCode: Number(editHotel.cityCode) || 0,
        HotelCode: Number(editHotel.HotelCode) || 0,
        PinCode: Number(editHotel.PinCode) || 0
      }
      
      onSave(updatedHotel)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Modifier l'hôtel</DialogTitle>
          <DialogDescription>Modifier les informations de l'hôtel.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et Code de l'hôtel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="HotelName">Nom de l'hôtel</Label>
              <Input
                id="HotelName"
                name="HotelName"
                value={editHotel.HotelName}
                onChange={handleChange}
                placeholder="Nom de l'hôtel"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="HotelCode">Code de l'hôtel</Label>
              <Input
                id="HotelCode"
                name="HotelCode"
                type="number"
                value={editHotel.HotelCode}
                onChange={handleChange}
                placeholder="Code de l'hôtel"
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityName">Ville</Label>
              <Input
                id="cityName"
                name="cityName"
                value={editHotel.cityName}
                onChange={handleChange}
                placeholder="Ville"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityCode">Code de la ville</Label>
              <Input
                id="cityCode"
                name="cityCode"
                type="number"
                value={editHotel.cityCode}
                onChange={handleChange}
                placeholder="Code de la ville"
              />
            </div>
          </div>

          {/* Pays et Classement */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countyName">Pays</Label>
              <Input
                id="countyName"
                name="countyName"
                value={editHotel.countyName}
                onChange={handleChange}
                placeholder="Pays"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="HotelRating">Classement</Label>
              <Select 
                value={editHotel.HotelRating} 
                onValueChange={handleRatingChange}
              >
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

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="Address">Adresse</Label>
            <Input
              id="Address"
              name="Address"
              value={editHotel.Address}
              onChange={handleChange}
              placeholder="Adresse complète"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="Description">Description</Label>
            <Textarea
              id="Description"
              name="Description"
              value={editHotel.Description}
              onChange={handleChange}
              placeholder="Description de l'hôtel"
              className="min-h-[100px]"
            />
          </div>

          {/* Attractions */}
          <div className="space-y-2">
            <Label htmlFor="Attractions">Attractions</Label>
            <Textarea
              id="Attractions"
              name="Attractions"
              value={editHotel.Attractions}
              onChange={handleChange}
              placeholder="Attractions à proximité"
              className="min-h-[100px]"
            />
          </div>

          {/* Coordonnées */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="PhoneNumber">Numéro de téléphone</Label>
              <Input
                id="PhoneNumber"
                name="PhoneNumber"
                value={editHotel.PhoneNumber}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="FaxNumber">Numéro de fax</Label>
              <Input
                id="FaxNumber"
                name="FaxNumber"
                value={editHotel.FaxNumber}
                onChange={handleChange}
                placeholder="Numéro de fax"
              />
            </div>
          </div>

          {/* Autres informations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="HotelWebsiteUrl">Site web</Label>
              <Input
                id="HotelWebsiteUrl"
                name="HotelWebsiteUrl"
                value={editHotel.HotelWebsiteUrl}
                onChange={handleChange}
                placeholder="URL du site web"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="PinCode">Code postal</Label>
              <Input
                id="PinCode"
                name="PinCode"
                type="number"
                value={editHotel.PinCode}
                onChange={handleChange}
                placeholder="Code postal"
              />
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-2">
            <Label htmlFor="HotelFacilities">Équipements</Label>
            <Textarea
              id="HotelFacilities"
              name="HotelFacilities"
              value={editHotel.HotelFacilities}
              onChange={handleChange}
              placeholder="Liste des équipements de l'hôtel"
              className="min-h-[100px]"
            />
          </div>

          {/* Carte */}
          <div className="space-y-2">
            <Label htmlFor="Map">Coordonnées GPS</Label>
            <Input
              id="Map"
              name="Map"
              value={editHotel.Map}
              onChange={handleChange}
              placeholder="Latitude,Longitude"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}