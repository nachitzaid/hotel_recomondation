"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/hotels") // L'URL de ton API Flask
      .then((response) => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des hôtels :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des hôtels...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Hôtels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">{hotel.name}</h2>
            <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
            <p className="text-yellow-500">⭐ {hotel.rating}</p>
          </div>
        ))}
      </div>,
    </div>
  );
}
