"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Settings, HelpCircle, ChevronDown } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/traitements": "Traitements",
  "/dashboard/risques": "Risques",
  "/dashboard/mesures": "Mesures correctives",
  "/dashboard/users": "Utilisateurs",
  "/dashboard/alertes": "Alertes",
  "/dashboard/journal": "Journal",
  "/dashboard/rapports": "Rapports",
  "/dashboard/settings": "Paramètres",
}

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [alertCount, setAlertCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchAlertCount()
  }, [])

  const fetchAlertCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/alertes`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const alertes = await res.json()
        setAlertCount(alertes.filter((a: any) => !a.lu).length)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const getInitials = (nom: string) => {
    return (
      nom
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    )
  }

  const currentPageTitle = breadcrumbMap[pathname] || "Page"

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white shadow-sm border-b border-red-300">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{currentPageTitle}</h1>
          <div className="flex items-center text-sm text-red-100 mt-1">
            <span className="text-white">SBA Compta</span>
            <ChevronDown className="w-3 h-3 mx-1 rotate-[-90deg] text-red-200" />
            <span className="text-white">RGPD</span>
            <ChevronDown className="w-3 h-3 mx-1 rotate-[-90deg] text-red-200" />
            <span className="text-white font-semibold">{currentPageTitle}</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Help Button */}
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative text-white hover:bg-white/10"
          onClick={() => router.push("/dashboard/alertes")}
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 text-xs bg-yellow-300 text-black">
              {alertCount > 99 ? "99+" : alertCount}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 hover:bg-white/10 px-3 py-2 rounded-lg text-white">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-red-100 text-red-700 text-sm font-semibold">
                  {getInitials(user?.nom)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-white">{user?.nom || "Utilisateur"}</div>
                <div className="text-xs text-red-100">{user?.role || "Collaborateur"}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-red-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.nom}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="w-4 h-4 mr-2" />
              Aide & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
