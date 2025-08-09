"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  Bell,
  Download,
} from "lucide-react"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: BarChart3 },
  { name: "Traitements", href: "/dashboard/traitements", icon: FileText },
  { name: "Risques", href: "/dashboard/risques", icon: AlertTriangle },
  { name: "Mesures correctives", href: "/dashboard/mesures", icon: ShieldCheck },
  { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
  { name: "Alertes", href: "/dashboard/alertes", icon: Bell },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Rapports", href: "/dashboard/rapports", icon: Download },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white shadow-xl border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 px-4 bg-gradient-to-r from-red-400 to-red-500">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Image src="/images/sba-logo.png" alt="SBA Compta" width={32} height={32} className="rounded-full" />
          </div>
          <div className="text-white">
            <div className="text-xl font-bold">SBA</div>
            <div className="text-sm font-medium opacity-90">Compta</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Gestion RGPD</div>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-red-50 text-red-700 shadow-sm border border-red-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 mr-3 transition-colors",
                  isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {item.name}
              {isActive && <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-semibold">SBA Compta RGPD</div>
          <div>Version 1.0.0</div>
        </div>
      </div>
    </div>
  )
}
