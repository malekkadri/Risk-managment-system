"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles, Lock, Mail, Zap } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("jean.dupont@example.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.msg || "Échec de la connexion")
      }

      const { token, user } = await res.json()
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
          <CardHeader className="text-center pb-8">
            {/* Logo with animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <Image src="/images/sba-logo.png" alt="SBA Compta" width={56} height={56} className="rounded-2xl" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <CardTitle className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Bienvenue sur
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SBA Compta RGPD
              </span>
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Accédez à votre plateforme d'intelligence RGPD
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-purple-400" />
                  Adresse email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-purple-400" />
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-500/20 border-red-500/30 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <>
                    <Zap className="mr-3 h-5 w-5" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center mb-3">
                <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
                <h4 className="font-semibold text-blue-200">Compte de démonstration</h4>
              </div>
              <div className="text-sm text-blue-100 space-y-2">
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-2 text-blue-300" />
                  <span className="font-mono">jean.dupont@example.com</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-3 h-3 mr-2 text-blue-300" />
                  <span className="font-mono">password123</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <Button variant="link" className="text-purple-300 hover:text-purple-200 text-sm">
                Mot de passe oublié ?
              </Button>
              <div className="text-xs text-gray-400">
                Besoin d'aide ?
                <Button variant="link" className="text-purple-300 hover:text-purple-200 text-xs p-0 ml-1 h-auto">
                  Contactez le support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-400 mb-2">© 2025 SBA Compta. Tous droits réservés.</div>
          <div className="text-xs text-purple-300">L'avenir de la conformité RGPD</div>
        </div>
      </div>
    </div>
  )
}
