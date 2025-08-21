"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Bell,
  Shield,
  Database,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      criticalAlerts: true,
      weeklyReports: false,
      monthlyReports: true,
    },
    security: {
      sessionTimeout: "30",
      passwordExpiry: "90",
      twoFactorAuth: false,
      loginAttempts: "5",
    },
    system: {
      language: "fr",
      timezone: "Europe/Paris",
      dateFormat: "DD/MM/YYYY",
      autoBackup: true,
      backupFrequency: "daily",
    },
    gdpr: {
      dataRetention: "7",
      anonymization: true,
      consentTracking: true,
      rightToErasure: true,
    },
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  useRoleGuard(["Admin", "DPO", "SuperAdmin"])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Settings className="mr-3 h-8 w-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Configurez votre application Smart DPO</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="shadow-lg">
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? "Sauvegardé" : "Sauvegarder"}
        </Button>
      </div>

      {/* Status Banner */}
      {saved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Paramètres sauvegardés avec succès</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-blue-500" />
              Notifications
            </CardTitle>
            <CardDescription>Gérez vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSetting("notifications", "email", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifications navigateur</Label>
                <p className="text-sm text-muted-foreground">Afficher les notifications dans le navigateur</p>
              </div>
              <Switch
                checked={settings.notifications.browser}
                onCheckedChange={(checked) => updateSetting("notifications", "browser", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Alertes critiques</Label>
                <p className="text-sm text-muted-foreground">Notifications immédiates pour les risques critiques</p>
              </div>
              <Switch
                checked={settings.notifications.criticalAlerts}
                onCheckedChange={(checked) => updateSetting("notifications", "criticalAlerts", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Rapports hebdomadaires</Label>
                <p className="text-sm text-muted-foreground">Résumé hebdomadaire par email</p>
              </div>
              <Switch
                checked={settings.notifications.weeklyReports}
                onCheckedChange={(checked) => updateSetting("notifications", "weeklyReports", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Rapports mensuels</Label>
                <p className="text-sm text-muted-foreground">Rapport de conformité mensuel</p>
              </div>
              <Switch
                checked={settings.notifications.monthlyReports}
                onCheckedChange={(checked) => updateSetting("notifications", "monthlyReports", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-500" />
              Sécurité
            </CardTitle>
            <CardDescription>Paramètres de sécurité et d'authentification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting("security", "sessionTimeout", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Expiration mot de passe (jours)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting("security", "passwordExpiry", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">Sécurité renforcée avec 2FA</p>
              </div>
              <Switch
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Tentatives de connexion max</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => updateSetting("security", "loginAttempts", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-500" />
              Système
            </CardTitle>
            <CardDescription>Configuration générale du système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                value={settings.system.language}
                onValueChange={(value) => updateSetting("system", "language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select
                value={settings.system.timezone}
                onValueChange={(value) => updateSetting("system", "timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Format de date</Label>
              <Select
                value={settings.system.dateFormat}
                onValueChange={(value) => updateSetting("system", "dateFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">Sauvegarde automatique des données</p>
              </div>
              <Switch
                checked={settings.system.autoBackup}
                onCheckedChange={(checked) => updateSetting("system", "autoBackup", checked)}
              />
            </div>
            {settings.system.autoBackup && (
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                <Select
                  value={settings.system.backupFrequency}
                  onValueChange={(value) => updateSetting("system", "backupFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GDPR */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-purple-500" />
              RGPD
            </CardTitle>
            <CardDescription>Paramètres de conformité RGPD</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Rétention des données (années)</Label>
              <Input
                id="dataRetention"
                type="number"
                value={settings.gdpr.dataRetention}
                onChange={(e) => updateSetting("gdpr", "dataRetention", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Durée de conservation par défaut des données</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Anonymisation automatique</Label>
                <p className="text-sm text-muted-foreground">Anonymiser les données expirées</p>
              </div>
              <Switch
                checked={settings.gdpr.anonymization}
                onCheckedChange={(checked) => updateSetting("gdpr", "anonymization", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Suivi des consentements</Label>
                <p className="text-sm text-muted-foreground">Traçabilité des consentements utilisateurs</p>
              </div>
              <Switch
                checked={settings.gdpr.consentTracking}
                onCheckedChange={(checked) => updateSetting("gdpr", "consentTracking", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Droit à l'effacement</Label>
                <p className="text-sm text-muted-foreground">Permettre la suppression des données</p>
              </div>
              <Switch
                checked={settings.gdpr.rightToErasure}
                onCheckedChange={(checked) => updateSetting("gdpr", "rightToErasure", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Info className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Version</h3>
                <p className="text-sm text-blue-700">Smart DPO v1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Statut</h3>
                <p className="text-sm text-green-700">Système opérationnel</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Maintenance</h3>
                <p className="text-sm text-orange-700">Prochaine: 15/02/2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
