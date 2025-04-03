export default function Footer() {
    return (
      <footer className="bg-gradient-to-r from-red-900 to-green-900 text-white py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">WorldCup Hotels</h3>
              <p className="text-gray-300">
                Réservez votre séjour pour la Coupe du Monde 2030 en Espagne, Portugal et Maroc.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Hôtels
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Stades
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Calendrier des matchs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Villes Hôtes</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Madrid
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Lisbonne
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Casablanca
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Barcelone
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@worldcuphotels2030.com</li>
                <li>Téléphone: +33 1 23 45 67 89</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} WorldCup Hotels 2030. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  