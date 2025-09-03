"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
// Update the import path below if your use-toast file is in a different location
import { useToast } from "@/components/ui/use-toast"
import {
  Download,
  FileText,
  BarChart3,
  Activity,
  Upload,
  ShieldCheck,
  Loader2,
  X,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { useRoleGuard } from "@/hooks/useRoleGuard"

type ReportId = "conformite" | "risques" | "activite" | "mesures"
type Format = "pdf" | "excel"

type Status = "idle" | "loading" | "success" | "error" | "canceled"

interface ReportDef {
  id: ReportId
  title: string
  description: string
  Icon: any
  color: string
}

const REPORTS: ReportDef[] = [
  {
    id: "conformite",
    title: "Rapport de Conformité RGPD",
    description: "Vue d'ensemble de la conformité de tous les traitements",
    Icon: FileText,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    id: "risques",
    title: "Analyse des Risques",
    description: "Évaluation détaillée des risques identifiés",
    Icon: BarChart3,
    color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  },
  {
    id: "activite",
    title: "Rapport d'Activité",
    description: "Journal des actions et modifications récentes",
    Icon: Activity,
    color: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  },
  {
    id: "mesures",
    title: "Plan des Mesures Correctives",
    description: "Suivi détaillé des mesures correctives et leur statut",
    Icon: ShieldCheck,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  },
]

export default function RapportsPage() {
  useRoleGuard(["admin", "dpo", "super admin", "responsable du traitement", "sous traitant"])
  const { toast } = useToast()

  // Per-report status & last run time
  const [status, setStatus] = useState<Record<ReportId, Status>>({
    conformite: "idle",
    risques: "idle",
    activite: "idle",
    mesures: "idle",
  })
  const [lastRun, setLastRun] = useState<Record<ReportId, string | null>>({
    conformite: null,
    risques: null,
    activite: null,
    mesures: null,
  })
  const [progress, setProgress] = useState<Record<ReportId, number>>({
    conformite: 0,
    risques: 0,
    activite: 0,
    mesures: 0,
  })
  const controllers = useRef<Record<string, AbortController>>({})

  // Import
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Auto reports (UI only here; wire to your backend if you want)
  const [autoMonthly, setAutoMonthly] = useState(true)
  const [autoCritical, setAutoCritical] = useState(true)

  // Synthetic progress while generating (nice UX even if backend is streaming a blob)
  useEffect(() => {
    const timers: number[] = []
    REPORTS.forEach(r => {
      if (status[r.id] === "loading") {
        const t = window.setInterval(() => {
          setProgress(prev => {
            const next = Math.min(97, (prev[r.id] ?? 0) + Math.random() * 10)
            return { ...prev, [r.id]: next }
          })
        }, 400)
        timers.push(t)
      }
    })
    return () => timers.forEach(t => clearInterval(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.conformite, status.risques, status.activite, status.mesures])

  const handleExport = async (reportId: ReportId, format: Format) => {
    const key = `${reportId}-${format}`
    // cancel previous if any
    controllers.current[key]?.abort()
    const ctrl = new AbortController()
    controllers.current[key] = ctrl

    setStatus(s => ({ ...s, [reportId]: "loading" }))
    setProgress(p => ({ ...p, [reportId]: 10 }))

    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`${API_BASE_URL}/api/rapports/${reportId}/${format}`, {
        headers: { "x-auth-token": token },
        signal: ctrl.signal,
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rapport-${reportId}.${format === "pdf" ? "pdf" : "xlsx"}`
      document.body.appendChild(a)
      a.click()
      // Ensure the browser has time to trigger the download before cleaning up
      setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 0)

      setProgress(p => ({ ...p, [reportId]: 100 }))
      setStatus(s => ({ ...s, [reportId]: "success" }))
      setLastRun(t => ({ ...t, [reportId]: new Date().toLocaleString("fr-FR") }))

      toast({
        title: "Export terminé",
        description: `${prettyReport(reportId)} (${format.toUpperCase()}) a été téléchargé.`,
      })
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setStatus(s => ({ ...s, [reportId]: "canceled" }))
        toast({ title: "Génération annulée", description: prettyReport(reportId), variant: "default" })
      } else {
        setStatus(s => ({ ...s, [reportId]: "error" }))
        toast({
          title: "Erreur d’export",
          description: `Impossible de générer ${prettyReport(reportId)} (${format.toUpperCase()}).`,
          variant: "destructive",
        })
      }
    } finally {
      // small settle time then reset progress bar if not loading
      setTimeout(() => setProgress(p => ({ ...p, [reportId]: status[reportId] === "loading" ? p[reportId] : 0 })), 800)
      delete controllers.current[key]
    }
  }

  const cancelExport = (reportId: ReportId) => {
    (["pdf", "excel"] as Format[]).forEach(format => controllers.current[`${reportId}-${format}`]?.abort())
  }

  const generatingSome = useMemo(() => Object.values(status).some(s => s === "loading"), [status])

  const handleGenerateAll = async (format: Format) => {
    for (const r of REPORTS) {
      await handleExport(r.id, format)
    }
  }

  const downloadCustomReport = async (type: string, format: Format) => {
    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`${API_BASE_URL}/api/rapports/custom/${type}/${format}`, {
        headers: { "x-auth-token": token },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}.${format === "pdf" ? "pdf" : "xlsx"}`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 0)
      toast({
        title: "Export terminé",
        description: `Rapport ${type} (${format.toUpperCase()}) téléchargé.`,
      })
    } catch {
      toast({
        title: "Erreur d’export",
        description: `Impossible de générer le rapport ${type}.`,
        variant: "destructive",
      })
    }
  }

  const validateExcel = (f: File) => {
    const okType = /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|\.xlsx$/i
    const ok = okType.test(f.type) || f.name.toLowerCase().endsWith(".xlsx")
    const under5mb = f.size <= 5 * 1024 * 1024
    return ok && under5mb
  }

  const handleImport = async () => {
    if (!file) return
    if (!validateExcel(file)) {
      toast({
        title: "Fichier invalide",
        description: "Seuls les fichiers .xlsx jusqu’à 5 Mo sont acceptés.",
        variant: "destructive",
      })
      return
    }
    setImporting(true)
    try {
      const token = localStorage.getItem("token") || ""
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${API_BASE_URL}/api/traitements/import`, {
        method: "POST",
        headers: { "x-auth-token": token },
        body: formData,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFile(null)
      toast({ title: "Import réussi", description: `${file.name} a été importé.` })
    } catch {
      toast({
        title: "Erreur d’import",
        description: "Vérifiez le format du fichier et réessayez.",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  function prettyReport(id: ReportId) {
    return REPORTS.find(r => r.id === id)?.title ?? id
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rapports & Exports</h1>
            <p className="text-muted-foreground">Générez et exportez vos rapports RGPD</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Dernière visite : {new Date().toLocaleDateString("fr-FR")}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <span aria-live="polite">
                  {generatingSome ? (
                    <Badge className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Génération…
                    </Badge>
                  ) : (
                    <Badge className="gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Prêt
                    </Badge>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>État global de la page</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => handleGenerateAll("pdf")}
                disabled={generatingSome}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Tout générer (PDF)
              </Button>
            </TooltipTrigger>
            <TooltipContent>Génère chaque rapport l’un après l’autre</TooltipContent>
          </Tooltip>
          <Button
            variant="outline"
            onClick={() => handleGenerateAll("excel")}
            disabled={generatingSome}
          >
            <Download className="mr-2 h-4 w-4" />
            Tout générer (Excel)
          </Button>
        </div>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORTS.map(({ id, title, description, Icon, color }) => {
            const st = status[id]
            const isLoading = st === "loading"
            const isError = st === "error"
            const isOk = st === "success"
            const isCanceled = st === "canceled"
            const lr = lastRun[id]

            return (
              <Card key={id} className="relative overflow-hidden">
                {/* subtle loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm text-muted-foreground">Génération en cours…</span>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {progress[id] > 0 && (
                    <Progress value={progress[id]} aria-label={`Progression ${title}`} />
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="justify-start bg-transparent"
                      onClick={() => handleExport(id, "pdf")}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                      {isLoading ? "Génération..." : "Exporter en PDF"}
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start bg-transparent"
                      onClick={() => handleExport(id, "excel")}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                      {isLoading ? "Génération..." : "Exporter en Excel"}
                    </Button>

                    {isLoading && (
                      <Button variant="ghost" onClick={() => cancelExport(id)}>
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {isOk && (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-muted-foreground">Dernier export : {lr}</span>
                      </>
                    )}
                    {isError && (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-muted-foreground">Une erreur est survenue</span>
                      </>
                    )}
                    {isCanceled && <span className="text-muted-foreground">Génération annulée</span>}
                    {!isOk && !isError && !isCanceled && lr && (
                      <span className="text-muted-foreground">Dernier export : {lr}</span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Badge variant="outline">{prettyReport(id)}</Badge>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Import Excel */}
        <Card>
          <CardHeader>
            <CardTitle>Importer un fichier Excel</CardTitle>
            <CardDescription>Ajoutez des traitements depuis un fichier .xlsx (max 5 Mo)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Input
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <Badge variant="secondary" className="max-w-full truncate">
                  {file.name}
                </Badge>
              )}
              <Button onClick={handleImport} disabled={!file || importing} className="sm:ml-auto">
                {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {importing ? "Import..." : "Importer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom reports (kept simple, consistent) */}
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadCustomReport("pole", "pdf")}>
                    <Download className="mr-2 h-4 w-4" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadCustomReport("pole", "excel")}>
                    <Download className="mr-2 h-4 w-4" /> Excel
                  </Button>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Suivi des Mesures</h3>
                <p className="text-sm text-muted-foreground mb-4">État d'avancement des mesures correctives</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadCustomReport("suivi", "pdf")}>
                    <Download className="mr-2 h-4 w-4" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadCustomReport("suivi", "excel")}>
                    <Download className="mr-2 h-4 w-4" /> Excel
                  </Button>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Automatic scheduling (UX polish) */}
        <Card>
          <CardHeader>
            <CardTitle>Rapports Automatiques</CardTitle>
            <CardDescription>Configurez la génération automatique de rapports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Rapport mensuel de conformité</h4>
                <p className="text-sm text-muted-foreground">Envoyé le 1er de chaque mois</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={autoMonthly ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>{autoMonthly ? "Actif" : "Inactif"}</Badge>
                <Switch checked={autoMonthly} onCheckedChange={setAutoMonthly} aria-label="Activer le rapport mensuel" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Alerte risques critiques</h4>
                <p className="text-sm text-muted-foreground">Envoyé en cas de nouveau risque critique</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={autoCritical ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>{autoCritical ? "Actif" : "Inactif"}</Badge>
                <Switch checked={autoCritical} onCheckedChange={setAutoCritical} aria-label="Activer l’alerte risques" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
