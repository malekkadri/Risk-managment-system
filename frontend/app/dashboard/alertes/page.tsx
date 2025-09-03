"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, Clock } from "lucide-react"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const role = useRoleGuard(["admin", "dpo", "super admin", "responsable du traitement"])

  useEffect(() => {
    if (role) {
      fetchAlertes()
    }
  }, [role])

  const fetchAlertes = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/alertes`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        setAlertes(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/alertes/${id}/read`, {
        method: "PUT",
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        fetchAlertes()
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Critique":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Attention":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "Critique":
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>
      case "Attention":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
      case "Info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  const alertesNonLues = alertes.filter((a) => !a.lu)
  const alertesLues = alertes.filter((a) => a.lu)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centre d'Alertes</h1>
          <p className="text-muted-foreground">
            {alertesNonLues.length} alerte{alertesNonLues.length !== 1 ? "s" : ""} non lue
            {alertesNonLues.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Total: {alertes.length}</Badge>
          <Badge className="bg-red-100 text-red-800">Non lues: {alertesNonLues.length}</Badge>
        </div>
      </div>

      {/* Alertes non lues */}
      {alertesNonLues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Alertes Non Lues ({alertesNonLues.length})
            </CardTitle>
            <CardDescription>Alertes nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertesNonLues.map((alerte) => (
              <div key={alerte.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50">
                {getAlertIcon(alerte.type_alerte)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{alerte.titre}</h3>
                    {getAlertBadge(alerte.type_alerte)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alerte.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {alerte.nom_traitement && <span className="mr-4">Traitement: {alerte.nom_traitement}</span>}
                      <span>{new Date(alerte.cree_le).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => markAsRead(alerte.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marquer comme lu
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alertes lues */}
      {alertesLues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Alertes Lues ({alertesLues.length})
            </CardTitle>
            <CardDescription>Historique des alertes traitées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertesLues.slice(0, 10).map((alerte) => (
              <div key={alerte.id} className="flex items-start space-x-4 p-4 border rounded-lg opacity-75">
                {getAlertIcon(alerte.type_alerte)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700">{alerte.titre}</h3>
                    {getAlertBadge(alerte.type_alerte)}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{alerte.message}</p>
                  <div className="text-xs text-gray-400">
                    {alerte.nom_traitement && <span className="mr-4">Traitement: {alerte.nom_traitement}</span>}
                    <span>{new Date(alerte.cree_le).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </div>
            ))}
            {alertesLues.length > 10 && (
              <div className="text-center">
                <Button variant="outline" size="sm">
                  Voir plus d'alertes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {alertes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune alerte</h3>
            <p className="text-muted-foreground">Tout semble en ordre ! Aucune alerte n'a été générée.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
