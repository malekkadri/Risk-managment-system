"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Edit, Trash2, UserPlus, Shield, UsersIcon } from "lucide-react"
import { UserDialog } from "@/components/user-dialog"
import { useRoleGuard } from "@/hooks/useRoleGuard"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const role = useRoleGuard(["admin", "dpo", "super admin", "responsable du traitement", "sous traitant"])

  useEffect(() => {
    if (role) {
      fetchUsers()
    }
  }, [role])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const normalizeSingleRole = (roleValue: string | null | undefined) => {
    if (!roleValue) {
      return ""
    }

    const base = roleValue
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    if (!base) {
      return ""
    }

    if (base === "dpo") {
      return "dpo"
    }

    if (base === "admin" || base === "administrateur" || base === "administratrice") {
      return "admin"
    }

    if (base === "superadmin" || (base.includes("super") && base.includes("admin"))) {
      return "super admin"
    }

    if (base.includes("responsable") && base.includes("traitement")) {
      return "responsable du traitement"
    }

    if (base.includes("sous") && base.includes("traitant")) {
      return "sous traitant"
    }

    return base
  }

  const roleLabels: Record<string, string> = {
    dpo: "DPO",
    admin: "Admin",
    "super admin": "Super Admin",
    "responsable du traitement": "Responsables du traitement",
    "sous traitant": "Sous-traitant",
  }

  const getRoleDisplayLabel = (normalized: string, raw: string) => {
    if (normalized && roleLabels[normalized]) {
      return roleLabels[normalized]
    }

    const base = (normalized || raw || "").toString().trim()

    if (!base) {
      return ""
    }

    return base.replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const parseRoleEntries = (roleValue: string | null | undefined) => {
    if (!roleValue) {
      return []
    }

    const sanitized = roleValue
      .toString()
      .replace(/[–—]/g, "-")
      .replace(/\s*[-]\s*/g, ",")

    const segments = sanitized
      .split(/[,/;|]/)
      .flatMap((part) => part.split(/\bet\b|\bou\b|&/gi))
      .map((segment) => segment.trim())
      .filter(Boolean)

    return segments.map((segment) => {
      const normalized = normalizeSingleRole(segment)
      return {
        normalized,
        label: getRoleDisplayLabel(normalized, segment),
      }
    })
  }

  const normalizeRole = (roleValue: string | null | undefined) => {
    const entries = parseRoleEntries(roleValue)
    const priorities = [
      "super admin",
      "admin",
      "dpo",
      "responsable du traitement",
      "sous traitant",
    ]

    for (const priority of priorities) {
      if (entries.some((entry) => entry.normalized === priority)) {
        return priority
      }
    }

    return entries[0]?.normalized || ""
  }

  const normalizedCurrentRole = normalizeRole(role)
  const canManageUsers = ["admin", "dpo", "super admin"].includes(normalizedCurrentRole)

  const roleCounts = users.reduce((acc, user) => {
    parseRoleEntries(user.role).forEach(({ normalized }) => {
      if (!normalized) {
        return
      }

      acc[normalized] = (acc[normalized] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const dpoCount = roleCounts["dpo"] || 0
  const adminCount = roleCounts["admin"] || 0
  const superAdminCount = roleCounts["super admin"] || 0
  const responsablesCount = roleCounts["responsable du traitement"] || 0
  const sousTraitantCount = roleCounts["sous traitant"] || 0

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { "x-auth-token": token || "" },
      })
      if (res.ok) {
        const data = await res.json()
        const formatted = data.map((user: any) => ({
          ...user,
          role: user.role || "",
          actif: Boolean(user.actif),
        }))
        setUsers(formatted)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          (u.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredUsers(filtered)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token || "" },
        })
        if (res.ok) {
          fetchUsers()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const renderRoleBadges = (roleValue: string | null | undefined) => {
    const entries = parseRoleEntries(roleValue)

    if (entries.length === 0) {
      return <Badge variant="secondary">—</Badge>
    }

    return (
      <div className="flex flex-wrap gap-1">
        {entries.map(({ normalized, label }, index) => {
          const key = `${normalized || label}-${index}`

          switch (normalized) {
            case "dpo":
              return (
                <Badge key={key} className="bg-purple-100 text-purple-800">
                  <Shield className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              )
            case "admin":
              return (
                <Badge key={key} className="bg-blue-100 text-blue-800">
                  <UsersIcon className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              )
            case "super admin":
              return (
                <Badge key={key} className="bg-red-100 text-red-800">
                  <Shield className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              )
            case "responsable du traitement":
              return (
                <Badge key={key} className="bg-green-100 text-green-800">
                  {label}
                </Badge>
              )
            case "sous traitant":
              return (
                <Badge key={key} className="bg-gray-100 text-gray-800">{label}</Badge>
              )
            default:
              return (
                <Badge key={key} variant="secondary">
                  {label || "—"}
                </Badge>
              )
          }
        })}
      </div>
    )
  }

  const getStatusBadge = (actif: boolean) => {
    return actif ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
    )
  }

  const getInitials = (nom: string) => {
    if (!nom) {
      return ""
    }

    return nom
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les accès et les rôles de votre équipe</p>
        </div>
        {canManageUsers && (
          <Button onClick={() => setShowDialog(true)} className="shadow-lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel Utilisateur
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DPO</p>
                <p className="text-2xl font-bold">{dpoCount}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Super Admins</p>
                <p className="text-2xl font-bold">{superAdminCount}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Responsables du traitement &amp; Sous-traitants
                </p>
                <p className="text-2xl font-bold">{responsablesCount + sousTraitantCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {responsablesCount} responsables • {sousTraitantCount} sous-traitants
                </p>
              </div>
              <UsersIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="mr-2 h-5 w-5" />
            Utilisateurs ({filteredUsers.length})
          </CardTitle>
          <CardDescription>Liste de tous les utilisateurs avec leurs rôles et statuts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(user.nom)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.nom}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{renderRoleBadges(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(Boolean(user.actif))}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.cree_le).toLocaleDateString("fr-FR")}
                  </TableCell>
                  {canManageUsers && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setShowDialog(true)
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canManageUsers && (
        <UserDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          user={editingUser}
          onSuccess={() => {
            fetchUsers()
            setShowDialog(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}
