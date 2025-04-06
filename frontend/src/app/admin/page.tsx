"use client"

import { useState } from "react"
import {
  Building,
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Composant pour les graphiques
const RevenueChart = () => (
  <div className="w-full h-80 mt-4">
    <div className="flex justify-between mb-4">
      <div className="space-y-1">
        <div className="text-sm text-gray-500">Mois précédent</div>
        <div className="text-2xl font-bold">€42,138</div>
        <div className="flex items-center text-sm text-red-500">
          <ArrowDownRight className="mr-1 h-4 w-4" />
          <span>-12.4%</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-gray-500">Mois en cours</div>
        <div className="text-2xl font-bold">€38,156</div>
        <div className="flex items-center text-sm text-green-500">
          <ArrowUpRight className="mr-1 h-4 w-4" />
          <span>+24.5%</span>
        </div>
      </div>
    </div>

    {/* Graphique simplifié */}
    <div className="w-full h-48 bg-gradient-to-b from-blue-50 to-white rounded-lg border p-4">
      <div className="flex items-end justify-between h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => {
          const height = Math.random() * 100
          const isCurrentMonth = i === 5
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-8 rounded-t-md ${isCurrentMonth ? "bg-blue-600" : "bg-blue-300"}`}
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs mt-2">
                {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Données simulées pour les statistiques
  const stats = [
    {
      title: "Hôtels",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: "Utilisateurs",
      value: "12,486",
      change: "+18%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Revenus",
      value: "€124,892",
      change: "+8.2%",
      trend: "up",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Réservations",
      value: "1,429",
      change: "-3%",
      trend: "down",
      icon: <Calendar className="h-5 w-5" />,
    },
  ]

  // Données simulées pour les hôtels populaires
  const popularHotels = [
    {
      id: 1,
      name: "Grand Hôtel Paris",
      location: "Paris, France",
      bookings: 248,
      revenue: "€42,890",
      rating: 4.8,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Seaside Resort",
      location: "Nice, France",
      bookings: 186,
      revenue: "€38,450",
      rating: 4.9,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Chamonix, France",
      bookings: 142,
      revenue: "€29,780",
      rating: 4.7,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "City Center Hotel",
      location: "Lyon, France",
      bookings: 124,
      revenue: "€26,540",
      rating: 4.6,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Riverside Boutique",
      location: "Bordeaux, France",
      bookings: 98,
      revenue: "€21,350",
      rating: 4.5,
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Données simulées pour les réservations récentes
  const recentBookings = [
    {
      id: "B-12345",
      hotel: "Grand Hôtel Paris",
      user: "Jean Dupont",
      date: "2023-06-15",
      amount: "€450",
      status: "confirmed",
    },
    {
      id: "B-12346",
      hotel: "Seaside Resort",
      user: "Marie Martin",
      date: "2023-06-14",
      amount: "€680",
      status: "pending",
    },
    {
      id: "B-12347",
      hotel: "Mountain Lodge",
      user: "Pierre Durand",
      date: "2023-06-13",
      amount: "€320",
      status: "confirmed",
    },
    {
      id: "B-12348",
      hotel: "City Center Hotel",
      user: "Sophie Petit",
      date: "2023-06-12",
      amount: "€280",
      status: "cancelled",
    },
    {
      id: "B-12349",
      hotel: "Riverside Boutique",
      user: "Thomas Leroy",
      date: "2023-06-11",
      amount: "€390",
      status: "confirmed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-gray-500">Bienvenue dans votre espace d'administration .</p>
        </div>
        
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="bg-blue-50 p-2 rounded-md">{stat.icon}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                    <DropdownMenuItem>Télécharger le rapport</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <div className="flex items-center mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} depuis le mois dernier
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Graphique des revenus */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenus mensuels</CardTitle>
                <CardDescription>
                  Évolution des revenus générés par les commissions sur les réservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>

            {/* Top 5 des hôtels */}
            <Card>
              <CardHeader>
                <CardTitle>Hôtels les plus populaires</CardTitle>
                <CardDescription>Classement basé sur le nombre de réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularHotels.map((hotel, index) => (
                    <div key={hotel.id} className="flex items-center gap-4">
                      <div className="font-bold text-gray-500 w-5">{index + 1}</div>
                      <Avatar>
                        <AvatarImage src={hotel.image} />
                        <AvatarFallback>{hotel.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{hotel.name}</p>
                        <p className="text-xs text-gray-500 truncate">{hotel.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{hotel.bookings} réservations</p>
                        <div className="flex items-center justify-end mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-xs">{hotel.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Taux de satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction client</CardTitle>
                <CardDescription>Basé sur les avis des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">Note moyenne</span>
                      </div>
                      <span className="font-bold">4.7/5</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Propreté</div>
                      <div className="flex items-center gap-2">
                        <Progress value={96} className="h-2" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Service</div>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="h-2" />
                        <span className="text-sm font-medium">4.6</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Emplacement</div>
                      <div className="flex items-center gap-2">
                        <Progress value={90} className="h-2" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Rapport qualité/prix</div>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="h-2" />
                        <span className="text-sm font-medium">4.4</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Répartition des notes</div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="w-10 text-sm text-right">{rating} ★</div>
                          <Progress
                            value={rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1}
                            className="h-2 flex-1"
                          />
                          <div className="w-10 text-sm">
                            {rating === 5
                              ? "68%"
                              : rating === 4
                                ? "22%"
                                : rating === 3
                                  ? "7%"
                                  : rating === 2
                                    ? "2%"
                                    : "1%"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Réservations récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
              <CardDescription>Les 5 dernières réservations effectuées sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Hôtel</th>
                      <th className="px-4 py-2">Client</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Montant</th>
                      <th className="px-4 py-2">Statut</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-t">
                        <td className="px-4 py-3 text-sm font-medium">{booking.id}</td>
                        <td className="px-4 py-3 text-sm">{booking.hotel}</td>
                        <td className="px-4 py-3 text-sm">{booking.user}</td>
                        <td className="px-4 py-3 text-sm">{booking.date}</td>
                        <td className="px-4 py-3 text-sm font-medium">{booking.amount}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status === "confirmed"
                              ? "Confirmée"
                              : booking.status === "pending"
                                ? "En attente"
                                : "Annulée"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  Voir toutes les réservations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques détaillées</CardTitle>
              <CardDescription>Analyses approfondies des performances de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">Contenu des analytiques détaillées à venir</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>Rapports générés sur l'activité de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">Contenu des rapports à venir</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Toutes les notifications du système</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">Contenu des notifications à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}