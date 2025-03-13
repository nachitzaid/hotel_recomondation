// data.tsx
import { useRouter } from 'next/router';
import HotelDashboardHeader from './HotelDashboardHeader';

export default function DataPage() {
  const router = useRouter();
  const { destination, dates, guests } = router.query;
  
  // Ici vous feriez une requête API pour obtenir vos données d'hôtels
  // basées sur les paramètres de recherche
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HotelDashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Résultats pour: {destination}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ici vous mappez vos données d'hôtels */}
          {/* Exemple: */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <h3 className="font-bold">Nom de l'hôtel</h3>
              <div className="flex items-center text-sm mt-1">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">8.9</span>
                <span>Excellent</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Centre-ville, 2km de la plage</p>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">Prix par nuit</p>
                  <p className="text-xl font-bold">€120</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Voir l'offre</button>
              </div>
            </div>
          </div>
          {/* Répétez pour plus d'hôtels */}
        </div>
      </main>
    </div>
  );
}