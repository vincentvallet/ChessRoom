# ChessRoom 🏆♟️

**Gestionnaire de Plan de Salles pour Tournois d'Échecs**

Application web complète pour gérer l'organisation physique et logistique des tournois d'échecs, de la création du plan de salle jusqu'à la saisie des résultats.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Modes d'Utilisation](#-modes-dutilisation)
- [Prérequis PAPI](#-prérequis-papi)
- [Technologies](#-technologies)
- [Contribuer](#-contribuer)
- [Licence](#-licence)
- [Auteur](#-auteur)

---

♟️ ChessRoom

ChessRoom est un outil complet de gestion de tournois d’échecs pour arbitres et organisateurs.  
Il permet de concevoir un plan de salle interactif, d’y intégrer les appariements, de saisir les résultats (manuellement ou par QR code), et d’exporter les données du tournoi — le tout, hors connexion, directement depuis le navigateur.

---

🚀 Fonctionnalités principales

- 🗺️ Plan de salle interactif
  - Création et déplacement libre des tables et échiquiers  
  - Définition de salles distinctes  
  - Zoom et navigation fluide  

- 📦 Import automatique
  - Chargement d’un fichier PAPI d'appariement par ordre alphabétique (HTML) pour associer automatiquement les joueurs et échiquiers  
  - Possibilité de créer ou de cloner des rondes avec des dispositions différentes  

- 🎮 Saisie des résultats
  - Mode arbitre (clic ou QR code)  
  - Mode joueur sécurisé par mot de passe  
  - Génération de fiches QR-codes individuelles pour chaque échiquier  

- ⏱️ Outils intégrés
  - Chronomètre de ronde (décompte puis temps depuis le début de la ronde)  
  - Résultat toutes les minutes à jour
  - Recherche rapide par joueur

- 💾 Sauvegarde et export
  - Sauvegarde automatique dans le cache navigateur  
  - Export PDF de la liste des résultats ou du plan visuel  
  - Import/export complet du plan tournoi  

- 🔒 100 % local et hors ligne
  - Aucune donnée transmise à un serveur  
  - Fonctionne directement dans le navigateur, même sans connexion Internet  

---

🧩 Installation et utilisation

🔧 Méthode 1 – Utilisation directe
1. Téléchargez le fichier `ChessRoom.html`  
2. Ouvrez-le simplement dans votre navigateur  
3. Tout fonctionne localement !

🧑‍💻 Méthode 2 – Clonage du dépôt
```bash
git clone https://github.com/vincentvallet/ChessRoom.git
cd ChessRoom

---

📄 Formats pris en charge

Fichier d’appariements PAPI HTML
Sauvegardes au format JSON
Export visuel en PDF
Fiches QR-code pour saisie webcam ou mobile

---

🔐 Sécurité

Mode joueur accessible uniquement via mot de passe arbitre
Aucune donnée n’est transmise sur Internet
Compatible RGPD (aucune collecte, tout reste en local)

---

🪪 Licence

Publié sous licence MIT
© 2025 Vincent Vallet

---
🌐 Contact

Vincent Vallet – Formateur en IA & développeur d’outils pédagogiques
📧 mail@vincentvallet.com
🌍 https://vincentvallet.com



IMPORTANT : Les fonctionnalités décrites ci-dessous ainsi que les autres fichiers ont été générées par l'IA.
Je n'ai pas pris le temps de tout vérifier mais je vous les laisse tout ceci car cela peut vous être utile :


## ✨ Fonctionnalités

### 🎨 Gestion du Plan de Salle
- **Éditeur visuel** : Créez votre plan de salle en glisser-déposer
- **Tables physiques** : Positionnement libre des tables dans l'espace
- **Salles multiples** : Gérez plusieurs salles simultanément
- **Échiquiers configurables** : 1 à 30 échiquiers par table
- **Rotation des tables** : Orientation à 0°, 90°, 180° ou 270°
- **Zoom et navigation** : Contrôles intuitifs pour naviguer dans le plan

### 📊 Import et Gestion des Appariements
- **Import PAPI** : Importez directement vos feuilles d'appariements au format PAPI
- **Format requis** : Feuille triée alphabétiquement, format "X avec telle couleur contre Y"
- **Attribution automatique** : Les joueurs sont automatiquement assignés aux échiquiers
- **Affichage des ELO** : Ratings des joueurs visibles sur chaque échiquier
- **Numérotation flexible** : Personnalisez la numérotation des échiquiers

### 🎮 Modes d'Utilisation

#### Mode Arbitre
- Saisie complète des résultats
- Ajout de commentaires par joueur
- Vue d'ensemble de tous les échiquiers
- Édition des numéros d'échiquiers
- Flip individuel des échiquiers

#### Mode Joueur
- **Recherche par nom** : Trouvez votre échiquier rapidement
- **Recherche par liste** : Sélection dans une liste déroulante
- **Scanner QR Code** : Scannez votre QR code personnel
- **Saisie depuis le plan** : Visualisez le plan complet et cliquez sur votre échiquier
- **Interface simplifiée** : Saisie rapide du résultat (1-0, ½-½, 0-1)
- **Protection par mot de passe** : Accès sécurisé au mode joueur

### 📤 Export et Impression
- **Export PDF** : Générez un PDF du plan de salle complet
- **Export PNG** : Sauvegardez une image haute résolution
- **Impression optimisée** : Format adapté pour l'impression

### 💾 Sauvegarde et Historique
- **Sauvegarde automatique** : Les données sont sauvegardées dans le navigateur (localStorage)
- **Gestion des rondes** : Créez, renommez, dupliquez et supprimez des rondes
- **Historique Undo/Redo** : Annulez et refaites vos actions (Ctrl+Z / Ctrl+Y)
- **Synchronisation multi-onglets** : Les modifications sont synchronisées entre onglets

### 📱 QR Codes
- **Génération automatique** : QR code unique par joueur
- **Planche d'impression** : Exportez tous les QR codes en PDF
- **Scanner intégré** : Scannez les QR codes directement depuis l'application

---

## 🚀 Installation

### Option 1 : Fichier unique (Recommandé)

1. **Téléchargez le fichier** `index.html`
2. **Ouvrez-le** dans votre navigateur web moderne (Chrome, Firefox, Edge, Safari)
3. **C'est tout !** L'application fonctionne entièrement en local, sans serveur

```bash
# Clone le repository
git clone https://github.com/votre-username/ChessRoom.git

# Ouvrez simplement le fichier
cd ChessRoom
# Double-cliquez sur index.html ou ouvrez-le avec votre navigateur
```

### Option 2 : Serveur local (optionnel)

Si vous préférez utiliser un serveur local :

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx http-server

# Puis ouvrez http://localhost:8000 dans votre navigateur
```

### Option 3 : Hébergement web

Uploadez simplement le fichier `index.html` sur votre hébergement web (FTP, GitHub Pages, Netlify, Vercel, etc.).

---

## 📖 Utilisation

### Démarrage Rapide

#### 1. Créer votre plan de salle

1. **Ajoutez des tables** :
   - Cliquez sur "➕ Ajouter Table"
   - Définissez le nombre d'échiquiers (1-30)
   - Positionnez la table par glisser-déposer

2. **Organisez l'espace** :
   - Utilisez l'outil "Déplacer" (🤚) pour repositionner les tables
   - Rotation : 0°, 90°, 180°, 270°
   - Ajoutez des salles avec l'outil "🏛️ Ajouter Salle"

#### 2. Importer les appariements

**⚠️ IMPORTANT - Format PAPI requis :**

Votre feuille d'appariements PAPI doit être :
- **Triée alphabétiquement** par nom de joueur
- Au format **"X avec telle couleur contre Y"**

**Procédure :**
1. Cliquez sur le bouton **vert "📄 Importer Papi"** à gauche de la page
2. Sélectionnez votre fichier PAPI (.txt)
3. Les joueurs sont automatiquement assignés aux échiquiers

**Exemple de format attendu :**
```
DUPONT Jean (1850) avec Blancs contre MARTIN Pierre (1720)
LEFEBVRE Sophie (1680) avec Noirs contre BERNARD Luc (1790)
...
```

#### 3. Configurer les accès

**Mode Arbitre :**
- Définissez un mot de passe arbitre dans les paramètres
- Permet la saisie complète et l'édition du plan

**Mode Joueur :**
- Les joueurs peuvent saisir leurs résultats
- Quatre méthodes de recherche disponibles
- Protection par mot de passe optionnelle

#### 4. Saisir les résultats

**En mode arbitre :**
- Cliquez sur les `...` de chaque échiquier
- Saisissez le résultat et ajoutez des commentaires

**En mode joueur :**
- Recherchez votre nom ou scannez votre QR code
- Cliquez sur le résultat de la partie (1-0, ½-½, 0-1)

#### 5. Exporter et Imprimer

- **PDF** : Plan complet pour affichage ou distribution
- **PNG** : Image haute résolution
- **QR Codes** : Planche de tous les QR codes des joueurs

---

## 🎯 Modes d'Utilisation

### Mode Arbitre 👨‍⚖️

**Accès :** Bouton "👨‍⚖️ Mode Arbitre" en bas à gauche

**Fonctionnalités :**
- ✏️ Édition complète du plan
- 🎲 Saisie des résultats avec commentaires
- 🔄 Flip individuel des échiquiers
- 🔢 Édition des numéros d'échiquiers
- 📊 Vue statistiques en temps réel
- 💾 Gestion des rondes multiples

**Protection :** 
Définissez un mot de passe dans Paramètres > Mot de passe arbitre

### Mode Joueur 🎮

**Accès :** Bouton "🎮 Mode Joueur" en bas à gauche

**4 Méthodes de Recherche :**

#### 1. Recherche par Nom 🔍
- Tapez votre nom
- Suggestions automatiques
- Validation et affichage de votre échiquier

#### 2. Liste Déroulante 📋
- Sélectionnez votre nom dans la liste complète
- Recherche alphabétique

#### 3. Scanner QR Code 📷
- Activez la caméra
- Scannez votre QR code personnel
- Accès instantané à votre partie

#### 4. Saisir depuis le Plan 🗺️
- Visualisez le plan complet de la salle
- Cliquez directement sur votre échiquier
- Idéal si vous connaissez votre emplacement

**Saisie Simplifiée :**
- Interface épurée avec 3 boutons
- 1-0 (Blancs gagnent)
- ½-½ (Match nul)
- 0-1 (Noirs gagnent)
- Validation automatique et retour à l'accueil

---

## 📋 Prérequis PAPI

### Format d'Import Requis

**Le fichier PAPI doit être :**
1. ✅ Trié **alphabétiquement** par nom de joueur
2. ✅ Format : **"Joueur1 (ELO) avec Couleur contre Joueur2 (ELO)"**

### Exemple Correct

```
BERNARD Luc (1790) avec Noirs contre LEFEBVRE Sophie (1680)
DUPONT Jean (1850) avec Blancs contre MARTIN Pierre (1720)
LEFEBVRE Sophie (1680) avec Noirs contre BERNARD Luc (1790)
MARTIN Pierre (1720) avec Blancs contre DUPONT Jean (1850)
```

### Génération depuis PAPI

Dans le logiciel PAPI :
1. Allez dans **Fichier > Imprimer**
2. Sélectionnez **"Feuilles d'appariement"**
3. Choisissez **"Format texte"**
4. Cochez **"Tri alphabétique"**
5. Format : **"X avec telle couleur contre Y"**
6. Exportez le fichier `.txt`

---

## 🛠️ Technologies

- **HTML5** - Structure
- **CSS3** - Styling avec dégradés et animations
- **Vanilla JavaScript** - Logique métier sans framework
- **LocalStorage** - Sauvegarde des données
- **Canvas API** - Rendu graphique
- **MediaDevices API** - Accès caméra pour QR codes

### Bibliothèques Externes (CDN)

- **html2canvas** (1.4.1) - Capture d'écran pour export PNG
- **jsPDF** (2.5.1) - Génération de PDF
- **jsQR** (1.4.0) - Lecture de QR codes
- **qrcode.js** (1.0.0) - Génération de QR codes

---

## 🔧 Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl + Z` | Annuler (Undo) |
| `Ctrl + Y` | Refaire (Redo) |
| `Suppr` | Supprimer la sélection |
| `Échap` | Fermer les modales |
| `Entrée` | Valider les formulaires |

---

## 📊 Statistiques en Temps Réel

L'application affiche en permanence :
- 📋 **Tables** : Nombre total de tables
- ♟️ **Échiquiers** : Nombre total d'échiquiers
- 👥 **Joueurs** : Nombre de joueurs appariés
- ✅ **Résultats** : Nombre de résultats saisis
- ⏳ **En cours** : Parties en attente

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! 

### Comment contribuer

1. **Fork** le projet
2. Créez votre **branche** (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Idées de Contributions

- 🌍 Traductions (anglais, espagnol, etc.)
- 📱 Améliorations responsive mobile
- 🎨 Thèmes personnalisables
- 🔌 Intégration avec d'autres logiciels d'échecs
- 📊 Exports supplémentaires (Excel, CSV)
- 🔐 Authentification avancée

---

## 📝 Roadmap

- [ ] Mode sombre / clair
- [ ] Thèmes personnalisables
- [ ] Support multi-langues
- [ ] Export Excel/CSV
- [ ] Statistiques avancées
- [ ] Intégration avec Chess.com / Lichess
- [ ] Application mobile (PWA)
- [ ] Mode hors ligne complet

---

## 🐛 Signaler un Bug

Si vous trouvez un bug, merci de :
1. Vérifier qu'il n'a pas déjà été signalé dans les [Issues](https://github.com/vincentvallet/ChessRoom/issues)
2. Ouvrir une nouvelle issue avec :
   - Description détaillée
   - Étapes pour reproduire
   - Navigateur et version
   - Captures d'écran si possible

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

Copyright (c) 2025 Vincent Vallet

---

## 👤 Auteur

**Vincent Vallet**

- Email : [mail@vincentvallet.com](mailto:mail@vincentvallet.com)
- Site web : [www.vincentvallet.com](https://www.vincentvallet.com)
- GitHub : [@vincentvallet](https://github.com/vincentvallet)

---

## 🙏 Remerciements

- Communauté des arbitres et organisateurs de tournois d'échecs
- Fédération Française des Échecs (FFE)
- Contributeurs et testeurs

---

## 📸 Captures d'Écran

### Vue Principale - Mode Arbitre
![Mode Arbitre](docs/screenshots/arbitre-mode.png)

### Import PAPI
![Import PAPI](docs/screenshots/import-papi.png)

### Mode Joueur - Recherche
![Mode Joueur](docs/screenshots/player-mode.png)

### Plan de Salle Complet
![Plan de Salle](docs/screenshots/floor-plan.png)

---

## ⚡ Performance

- ✅ **Fichier unique** : Tout en un, aucune dépendance locale
- ✅ **Léger** : ~150 KB non compressé
- ✅ **Rapide** : Exécution instantanée
- ✅ **Hors ligne** : Fonctionne sans connexion internet (sauf import CDN initial)
- ✅ **Compatible** : Tous navigateurs modernes

---

## 🔐 Sécurité

- Toutes les données sont stockées **localement** dans votre navigateur
- Aucune donnée n'est envoyée à un serveur externe
- Les mots de passe sont stockés en clair dans le localStorage (à usage local uniquement)
- Pour une utilisation en production avec accès internet, considérez une solution backend sécurisée

---

## 💡 Cas d'Usage

### Tournois Locaux
- Clubs d'échecs
- Tournois amicaux
- Championnats régionaux

### Tournois Officiels
- Tournois homologués FFE
- Opens internationaux
- Championnats scolaires

### Événements Spéciaux
- Simultanées
- Blitz / Rapid tournaments
- Festivals d'échecs

---

## 📞 Support

Pour toute question ou demande d'assistance :
- 📧 Email : [mail@vincentvallet.com](mailto:mail@vincentvallet.com)
- 🐛 Issues GitHub : [Ouvrir une issue](https://github.com/votre-username/ChessRoom/issues)

---

**Fait avec ❤️ pour la communauté des échecs**
