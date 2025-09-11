# Guide d'Installation - SBA Compta RGPD Intelligence

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18.0.0 ou supérieure
- **npm** version 8.0.0 ou supérieure

### Vérification des versions
Ouvrez votre invite de commande (CMD) ou PowerShell et exécutez :
\`\`\`bash
node --version  # Doit être >= v18.0.0
npm --version   # Doit être >= 8.0.0
\`\`\`

## 🚀 Installation du Frontend

### 1. Téléchargement du projet
Si vous avez téléchargé le projet sous forme de fichier ZIP, décompressez-le.
Si vous utilisez Git, clonez le dépôt :
\`\`\`bash
git clone <votre-repo-url>
cd smart-dpo-app
\`\`\`

### 2. Navigation vers le dossier frontend
\`\`\`bash
cd frontend
\`\`\`

### 3. Installation des dépendances
Dans le dossier `frontend`, exécutez la commande suivante :
\`\`\`bash
npm install
\`\`\`

### 4. Configuration de l'environnement
Créez un fichier nommé `.env.local` dans le dossier `frontend`. Vous pouvez le faire manuellement ou via la commande :
\`\`\`bash
# Dans l'invite de commande (CMD)
copy .env.example .env.local

# Ou dans PowerShell
Copy-Item .env.example .env.local
\`\`\`

Ouvrez le fichier `.env.local` avec un éditeur de texte (comme Notepad, VS Code, etc.) et ajoutez le contenu suivant :
\`\`\`env
# Configuration Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001


# Configuration de développement
NODE_ENV=development
\`\`\`

### 5. Lancement du serveur de développement
Dans le dossier `frontend`, exécutez la commande suivante :
\`\`\`bash
npm run dev
\`\`\`

Le frontend sera accessible sur : **http://localhost:3000**

## 🔧 Scripts Disponibles

Voici les commandes que vous pouvez utiliser dans le dossier `frontend` :

\`\`\`bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile l'application pour la production
npm run start        # Lance l'application en mode production

# Maintenance
npm run lint         # Vérifie le code avec ESLint
npm run lint:fix     # Corrige automatiquement les problèmes ESLint
npm run type-check   # Vérifie les types TypeScript
npm run clean        # Nettoie les dossiers de build et de cache
npm run analyze      # Analyse la taille du bundle (nécessite ANALYZE=true dans .env.local)
\`\`\`

## 📁 Structure du Projet

\`\`\`
frontend/
├── app/                    # Pages Next.js 14 (App Router)
│   ├── dashboard/         # Pages du dashboard
│   ├── login/            # Page de connexion
│   ├── globals.css       # Styles globaux
│   ├── layout.tsx        # Layout principal
│   ├── not-found.tsx     # Page 404 personnalisée
│   └── page.tsx          # Page d'accueil
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI (shadcn/ui)
│   └── *.tsx            # Composants métier
├── lib/                 # Utilitaires et configurations
├── hooks/               # Hooks React personnalisés
├── styles/              # Fichiers CSS additionnels
├── public/              # Assets statiques
├── .env.example         # Exemple de fichier d'environnement
├── .gitignore           # Fichiers à ignorer par Git
├── next.config.mjs      # Configuration Next.js
├── package.json         # Dépendances et scripts
└── tsconfig.json        # Configuration TypeScript
\`\`\`

## 🛠️ Résolution des Problèmes Courants

### Erreur : "Module not found"
\`\`\`bash
# Supprimer node_modules et package-lock.json (ou yarn.lock/pnpm-lock.yaml)
rmdir /s /q node_modules
del package-lock.json
npm install
\`\`\`

### Erreur de port déjà utilisé
\`\`\`bash
# Changer le port (par défaut 3000)
npm run dev -- -p 3001
\`\`\`

### Erreurs TypeScript
\`\`\`bash
# Vérifier les types
npm run type-check

# Ignorer temporairement (non recommandé pour la production)
# Modifiez next.config.mjs pour ignorer les erreurs TypeScript pendant le build si nécessaire.
\`\`\`

### Problèmes de cache
\`\`\`bash
# Nettoyer le cache Next.js
rmdir /s /q .next
npm run dev
\`\`\`

## 🔍 Vérification de l'Installation

Une fois le serveur lancé, vérifiez que :

1. ✅ La page d'accueil se charge sur `http://localhost:3000`
2. ✅ Le design s'affiche correctement
3. ✅ Les boutons de navigation fonctionnent
4. ✅ Aucune erreur dans la console du navigateur (F12)
5. ✅ La page de login est accessible via le bouton "Accès Plateforme"

## 📱 Test sur Mobile

Pour tester sur mobile/tablette sur votre réseau local :

1. Trouvez l'adresse IP de votre machine Windows. Ouvrez l'invite de commande et tapez `ipconfig`. Cherchez l'adresse IPv4 de votre adaptateur réseau (ex: `192.168.1.X`).
2. Sur votre appareil mobile, ouvrez un navigateur et accédez à `http://[VOTRE-IP]:3000` (remplacez `[VOTRE-IP]` par l'adresse IP trouvée).

## 🚀 Déploiement

### Vercel (Recommandé)
\`\`\`bash
# Installer Vercel CLI
npm install -g vercel

# Déployer (suivez les instructions)
vercel --prod
\`\`\`

### Build local pour production
\`\`\`bash
npm run build
npm run start
\`\`\`

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans le terminal où vous avez lancé `npm run dev`.
2. Consultez la console du navigateur (F12).
3. Assurez-vous que toutes les dépendances sont installées (`npm install`).
4. Vérifiez que le port 3000 (ou celui que vous utilisez) est libre.

## 🔄 Mise à Jour

Pour mettre à jour les dépendances du projet :

\`\`\`bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour toutes les dépendances vers leurs dernières versions compatibles
npm update

# Pour les mises à jour majeures (peut introduire des breaking changes)
# npm install -g npm-check-updates
# ncu -u
# npm install
\`\`\`
