import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50">
      {/* Hide the sidebar on small screens for a cleaner mobile layout */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-white/60">
          {children}
        </main>
      </div>
    </div>
  )
}
