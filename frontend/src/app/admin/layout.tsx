"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react"
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
      active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-500 hover:text-blue-700 hover:bg-blue-50"
    }`}
  >
    {icon}
    <span>{title}</span>
    {active && <div className="ml-auto w-1.5 h-6 rounded-full bg-blue-700"></div>}
  </Link>
)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

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
    {
      icon: <Settings size={20} />,
      title: "Paramètres",
      href: "/admin/settings",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-700">TravelBook</h1>
          <p className="text-xs text-gray-500 mt-1">Administration</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              title={item.title}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@travelbook.com</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 md:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-blue-700">TravelBook</h1>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              title={item.title}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@travelbook.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </Button>
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Nouvelle demande d'hôtel</p>
                      <p className="text-xs text-gray-500">Grand Hôtel Paris a soumis une demande d'inscription</p>
                      <p className="text-xs text-gray-400">Il y a 10 minutes</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Litige de réservation</p>
                      <p className="text-xs text-gray-500">
                        Un client a signalé un problème avec sa réservation #12345
                      </p>
                      <p className="text-xs text-gray-400">Il y a 2 heures</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Paiement en attente</p>
                      <p className="text-xs text-gray-500">3 paiements nécessitent votre attention</p>
                      <p className="text-xs text-gray-400">Il y a 1 jour</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-center text-blue-600">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Profil</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

