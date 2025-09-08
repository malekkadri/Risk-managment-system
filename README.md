# risk managment- Application de Gestion RGPD

Une application complète de gestion intelligente des risques RGPD pour les traitements de données à caractère personnel.

## 📘 Description du Projet
risk managmentcentralise la cartographie des traitements, l'évaluation des risques et le suivi des mesures correctives.
La plateforme accompagne les Riskadminet responsables de traitement grâce à des tableaux de bord en temps réel et des
alertes proactives pour garantir la conformité au RGPD.

## 🚀 Fonctionnalités

### ✅ Implémentées
- **UC01**: Authentification et gestion des rôles (dpo, super admin, admin, responsable du traitement, sous traitant)
- **UC02**: CRUD complet des traitements RGPD
- **UC03**: Évaluation automatique des risques RGPD
- **UC04**: Tableaux de bord avec visualisations par pôle, criticité, base légale
- **UC05**: Gestion des mesures correctives avec suivi
- **UC06**: Export de rapports (PDF et Excel)
- **UC07**: Journal complet des actions
- **UC08**: Filtrage avancé des traitements sensibles

### 📊 Tableaux de Bord
- Vue d'ensemble de la conformité RGPD
- Graphiques de répartition des risques
- Évolution temporelle des traitements
- Alertes en temps réel

### 🔔 Système d'Alertes
- Détection automatique des risques critiques
- Notifications pour les échéances de mesures correctives
- Alertes de non-conformité

### 📈 Rapports et Analytics
- Rapport de conformité RGPD
- Analyse des risques par criticité
- Plan des mesures correctives avec suivi de l'échéance
- Export PDF et Excel
- Rapports automatiques programmés

## 🏗️ Architecture

\`\`\`
risk-managment/
├── database/           # Scripts SQL et schéma de base
├── backend/           # API Node.js/Express
│   ├── routes/        # Routes API
│   ├── services/      # Services métier
│   └── middleware/    # Middlewares d'authentification
└── frontend/          # Interface Next.js/React
    ├── app/           # Pages de l'application
    └── components/    # Composants réutilisables
\`\`\`

## ⚙️ Description Technique des Modules
- **database/** : scripts SQL MySQL définissant le schéma et les données de référence.
- **backend/** : API REST Node.js/Express gérant l'authentification, la logique métier, l'évaluation des risques et les exports.
- **frontend/** : application Next.js/React en TypeScript avec Tailwind CSS et Recharts pour les tableaux de bord interactifs.
- **scripts/** : utilitaires d'automatisation pour l'import Excel et d'autres tâches.
- **public/** : ressources statiques partagées (images, icônes, etc.).

### 🛣️ Routes API principales

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Authentifier un utilisateur et renvoyer un jeton JWT |
| `GET` | `/api/users` | Lister les utilisateurs (admin, dpo, super admin) |
| `POST` | `/api/users` | Créer un utilisateur |
| `PUT` | `/api/users/:id` | Mettre à jour un utilisateur |
| `GET` | `/api/traitements` | Rechercher et lister les traitements avec filtres |
| `GET` | `/api/traitements/:id` | Récupérer le détail d’un traitement |
| `POST` | `/api/traitements` | Créer un traitement et évaluer le risque |
| `PUT` | `/api/traitements/:id` | Mettre à jour un traitement |
| `DELETE` | `/api/traitements/:id` | Supprimer un traitement |
| `POST` | `/api/traitements/import` | Importer des traitements depuis un fichier Excel |
| `GET` | `/api/risques` | Lister les risques associés à un traitement |
| `POST` | `/api/risques` | Ajouter un risque |
| `PUT` | `/api/risques/:id` | Mettre à jour un risque |
| `GET` | `/api/mesures` | Lister les mesures correctives |
| `POST` | `/api/mesures` | Créer une mesure corrective |
| `PUT` | `/api/mesures/:id` | Mettre à jour une mesure |
| `GET` | `/api/journal` | Historique des actions (audit trail) |
| `GET` | `/api/alertes` | Lister les alertes générées automatiquement |
| `PUT` | `/api/alertes/:id` | Marquer une alerte comme résolue ou modifier son statut |
| `GET` | `/api/rapports/conformite` | Générer un rapport de conformité JSON |
| `GET` | `/api/rapports/conformite/:format` | Exporter le rapport de conformité (`pdf`/`excel`) |
| `GET` | `/api/rapports/risques/:format` | Exporter l’analyse des risques |
| `GET` | `/api/rapports/activite/:format` | Exporter le journal d’activité |
| `GET` | `/api/rapports/mesures/:format` | Exporter les mesures correctives |
| `GET` | `/api/rapports/custom/pole/:format` | Rapport de conformité par pôle |
| `GET` | `/api/rapports/custom/suivi/:format` | Suivi des mesures correctives |
| `GET` | `/api/dashboard/stats` | Statistiques globales pour le tableau de bord |
| `GET` | `/api/dashboard/evolution` | Évolution temporelle des traitements |

Toutes les routes protégées utilisent les middlewares `auth` et `authorize` pour assurer la sécurité des accès.

## 🛠️ Installation

### Prérequis
- Node.js 18+
- MySQL 8.0+
- WAMP/XAMPP (pour le développement local)

### 1. Base de Données
```bash
# Importer le schéma et les paramètres d'application
mysql -u root -p smart_Riskadmin< database/schema.sql
# Pour les installations existantes, initialiser la table ApplicationSettings
mysql -u root -p smart_Riskadmin< database/add_app_name_setting.sql
```

### 2. Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm start

# Importer les traitements depuis l'Excel (optionnel)
npm run import:excel
\`\`\`

### 3. Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🔧 Configuration

### Variables d'Environnement Backend (.env)
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_dpo
JWT_SECRET=votre_cle_secrete_jwt
PORT=3001
\`\`\`
### Personnalisation du nom de l'application
Le nom affiché dans l'interface (par défaut "Smart DPO") est stocké dans la table `ApplicationSettings`. Vous pouvez le modifier depuis la page **Paramètres** ou via l'endpoint `PUT /api/settings/app-name`.

### Accès par Défaut
- **Email**: jean.dupont@example.com
- **Mot de passe**: password123
- **Rôle**: dpo

## 📋 Cas d'Usage Implémentés

| UC | Description | Statut |
|----|-------------|--------|
| UC01 | Authentification et autorisation | ✅ |
| UC02 | Gestion des traitements RGPD | ✅ |
| UC03 | Évaluation automatique des risques | ✅ |
| UC04 | Tableaux de bord et visualisations | ✅ |
| UC05 | Mesures correctives et suivi | ✅ |
| UC06 | Export de rapports (PDF/Excel) | ✅ |
| UC07 | Journal des actions | ✅ |
| UC08 | Filtrage des traitements sensibles | ✅ |

## 🎯 Fonctionnalités Avancées

### Évaluation Automatique des Risques
- Calcul automatique basé sur les critères RGPD
- Score de risque dynamique (Criticité × Probabilité × Impact)
- Classification automatique (Critique, Élevé, Moyen, Faible)

### Système d'Alertes Intelligent
- Vérification automatique toutes les heures
- Détection des traitements non conformes
- Suivi des échéances de mesures correctives
- Notifications pour les risques critiques

### Tableaux de Bord Interactifs
- Graphiques en temps réel avec Recharts
- Filtrage par pôle, statut, base légale
- Évolution temporelle des traitements
- Métriques de conformité

## 🔐 Sécurité

- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Middleware d'autorisation sur toutes les routes sensibles
- Validation des données côté serveur
- Protection contre les injections SQL

## 📊 Base de Données

### Tables Principales
- **Utilisateur**: Gestion des utilisateurs et rôles
- **Traitement**: Registre des traitements RGPD
- **Risque**: Évaluation et suivi des risques
- **MesureCorrective**: Actions de remédiation
- **JournalAction**: Audit trail complet
- **Alerte**: Système de notifications
- **Rapport**: Historique des rapports générés

## 🚀 Déploiement

### Production
1. Configurer une base MySQL en production
2. Déployer le backend sur un serveur Node.js
3. Déployer le frontend sur Vercel/Netlify
4. Configurer les variables d'environnement

### Docker (Optionnel)
\`\`\`bash
# À venir dans une prochaine version
docker-compose up -d
\`\`\`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support technique :
- Email: malek.kadri100@gmail.com
- Issues GitHub: [github.com/malekkadri/Risk-managment-system-/issues](https://github.com/malekkadri/Risk-managment-system-/issues)

---

**Smart DPO** - Votre partenaire pour la conformité RGPD intelligente 🛡️
