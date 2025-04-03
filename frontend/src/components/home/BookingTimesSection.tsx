"use client"

import Image from "next/image"
import { Clock, Calendar, TrendingUp, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BookingTime {
  id: number
  destination: string
  bestMonth: string
  savingsPercent: number
  image: string
}

interface BookingTimesSectionProps {
  bookingTimes: BookingTime[]
}

export default function BookingTimesSection({ bookingTimes }: BookingTimesSectionProps) {
  return (
    <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
      <div className="flex items-center mb-6">
        <Clock className="text-blue-600 mr-2 h-6 w-6" />
        <h2 className="text-2xl font-bold">Quand réserver pour la Coupe du Monde 2030</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bookingTimes.map((item) => (
          <Card key={item.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all">
            <div className="h-32 w-full bg-gray-200 relative">
              <Image src={item.image || "/placeholder.svg"} alt={item.destination} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="font-bold text-lg text-white">{item.destination}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center mt-2 text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">Meilleur moment: </span>
                <span className="ml-2">{item.bestMonth}</span>
              </div>
              <div className="mt-3 bg-green-100 text-green-800 px-3 py-2 rounded-md flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Économisez jusqu'à {item.savingsPercent}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-blue-100 p-4 rounded-lg flex items-start">
        <ShieldCheck className="h-5 w-5 text-blue-700 mt-1 mr-3 flex-shrink-0" />
        <p className="text-blue-800 text-sm">
          <span className="font-bold">Conseil d'expert:</span> Pour les matchs à élimination directe, les prix des
          hôtels augmentent considérablement après que les équipes qualifiées sont connues. Réservez à l'avance et
          choisissez une politique d'annulation flexible pour maximiser vos économies.
        </p>
      </div>
    </section>
  )
}

