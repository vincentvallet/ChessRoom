# Documentation Complète - ChessRoom

## 📋 Table des matières
1. [Présentation générale](#présentation-générale)
2. [Architecture technique](#architecture-technique)
3. [Fonctionnalités principales](#fonctionnalités-principales)
4. [Guide d'utilisation détaillé](#guide-dutilisation-détaillé)
5. [Modes d'affichage](#modes-daffichage)
6. [Gestion des données](#gestion-des-données)
7. [Fonctionnalités avancées](#fonctionnalités-avancées)
8. [Résolution de problèmes](#résolution-de-problèmes)

---

## Présentation générale

**ChessRoom** est une application web complète de gestion de tournois d'échecs qui permet de :
- Créer et gérer plusieurs rondes de tournoi
- Organiser visuellement les tables dans une salle
- Gérer les appariements de joueurs
- Suivre les scores en temps réel
- Générer des QR codes pour faciliter l'identification
- Exporter les données aux formats PAPI et PDF
- Offrir différents modes d'affichage (organisateur, joueur, spectateur, projecteur)

### Points forts
- ✅ Interface intuitive avec drag & drop
- ✅ Synchronisation automatique multi-appareils
- ✅ Mode hors ligne avec sauvegarde locale
- ✅ Compatible mobile et tablette
- ✅ Export PDF professionnel
- ✅ Gestion des conflits de données
- ✅ Mode sombre disponible

---

## Architecture technique

### Technologies utilisées
- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : PHP 7+ avec gestion de fichiers JSON
- **Bibliothèques** :
  - `html2canvas` : Capture d'écran pour PDF
  - `jsPDF` : Génération de documents PDF
  - `jsQR` : Lecture de QR codes
  - `qrcode.js` : Génération de QR codes

### Structure des fichiers
```
chessroom/
├── index.html              # Application principale
├── save.php                # Script de sauvegarde avec verrouillage optimiste
├── update_score.php        # Mise à jour atomique des scores
├── chessroom-data.json     # Base de données (créée automatiquement)
├── chessroom-debug.log     # Journal des erreurs
└── chessroom-history/      # Historique des sauvegardes
    ├── history_2024-01-15_10-30-00.json
    └── ...
```

### Permissions requises
- **Dossier `chessroom-history/`** : 755 (rwxr-xr-x)
- **Fichier `save.php`** : 664 (rw-rw-r--)
- **Fichier `update_score.php`** : 664 (rw-rw-r--)

---

## Fonctionnalités principales

### 1. Gestion des rondes

#### Création de rondes
- Créez plusieurs rondes de tournoi (Ronde 1, Ronde 2, etc.)
- Chaque ronde est indépendante avec sa propre organisation
- Navigation simple entre les rondes via un sélecteur

#### Configuration par ronde
- **Nombre de tables physiques** : Définissez combien de tables réelles vous avez dans la salle
- **Nombre d'échiquiers par table** : Configurez le nombre de parties par table (généralement 1 à 4)
- **Auto-numérotation** : Les échiquiers sont numérotés automatiquement de manière séquentielle

### 2. Organisation visuelle des tables

#### Canvas interactif
- **Dimension** : 3000x2000 pixels (redimensionnable)
- **Zoom** : Contrôles +/- et réinitialisation (100%)
- **Scroll** : Navigation fluide dans l'espace avec la souris ou le doigt

#### Manipulation des tables
- **Drag & Drop** : Déplacez les tables en les glissant
- **Positionnement libre** : Placez les tables n'importe où sur le canvas
- **Indication visuelle** : Curseur main lors du survol
- **Sauvegarde automatique** : Les positions sont enregistrées en temps réel

#### Éléments de décor
Ajoutez des éléments visuels pour représenter la salle :
- 🚪 **Portes** : Indiquez les entrées/sorties
- 🪟 **Fenêtres** : Positionnez les ouvertures
- 🍽️ **Buvette** : Marquez l'espace restauration
- ⚠️ **Obstacles** : Signalisez piliers, colonnes, etc.

**Manipulation** :
- Clic sur un élément pour le sélectionner
- Déplacement par drag & drop
- Suppression avec le bouton dédié
- Redimensionnement possible pour certains éléments

### 3. Gestion des appariements

#### Importation PAPI
Le format PAPI (Portable Application Programming Interface) est le standard français pour les tournois d'échecs.

**Fichier PAPI attendu** :
```
012 NomJoueur            1234  5.5  blanc vs NomAdversaire   1256
```

**Format détaillé** :
- **Position 1-3** : Numéro d'échiquier (ex: "012", "042")
- **Position 5-24** : Nom du joueur blanc (20 caractères)
- **Position 26-29** : ELO du joueur blanc
- **Position 32-35** : ELO du joueur noir (optionnel)
- **Position 37-38** : Couleur ("blanc" ou "noir")
- **Position 43+** : Nom du joueur noir

**Processus d'importation** :
1. Cliquez sur "Importer appariements (PAPI)"
2. Sélectionnez votre fichier .txt ou .papi
3. L'application analyse et place automatiquement les joueurs
4. Vérification automatique de la cohérence des données

#### Saisie manuelle
Pour chaque échiquier :
- **Joueur Blanc** : Nom + ELO (optionnel)
- **Joueur Noir** : Nom + ELO (optionnel)
- **Score** : Menu déroulant avec résultats standardisés
  - 1-0 (Victoire des Blancs)
  - 0-1 (Victoire des Noirs)
  - ½-½ (Nulle)
  - 0-0 (Non joué)
  - + (Forfait Noir)
  - - (Forfait Blanc)

#### Génération automatique de test
- Bouton "Générer 100 tables test"
- Création instantanée de données fictives pour les démonstrations
- Noms et ELO générés aléatoirement
- Utile pour tester l'interface sans saisir de vraies données

### 4. Système de QR codes

#### QR codes joueur
**Génération** :
- Cliquez sur "Générer tous les QR codes joueurs"
- Un QR code unique est créé pour chaque joueur
- Format : `player:NomDuJoueur`

**Utilisation** :
1. Imprimez les QR codes et distribuez-les aux joueurs
2. Avant chaque ronde, le joueur scanne son QR code
3. L'application affiche automatiquement sa table et son adversaire
4. Informations affichées :
   - Numéro de table
   - Couleur des pièces
   - Nom et ELO de l'adversaire

**Export PDF** :
- "Télécharger tous les QR codes (PDF)"
- Mise en page optimisée (4 QR codes par page)
- Comprend le nom du joueur sous chaque QR code
- Prêt à l'impression

#### QR codes table
**Génération** :
- Cliquez sur "Générer tous les QR codes tables"
- Un QR code par échiquier
- Format : `table:NuméroTable`

**Utilisation** :
1. Placez les QR codes sur chaque table physique
2. Les joueurs les scannent pour saisir directement le résultat
3. Formulaire de saisie simplifié :
   - Identité des joueurs pré-remplie
   - Boutons de résultat rapide
   - Sauvegarde instantanée

**Export PDF** :
- "Télécharger tous les QR codes tables (PDF)"
- Format standard pour impression
- Numéro de table visible

### 5. Filtres d'affichage

#### Filtres disponibles
- **Par score** :
  - ✓ Terminé (score saisi)
  - ⏳ En cours (sans score)
  - ∅ Vide (sans joueurs)

- **Par présence joueurs** :
  - 👥 Avec joueurs
  - 📭 Sans joueurs

#### Application des filtres
- Cliquez sur un ou plusieurs boutons de filtre
- Les tables non concernées disparaissent immédiatement
- Bouton "Réinitialiser filtres" pour tout réafficher
- Utile pour se concentrer sur certaines tables

### 6. Export des données

#### Export PAPI
**Utilité** : Compatible avec les logiciels de gestion de tournois français (PAPI, Swiss-Manager)

**Format généré** :
```
001 Joueur1              2100  5.5  blanc vs Joueur2         2050  1-0
002 Joueur3              1950  4.5  noir  vs Joueur4         2000  0-1
```

**Processus** :
1. Cliquez sur "Exporter en PAPI"
2. Fichier téléchargé automatiquement : `appariements_rondeX.txt`
3. Importable directement dans d'autres logiciels

#### Export PDF
**Options d'export** :
- **Plan complet** : Vue d'ensemble de toute la salle
- **Tables uniquement** : Liste détaillée de tous les appariements
- **Export personnalisé** : Sélection d'une zone spécifique du canvas

**Paramètres du PDF** :
- Format A4 (portrait ou paysage)
- Haute résolution
- Nom du tournoi inclus
- Date de génération
- Numérotation automatique

**Processus** :
1. Cliquez sur "Exporter en PDF (Plan complet)"
2. Capture automatique du canvas
3. Conversion en PDF
4. Téléchargement : `plan_salle_rondeX.pdf`

### 7. Gestion des scores

#### Saisie directe
Dans la barre latérale :
- Sélectionnez l'échiquier
- Choisissez le résultat dans le menu déroulant
- Sauvegarde automatique

#### Saisie par QR code
Après scan du QR code table :
- Formulaire pré-rempli avec les joueurs
- Boutons de résultat rapide :
  - "1-0" (Blancs gagnent)
  - "½-½" (Nulle)
  - "0-1" (Noirs gagnent)
- Validation instantanée

#### Mise à jour atomique
- Le fichier `update_score.php` gère les mises à jour de scores isolément
- Évite les conflits lors de saisies simultanées
- Verrouillage de fichier pour assurer la cohérence

---

## Modes d'affichage

### Mode Organisateur (par défaut)
**Accès** : Ouverture normale de l'application

**Caractéristiques** :
- Barre latérale complète avec tous les contrôles
- Barre d'outils (zoom, export, etc.)
- Drag & drop actif
- Modification de tous les paramètres
- Sauvegarde automatique

**Utilisation** :
- Configuration initiale du tournoi
- Ajustement de la disposition des tables
- Saisie des résultats
- Export des documents

### Mode Joueur
**Accès** : Scan d'un QR code joueur

**Caractéristiques** :
- Interface épurée
- Affichage centré sur l'information du joueur :
  - Numéro de table
  - Couleur des pièces
  - Adversaire et son ELO
- Plan de la salle en arrière-plan (lecture seule)
- Bouton "Retour" pour sortir du mode

**Utilisation** :
- Distribution des QR codes aux joueurs avant le tournoi
- Chaque joueur scanne son QR à chaque ronde
- Localisation rapide de sa table

### Mode Spectateur
**Accès** : Ajout de `?mode=spectator` à l'URL

**Exemple** : `https://votre-site.com/chessroom/?mode=spectator`

**Caractéristiques** :
- Lecture seule complète
- Aucune modification possible
- Aucune barre d'outils
- Vue du plan et des appariements
- Navigation entre rondes possible

**Utilisation** :
- Affichage public sur écran secondaire
- Partage avec des spectateurs
- Consultation en temps réel des appariements

#### Sous-mode : Suivi joueur
Dans le mode spectateur, une fonctionnalité spéciale permet de **suivre un joueur spécifique** :

**Activation** :
1. En mode spectateur, sélectionnez un joueur dans la liste déroulante
2. Cliquez sur "Suivre ce joueur"

**Fonctionnalités** :
- **Suivi automatique** : L'écran se centre automatiquement sur la table du joueur
- **Highlight visuel** : La table du joueur est mise en surbrillance (bordure jaune)
- **Informations en temps réel** :
  - Numéro de table actuel
  - Couleur jouée
  - Nom et ELO de l'adversaire
- **Popup d'alerte** : Notification visuelle à chaque changement de ronde
- **Persistance** : Le suivi continue même après rechargement de la page
- **Wake Lock** : Empêche la mise en veille de l'écran

**Cas d'usage** :
- Parents suivant leur enfant pendant le tournoi
- Accompagnateurs de joueurs
- Suivi personnel sur smartphone

**Désactivation** :
- Cliquez sur "Arrêter le suivi"
- Le suivi est conservé dans le navigateur (localStorage)

### Mode Projecteur
**Accès** : Cliquez sur "Mode Projecteur" dans la barre d'outils

**Caractéristiques** :
- **Plein écran automatique**
- Interface minimale
- Aucune barre de contrôle visible
- Optimisé pour les grands écrans
- Fond blanc propre
- Bouton de sortie discret (coin inférieur droit)

**Utilisation** :
- Projection sur grand écran dans la salle de tournoi
- Affichage permanent des appariements
- Présentation lors de briefings

**Sortie** :
- Bouton "Quitter le mode projecteur" (apparaît au survol)
- Ou touche Échap

---

## Gestion des données

### Système de sauvegarde

#### Stratégies disponibles
1. **Auto (serveur + local)** *(recommandé)*
   - Sauvegarde simultanée sur le serveur PHP et localement
   - Fallback automatique en cas de panne serveur
   - Meilleure fiabilité

2. **Serveur uniquement**
   - Toutes les données sur le serveur
   - Synchronisation multi-appareils
   - Nécessite une connexion stable

3. **Local uniquement**
   - Données stockées dans le navigateur (localStorage)
   - Fonctionne hors ligne
   - Pas de synchronisation entre appareils

#### Sauvegarde automatique
- **Déclenchement** : À chaque modification (déplacement, saisie, etc.)
- **Debounce** : 1 seconde de délai pour grouper les modifications
- **Indicateur visuel** : Icône de statut dans la barre d'outils
  - 💾 Sauvegarde en cours...
  - ✅ Sauvegardé
  - ❌ Erreur de sauvegarde

#### Sauvegarde manuelle
- Bouton "💾 Sauvegarder" en haut de la barre latérale
- Force une sauvegarde immédiate
- Utile après des modifications importantes

### Verrouillage optimiste

Le système implémente un **verrouillage optimiste** pour gérer les modifications concurrentes :

**Principe** :
1. Chaque sauvegarde inclut un timestamp (horodatage)
2. Avant d'écrire, le client envoie son timestamp au serveur
3. Le serveur compare avec son propre timestamp
4. Si le serveur est plus récent → **Conflit détecté**

**En cas de conflit** :
- Code HTTP 409 (Conflict) renvoyé
- Message d'alerte à l'utilisateur
- Proposition de recharger les données
- Aucune donnée n'est écrasée

**Avantages** :
- Évite les pertes de données lors d'éditions simultanées
- Plusieurs appareils peuvent travailler en parallèle
- Détection automatique des désynchronisations

### Historique des sauvegardes

**Fonctionnement** :
- Chaque sauvegarde crée une copie dans `chessroom-history/`
- Nom du fichier : `history_YYYY-MM-DD_HH-MM-SS.json`
- Conservation des 10 dernières sauvegardes (configurable)
- Nettoyage automatique des plus anciennes

**Utilité** :
- Restauration en cas d'erreur
- Audit des modifications
- Récupération de données perdues

**Consultation** :
- Accessible via FTP
- Fichiers JSON lisibles
- Importables manuellement si nécessaire

### Surveillance de connexion

**Indicateur de statut** :
- Petit point coloré en haut à droite de l'écran
- 🟢 Vert : Connecté au serveur
- 🔴 Rouge : Déconnecté
- 🟡 Jaune : Vérification en cours

**Heartbeat** :
- Vérification automatique toutes les 5 secondes
- Requête légère au serveur PHP
- Détection rapide des problèmes de connexion

**Fallback automatique** :
- Si le serveur ne répond plus, bascule sur sauvegarde locale
- Message informatif à l'utilisateur
- Reprise de la synchronisation dès le retour de connexion

### Import/Export manuel

#### Charger depuis un fichier
1. Cliquez sur "📂 Charger depuis un fichier"
2. Sélectionnez un fichier JSON de sauvegarde
3. Confirmation de l'import
4. Écrasement des données actuelles

**Formats acceptés** :
- Fichiers JSON de ChessRoom
- Sauvegardes de l'historique

#### Sauvegarder vers un fichier
1. Cliquez sur "💾 Sauvegarder vers un fichier"
2. Fichier téléchargé : `chessroom_backup_YYYY-MM-DD.json`
3. Conservez ce fichier en sécurité

**Utilité** :
- Backup manuel avant modifications importantes
- Transfert de données entre installations
- Archivage de tournois terminés

---

## Fonctionnalités avancées

### Mode sombre

**Activation** :
- Bouton "🌙 Mode sombre" / "☀️ Mode clair" dans la barre latérale
- Basculement instantané
- Préférence sauvegardée dans le navigateur

**Modifications** :
- Arrière-plan noir (#1a1a1a)
- Textes en gris clair (#e0e0e0)
- Éléments UI adaptés (bordures, ombres)
- Meilleur confort visuel en soirée
- Économie de batterie sur écrans OLED

### Raccourcis clavier

*(Si implémentés, à documenter selon les fonctionnalités)*

Exemples courants :
- `Ctrl + S` : Sauvegarde manuelle
- `Ctrl + Z` : Annulation (undo)
- `Ctrl + +` : Zoom avant
- `Ctrl + -` : Zoom arrière
- `Échap` : Fermer les modales / Quitter mode projecteur

### Responsive design

**Adaptation mobile** :
- Interface tactile optimisée
- Boutons plus grands pour le touch
- Barre latérale repliable
- Canvas scrollable au doigt
- Zoom pinch-to-zoom

**Adaptation tablette** :
- Mode portrait et paysage supportés
- Sidebar adaptative
- Clavier virtuel géré correctement

**Desktop** :
- Interface complète
- Raccourcis clavier disponibles
- Multi-fenêtres possible

### Accessibilité

**Éléments pris en compte** :
- Contraste des couleurs (WCAG AA)
- Labels sur tous les champs de formulaire
- Navigation au clavier possible
- Messages d'erreur explicites
- Taille de police ajustable (via zoom navigateur)

### Performance

**Optimisations** :
- Rendu optimisé du canvas (requestAnimationFrame)
- Debounce sur les sauvegardes (1s)
- Lazy loading des images
- Minimisation des reflows DOM
- Verrouillage de fichiers pour éviter la corruption

---

## Résolution de problèmes

### Problèmes courants

#### 1. La sauvegarde ne fonctionne pas

**Symptômes** :
- Message "Erreur de sauvegarde"
- Icône rouge persistante
- Modifications non enregistrées

**Solutions** :
1. Vérifiez les permissions des fichiers :
   ```bash
   chmod 755 chessroom-history/
   chmod 664 save.php
   chmod 664 update_score.php
   ```

2. Vérifiez que PHP peut écrire dans le dossier :
   ```bash
   chown www-data:www-data chessroom-history/
   ```

3. Consultez le fichier `chessroom-debug.log` :
   ```bash
   tail -f chessroom-debug.log
   ```

4. Vérifiez la configuration PHP :
   - `file_uploads = On`
   - `upload_max_filesize` suffisant
   - `post_max_size` suffisant

5. Testez la connexion au serveur :
   - Ouvrez la console navigateur (F12)
   - Onglet "Network"
   - Vérifiez les requêtes vers `save.php`

#### 2. Conflit de données détecté

**Symptômes** :
- Message "CONFLIT: Les données ont été modifiées sur le serveur"
- Code HTTP 409

**Cause** :
- Deux appareils ont modifié les données simultanément
- Données serveur plus récentes que les données locales

**Solutions** :
1. Cliquez sur "Recharger" pour obtenir les dernières données
2. Réappliquez vos modifications
3. Pour éviter :
   - Désignez une personne responsable de la saisie
   - Utilisez un seul appareil pour les modifications importantes
   - Activez le mode "Serveur uniquement" pour une cohérence stricte

#### 3. Les QR codes ne fonctionnent pas

**Symptômes** :
- QR code non reconnu
- Caméra ne se lance pas
- Erreur de scan

**Solutions** :
1. **Permissions caméra** :
   - Vérifiez que le navigateur a accès à la caméra
   - Sur mobile : Paramètres > Navigateur > Autorisations > Caméra

2. **HTTPS requis** :
   - L'API caméra nécessite HTTPS (pas HTTP)
   - Sur localhost, HTTP est accepté

3. **Qualité du QR code** :
   - Imprimez en haute résolution
   - Évitez les impressions pixelisées
   - Bonne luminosité pour le scan

4. **Navigateur compatible** :
   - Chrome, Firefox, Safari récents
   - Évitez les navigateurs obsolètes

#### 4. Les tables n'apparaissent pas

**Symptômes** :
- Canvas vide
- Aucune table visible

**Solutions** :
1. Vérifiez le nombre de tables configuré :
   - Barre latérale > "Nombre de tables physiques"
   - Doit être > 0

2. Vérifiez le zoom :
   - Cliquez sur "⊙" pour réinitialiser le zoom

3. Rechargez les données :
   - Bouton "🔄 Charger" dans la barre latérale

4. Consultez la console navigateur :
   - F12 > Console
   - Cherchez les erreurs JavaScript

#### 5. Export PDF échoue

**Symptômes** :
- Erreur lors de la génération
- PDF vide ou corrompu

**Solutions** :
1. Vérifiez que `html2canvas` et `jsPDF` sont chargés :
   - Console > Onglet "Network"
   - Cherchez les CDN

2. Réduisez la complexité du canvas :
   - Moins de tables affichées
   - Désactivez les filtres

3. Essayez un autre navigateur :
   - Chrome recommandé pour l'export PDF

4. Augmentez la mémoire disponible :
   - Fermez les onglets inutiles

#### 6. Perte de données

**Symptômes** :
- Données disparues après rechargement
- Retour à un état vide

**Solutions** :
1. **Récupération depuis l'historique** :
   ```bash
   cd chessroom-history/
   ls -lt  # Liste les sauvegardes par date
   cp history_2024-01-15_14-30-00.json ../chessroom-data.json
   ```

2. **Récupération depuis localStorage** :
   - F12 > Application > Local Storage
   - Cherchez `chessRoomData`
   - Copiez le JSON et sauvegardez-le

3. **Vérifiez le fichier de données** :
   ```bash
   cat chessroom-data.json
   ```
   - Si vide ou corrompu, restaurez depuis l'historique

4. **Préventions futures** :
   - Activez "Auto (serveur + local)"
   - Faites des exports manuels réguliers (💾 Sauvegarder vers un fichier)
   - Conservez les backups hors serveur

### Diagnostics avancés

#### Vérification de l'intégrité des données

**Commande** :
```bash
php -r "json_decode(file_get_contents('chessroom-data.json'));"
```
- Si aucune erreur : JSON valide
- Sinon : Fichier corrompu, restaurez depuis l'historique

#### Logs PHP

**Activation** :
Modifiez `save.php` :
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

**Consultation** :
```bash
tail -f /var/log/apache2/error.log  # Apache
tail -f /var/log/nginx/error.log    # Nginx
```

#### Test de verrouillage

**Commande** :
```bash
php -r '
$fp = fopen("chessroom-data.json", "r");
if (flock($fp, LOCK_SH)) {
    echo "Verrouillage OK\n";
    flock($fp, LOCK_UN);
} else {
    echo "Verrouillage ÉCHEC\n";
}
fclose($fp);
'
```

### Support et contact

Pour toute question ou problème non résolu :
1. Consultez les logs : `chessroom-debug.log`
2. Vérifiez la console navigateur (F12)
3. Documentez le problème avec captures d'écran
4. Contactez le développeur : Vincent Vallet

---

## Annexes

### Format de données JSON

Structure du fichier `chessroom-data.json` :

```json
{
  "roundsStore": {
    "ronde1": {
      "config": {
        "tournamentName": "Tournoi Municipal 2024",
        "numPhysicalTables": 10,
        "boardsPerTable": 4
      },
      "physicalTables": [
        {
          "id": "table-1",
          "x": 100,
          "y": 100,
          "boards": [
            {
              "boardNumber": 1,
              "players": {
                "white": { "name": "Joueur1", "elo": "2100" },
                "black": { "name": "Joueur2", "elo": "2050" }
              },
              "score": { "white": "1", "black": "0" }
            }
          ]
        }
      ],
      "decorElements": [
        { "type": "door", "x": 50, "y": 300, "label": "Entrée" }
      ]
    }
  },
  "currentRoundKey": "ronde1"
}
```

### Compatibilité navigateurs

| Navigateur | Version minimale | Support |
|------------|------------------|---------|
| Chrome     | 80+              | ✅ Complet |
| Firefox    | 75+              | ✅ Complet |
| Safari     | 13+              | ✅ Complet |
| Edge       | 80+              | ✅ Complet |
| Opera      | 67+              | ✅ Complet |
| IE         | ❌               | Non supporté |

### Licence et crédits

**ChessRoom** - Gestionnaire de tournois d'échecs  
Développé par : Vincent Vallet  
Année : 2024  
Licence : À définir

---

**Version de la documentation** : 1.0  
**Dernière mise à jour** : Novembre 2024
