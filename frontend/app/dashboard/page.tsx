"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [evolution, setEvolution] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { "x-auth-token": token || "" }

      const [statsRes, evolutionRes] = await Promise.all([
        fetch("http://localhost:3001/api/dashboard/stats", { headers }),
        fetch("http://localhost:3001/api/dashboard/evolution", { headers }),
      ])

      if (statsRes.ok && evolutionRes.ok) {
        setStats(await statsRes.json())
        setEvolution(await evolutionRes.json())
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const conformiteData =
    stats?.conformite?.map((item: any) => ({
      name: item.statut_conformite,
      value: item.count,
    })) || []

  const risquesData =
    stats?.risques?.map((item: any) => ({
      name: item.niveau,
      value: item.count,
    })) || []

  const polesData =
    stats?.poles?.map((item: any) => ({
      name: item.pole,
      value: item.count,
    })) || []

  const conformityRate = stats?.conformite
    ? Math.round(
        ((stats.conformite.find((c: any) => c.statut_conformite === "Conforme")?.count || 0) / stats.totalTraitements) *
          100,
      )
    : 0

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de bord RGPD</h1>
            <p className="text-red-100 text-lg">Bienvenue sur votre plateforme SBA Compta de gestion RGPD</p>
            <div className="flex items-center mt-4 text-red-100">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-4xl font-bold">{conformityRate}%</div>
              <div className="text-red-100">Conformité globale</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Traitements</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalTraitements || 0}</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risques Actifs</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.risques?.reduce((acc: number, r: any) => acc + r.count, 0) || 0}
            </div>
            <div className="flex items-center text-sm text-red-600 mt-2">
              <TrendingDown className="h-3 w-3 mr-1" />
              -5% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mesures Correctives</CardTitle>
            <ShieldCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.mesures?.reduce((acc: number, m: any) => acc + m.count, 0) || 0}
            </div>
            <Progress value={75} className="mt-3" />
            <div className="text-sm text-gray-600 mt-2">75% terminées</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alertes</CardTitle>
            <Activity className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.alertesNonLues || 0}</div>
            <Badge variant="destructive" className="mt-2">
              Non lues
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Conformité par Statut
            </CardTitle>
            <CardDescription>Répartition des traitements par niveau de conformité</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conformiteData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conformiteData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Risques par Niveau
            </CardTitle>
            <CardDescription>Distribution des risques selon leur criticité</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={risquesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Traitements par Pôle
            </CardTitle>
            <CardDescription>Répartition des traitements par département</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={polesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Évolution Mensuelle
            </CardTitle>
            <CardDescription>Nouveaux traitements créés par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="nouveaux_traitements"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Link href="/dashboard/traitements">
                <FileText className="h-6 w-6" />
                <span>Nouveau Traitement</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Link href="/dashboard/risques">
                <AlertTriangle className="h-6 w-6" />
                <span>Évaluer un Risque</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Link href="/dashboard/rapports">
                <BarChart className="h-6 w-6" />
                <span>Générer un Rapport</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Alertes Récentes
              </CardTitle>
              <CardDescription>Les dernières notifications importantes</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/alertes">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Risque critique détecté</p>
                <p className="text-xs text-red-700">Traitement "Gestion de la paie" - Action requise</p>
              </div>
              <Badge variant="destructive">Critique</Badge>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">Échéance proche</p>
                <p className="text-xs text-yellow-700">Mesure corrective à terminer dans 5 jours</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
