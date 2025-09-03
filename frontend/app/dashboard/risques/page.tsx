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

// --- Helpers UI ---
const levelLabel = (v: number) => {
  // v attendu de 1 à 5
  switch (Math.max(1, Math.min(5, Number(v)))) {
    case 1: return { text: "Très faible", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" }
    case 2: return { text: "Faible",      cls: "bg-green-100 text-green-800 border-green-200" }
    case 3: return { text: "Modéré",      cls: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    case 4: return { text: "Élevé",       cls: "bg-orange-100 text-orange-800 border-orange-200" }
    case 5: return { text: "Critique",    cls: "bg-red-100 text-red-800 border-red-200" }
    default: return { text: `${v}/5`,     cls: "bg-muted text-foreground" }
  }
}

const LevelBadge = ({ value }: { value: number }) => {
  const { text, cls } = levelLabel(value)
  return <Badge className={`border ${cls}`}>{text}</Badge>
}

const rowTint = (score: number) => {
  if (score >= 80) return "hover:bg-red-50/80"
  if (score >= 60) return "hover:bg-orange-50/80"
  if (score >= 40) return "hover:bg-yellow-50/70"
  return "hover:bg-emerald-50/70"
}

export default function RisquesPage() {
  const [risques, setRisques] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingRisque, setEditingRisque] = useState<any>(null)
  const role = useRoleGuard(["Admin", "DPO", "SuperAdmin", "Collaborateur"])

  useEffect(() => {
    if (role) fetchRisques()
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
    if (score >= 80) return <Badge className="bg-red-100 text-red-800 border border-red-200">Critique</Badge>
    if (score >= 60) return <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Élevé</Badge>
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Moyen</Badge>
    return <Badge className="bg-green-100 text-green-800 border border-green-200">Faible</Badge>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Identifié":
        return <Badge variant="secondary">Identifié</Badge>
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">En cours</Badge>
      case "Traité":
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Traité</Badge>
      case "Résiduel":
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Résiduel</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) return <div className="p-6">Chargement...</div>

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

      {/* Statistiques */}
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
            <div className="text-2xl font-bold text-red-600">
              {risques.filter((r) => r.score_risque >= 80).length}
            </div>
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

      {/* Légende niveaux */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground mr-2">Légende :</span>
            <LevelBadge value={1} />
            <LevelBadge value={2} />
            <LevelBadge value={3} />
            <LevelBadge value={4} />
            <LevelBadge value={5} />
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Risques</CardTitle>
          <CardDescription>Tous les risques identifiés et leur niveau</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Traitement</TableHead>
                  <TableHead>Type de Risque</TableHead>
                  <TableHead>Criticité</TableHead>
                  <TableHead>Probabilité</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risques.map((risque) => (
                  <TableRow key={risque.id} className={rowTint(risque.score_risque)}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{risque.nom_traitement}</div>
                        <div className="text-sm text-muted-foreground">{risque.pole}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{risque.type_risque}</Badge>
                    </TableCell>

                    {/* Remplacement 1/5 -> libellés colorés */}
                    <TableCell><LevelBadge value={risque.criticite} /></TableCell>
                    <TableCell><LevelBadge value={risque.probabilite} /></TableCell>
                    <TableCell><LevelBadge value={risque.impact} /></TableCell>

                    <TableCell>{getRiskBadge(risque.score_risque)}</TableCell>
                    <TableCell>{getStatusBadge(risque.statut)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm" title="Voir">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Modifier"
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
          </div>
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
