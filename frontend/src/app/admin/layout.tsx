"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Hotel, Calendar, Users, CreditCard, Settings, LogOut, Trophy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href: string
  active: boolean
}

const SidebarItem = ({ icon, title, href, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      active
        ? "bg-gradient-to-r from-red-700/10 via-amber-600/10 to-green-700/10 text-amber-700 font-medium"
        : "text-gray-500 hover:text-amber-700 hover:bg-amber-50"
    }`}
  >
    {icon}
    <span>{title}</span>
    {active && (
      <div className="ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-red-700 via-amber-600 to-green-700"></div>
    )}
  </Link>
)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isReady, setIsReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()

  // État pour la transition
  useEffect(() => {
    // Court délai avant d'afficher le contenu pour une transition fluide
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    try {
      // Désactiver la transition avec un court délai pour permettre
      // à l'animation de se produire avant la déconnexion
      setIsReady(false)
      
      // Court délai pour l'animation de fondu
      setTimeout(async () => {
        await logout()
        // La redirection est gérée dans la fonction logout
      }, 150)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setIsReady(true) // Réactiver la transition en cas d'erreur
    }
  }

  const sidebarItems = [
    {
      icon: <LayoutDashboard size={20} />,
      title: "Dashboard",
      href: "/admin",
    },
    {
      icon: <Hotel size={20} />,
      title: "Hôtels",
      href: "/admin/hotels",
    },
    {
      icon: <Calendar size={20} />,
      title: "Réservations",
      href: "/admin/reservations",
    },
    {
      icon: <Users size={20} />,
      title: "Utilisateurs",
      href: "/admin/users",
    },
    {
      icon: <CreditCard size={20} />,
      title: "Paiements",
      href: "/admin/payments",
    },
  ]

  return (
    <div className={`flex min-h-screen flex-col transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-red-700 via-amber-600 to-green-700 text-white shadow-md">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">WorldCup Hotels - Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:inline-block">Connecté en tant qu'administrateur</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2 text-white hover:bg-white/20">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.firstName || "Admin"}</p>
                  <p className="text-xs opacity-80">{user?.email || "admin@worldcuphotels.com"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar pour desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-white shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-amber-800">Administration</h2>
            <p className="text-xs text-gray-500 mt-1">Gestion de la plateforme</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              />
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{user?.firstName?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.firstName || "Admin"}</p>
                <p className="text-xs text-gray-500">{user?.email || "admin@worldcuphotels.com"}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
                title="Se déconnecter"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </aside>

        {/* Sidebar mobile */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 md:hidden ${sidebarOpen ? "block" : "hidden"}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-amber-800">Administration</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </Button>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              />
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{user?.firstName?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.firstName || "Admin"}</p>
                <p className="text-xs text-gray-500">{user?.email || "admin@worldcuphotels.com"}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
                title="Se déconnecter"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 bg-gray-50">
          {/* Bouton pour ouvrir le menu mobile */}
          <Button variant="outline" size="icon" className="mb-4 md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </Button>

          {children}
        </main>
      </div>
    </div>
  )
}