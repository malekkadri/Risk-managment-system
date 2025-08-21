"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useRoleGuard(allowedRoles: string[]) {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/login")
      return
    }
    try {
      const user = JSON.parse(stored)
      setRole(user.role)
      if (!allowedRoles.includes(user.role)) {
        router.push("/dashboard")
      }
    } catch {
      router.push("/login")
    }
  }, [allowedRoles, router])

  return role
}
