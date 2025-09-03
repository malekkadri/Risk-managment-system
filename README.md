# Smart DPO - Application de Gestion RGPD

Une application complète de gestion intelligente des risques RGPD pour les traitements de données à caractère personnel.

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
smart-dpo/
├── database/           # Scripts SQL et schéma de base
├── backend/           # API Node.js/Express
│   ├── routes/        # Routes API
│   ├── services/      # Services métier
│   └── middleware/    # Middlewares d'authentification
└── frontend/          # Interface Next.js/React
    ├── app/           # Pages de l'application
    └── components/    # Composants réutilisables
\`\`\`

## 🛠️ Installation

### Prérequis
- Node.js 18+
- MySQL 8.0+
- WAMP/XAMPP (pour le développement local)

### 1. Base de Données
\`\`\`bash
# Importer le schéma dans MySQL
mysql -u root -p smart_dpo < database/schema.sql
\`\`\`

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
