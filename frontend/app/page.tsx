"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  Award,
  Star,
  Brain,
  Rocket,
  Shield,
  BarChart3,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "IA Avancée",
      description: "Intelligence artificielle de pointe pour l'analyse prédictive des risques RGPD",
      color: "bg-emerald-500",
    },
    {
      icon: Rocket,
      title: "Performance Ultra",
      description: "Traitement en temps réel avec des insights instantanés et précis",
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      title: "Automatisation",
      description: "Workflows intelligents qui s'adaptent à votre organisation",
      color: "bg-yellow-500",
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Chiffrement militaire et conformité aux standards internationaux",
      color: "bg-purple-500",
    },
  ]

  const benefits = [
    { icon: Rocket, text: "Déploiement instantané en 60 secondes" },
    { icon: Brain, text: "IA propriétaire avec 99.8% de précision" },
    { icon: BarChart3, text: "Dashboards prédictifs en temps réel" },
    { icon: Lock, text: "Sécurité quantique et zero-trust" },
    { icon: Zap, text: "Performance sub-milliseconde" },
    { icon: Award, text: "Support premium 24/7/365" },
  ]

  const stats = [
    { number: "99.9%", label: "Uptime SLA", icon: TrendingUp },
    { number: "1500+", label: "Entreprises", icon: Users },
    { number: "24/7", label: "Support Expert", icon: Award },
    { number: "100%", label: "Conformité", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">SBA Compta</div>
                <div className="text-xs text-purple-600 font-semibold">RGPD INTELLIGENCE</div>
              </div>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/login">
                <Sparkles className="mr-2 h-4 w-4" />
                Accès Plateforme
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Brain className="w-4 h-4 mr-2" />
              IA RÉVOLUTIONNAIRE • NOUVELLE GÉNÉRATION
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RGPD RÉVOLUTION
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              L'intelligence artificielle au service de votre conformité RGPD.
              <span className="text-purple-600 font-semibold"> Automatisez, analysez, protégez</span> - tout devient
              possible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
              >
                <Link href="/login">
                  <Rocket className="mr-2 h-5 w-5" />
                  Démarrer l'Aventure
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Globe className="mr-2 h-5 w-5" />
                Découvrir la Démo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/60 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Lock className="w-4 h-4 mr-2" />
              TECHNOLOGIE QUANTIQUE • SÉCURITÉ ABSOLUE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Fonctionnalités
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Révolutionnaires
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment notre IA propriétaire transforme radicalement la gestion RGPD
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 bg-green-100 text-green-700 hover:bg-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                AVANTAGES EXCLUSIFS • PREMIUM
              </Badge>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Pourquoi choisir
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  SBA Compta ?
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                Notre plateforme révolutionnaire combine IA quantique, automatisation totale et expertise RGPD pour une
                conformité sans effort.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Link href="/login">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Essai Gratuit Premium
                </Link>
              </Button>
            </div>

            <div>
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Conformité Garantie</h3>
                  <p className="text-gray-600 mb-6">
                    Notre IA propriétaire analyse en continu vos traitements avec une précision de 99.8% et vous alerte
                    instantanément.
                  </p>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
                    <div className="text-green-700 font-medium">Taux de conformité client</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
            <Zap className="w-4 h-4 mr-2" />
            OFFRE LIMITÉE • ACCÈS VIP
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Prêt à révolutionner votre RGPD ?</h2>

          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Rejoignez l'élite des entreprises qui ont choisi l'excellence avec SBA Compta RGPD Intelligence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
              <Link href="/login">
                <Rocket className="mr-2 h-5 w-5" />
                Commencer l'Aventure
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              Expert Dédié
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">SBA Compta</div>
              <div className="text-sm text-purple-400 font-semibold">RGPD INTELLIGENCE</div>
            </div>
          </div>
          <div className="text-center text-gray-400">
            <p className="mb-2">&copy; 2025 SBA Compta. Tous droits réservés.</p>
            <p className="text-purple-400 font-medium">L'avenir de la conformité RGPD commence ici</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
