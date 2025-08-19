# Guide de déploiement Fi.A.Ma.Sa.M sur Hostinger/Plesk

## 🎯 Objectif
Déployer l'application Next.js sur **mpsanjaka-sakalava.mg** avec Plesk

## 📋 Prérequis
- Accès à votre panel Plesk Hostinger
- Domaine `mpsanjaka-sakalava.mg` configuré
- Base de données MySQL disponible

## 🚀 Étapes de déploiement

### 1. Configuration de la base de données dans Plesk

1. **Connectez-vous à Plesk** : https://votre-serveur:8443
2. **Allez dans "Bases de données"**
3. **Créez une nouvelle base de données :**
   - Nom : `fiamasam_prod`
   - Utilisateur : `fiamasam_user`
   - Mot de passe : (générez un mot de passe fort)
4. **Notez les informations de connexion**

### 2. Activation de Node.js dans Plesk

1. **Dans Plesk, allez dans votre domaine** `mpsanjaka-sakalava.mg`
2. **Cliquez sur "Node.js"**
3. **Activez Node.js :**
   - Version : 18.x ou 20.x (la plus récente disponible)
   - Mode : Production
   - Document Root : `/httpdocs`
   - Application Root : `/`
   - Startup File : `server.js`

### 3. Déploiement des fichiers

**Option A : Via Git (Recommandé)**
1. Dans Plesk, allez dans "Git"
2. Clonez votre repository : `https://github.com/JaoMalazaMada/fiamasam.git`
3. Branche : `master`
4. Répertoire : `/httpdocs`

**Option B : Via File Manager**
1. Téléchargez le projet en ZIP depuis GitHub
2. Uploadez dans `/httpdocs` via le File Manager Plesk
3. Décompressez les fichiers

### 4. Configuration des variables d'environnement

1. **Dans Plesk, allez dans "Node.js"**
2. **Ajoutez les variables d'environnement :**

```
NODE_ENV=production
DATABASE_URL=mysql://fiamasam_user:VOTRE_MOT_DE_PASSE@localhost:3306/fiamasam_prod
NEXTAUTH_URL=https://mpsanjaka-sakalava.mg
NEXTAUTH_SECRET=VOTRE_SECRET_32_CARACTERES
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@mpsanjaka-sakalava.mg
SMTP_PASS=VOTRE_MOT_DE_PASSE_EMAIL
EMAIL_FROM=Fi.A.Ma.Sa.M <noreply@mpsanjaka-sakalava.mg>
NEXT_PUBLIC_URL=https://mpsanjaka-sakalava.mg
```

### 5. Installation et build

1. **Dans le terminal Plesk ou via SSH :**
```bash
cd /var/www/vhosts/mpsanjaka-sakalava.mg/httpdocs
npm install
npm run build
```

2. **Ou utilisez l'interface Plesk Node.js :**
   - Cliquez sur "NPM Install"
   - Puis "NPM Run Build"

### 6. Configuration de Prisma

1. **Générer le client Prisma :**
```bash
npx prisma generate
```

2. **Appliquer les migrations (première fois) :**
```bash
npx prisma db push
```

### 7. Démarrage de l'application

1. **Dans Plesk Node.js :**
   - Cliquez sur "Enable Node.js"
   - L'application démarrera automatiquement

2. **Ou via terminal :**
```bash
npm start
```

### 8. Configuration du domaine

1. **Dans Plesk, allez dans "Hosting Settings"**
2. **Configurez :**
   - Document root : `/httpdocs`
   - Proxy vers Node.js : Activé (port 3000)

### 9. SSL/HTTPS

1. **Dans Plesk, allez dans "SSL/TLS Certificates"**
2. **Obtenez un certificat Let's Encrypt gratuit**
3. **Activez "Redirect from HTTP to HTTPS"**

## 🔧 Dépannage

### Problèmes courants :

1. **Erreur de base de données :**
   - Vérifiez la chaîne de connexion DATABASE_URL
   - Testez la connexion depuis Plesk

2. **Erreur Node.js :**
   - Vérifiez que la version Node.js est 18+ 
   - Regardez les logs dans Plesk

3. **Problème d'uploads :**
   - Créez le dossier `public/uploads` avec permissions 755
   - Vérifiez les permissions d'écriture

### Logs utiles :
- Logs Node.js : Dans Plesk > Node.js > Logs
- Logs Apache/Nginx : Dans Plesk > Logs
- Logs d'erreurs : `/var/www/vhosts/mpsanjaka-sakalava.mg/logs/`

## 🎉 Test final

1. **Visitez :** https://mpsanjaka-sakalava.mg
2. **Testez :**
   - Affichage de la page d'accueil
   - Connexion utilisateur
   - Création d'article (admin)
   - Envoi d'email

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez les logs Plesk
2. Vérifiez les variables d'environnement
3. Testez la connexion base de données
4. Contactez le support Hostinger si nécessaire
