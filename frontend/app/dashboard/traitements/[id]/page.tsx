"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function TraitementDetailsPage({ params }: { params: { id: string } }) {
  const [traitement, setTraitement] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const role = useRoleGuard(["admin", "dpo", "super admin", "responsable du traitement"])

  useEffect(() => {
    if (!role) return
    const fetchTraitement = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE_URL}/api/traitements/${params.id}`, {
          headers: { "x-auth-token": token || "" },
        })
        if (res.ok) {
          const data = await res.json()
          setTraitement(data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du traitement:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTraitement()
  }, [params.id, role])

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  if (!traitement) {
    return <div className="p-6">Traitement non trouvé</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{traitement.nom}</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/traitements">Retour</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Pôle:</strong> {traitement.pole || "N/A"}
          </div>
          <div>
            <strong>Base légale:</strong> {traitement.base_legale || "N/A"}
          </div>
          <div>
            <strong>Finalité:</strong> {traitement.finalite || "N/A"}
          </div>
          <div>
            <strong>Statut:</strong> <Badge>{traitement.statut_conformite}</Badge>
          </div>
        </CardContent>
      </Card>

      {traitement.risques && traitement.risques.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risques associés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {traitement.risques.map((r: any) => (
              <div key={r.id} className="flex justify-between">
                <span>{r.type_risque}</span>
                <Badge variant="secondary">{r.criticite}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

