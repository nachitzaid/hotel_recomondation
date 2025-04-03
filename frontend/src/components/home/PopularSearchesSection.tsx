"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PopularSearch {
  id: number
  term: string
  count: number
  flag: string
}

interface PopularSearchesSectionProps {
  popularSearches: PopularSearch[]
}

export default function PopularSearchesSection({ popularSearches }: PopularSearchesSectionProps) {
  const router = useRouter()

  return (
    <section className="mb-16">
      <div className="flex items-center mb-6">
        <Search className="text-purple-600 mr-2 h-6 w-6" />
        <h2 className="text-2xl font-bold">Villes hôtes les plus recherchées</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {popularSearches.map((search) => (
          <Button
            key={search.id}
            variant="outline"
            className="rounded-full hover:bg-purple-50 hover:border-purple-300"
            onClick={() => router.push(`/hotels?location=${search.term}`)}
          >
            <span className="mr-2">{search.flag}</span>
            <span className="font-medium">{search.term}</span>
            <span className="ml-2 text-xs text-gray-500">({search.count.toLocaleString()})</span>
          </Button>
        ))}
      </div>
    </section>
  )
}

