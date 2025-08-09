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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: any
  onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    role: "Collaborateur",
    actif: true,
    mot_de_passe: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        role: user.role || "Collaborateur",
        actif: user.actif !== undefined ? user.actif : true,
        mot_de_passe: "",
      })
    } else {
      setFormData({
        nom: "",
        email: "",
        role: "Collaborateur",
        actif: true,
        mot_de_passe: "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const url = user
        ? `${API_BASE_URL}/api/users/${user.id}`
        : `${API_BASE_URL}/api/users`
      const method = user ? "PUT" : "POST"

      const payload = user
        ? { nom: formData.nom, email: formData.email, role: formData.role, actif: formData.actif }
        : formData

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify(payload),
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
          <DialogDescription>
            {user ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom complet *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DPO">DPO</SelectItem>
                <SelectItem value="Admin">Administrateur</SelectItem>
                <SelectItem value="Collaborateur">Collaborateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="mot_de_passe">Mot de passe *</Label>
              <Input
                id="mot_de_passe"
                type="password"
                value={formData.mot_de_passe}
                onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                required={!user}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="actif">Compte actif</Label>
            <Switch
              id="actif"
              checked={formData.actif}
              onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
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
