"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface TraitementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  traitement?: any
  onSuccess: () => void
}

export function TraitementDialog({ open, onOpenChange, traitement, onSuccess }: TraitementDialogProps) {
  const [formData, setFormData] = useState({
    nom: "",
    pole: "",
    base_legale: "",
    finalite: "",
    duree_conservation: "",
    type_dcp: "",
    nombre_personnes_concernees: "",
    transfert_hors_ue: false,
    mesures_securite: "",
    statut_conformite: "À vérifier",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (traitement) {
      setFormData({
        nom: traitement.nom || "",
        pole: traitement.pole || "",
        base_legale: traitement.base_legale || "",
        finalite: traitement.finalite || "",
        duree_conservation: traitement.duree_conservation?.toString() || "",
        type_dcp: traitement.type_dcp || "",
        nombre_personnes_concernees: traitement.nombre_personnes_concernees?.toString() || "",
        transfert_hors_ue: traitement.transfert_hors_ue || false,
        mesures_securite: traitement.mesures_securite || "",
        statut_conformite: traitement.statut_conformite || "À vérifier",
      })
    } else {
      setFormData({
        nom: "",
        pole: "",
        base_legale: "",
        finalite: "",
        duree_conservation: "",
        type_dcp: "",
        nombre_personnes_concernees: "",
        transfert_hors_ue: false,
        mesures_securite: "",
        statut_conformite: "À vérifier",
      })
    }
  }, [traitement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const url = traitement
        ? `${API_BASE_URL}/api/traitements/${traitement.id}`
        : `${API_BASE_URL}/api/traitements`

      const method = traitement ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          ...formData,
          duree_conservation: Number.parseInt(formData.duree_conservation) || 0,
          nombre_personnes_concernees: Number.parseInt(formData.nombre_personnes_concernees) || 0,
        }),
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{traitement ? "Modifier le traitement" : "Nouveau traitement"}</DialogTitle>
          <DialogDescription>Renseignez les informations du traitement de données personnelles</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du traitement *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pole">Pôle</Label>
              <Select value={formData.pole} onValueChange={(value) => setFormData({ ...formData, pole: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Sécurité">Sécurité</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_legale">Base légale *</Label>
            <Select
              value={formData.base_legale}
              onValueChange={(value) => setFormData({ ...formData, base_legale: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une base légale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consentement">Consentement</SelectItem>
                <SelectItem value="Contrat">Contrat</SelectItem>
                <SelectItem value="Obligation légale">Obligation légale</SelectItem>
                <SelectItem value="Intérêt vital">Intérêt vital</SelectItem>
                <SelectItem value="Mission publique">Mission publique</SelectItem>
                <SelectItem value="Intérêt légitime">Intérêt légitime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalite">Finalité</Label>
            <Textarea
              id="finalite"
              value={formData.finalite}
              onChange={(e) => setFormData({ ...formData, finalite: e.target.value })}
              placeholder="Décrivez la finalité du traitement..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duree_conservation">Durée de conservation (années)</Label>
              <Input
                id="duree_conservation"
                type="number"
                value={formData.duree_conservation}
                onChange={(e) => setFormData({ ...formData, duree_conservation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_personnes_concernees">Nombre de personnes concernées</Label>
              <Input
                id="nombre_personnes_concernees"
                type="number"
                value={formData.nombre_personnes_concernees}
                onChange={(e) => setFormData({ ...formData, nombre_personnes_concernees: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_dcp">Types de données à caractère personnel</Label>
            <Textarea
              id="type_dcp"
              value={formData.type_dcp}
              onChange={(e) => setFormData({ ...formData, type_dcp: e.target.value })}
              placeholder="Ex: Nom, prénom, adresse, email..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mesures_securite">Mesures de sécurité</Label>
            <Textarea
              id="mesures_securite"
              value={formData.mesures_securite}
              onChange={(e) => setFormData({ ...formData, mesures_securite: e.target.value })}
              placeholder="Décrivez les mesures de sécurité mises en place..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="transfert_hors_ue"
              checked={formData.transfert_hors_ue}
              onCheckedChange={(checked) => setFormData({ ...formData, transfert_hors_ue: checked as boolean })}
            />
            <Label htmlFor="transfert_hors_ue">Transfert hors Union Européenne</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut_conformite">Statut de conformité</Label>
            <Select
              value={formData.statut_conformite}
              onValueChange={(value) => setFormData({ ...formData, statut_conformite: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conforme">Conforme</SelectItem>
                <SelectItem value="Non conforme">Non conforme</SelectItem>
                <SelectItem value="À vérifier">À vérifier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
