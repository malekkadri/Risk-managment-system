#!/bin/bash

echo "🚀 Configuration de SBA Compta RGPD Intelligence"
echo "================================================"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION détectée. Version $REQUIRED_VERSION ou supérieure requise."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION détectée"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version $NPM_VERSION détectée"

# Navigation vers le dossier frontend
echo "📁 Navigation vers le dossier frontend..."
cd frontend || {
    echo "❌ Dossier frontend introuvable"
    exit 1
}

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées avec succès"

# Création du fichier .env.local
echo "⚙️ Configuration de l'environnement..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Fichier .env.local créé"
else
    echo "ℹ️ Fichier .env.local existe déjà"
fi

# Vérification du build
echo "🔨 Vérification du build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi"

# Nettoyage
echo "🧹 Nettoyage..."
rm -rf .next

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "Pour lancer l'application :"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "L'application sera accessible sur http://localhost:3000"
