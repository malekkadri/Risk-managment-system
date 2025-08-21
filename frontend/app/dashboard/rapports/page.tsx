"use client"

import { useState } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3, Activity, Upload } from "lucide-react"

export default function RapportsPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleExport = async (type: string, format: string) => {
    setLoading(`${type}-${format}`)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/rapports/${type}/${format}`, {
        headers: { "x-auth-token": token || "" },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-${type}.${format === "pdf" ? "pdf" : "xlsx"}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    setLoading("import")
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch(`${API_BASE_URL}/api/traitements/import`, {
        method: "POST",
        headers: { "x-auth-token": token || "" },
        body: formData,
      })
      if (response.ok) {
        setFile(null)
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
    } finally {
      setLoading(null)
    }
  }

  const rapports = [
    {
      id: "conformite",
      title: "Rapport de Conformité RGPD",
      description: "Vue d'ensemble de la conformité de tous les traitements",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "risques",
      title: "Analyse des Risques",
      description: "Évaluation détaillée des risques identifiés",
      icon: BarChart3,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "activite",
      title: "Rapport d'Activité",
      description: "Journal des actions et modifications récentes",
      icon: Activity,
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports et Exports</h1>
          <p className="text-muted-foreground">Générez et exportez vos rapports RGPD</p>
        </div>
        <Badge variant="outline">Dernière génération: {new Date().toLocaleDateString("fr-FR")}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rapports.map((rapport) => (
          <Card key={rapport.id} className="relative">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${rapport.color} flex items-center justify-center mb-4`}>
                <rapport.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">{rapport.title}</CardTitle>
              <CardDescription>{rapport.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleExport(rapport.id, "pdf")}
                  disabled={loading === `${rapport.id}-pdf`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {loading === `${rapport.id}-pdf` ? "Génération..." : "Exporter en PDF"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleExport(rapport.id, "excel")}
                  disabled={loading === `${rapport.id}-excel`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {loading === `${rapport.id}-excel` ? "Génération..." : "Exporter en Excel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importer un fichier Excel</CardTitle>
          <CardDescription>Ajoutez des traitements depuis un fichier .xlsx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            onClick={handleImport}
            disabled={!file || loading === "import"}
            className="flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading === "import" ? "Import..." : "Importer"}
          </Button>
        </CardContent>
      </Card>

      {/* Rapports personnalisés */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Personnalisés</CardTitle>
          <CardDescription>Créez des rapports sur mesure selon vos besoins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Rapport par Pôle</h3>
              <p className="text-sm text-muted-foreground mb-4">Analyse détaillée des traitements par département</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Générer
              </Button>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Suivi des Mesures</h3>
              <p className="text-sm text-muted-foreground mb-4">État d'avancement des mesures correctives</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Générer
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Planification automatique */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Automatiques</CardTitle>
          <CardDescription>Configurez la génération automatique de rapports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Rapport mensuel de conformité</h4>
                <p className="text-sm text-muted-foreground">Envoyé le 1er de chaque mois</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Alerte risques critiques</h4>
                <p className="text-sm text-muted-foreground">Envoyé en cas de nouveau risque critique</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
