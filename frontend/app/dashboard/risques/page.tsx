"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Plus, Eye, Edit } from "lucide-react"
import { RisqueDialog } from "@/components/risque-dialog"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function RisquesPage() {
  const [risques, setRisques] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingRisque, setEditingRisque] = useState<any>(null)
  const role = useRoleGuard(["Admin", "DPO", "SuperAdmin", "Collaborateur"])

  useEffect(() => {
    if (role) {
      fetchRisques()
    }
  }, [role])

  const fetchRisques = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/risques`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        setRisques(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des risques:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-red-100 text-red-800">Critique</Badge>
    if (score >= 60) return <Badge className="bg-orange-100 text-orange-800">Élevé</Badge>
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
    return <Badge className="bg-green-100 text-green-800">Faible</Badge>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Identifié":
        return <Badge variant="secondary">Identifié</Badge>
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "Traité":
        return <Badge className="bg-green-100 text-green-800">Traité</Badge>
      case "Résiduel":
        return <Badge className="bg-gray-100 text-gray-800">Résiduel</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Risques</h1>
          <p className="text-muted-foreground">Identifiez et gérez les risques RGPD</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Risque
        </Button>
      </div>

      {/* Statistiques des risques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risques.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{risques.filter((r) => r.score_risque >= 80).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {risques.filter((r) => r.statut === "En cours").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {risques.filter((r) => r.statut === "Traité").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des risques */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Risques</CardTitle>
          <CardDescription>Tous les risques identifiés et leur niveau de criticité</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Traitement</TableHead>
                <TableHead>Type de Risque</TableHead>
                <TableHead>Criticité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risques.map((risque) => (
                <TableRow key={risque.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{risque.nom_traitement}</div>
                      <div className="text-sm text-muted-foreground">{risque.pole}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{risque.type_risque}</Badge>
                  </TableCell>
                  <TableCell>{risque.criticite}/5</TableCell>
                  <TableCell>{risque.probabilite}/5</TableCell>
                  <TableCell>{risque.impact}/5</TableCell>
                  <TableCell>{getRiskBadge(risque.score_risque)}</TableCell>
                  <TableCell>{getStatusBadge(risque.statut)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingRisque(risque)
                          setShowDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RisqueDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        risque={editingRisque}
        onSuccess={() => {
          fetchRisques()
          setShowDialog(false)
          setEditingRisque(null)
        }}
      />
    </div>
  )
}
