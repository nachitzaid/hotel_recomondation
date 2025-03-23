"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-context"
import { User, LogOut, Settings, Hotel, Calendar, CreditCard, UsersIcon, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              HotelBooking
            </Link>

            <nav className="hidden md:flex ml-8 space-x-6">
              <Link href="/hotels" className="text-gray-600 hover:text-blue-600">
                Hôtels
              </Link>
              <Link href="/destinations" className="text-gray-600 hover:text-blue-600">
                Destinations
              </Link>
              <Link href="/offers" className="text-gray-600 hover:text-blue-600">
                Offres
              </Link>
              {isAuthenticated && (
                <Link href="/reservations" className="text-gray-600 hover:text-blue-600">
                  Mes réservations
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                  Administration
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                      <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/reservations")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Réservations</span>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Administration</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/admin/hotels")}>
                        <Hotel className="mr-2 h-4 w-4" />
                        <span>Gérer les hôtels</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/admin/reservations")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Gérer les réservations</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                        <UsersIcon className="mr-2 h-4 w-4" />
                        <span>Gérer les utilisateurs</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/admin/payments")}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Paiements</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Connexion
                </Button>
                <Button onClick={() => router.push("/signup")}>Inscription</Button>
              </div>
            )}

            {/* Bouton menu mobile */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/hotels" className="text-gray-600 hover:text-blue-600 py-2">
                Hôtels
              </Link>
              <Link href="/destinations" className="text-gray-600 hover:text-blue-600 py-2">
                Destinations
              </Link>
              <Link href="/offers" className="text-gray-600 hover:text-blue-600 py-2">
                Offres
              </Link>
              {isAuthenticated && (
                <Link href="/reservations" className="text-gray-600 hover:text-blue-600 py-2">
                  Mes réservations
                </Link>
              )}
              {user?.role === "admin" && (
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 py-2">
                  Administration
                </Link>
              )}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    Connexion
                  </Button>
                  <Button onClick={() => router.push("/signup")}>Inscription</Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

