"use client"

import { Globe, Trophy, Flag, Plane } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function WorldCupExperienceSection() {
  return (
    <section className="mt-16 mb-16">
      <div className="flex items-center mb-6">
        <Globe className="text-blue-600 mr-2 h-6 w-6" />
        <h2 className="text-2xl font-bold">L'expérience Coupe du Monde 2030</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Forfaits Match + Hôtel</h3>
            <p className="text-gray-600">
              Réservez votre hébergement et vos billets de match ensemble pour bénéficier de réductions exclusives et
              d'un accès prioritaire.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fan Zones Officielles</h3>
            <p className="text-gray-600">
              Séjournez près des fan zones officielles pour vivre l'ambiance de la Coupe du Monde même sans billet pour
              les matchs.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="rounded-full bg-amber-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Plane className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Navettes Inter-Pays</h3>
            <p className="text-gray-600">
              Profitez de nos services de navette entre l'Espagne, le Portugal et le Maroc pour suivre votre équipe tout
              au long du tournoi.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

