# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-01-12

### Ajouté ✨
- Éditeur visuel de plan de salle avec glisser-déposer
- Gestion de tables physiques avec 1 à 30 échiquiers par table
- Rotation des tables (0°, 90°, 180°, 270°)
- Import de fichiers PAPI (format alphabétique)
- Attribution automatique des joueurs aux échiquiers
- Affichage des ELO des joueurs
- Mode Arbitre avec saisie complète des résultats
- Mode Joueur avec 4 méthodes de recherche :
  - Recherche par nom
  - Liste déroulante
  - Scanner QR code
  - Saisie depuis le plan
- Génération de QR codes personnalisés par joueur
- Export PDF du plan de salle
- Export PNG haute résolution
- Export PDF des QR codes (planche d'impression)
- Sauvegarde automatique dans localStorage
- Gestion multi-rondes (création, renommage, duplication, suppression)
- Historique Undo/Redo (Ctrl+Z / Ctrl+Y)
- Synchronisation multi-onglets
- Protection par mot de passe pour mode arbitre et mode joueur
- Statistiques en temps réel
- Système de salles multiples
- Flip individuel des échiquiers
- Commentaires par joueur
- Éditeur de numéros d'échiquiers
- Raccourcis clavier
- Interface responsive

### Sécurité 🔐
- Validation des imports PAPI
- Protection contre la perte de données
- Confirmation pour actions destructives

### Performance ⚡
- Application fichier unique (standalone)
- Optimisation du rendu
- Chargement instantané

---

## Structure des Versions

Le numéro de version suit le format MAJEUR.MINEUR.CORRECTIF :
- **MAJEUR** : Changements incompatibles avec les versions précédentes
- **MINEUR** : Ajout de fonctionnalités rétrocompatibles
- **CORRECTIF** : Corrections de bugs rétrocompatibles

---

## Types de Changements

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités

---

## Versions à Venir

### [1.1.0] - À venir
- [ ] Mode sombre / clair
- [ ] Exports de résultats pour PAPI

---

## Archive des Versions

### Version Beta (avant 1.0.0)
- Développement initial et tests internes
- Prototypage des fonctionnalités principales
- Tests utilisateurs avec arbitres locaux
