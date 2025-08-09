"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface RisqueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  risque?: any
  onSuccess: () => void
}

export function RisqueDialog({ open, onOpenChange, risque, onSuccess }: RisqueDialogProps) {
  const [traitements, setTraitements] = useState<any[]>([])
  const [formData, setFormData] = useState({
    traitement_id: "",
    type_risque: "",
    criticite: [3],
    probabilite: [3],
    impact: [3],
    statut: "Identifié",
    vulnerabilites: "",
    commentaire: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTraitements()
  }, [])

  useEffect(() => {
    if (risque) {
      setFormData({
        traitement_id: risque.traitement_id?.toString() || "",
        type_risque: risque.type_risque || "",
        criticite: [risque.criticite || 3],
        probabilite: [risque.probabilite || 3],
        impact: [risque.impact || 3],
        statut: risque.statut || "Identifié",
        vulnerabilites: risque.vulnerabilites || "",
        commentaire: risque.commentaire || "",
      })
    } else {
      setFormData({
        traitement_id: "",
        type_risque: "",
        criticite: [3],
        probabilite: [3],
        impact: [3],
        statut: "Identifié",
        vulnerabilites: "",
        commentaire: "",
      })
    }
  }, [risque])

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const url = risque ? `http://localhost:3001/api/risques/${risque.id}` : "http://localhost:3001/api/risques"

      const method = risque ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          ...formData,
          traitement_id: Number.parseInt(formData.traitement_id),
          criticite: formData.criticite[0],
          probabilite: formData.probabilite[0],
          impact: formData.impact[0],
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

  const scoreRisque = formData.criticite[0] * formData.probabilite[0] * formData.impact[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{risque ? "Modifier le risque" : "Nouveau risque"}</DialogTitle>
          <DialogDescription>Évaluez et documentez un risque RGPD</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="traitement_id">Traitement concerné *</Label>
            <Select
              value={formData.traitement_id}
              onValueChange={(value: string) => setFormData({ ...formData, traitement_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un traitement" />
              </SelectTrigger>
              <SelectContent>
                {traitements.map((traitement) => (
                  <SelectItem key={traitement.id} value={traitement.id.toString()}>
                    {traitement.nom} - {traitement.pole}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_risque">Type de risque *</Label>
            <Select
              value={formData.type_risque}
              onValueChange={(value: string) => setFormData({ ...formData, type_risque: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confidentialité">Confidentialité</SelectItem>
                <SelectItem value="Intégrité">Intégrité</SelectItem>
                <SelectItem value="Disponibilité">Disponibilité</SelectItem>
                <SelectItem value="Conformité">Conformité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Criticité: {formData.criticite[0]}/5</Label>
              <Slider
                value={formData.criticite}
                onValueChange={(value) => setFormData({ ...formData, criticite: value })}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Probabilité: {formData.probabilite[0]}/5</Label>
              <Slider
                value={formData.probabilite}
                onValueChange={(value) => setFormData({ ...formData, probabilite: value })}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Impact: {formData.impact[0]}/5</Label>
              <Slider
                value={formData.impact}
                onValueChange={(value) => setFormData({ ...formData, impact: value })}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium">Score de risque calculé</Label>
            <div className="text-2xl font-bold mt-1">
              {scoreRisque}/125
              <span className="text-sm font-normal ml-2">
                ({scoreRisque >= 80 ? "Critique" : scoreRisque >= 60 ? "Élevé" : scoreRisque >= 40 ? "Moyen" : "Faible"}
                )
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Identifié">Identifié</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Traité">Traité</SelectItem>
                <SelectItem value="Résiduel">Résiduel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vulnerabilites">Vulnérabilités identifiées</Label>
            <Textarea
              id="vulnerabilites"
              value={formData.vulnerabilites}
              onChange={(e) => setFormData({ ...formData, vulnerabilites: e.target.value })}
              placeholder="Décrivez les vulnérabilités..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commentaire">Commentaires</Label>
            <Textarea
              id="commentaire"
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              placeholder="Commentaires additionnels..."
            />
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
