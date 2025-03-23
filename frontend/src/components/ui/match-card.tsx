import type { Match } from "@/app/types" 
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  // Formater la date
  const formattedDate = match.date ? format(parseISO(match.date), "d MMMM yyyy", { locale: fr }) : ""

  // Déterminer le statut du match
  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">En direct</span>
      case "completed":
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Terminé</span>
      default:
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">À venir</span>
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
            {match.time && (
              <>
                <Clock className="h-4 w-4 ml-2 mr-1" />
                {match.time}
              </>
            )}
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center text-center w-2/5">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
              {match.team1.substring(0, 3).toUpperCase()}
            </div>
            <span className="font-medium">{match.team1}</span>
          </div>

          <div className="text-center">
            {match.status === "completed" ? (
              <div className="text-xl font-bold">
                {match.team1_score} - {match.team2_score}
              </div>
            ) : (
              <div className="text-xl font-bold">VS</div>
            )}
            <div className="text-xs text-gray-500">{match.round}</div>
          </div>

          <div className="flex flex-col items-center text-center w-2/5">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
              {match.team2.substring(0, 3).toUpperCase()}
            </div>
            <span className="font-medium">{match.team2}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {match.venue}, {match.city}
          </span>
        </div>

        <Button asChild size="sm" className="w-full bg-[#8A1538] hover:bg-[#6d102c]">
          <Link href={`/matches/${match._id}`}>Voir les hôtels à proximité</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

