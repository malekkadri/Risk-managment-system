"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Shield, CheckCircle, AlertTriangle, Clock, Edit, Trash2 } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"
import { MesureDialog } from "@/components/mesure-dialog"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function MesuresPage() {
  const [mesures, setMesures] = useState<any[]>([])
  const [filteredMesures, setFilteredMesures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingMesure, setEditingMesure] = useState<any>(null)
  const role = useRoleGuard(["admin", "dpo", "super admin", "responsable du traitement"])

  useEffect(() => {
    if (role) {
      fetchMesures()
    }
  }, [role])

  useEffect(() => {
    filterMesures()
  }, [mesures, searchTerm, filterStatus])

  const fetchMesures = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/mesures`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        setMesures(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des mesures:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMesures = () => {
    let filtered = mesures

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.nom_traitement.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((m) => m.statut === filterStatus)
    }

    setFilteredMesures(filtered)
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Terminée":
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "Reportée":
        return <Badge className="bg-yellow-100 text-yellow-800">Reportée</Badge>
      case "À faire":
        return <Badge variant="secondary">À faire</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getPriorityBadge = (priorite: string) => {
    switch (priorite) {
      case "Critique":
        return <Badge variant="destructive">Critique</Badge>
      case "Haute":
        return <Badge className="bg-red-100 text-red-800">Haute</Badge>
      case "Moyenne":
        return <Badge className="bg-orange-100 text-orange-800">Moyenne</Badge>
      case "Basse":
        return <Badge variant="secondary">Basse</Badge>
      default:
        return <Badge variant="secondary">{priorite}</Badge>
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette mesure ?")) {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE_URL}/api/mesures/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token || "" },
        })
        if (res.ok) {
          fetchMesures()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const stats = [
    { title: "Total Mesures", value: mesures.length, icon: Shield, color: "text-blue-600" },
    { title: "En cours", value: mesures.filter((m) => m.statut === "En cours").length, icon: Clock, color: "text-orange-600" },
    { title: "Terminées", value: mesures.filter((m) => m.statut === "Terminée").length, icon: CheckCircle, color: "text-green-600" },
    { title: "À faire", value: mesures.filter((m) => m.statut === "À faire").length, icon: AlertTriangle, color: "text-yellow-600" },
  ]

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mesures de Sécurité</h1>
          <p className="text-gray-600 mt-2">Gestion et suivi des mesures de protection des données</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Mesure
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une mesure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="À faire">À faire</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
                <SelectItem value="Reportée">Reportée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Mesures</CardTitle>
          <CardDescription>Toutes les mesures correctives enregistrées</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Traitement</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMesures.map((mesure) => (
                <TableRow key={mesure.id}>
                  <TableCell className="font-medium">{mesure.nom_traitement}</TableCell>
                  <TableCell>{mesure.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{mesure.type_mesure}</Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(mesure.priorite)}</TableCell>
                  <TableCell>{getStatusBadge(mesure.statut)}</TableCell>
                  <TableCell>
                    {mesure.date_echeance
                      ? new Date(mesure.date_echeance).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingMesure(mesure)
                          setShowDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(mesure.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MesureDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mesure={editingMesure}
        onSuccess={() => {
          fetchMesures()
          setShowDialog(false)
          setEditingMesure(null)
        }}
      />
    </div>
  )
}

