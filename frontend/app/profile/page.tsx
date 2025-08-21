"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("user")
    if (data) {
      setUser(JSON.parse(data))
    }
  }, [])

  if (!user) {
    return <div className="p-6">Aucun utilisateur connecté.</div>
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Mon profil</h1>
      <p>
        <strong>Nom:</strong> {user.nom}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <Button asChild>
        <Link href="/profile/edit">Modifier le profil</Link>
      </Button>
    </div>
  )
}

