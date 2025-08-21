"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditProfilePage() {
  const router = useRouter()
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setNom(u.nom || "")
      setEmail(u.email || "")
      setUserId(u.id)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ nom, email }),
      })
      if (res.ok) {
        const updated = await res.json()
        localStorage.setItem("user", JSON.stringify(updated))
        router.push("/profile")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifier le profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  )
}

