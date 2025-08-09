"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { TraitementDialog } from "@/components/traitement-dialog"

export default function TraitementsPage() {
  const [traitements, setTraitements] = useState<any[]>([])
  const [filteredTraitements, setFilteredTraitements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [poleFilter, setPoleFilter] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingTraitement, setEditingTraitement] = useState<any>(null)

  useEffect(() => {
    fetchTraitements()
  }, [])

  useEffect(() => {
    filterTraitements()
  }, [traitements, searchTerm, statusFilter, poleFilter])

  const fetchTraitements = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3001/api/traitements", {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        setTraitements(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des traitements:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTraitements = () => {
    let filtered = traitements

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.finalite?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.statut_conformite === statusFilter)
    }

    if (poleFilter !== "all") {
      filtered = filtered.filter((t) => t.pole === poleFilter)
    }

    setFilteredTraitements(filtered)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce traitement ?")) {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:3001/api/traitements/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token || "" },
        })
        if (res.ok) {
          fetchTraitements()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Conforme":
        return <Badge className="bg-green-100 text-green-800">Conforme</Badge>
      case "Non conforme":
        return <Badge className="bg-red-100 text-red-800">Non conforme</Badge>
      case "À vérifier":
        return <Badge className="bg-yellow-100 text-yellow-800">À vérifier</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return <Badge className="bg-red-100 text-red-800">Critique</Badge>
    if (score >= 60) return <Badge className="bg-orange-100 text-orange-800">Élevé</Badge>
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
    return <Badge className="bg-green-100 text-green-800">Faible</Badge>
  }

  const poles = Array.from(new Set(traitements.map((t) => t.pole).filter(Boolean)))

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registre des Traitements</h1>
          <p className="text-muted-foreground">Gérez tous vos traitements de données personnelles</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Traitement
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un traitement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut de conformité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Conforme">Conforme</SelectItem>
                <SelectItem value="Non conforme">Non conforme</SelectItem>
                <SelectItem value="À vérifier">À vérifier</SelectItem>
              </SelectContent>
            </Select>
            <Select value={poleFilter} onValueChange={setPoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pôles</SelectItem>
                {poles.map((pole) => (
                  <SelectItem key={pole} value={pole}>
                    {pole}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des traitements */}
      <Card>
        <CardHeader>
          <CardTitle>Traitements ({filteredTraitements.length})</CardTitle>
          <CardDescription>Liste de tous les traitements de données personnelles enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Traitement</TableHead>
                <TableHead>Pôle</TableHead>
                <TableHead>Base Légale</TableHead>
                <TableHead>Conformité</TableHead>
                <TableHead>Risques</TableHead>
                <TableHead>Score Risque</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTraitements.map((traitement) => (
                <TableRow key={traitement.id}>
                  <TableCell className="font-medium">{traitement.nom}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{traitement.pole}</Badge>
                  </TableCell>
                  <TableCell>{traitement.base_legale}</TableCell>
                  <TableCell>{getStatusBadge(traitement.statut_conformite)}</TableCell>
                  <TableCell>{traitement.nombre_risques || 0}</TableCell>
                  <TableCell>
                    {traitement.score_moyen_risque ? (
                      getRiskLevel(Math.round(traitement.score_moyen_risque))
                    ) : (
                      <Badge variant="secondary">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/traitements/${traitement.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTraitement(traitement)
                          setShowDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(traitement.id)}>
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

      <TraitementDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        traitement={editingTraitement}
        onSuccess={() => {
          fetchTraitements()
          setShowDialog(false)
          setEditingTraitement(null)
        }}
      />
    </div>
  )
}
