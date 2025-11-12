# Guide d'Installation 🚀

Ce guide détaille les différentes méthodes pour installer et utiliser ChessRoom.

## Table des Matières

1. [Installation Rapide](#installation-rapide)
2. [Prérequis](#prérequis)
3. [Installation Locale](#installation-locale)
4. [Hébergement Web](#hébergement-web)
5. [Configuration](#configuration)
6. [Dépannage](#dépannage)

---

## Installation Rapide

**La méthode la plus simple :**

1. Téléchargez le fichier `index.html`
2. Double-cliquez dessus
3. ✨ C'est tout !

L'application s'ouvre dans votre navigateur par défaut et fonctionne immédiatement.

---

## Prérequis

### Navigateur Moderne

ChessRoom nécessite un navigateur moderne avec support de :
- ✅ ES6+ JavaScript
- ✅ CSS3 (Grid, Flexbox, Variables)
- ✅ LocalStorage API
- ✅ Canvas API
- ✅ MediaDevices API (pour QR codes)

### Navigateurs Testés

| Navigateur | Version Minimale | Statut |
|------------|------------------|--------|
| Chrome | 90+ | ✅ Testé |
| Firefox | 88+ | ✅ Testé |
| Safari | 14+ | ✅ Testé |
| Edge | 90+ | ✅ Testé |
| Opera | 76+ | ✅ Compatible |

### Connexion Internet

**Requise uniquement pour :**
- Premier chargement (téléchargement des bibliothèques CDN)
- Génération/scan de QR codes
- Export PDF

**Une fois chargé**, l'application fonctionne **100% hors ligne**.

---

## Installation Locale

### Option 1 : Téléchargement Direct

#### Via GitHub

1. Allez sur https://github.com/votre-username/ChessRoom
2. Cliquez sur **"Code"** > **"Download ZIP"**
3. Décompressez le fichier ZIP
4. Ouvrez `index.html` dans votre navigateur

#### Via Git Clone

```bash
# Clone le repository
git clone https://github.com/votre-username/ChessRoom.git

# Accédez au dossier
cd ChessRoom

# Ouvrez le fichier
# Sur Windows :
start index.html

# Sur Mac :
open index.html

# Sur Linux :
xdg-open index.html
```

### Option 2 : Serveur Local

Si vous préférez un serveur local (utile pour le développement) :

#### Avec Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Puis ouvrez : http://localhost:8000
```

#### Avec Node.js

```bash
# Avec http-server (recommandé)
npx http-server

# Ou avec live-server (rechargement automatique)
npx live-server

# Puis ouvrez : http://localhost:8080
```

#### Avec PHP

```bash
php -S localhost:8000

# Puis ouvrez : http://localhost:8000
```

### Option 3 : Extensions de Navigateur

#### Chrome / Edge
1. Extensions > "Mode Développeur"
2. "Charger l'extension non empaquetée"
3. Sélectionnez le dossier ChessRoom

#### Firefox
1. `about:debugging`
2. "Ce Firefox"
3. "Charger un module complémentaire temporaire"
4. Sélectionnez `index.html`

---

## Hébergement Web

### GitHub Pages (Gratuit)

**Avantages :**
- ✅ Hébergement gratuit
- ✅ HTTPS automatique
- ✅ Nom de domaine personnalisé possible
- ✅ Mise à jour automatique depuis GitHub

**Étapes :**

1. **Créez un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/ChessRoom.git
   git push -u origin main
   ```

2. **Activez GitHub Pages**
   - Allez dans Settings > Pages
   - Source : "Deploy from branch"
   - Branch : `main` / `root`
   - Cliquez sur "Save"

3. **Accédez à votre site**
   - URL : `https://votre-username.github.io/ChessRoom/`
   - Délai : 2-5 minutes pour la première publication

### Netlify (Gratuit)

**Avantages :**
- ✅ Déploiement en un clic
- ✅ HTTPS automatique
- ✅ Nom de domaine personnalisé
- ✅ Prévisualisation des branches

**Méthode 1 : Drag & Drop**
1. Allez sur https://app.netlify.com/drop
2. Glissez le dossier ChessRoom
3. ✨ Site déployé !

**Méthode 2 : CLI**
```bash
# Installation
npm install -g netlify-cli

# Déploiement
cd ChessRoom
netlify deploy --prod
```

### Vercel (Gratuit)

**Avantages :**
- ✅ Déploiement ultra-rapide
- ✅ Edge Network mondial
- ✅ Analytics intégré

```bash
# Installation
npm install -g vercel

# Déploiement
cd ChessRoom
vercel --prod
```

### Hébergement Traditionnel (FTP)

**Pour hébergeurs classiques (OVH, 1&1, etc.) :**

1. Connectez-vous via FTP (FileZilla, Cyberduck, etc.)
   - Hôte : ftp.votre-domaine.com
   - Port : 21
   - Protocole : FTP ou SFTP

2. Uploadez `index.html` dans le dossier `public_html` ou `www`

3. Accédez à : `https://votre-domaine.com/index.html`

**Remarque :** Aucune configuration serveur nécessaire, c'est du HTML statique !

---

## Configuration

### Première Utilisation

1. **Ouvrez ChessRoom**
   - L'application se charge avec un plan vide

2. **Définissez un mot de passe arbitre** (recommandé)
   - Cliquez sur "⚙️ Paramètres"
   - "Mot de passe arbitre" > Entrez un mot de passe
   - Cliquez "Définir le mot de passe"

3. **Créez votre premier plan**
   - Cliquez "➕ Ajouter Table"
   - Définissez le nombre d'échiquiers
   - Positionnez la table

4. **Importez vos appariements PAPI**
   - Cliquez "📄 Importer Papi" (bouton vert)
   - Sélectionnez votre fichier `.txt`
   - Vérifiez l'attribution automatique

### Configuration Avancée

#### Personnalisation des Échiquiers

- **Numérotation** : Double-cliquez sur un numéro pour l'éditer
- **Flip** : Bouton 🔄 sur chaque échiquier pour inverser noir/blanc
- **Rotation table** : Sélectionnez une table > Rotation 0°/90°/180°/270°

#### Mode Joueur

1. **Protection par mot de passe** (optionnel)
   - Paramètres > "Mot de passe joueur"
   - Définissez un mot de passe

2. **Génération des QR Codes**
   - Après import PAPI
   - Cliquez "📊 QR Codes"
   - "Générer QR Codes"
   - "📄 Exporter PDF" pour impression

#### Gestion des Rondes

- **Nouvelle ronde** : "➕ Nouvelle Ronde"
- **Renommer** : Cliquez sur le nom actuel
- **Dupliquer** : "📋 Dupliquer Ronde" (copie le plan)
- **Supprimer** : "🗑️ Supprimer Ronde"

---

## Dépannage

### L'application ne se charge pas

**Symptôme :** Page blanche ou erreur 404

**Solutions :**
1. Vérifiez que vous avez une connexion internet (première fois)
2. Videz le cache de votre navigateur (Ctrl+Shift+Delete)
3. Essayez un autre navigateur
4. Vérifiez la console (F12) pour voir les erreurs

### Import PAPI échoue

**Symptôme :** Erreur lors de l'import du fichier

**Solutions :**
1. Vérifiez le format du fichier :
   - Extension `.txt` uniquement
   - Encodage UTF-8
   - Format : "X avec Couleur contre Y"
   - Tri alphabétique

2. Testez avec un fichier minimal :
   ```
   DUPONT Jean (1850) avec Blancs contre MARTIN Pierre (1720)
   MARTIN Pierre (1720) avec Noirs contre DUPONT Jean (1850)
   ```

### Les QR Codes ne se génèrent pas

**Symptôme :** Erreur "Impossible de générer les QR codes"

**Solutions :**
1. Vérifiez que vous avez importé des appariements PAPI
2. Actualisez la page (F5)
3. Vérifiez votre connexion internet
4. Essayez un autre navigateur

### La caméra ne fonctionne pas (Scanner QR)

**Symptôme :** Erreur "Accès caméra refusé"

**Solutions :**
1. Autorisez l'accès à la caméra dans les paramètres du navigateur
2. Utilisez HTTPS (requis pour accès caméra)
3. Vérifiez qu'aucune autre application n'utilise la caméra
4. Sur mobile : utilisez Chrome ou Safari (pas Firefox)

### Données perdues après actualisation

**Symptôme :** Le plan disparaît après F5

**Solutions :**
1. Vérifiez que le localStorage n'est pas désactivé
2. Ne pas utiliser le mode "Navigation privée/Incognito"
3. Vérifiez l'espace disque disponible
4. Exportez régulièrement en PDF/PNG comme backup

### Export PDF échoue

**Symptôme :** Erreur lors de la génération du PDF

**Solutions :**
1. Vérifiez votre connexion internet (CDN jsPDF)
2. Attendez que tout le plan soit chargé
3. Réduisez le zoom si le plan est très grand
4. Essayez l'export PNG en alternative

### Performance lente

**Symptôme :** L'application rame avec beaucoup d'échiquiers

**Solutions :**
1. Fermez les onglets/applications inutiles
2. Utilisez Chrome (meilleure performance)
3. Réduisez le nombre d'échiquiers visibles (multi-salles)
4. Désactivez les extensions de navigateur

### Problèmes de synchronisation multi-onglets

**Symptôme :** Les changements ne se synchronisent pas

**Solutions :**
1. Fermez les modales ouvertes
2. Actualisez les deux onglets (F5)
3. Vérifiez que c'est bien le même navigateur
4. Utilisez une seule instance en mode arbitre

---

## Support

### Aide Supplémentaire

Si votre problème persiste :

1. **Vérifiez la FAQ** dans le README.md
2. **Cherchez dans les Issues** : [GitHub Issues](https://github.com/votre-username/ChessRoom/issues)
3. **Ouvrez une nouvelle issue** avec :
   - Description du problème
   - Navigateur et version
   - Étapes pour reproduire
   - Captures d'écran
   - Messages d'erreur de la console

### Contact

- 📧 Email : [mail@vincentvallet.com](mailto:mail@vincentvallet.com)
- 🐛 GitHub Issues : [Signaler un bug](https://github.com/votre-username/ChessRoom/issues/new)

---

## Mise à Jour

### Méthode 1 : Téléchargement Manuel

1. Téléchargez la dernière version depuis GitHub
2. Remplacez votre ancien `index.html`
3. Actualisez le navigateur (F5)
4. Vos données sont conservées (localStorage)

### Méthode 2 : Git Pull

```bash
cd ChessRoom
git pull origin main
```

### Méthode 3 : Automatique (GitHub Pages)

Si hébergé sur GitHub Pages, les mises à jour sont automatiques après chaque commit.

---

## Désinstallation

### Locale

Supprimez simplement le fichier `index.html` ou le dossier `ChessRoom`.

### Données

Pour effacer toutes les données sauvegardées :

1. Ouvrez la console du navigateur (F12)
2. Application > LocalStorage
3. Supprimez les entrées "chessroom_*"

Ou dans l'application :
- Paramètres > "🗑️ Effacer toutes les données"

---

**Besoin d'aide ? N'hésitez pas à nous contacter ! 📧**
