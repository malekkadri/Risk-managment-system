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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_BASE_URL } from "@/lib/api"

interface MesureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mesure?: any
  onSuccess: () => void
}

export function MesureDialog({ open, onOpenChange, mesure, onSuccess }: MesureDialogProps) {
  const [risques, setRisques] = useState<any[]>([])
  const [formData, setFormData] = useState({
    risque_id: "",
    description: "",
    type_mesure: "Technique",
    priorite: "Moyenne",
    statut: "À faire",
    responsable_id: "",
    date_echeance: "",
    cout_estime: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRisques()
  }, [])

  useEffect(() => {
    if (mesure) {
      setFormData({
        risque_id: mesure.risque_id?.toString() || "",
        description: mesure.description || "",
        type_mesure: mesure.type_mesure || "Technique",
        priorite: mesure.priorite || "Moyenne",
        statut: mesure.statut || "À faire",
        responsable_id: mesure.responsable_id?.toString() || "",
        date_echeance: mesure.date_echeance ? mesure.date_echeance.split("T")[0] : "",
        cout_estime: mesure.cout_estime?.toString() || "",
      })
    } else {
      setFormData({
        risque_id: "",
        description: "",
        type_mesure: "Technique",
        priorite: "Moyenne",
        statut: "À faire",
        responsable_id: "",
        date_echeance: "",
        cout_estime: "",
      })
    }
  }, [mesure])

  const fetchRisques = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/risques`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        setRisques(data)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des risques:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const url = mesure
        ? `${API_BASE_URL}/api/mesures/${mesure.id}`
        : `${API_BASE_URL}/api/mesures`

      const method = mesure ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({
          ...formData,
          risque_id: Number.parseInt(formData.risque_id),
          responsable_id: formData.responsable_id ? Number.parseInt(formData.responsable_id) : null,
          cout_estime: formData.cout_estime ? Number.parseFloat(formData.cout_estime) : null,
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mesure ? "Modifier la mesure" : "Nouvelle mesure"}</DialogTitle>
          <DialogDescription>Définissez les actions correctives pour réduire les risques identifiés</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="risque_id">Risque associé *</Label>
            <Select value={formData.risque_id} onValueChange={(v) => setFormData({ ...formData, risque_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un risque" />
              </SelectTrigger>
              <SelectContent>
                {risques.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.nom_traitement} - {r.type_risque}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de mesure</Label>
              <Select
                value={formData.type_mesure}
                onValueChange={(v) => setFormData({ ...formData, type_mesure: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technique">Technique</SelectItem>
                  <SelectItem value="Organisationnelle">Organisationnelle</SelectItem>
                  <SelectItem value="Juridique">Juridique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={formData.priorite} onValueChange={(v) => setFormData({ ...formData, priorite: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basse">Basse</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsable_id">ID Responsable</Label>
              <Input
                id="responsable_id"
                value={formData.responsable_id}
                onChange={(e) => setFormData({ ...formData, responsable_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_echeance">Date d'échéance</Label>
              <Input
                id="date_echeance"
                type="date"
                value={formData.date_echeance}
                onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cout_estime">Coût estimé (€)</Label>
            <Input
              id="cout_estime"
              type="number"
              value={formData.cout_estime}
              onChange={(e) => setFormData({ ...formData, cout_estime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={formData.statut} onValueChange={(v) => setFormData({ ...formData, statut: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="À faire">À faire</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
                <SelectItem value="Reportée">Reportée</SelectItem>
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

