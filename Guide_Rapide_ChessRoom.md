# Guide Rapide - ChessRoom

## 🚀 Installation en 5 minutes

### Étape 1 : Télécharger les fichiers
Assurez-vous d'avoir tous ces fichiers :
- `index.html`
- `save.php`
- `update_score.php`
- `GUIDE.md` (ce fichier)

### Étape 2 : Upload sur votre serveur FTP

1. **Connectez-vous à votre serveur FTP** avec un client (FileZilla, Cyberduck, etc.)

2. **Uploadez tous les fichiers** dans le dossier de votre choix :
   ```
   /public_html/chessroom/
   ```

3. **Créez le dossier d'historique** :
   - Créez un dossier nommé `chessroom-history`

4. **Configurez les permissions** :
   ```
   chessroom-history/     → 755 (rwxr-xr-x)
   save.php               → 664 (rw-rw-r--)
   update_score.php       → 664 (rw-rw-r--)
   ```

### Étape 3 : Configuration des permissions

#### Avec votre client FTP :
- Clic droit sur le dossier/fichier → "Permissions" ou "File Permissions"
- **Pour le dossier** `chessroom-history` :
  - ☑ Propriétaire : Lecture, Écriture, Exécution
  - ☑ Groupe : Lecture, Exécution
  - ☑ Public : Lecture, Exécution
  - Code numérique : **755**

- **Pour les fichiers PHP** (`save.php`, `update_score.php`) :
  - ☑ Propriétaire : Lecture, Écriture
  - ☑ Groupe : Lecture, Écriture
  - ☑ Public : Lecture
  - Code numérique : **664**

#### Avec SSH (si disponible) :
```bash
chmod 755 chessroom-history/
chmod 664 save.php
chmod 664 update_score.php
```

### Étape 4 : Accéder à l'application

Ouvrez votre navigateur et allez à :
```
https://votre-domaine.com/chessroom/
```

✅ **C'est prêt !** L'application devrait se charger.

---

## 🎯 Prise en main rapide (10 minutes)

### 1. Configuration initiale

**À l'ouverture de l'application :**

1. **Nommez votre tournoi**
   - Barre latérale gauche → "Nom du tournoi"
   - Exemple : "Tournoi Municipal 2024"

2. **Configurez les tables**
   - "Nombre de tables physiques" → Ex : 10
   - "Échiquiers par table" → Ex : 4
   - Cliquez sur "Regénérer les tables"

### 2. Organiser la salle

**Placer les tables :**
- Glissez-déposez les tables rectangles pour représenter votre salle
- Utilisez le zoom (+ / -) pour ajuster la vue
- Les positions sont sauvegardées automatiquement

**Ajouter des éléments de décor (optionnel) :**
- Cliquez sur 🚪 Porte, 🪟 Fenêtre, 🍽️ Buvette, ⚠️ Obstacle
- Placez-les sur le plan
- Glissez-les pour les repositionner
- Cliquez dessus puis "Supprimer l'élément" pour les retirer

### 3. Importer les appariements

**Option A : Import automatique (fichier PAPI)**
1. Cliquez sur "Importer appariements (PAPI)"
2. Sélectionnez votre fichier `.txt` ou `.papi`
3. Les joueurs sont placés automatiquement

**Option B : Saisie manuelle**
1. Dans la barre latérale, sélectionnez un échiquier
2. Remplissez les informations :
   - Nom Joueur Blanc + ELO (optionnel)
   - Nom Joueur Noir + ELO (optionnel)
3. Répétez pour tous les échiquiers

**Option C : Génération de test**
- Cliquez sur "Générer 100 tables test"
- Données fictives créées instantanément
- Parfait pour découvrir l'interface

### 4. Générer les QR codes joueurs

**Pour que les joueurs trouvent leur table :**
1. Cliquez sur "Générer tous les QR codes joueurs"
2. Cliquez sur "Télécharger tous les QR codes (PDF)"
3. Imprimez le PDF (4 QR codes par page)
4. Découpez et distribuez avant le tournoi

**Utilisation par les joueurs :**
- Avant chaque ronde, le joueur scanne son QR code
- L'application affiche automatiquement :
  - Numéro de table
  - Couleur des pièces
  - Adversaire et son ELO

### 5. Saisir les résultats

**Méthode 1 : Saisie directe**
1. Barre latérale → Sélectionnez l'échiquier
2. Menu déroulant "Score" → Choisissez le résultat :
   - 1-0 (Blancs gagnent)
   - 0-1 (Noirs gagnent)
   - ½-½ (Nulle)
   - 0-0 (Non joué)
3. Sauvegarde automatique

**Méthode 2 : Via QR code table**
1. Générez les QR codes tables (bouton dédié)
2. Téléchargez le PDF et imprimez
3. Placez un QR code sur chaque table physique
4. Les joueurs scannent et saisissent le résultat directement

### 6. Exporter les résultats

**Export PAPI (pour logiciels de tournois) :**
- Cliquez sur "Exporter en PAPI"
- Fichier téléchargé : `appariements_ronde1.txt`

**Export PDF (plan de salle) :**
- Cliquez sur "Exporter en PDF (Plan complet)"
- Fichier téléchargé : `plan_salle_ronde1.pdf`

---

## 🎨 Modes d'utilisation

### Mode Organisateur (par défaut)
- **Accès** : URL normale
- **Usage** : Configuration, modifications, saisie des scores
- Toutes les fonctionnalités disponibles

### Mode Joueur
- **Accès** : Scan du QR code joueur
- **Usage** : Affiche la table du joueur uniquement
- Interface épurée pour les participants

### Mode Spectateur
- **Accès** : Ajoutez `?mode=spectator` à l'URL
- **Exemple** : `https://votre-site.com/chessroom/?mode=spectator`
- **Usage** : Lecture seule, affichage public
- Aucune modification possible

### Mode Projecteur
- **Accès** : Bouton "Mode Projecteur" dans la barre d'outils
- **Usage** : Plein écran pour projection sur grand écran
- Interface minimale, optimisée pour présentation

---

## ⚡ Fonctions essentielles

### Sauvegarde automatique
- ✅ Activée par défaut
- Sauvegarde toutes les secondes après modification
- Indicateur visuel : 💾 / ✅ / ❌

### Filtres d'affichage
- **Par score** : ✓ Terminé / ⏳ En cours / ∅ Vide
- **Par joueurs** : 👥 Avec joueurs / 📭 Sans joueurs
- Cliquez sur les boutons pour filtrer
- "Réinitialiser filtres" pour tout réafficher

### Gestion des rondes
- Créez plusieurs rondes (Ronde 1, Ronde 2, etc.)
- Sélecteur de ronde en haut de la barre latérale
- Chaque ronde est indépendante

### Mode sombre
- Bouton "🌙 Mode sombre" dans la barre latérale
- Confort visuel en soirée
- Préférence sauvegardée

---

## 🔧 Résolution rapide des problèmes

### La sauvegarde ne fonctionne pas
**➜ Vérifiez les permissions :**
```bash
chmod 755 chessroom-history/
chmod 664 save.php
chmod 664 update_score.php
```

**➜ Consultez les logs :**
- Fichier `chessroom-debug.log` dans le même dossier
- Recherchez les erreurs PHP

### Conflit de données
**Message : "Les données ont été modifiées sur le serveur"**
- Cliquez sur "Recharger" pour obtenir la dernière version
- Évitez de modifier depuis plusieurs appareils simultanément

### QR codes non reconnus
- Vérifiez que vous utilisez HTTPS (pas HTTP)
- Autorisez l'accès à la caméra dans votre navigateur
- Imprimez les QR codes en haute qualité

### Canvas vide
- Vérifiez que "Nombre de tables physiques" > 0
- Cliquez sur "⊙" pour réinitialiser le zoom
- Rechargez la page (F5)

---

## 💡 Astuces et bonnes pratiques

### Avant le tournoi
1. ✅ Testez l'application avec des données fictives
2. ✅ Organisez le plan de salle à l'avance
3. ✅ Imprimez tous les QR codes joueurs
4. ✅ Testez les scans de QR codes sur différents appareils
5. ✅ Faites un export manuel (backup) avant le début

### Pendant le tournoi
1. ✅ Désignez une personne pour la saisie des résultats
2. ✅ Utilisez le mode projecteur pour affichage public
3. ✅ Vérifiez régulièrement l'indicateur de connexion (point vert)
4. ✅ Gardez un backup papier des appariements (au cas où)

### Après le tournoi
1. ✅ Exportez en PAPI pour archivage
2. ✅ Exportez en PDF pour rapport
3. ✅ Faites une sauvegarde manuelle (💾 Sauvegarder vers un fichier)
4. ✅ Conservez les backups hors serveur

### Sécurité des données
- **Backup automatique** : 10 dernières sauvegardes dans `chessroom-history/`
- **Backup manuel** : Utilisez "💾 Sauvegarder vers un fichier" régulièrement
- **Récupération** : En cas de problème, copiez un fichier de l'historique :
  ```bash
  cp chessroom-history/history_2024-XX-XX_XX-XX-XX.json chessroom-data.json
  ```

### Multi-appareils
- **Organisateur** : Ordinateur principal pour configuration
- **Assistants** : Tablettes pour saisie de scores
- **Public** : Mode spectateur sur écran secondaire
- **Joueurs** : Smartphones pour scan QR codes

---

## 📞 Support

**Problème technique ?**
1. Consultez la documentation complète : `Documentation_ChessRoom.md`
2. Vérifiez les logs : `chessroom-debug.log`
3. Console navigateur : F12 → onglet "Console"

**Contact développeur :**
- Vincent Vallet
- OFID - Organisme de Formation à l'IA et au Digital

---

## 🎯 Checklist de démarrage

Avant votre premier tournoi, vérifiez :

- [ ] Fichiers uploadés sur le serveur
- [ ] Permissions correctes (755 pour dossier, 664 pour PHP)
- [ ] Application accessible dans le navigateur
- [ ] Sauvegarde automatique fonctionnelle (testez une modification)
- [ ] QR codes générés et testés
- [ ] Plan de salle organisé et exporté en PDF
- [ ] Mode projecteur testé
- [ ] Backup manuel effectué

**Vous êtes prêt ! Bon tournoi ! 🏆**

---

**Version du guide** : 1.0  
**Dernière mise à jour** : Novembre 2024
