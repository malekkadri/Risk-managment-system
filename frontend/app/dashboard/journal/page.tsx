"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Activity, FileText, AlertTriangle, Shield, Calendar, User } from "lucide-react"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function JournalPage() {
  const [actions, setActions] = useState<any[]>([])
  const [filteredActions, setFilteredActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const role = useRoleGuard(["admin", "dpo", "super admin"])

  useEffect(() => {
    if (role) {
      fetchActions()
    }
  }, [role])

  useEffect(() => {
    filterActions()
  }, [actions, searchTerm, actionFilter])

  const fetchActions = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/journal`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        setActions(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du journal:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterActions = () => {
    let filtered = actions

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.nom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter((a) => a.action === actionFilter)
    }

    setFilteredActions(filtered)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Création":
        return <FileText className="h-4 w-4 text-green-500" />
      case "Modification":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "Suppression":
        return <FileText className="h-4 w-4 text-red-500" />
      case "Création risque":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "Modification risque":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "Création mesure":
        return <Shield className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Création":
        return <Badge className="bg-green-100 text-green-800">Création</Badge>
      case "Modification":
        return <Badge className="bg-blue-100 text-blue-800">Modification</Badge>
      case "Suppression":
        return <Badge className="bg-red-100 text-red-800">Suppression</Badge>
      case "Création risque":
        return <Badge className="bg-orange-100 text-orange-800">Nouveau Risque</Badge>
      case "Modification risque":
        return <Badge className="bg-yellow-100 text-yellow-800">Risque Modifié</Badge>
      case "Création mesure":
        return <Badge className="bg-purple-100 text-purple-800">Nouvelle Mesure</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  const getInitials = (nom: string) => {
    if (!nom) return "?"
    return nom
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const uniqueActions = Array.from(new Set(actions.map((a) => a.action)))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Activity className="mr-3 h-8 w-8 text-primary" />
            Journal d'Activité
          </h1>
          <p className="text-muted-foreground">Historique complet des actions effectuées dans l'application</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="mr-1 h-3 w-3" />
          {filteredActions.length} action{filteredActions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créations</p>
                <p className="text-2xl font-bold">{actions.filter((a) => a.action === "Création").length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modifications</p>
                <p className="text-2xl font-bold">{actions.filter((a) => a.action === "Modification").length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risques</p>
                <p className="text-2xl font-bold">{actions.filter((a) => a.action.includes("risque")).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mesures</p>
                <p className="text-2xl font-bold">{actions.filter((a) => a.action.includes("mesure")).length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans le journal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Activité Récente
          </CardTitle>
          <CardDescription>Chronologie des dernières actions effectuées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActions.map((action, index) => (
              <div
                key={action.id}
                className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {getActionIcon(action.action)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getActionBadge(action.action)}
                      {action.nom_traitement && (
                        <Badge variant="outline" className="text-xs">
                          {action.nom_traitement}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(action.date_action).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{action.details}</p>
                  {action.nom_utilisateur && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Par {action.nom_utilisateur}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredActions.length === 0 && (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune activité trouvée</h3>
                <p className="text-muted-foreground">Aucune action ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
