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
      const currentRole = typeof user.role === "string" ? user.role.toLowerCase() : ""
      setRole(currentRole)
      const normalizedRoles = allowedRoles.map((r) => r.toLowerCase())
      if (currentRole !== "dpo" && !normalizedRoles.includes(currentRole)) {
        router.push("/dashboard")
      }
    } catch {
      router.push("/login")
    }
  }, [allowedRoles, router])

  return role
}
