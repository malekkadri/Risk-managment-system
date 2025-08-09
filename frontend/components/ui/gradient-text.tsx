import type React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  gradient?: "primary" | "secondary" | "success" | "warning" | "error"
  className?: string
}

export function GradientText({ children, gradient = "primary", className }: GradientTextProps) {
  const gradients = {
    primary: "bg-gradient-to-r from-purple-400 to-pink-400",
    secondary: "bg-gradient-to-r from-blue-400 to-indigo-400",
    success: "bg-gradient-to-r from-green-400 to-emerald-400",
    warning: "bg-gradient-to-r from-yellow-400 to-orange-400",
    error: "bg-gradient-to-r from-red-400 to-pink-400",
  }

  return (
    <span className={cn("bg-clip-text text-transparent font-bold", gradients[gradient], className)}>{children}</span>
  )
}
