#!/bin/bash

# Script de déploiement pour Fi.A.Ma.Sa.M
# Usage: ./deploy.sh

set -e

echo "🚀 Début du déploiement de Fi.A.Ma.Sa.M..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="fiamasam"
PROJECT_DIR="/var/www/$PROJECT_NAME"
BACKUP_DIR="/var/backups/$PROJECT_NAME"
NODE_VERSION="18" # Ou la version que vous utilisez

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si on est root ou sudo
if [[ $EUID -eq 0 ]]; then
   log_warning "Ce script ne devrait pas être exécuté en tant que root pour des raisons de sécurité."
fi

# Créer le répertoire de sauvegarde si nécessaire
log_info "Création du répertoire de sauvegarde..."
sudo mkdir -p "$BACKUP_DIR"

# Sauvegarder l'ancienne version si elle existe
if [ -d "$PROJECT_DIR" ]; then
    log_info "Sauvegarde de l'ancienne version..."
    sudo cp -r "$PROJECT_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
fi

# Créer le répertoire du projet
log_info "Préparation du répertoire de déploiement..."
sudo mkdir -p "$PROJECT_DIR"
sudo chown -R $USER:$USER "$PROJECT_DIR"

# Cloner ou mettre à jour le repository
if [ -d "$PROJECT_DIR/.git" ]; then
    log_info "Mise à jour du code source..."
    cd "$PROJECT_DIR"
    git fetch origin
    git reset --hard origin/master
else
    log_info "Clonage du repository..."
    git clone https://github.com/JaoMalazaMada/fiamasam.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Vérifier la version de Node.js
log_info "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

NODE_CURRENT=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    log_warning "Version de Node.js recommandée: v$NODE_VERSION ou supérieure. Version actuelle: $(node --version)"
fi

# Installer les dépendances
log_info "Installation des dépendances..."
npm ci --production

# Générer le client Prisma
log_info "Génération du client Prisma..."
npx prisma generate

# Construire l'application
log_info "Construction de l'application..."
npm run build

# Créer les répertoires nécessaires
log_info "Création des répertoires nécessaires..."
mkdir -p logs
mkdir -p public/uploads/articles

# Définir les permissions
log_info "Configuration des permissions..."
chmod -R 755 .
chmod -R 777 public/uploads
chmod -R 777 logs

# Copier le fichier d'environnement de production
if [ -f "/etc/fiamasam/.env.production" ]; then
    log_info "Copie du fichier d'environnement de production..."
    cp /etc/fiamasam/.env.production .env
else
    log_warning "Fichier .env.production non trouvé dans /etc/fiamasam/"
    log_warning "Assurez-vous de configurer les variables d'environnement manuellement."
fi

# Redémarrer l'application avec PM2
log_info "Redémarrage de l'application..."
if command -v pm2 &> /dev/null; then
    pm2 stop $PROJECT_NAME || true
    pm2 delete $PROJECT_NAME || true
    pm2 start ecosystem.config.js --env production
    pm2 save
else
    log_warning "PM2 n'est pas installé. L'application doit être démarrée manuellement."
    log_info "Pour installer PM2: npm install -g pm2"
    log_info "Pour démarrer: pm2 start ecosystem.config.js --env production"
fi

log_info "✅ Déploiement terminé avec succès!"
log_info "🌐 L'application devrait être accessible sur votre domaine."

# Afficher les logs récents
if command -v pm2 &> /dev/null; then
    log_info "📋 Logs récents de l'application:"
    pm2 logs $PROJECT_NAME --lines 10
fi
