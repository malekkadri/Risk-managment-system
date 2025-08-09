"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationProps {
  type?: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  className?: string
}

export function Notification({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  className,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: "bg-green-500/20 border-green-500/30 text-green-100",
    error: "bg-red-500/20 border-red-500/30 text-red-100",
    warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-100",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-100",
  }

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full backdrop-blur-md border rounded-lg p-4 shadow-lg transition-all duration-300",
        colors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        className,
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", iconColors[type])} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold">{title}</h4>
          {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
