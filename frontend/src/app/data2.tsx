
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaCalendarAlt, FaUser, FaStar, FaMapMarkerAlt } from "react-icons/fa";

// Types pour nos données
interface Hotel {
  name: string;
  city: string;
  country: string;
  rating: number;
  price?: number;
  image?: string;
  amenities?: string[];
  distance_to_center?: number;
  address?: string;
}

export default function HotelsDashboard() {
  // États
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState(2);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");

  // Récupération des données
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/hotels")
      .then((response) => {
        // Ajout des prix fictifs pour la démo (puisque votre dataset n'en a peut-être pas)
        const hotelsWithPrices = response.data.map((hotel: Hotel) => ({
          ...hotel,
          price: Math.floor(Math.random() * 200) + 50,
          image: `/hotel-placeholder.jpg`, // Vous devrez ajouter des images placeholder
          amenities: ["WiFi", "Parking", "Restaurant", "Piscine"].slice(0, Math.floor(Math.random() * 4) + 1),
          distance_to_center: parseFloat((Math.random() * 5).toFixed(1)),
          address: `${Math.floor(Math.random() * 200) + 1} ${hotel.city} Street`
        }));
        setHotels(hotelsWithPrices);
        setFilteredHotels(hotelsWithPrices);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des hôtels :", error);
        setLoading(false);
      });
  }, []);

  // Filtre et tri des hôtels
  useEffect(() => {
    let results = [...hotels];
    
    // Filtrage par recherche
    if (searchQuery) {
      results = results.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrage par prix
  
    
    // Filtrage par note
    if (ratingFilter > 0) {
      results = results.filter((hotel) => hotel.rating >= ratingFilter);
    }
    
    // Tri
    if (sortBy === "price-asc") {
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredHotels(results);
  }, [hotels, searchQuery, priceRange, ratingFilter, sortBy]);

  // Gestion des dates
  const handleDateChange = (
    type: "checkIn" | "checkOut",
    value: string
  ) => {
    setDateRange({ ...dateRange, [type]: value });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">HotelFinder</h1>
          <p>Trouvez et comparez les meilleurs hôtels</p>
        </div>
      </header>

      {/* Barre de recherche principale */}
      <div className="bg-white shadow-lg py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Destination, hôtel, ville..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateRange.checkIn}
                  onChange={(e) => handleDateChange("checkIn", e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateRange.checkOut}
                  onChange={(e) => handleDateChange("checkOut", e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "personne" : "personnes"}
                    </option>
                  ))}
                </select>
              </div>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Barre latérale de filtres */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Filtres</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Prix par nuit</h3>
                <div className="flex items-center justify-between mb-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Note minimale</h3>
                <div className="flex items-center space-x-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        ratingFilter === rating
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setRatingFilter(rating === ratingFilter ? 0 : rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Trier par</h3>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommandés</option>
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="rating">Note</option>
                </select>
              </div>
            </div>
          </div>

          {/* Résultats des hôtels */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold">
                {filteredHotels.length} hôtels trouvés
                {searchQuery && ` pour "${searchQuery}"`}
              </h2>
            </div>

            <div className="space-y-6">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Image de l'hôtel (placeholder) */}
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">Image non disponible</span>
                        </div>
                      </div>
                      
                      {/* Informations de l'hôtel */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <FaMapMarkerAlt className="mr-1" />
                              <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                            </div>
                            <div className="flex items-center mb-4">
                              <div className="flex mr-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < Math.floor(hotel.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                             
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {hotel.amenities?.map((amenity, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 text-right">
                            <div className="text-gray-600 text-sm mb-1">Prix par nuit</div>
                            <div className="text-2xl font-bold text-blue-600">${hotel.price}</div>
                            <div className="text-gray-500 text-sm mb-4">Taxes incluses</div>
                            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
                              Voir l'offre
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun hôtel trouvé</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}