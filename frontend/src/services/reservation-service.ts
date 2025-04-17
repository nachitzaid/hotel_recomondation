// services/reservation-service.ts

import { differenceInDays } from "date-fns";

const API_URL = "http://localhost:5000"; // ou votre URL backend

export const ReservationService = {
  async checkAvailability(
    hotelId: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ): Promise<{ available: boolean; rooms: number }> {
    const response = await fetch(`${API_URL}/reservations/check-availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hotelId, checkIn, checkOut, guests }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la vérification de disponibilité");
    }

    return response.json();
  },

  calculatePrice(
    checkIn: Date,
    checkOut: Date,
    pricePerNight: number,
    guests: number,
    rooms: number
  ): number {
    const nights = differenceInDays(checkOut, checkIn);
    return pricePerNight * nights * rooms;
  },

  async createReservation(reservationData: {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    totalPrice: number;
    specialRequests?: string;
  }) {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ajoutez le token JWT si nécessaire
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de la réservation");
    }

    return response.json();
  },
};