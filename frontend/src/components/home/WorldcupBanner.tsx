"use client"

import { Button } from "@/components/ui/button"
import CountdownTimer from "@/components/ui/countdown-timer"
import { Ticket } from "lucide-react"

interface HostCountry {
  name: string
  flag: string
  stadiums: number
  matches: number
}

interface WorldCupBannerProps {
  hostCountries: HostCountry[]
}

export default function WorldCupBanner({ hostCountries }: WorldCupBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-red-700 via-amber-600 to-green-700 py-12 text-white text-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/placeholder.svg?height=100&width=100&text=⚽')",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Coupe du Monde 2030</h1>
        <p className="text-xl mb-8">Réservez votre hébergement pour le plus grand événement sportif mondial</p>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {hostCountries.map((country) => (
            <div
              key={country.name}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 flex flex-col items-center"
            >
              <span className="text-4xl mb-2">{country.flag}</span>
              <p className="font-bold text-lg">{country.name}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span>{country.stadiums} stades</span>
                <span>{country.matches} matchs</span>
              </div>
            </div>
          ))}
        </div>

        <CountdownTimer targetDate="2030-06-12T18:00:00" />

        <div className="mt-8">
          <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
            <Ticket className="mr-2 h-5 w-5" />
            Explorer les forfaits match + hôtel
          </Button>
        </div>
      </div>
    </div>
  )
}

