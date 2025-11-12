# Guide de Contribution 🤝

Merci de votre intérêt pour contribuer à ChessRoom ! Ce document explique comment contribuer au projet.

## Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :
- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté
- Faites preuve d'empathie envers les autres membres de la communauté

## Comment Contribuer ?

### Signaler un Bug 🐛

Si vous trouvez un bug :

1. **Vérifiez** qu'il n'a pas déjà été signalé dans les [Issues](https://github.com/vincentvallet/ChessRoom/issues)
2. **Ouvrez une nouvelle issue** avec le template "Bug Report"
3. **Incluez** :
   - Description claire et concise du bug
   - Étapes pour reproduire le problème
   - Comportement attendu vs comportement observé
   - Navigateur et version utilisés
   - Captures d'écran si pertinent
   - Fichier PAPI de test si applicable

### Proposer une Fonctionnalité ✨

Pour proposer une nouvelle fonctionnalité :

1. **Ouvrez une issue** avec le template "Feature Request"
2. **Décrivez** :
   - Le problème que cette fonctionnalité résoudrait
   - La solution que vous proposez
   - Des alternatives que vous avez considérées
   - Des cas d'usage concrets

### Soumettre une Pull Request 🔀

#### Prérequis

- Connaissance de HTML, CSS et JavaScript vanilla
- Git installé sur votre machine
- Un compte GitHub

#### Étapes

1. **Fork** le projet
   ```bash
   # Sur GitHub, cliquez sur "Fork"
   ```

2. **Clone** votre fork
   ```bash
   git clone https://github.com/vincentvallet/ChessRoom.git
   cd ChessRoom
   ```

3. **Créez une branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-super-fonctionnalite
   # ou
   git checkout -b fix/correction-bug
   ```

4. **Faites vos modifications**
   - Éditez le fichier `index.html`
   - Testez vos changements dans plusieurs navigateurs
   - Vérifiez que tout fonctionne sans erreur console

5. **Committez** vos changements
   ```bash
   git add index.html
   git commit -m "feat: ajout de ma super fonctionnalité"
   ```

   **Convention de commit :**
   - `feat:` Nouvelle fonctionnalité
   - `fix:` Correction de bug
   - `docs:` Documentation
   - `style:` Formatage, point-virgules manquants, etc.
   - `refactor:` Refactoring du code
   - `test:` Ajout de tests
   - `chore:` Maintenance

6. **Push** vers votre fork
   ```bash
   git push origin feature/ma-super-fonctionnalite
   ```

7. **Ouvrez une Pull Request**
   - Allez sur le repository original
   - Cliquez sur "New Pull Request"
   - Sélectionnez votre branche
   - Remplissez le template de PR

#### Checklist avant Pull Request

- [ ] Le code fonctionne sans erreur
- [ ] Testé sur Chrome, Firefox et Safari
- [ ] Code commenté si nécessaire
- [ ] Suit les conventions de code existantes
- [ ] Documentation mise à jour si nécessaire
- [ ] Pas de console.log() oubliés
- [ ] Indentation et formatage cohérents

## Architecture du Code

### Structure du fichier `index.html`

```
<!DOCTYPE html>
├── <head>
│   ├── Meta tags et titre
│   ├── Scripts externes (CDN)
│   └── <style> - CSS complet
│
└── <body>
    ├── HTML Structure
    │   ├── Container principal
    │   ├── Sidebar
    │   ├── Workspace
    │   ├── Modales
    │   └── Boutons de contrôle
    │
    └── <script> - JavaScript
        ├── Variables globales
        ├── Fonctions utilitaires
        ├── Gestion du plan de salle
        ├── Import/Export PAPI
        ├── Modes Arbitre/Joueur
        ├── QR Codes
        ├── Sauvegarde/Chargement
        └── Initialisation
```

### Conventions de Code

#### CSS
- Classes BEM pour les composants
- Variables CSS pour les couleurs récurrentes
- Mobile-first responsive design
- Transitions fluides (0.3s)

#### JavaScript
- Vanilla JS (pas de framework)
- Noms de variables en camelCase
- Fonctions documentées avec commentaires
- Gestion d'erreurs avec try/catch
- Éviter les variables globales quand possible

#### HTML
- Indentation 4 espaces
- Attributs entre guillemets doubles
- IDs uniques et significatifs
- Classes descriptives

## Zones de Contribution

### Priorité Haute 🔴

- **Bugs critiques** : Perte de données, crashes
- **Compatibilité navigateur** : Tests et corrections
- **Performance** : Optimisation du rendu
- **Accessibilité** : ARIA labels, navigation clavier

### Priorité Moyenne 🟡

- **Nouvelles fonctionnalités** : Voir roadmap
- **Améliorations UX** : Interface utilisateur
- **Documentation** : Guides, tutoriels
- **Traductions** : i18n

### Priorité Basse 🟢

- **Refactoring** : Amélioration du code
- **Tests** : Ajout de tests unitaires
- **Optimisations mineures**

## Tests

### Tests Manuels Requis

Avant toute PR, testez au minimum :

1. **Création d'un plan**
   - [ ] Ajout de tables
   - [ ] Déplacement de tables
   - [ ] Rotation des tables
   - [ ] Ajout de salles

2. **Import PAPI**
   - [ ] Import fichier valide
   - [ ] Gestion erreurs fichier invalide
   - [ ] Attribution correcte aux échiquiers

3. **Modes**
   - [ ] Passage mode arbitre/joueur
   - [ ] Protection par mot de passe
   - [ ] Saisie résultats

4. **Export**
   - [ ] Export PDF
   - [ ] Export PNG
   - [ ] QR codes

5. **Sauvegarde**
   - [ ] Sauvegarde automatique
   - [ ] Chargement après refresh
   - [ ] Undo/Redo

### Navigateurs Testés

- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Questions ?

Si vous avez des questions :
- 📧 Email : [mail@vincentvallet.com](mailto:mail@vincentvallet.com)
- 💬 Ouvrez une issue avec le label "question"

## Remerciements

Merci à tous les contributeurs qui aident à améliorer ChessRoom ! 🙏

---

**Happy Coding! ♟️**
