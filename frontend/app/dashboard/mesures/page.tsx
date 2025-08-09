"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Shield, CheckCircle, AlertTriangle, Clock, Filter } from "lucide-react"

export default function MesuresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const mesures = [
    {
      id: 1,
      nom: "Chiffrement des données",
      description: "Mise en place du chiffrement AES-256 pour toutes les données sensibles",
      statut: "active",
      priorite: "haute",
      progression: 100,
      dateCreation: "2024-01-15",
      dateEcheance: "2024-02-15",
      responsable: "Jean Dupont",
      cout: "15000€",
    },
    {
      id: 2,
      nom: "Formation RGPD équipes",
      description: "Programme de formation obligatoire pour tous les employés",
      statut: "en_cours",
      priorite: "moyenne",
      progression: 65,
      dateCreation: "2024-01-20",
      dateEcheance: "2024-03-01",
      responsable: "Marie Martin",
      cout: "8000€",
    },
    {
      id: 3,
      nom: "Audit de sécurité",
      description: "Audit complet des systèmes d'information et des processus",
      statut: "planifie",
      priorite: "haute",
      progression: 0,
      dateCreation: "2024-02-01",
      dateEcheance: "2024-04-01",
      responsable: "Pierre Durand",
      cout: "25000€",
    },
    {
      id: 4,
      nom: "Mise à jour politique confidentialité",
      description: "Révision et mise à jour de la politique de confidentialité",
      statut: "active",
      priorite: "faible",
      progression: 90,
      dateCreation: "2024-01-10",
      dateEcheance: "2024-02-10",
      responsable: "Sophie Leroy",
      cout: "2000€",
    },
  ]

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "en_cours":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        )
      case "planifie":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Planifié
          </Badge>
        )
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getPriorityBadge = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return <Badge variant="destructive">Haute</Badge>
      case "moyenne":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Moyenne</Badge>
      case "faible":
        return <Badge variant="secondary">Faible</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const filteredMesures = mesures.filter((mesure) => {
    const matchesSearch =
      mesure.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mesure.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || mesure.statut === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = [
    { title: "Total Mesures", value: mesures.length, icon: Shield, color: "text-blue-600" },
    {
      title: "Actives",
      value: mesures.filter((m) => m.statut === "active").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "En Cours",
      value: mesures.filter((m) => m.statut === "en_cours").length,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Planifiées",
      value: mesures.filter((m) => m.statut === "planifie").length,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mesures de Sécurité</h1>
          <p className="text-gray-600 mt-2">Gestion et suivi des mesures de protection des données</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Mesure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle mesure</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle mesure de sécurité pour améliorer votre conformité RGPD.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de la mesure</Label>
                  <Input id="nom" placeholder="Ex: Chiffrement des données" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priorite">Priorité</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Décrivez la mesure en détail..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input id="responsable" placeholder="Nom du responsable" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cout">Coût estimé</Label>
                  <Input id="cout" placeholder="Ex: 10000€" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input id="dateDebut" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateEcheance">Date d'échéance</Label>
                  <Input id="dateEcheance" type="date" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">Créer la mesure</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une mesure..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="planifie">Planifié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mesures Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Liste des Mesures</CardTitle>
          <CardDescription>{filteredMesures.length} mesure(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mesure</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Coût</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMesures.map((mesure) => (
                <TableRow key={mesure.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{mesure.nom}</div>
                      <div className="text-sm text-gray-500">{mesure.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(mesure.statut)}</TableCell>
                  <TableCell>{getPriorityBadge(mesure.priorite)}</TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{mesure.progression}%</span>
                      </div>
                      <Progress value={mesure.progression} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">{mesure.responsable}</TableCell>
                  <TableCell className="text-gray-600">{mesure.dateEcheance}</TableCell>
                  <TableCell className="font-medium text-gray-900">{mesure.cout}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
