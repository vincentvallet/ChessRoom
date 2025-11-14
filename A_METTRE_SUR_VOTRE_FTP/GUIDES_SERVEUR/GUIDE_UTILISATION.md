# 🎯 GUIDE D'UTILISATION - Système de Sauvegarde

## 🎉 Félicitations !

Ton système fonctionne maintenant :
- ✅ Sauvegarde locale
- ✅ Sauvegarde serveur manuelle
- ✅ Sauvegarde serveur automatique (corrigée)

---

## 🎮 Les Deux Modes

### Mode Arbitre 👨‍⚖️
**Qui :** La personne qui saisit les résultats (smartphone)

**Peut faire :**
- ✅ Saisir les résultats
- ✅ Sauvegarder localement
- ✅ Sauvegarder sur le serveur
- ✅ Activer la sauvegarde auto serveur

**Usage typique :**
```
1. Ouvrir l'application sur smartphone
2. Mode : "👨‍⚖️ Arbitre"
3. Cocher "☑ Sauvegarde auto serveur"
4. Circuler dans la salle et saisir les résultats
→ Chaque modification est automatiquement sauvegardée sur le serveur
```

### Mode Spectateur 👁️
**Qui :** Les écrans d'affichage (projecteur, écrans muraux, etc.)

**Peut faire :**
- ✅ Voir les résultats
- ✅ Se synchroniser avec le serveur

**Ne peut PAS faire :**
- ❌ Sauvegarder sur le serveur
- ❌ Modifier les données

**Usage typique :**
```
1. Ouvrir l'application sur le projecteur
2. Mode : "👁️ Spectateur"
3. Cocher "☑ Synchronisation auto (5s)"
4. L'écran se met à jour automatiquement
→ Affichage en quasi temps réel des résultats
```

---

## 💾 Les Trois Types de Sauvegarde

### 1. Sauvegarde Locale (localStorage)
**Où :** Dans le navigateur de l'appareil

**Avantages :**
- ⚡ Instantané
- 🔒 Toujours disponible (hors ligne)
- 🔄 Synchronisation automatique entre onglets du même navigateur

**Inconvénients :**
- ⚠️ Ne synchronise PAS entre appareils différents
- ⚠️ Perdu si on vide le cache navigateur

**Utilisation :**
- Backup de sécurité
- Travail hors ligne
- Récupération rapide en cas d'erreur

### 2. Sauvegarde Serveur Manuelle
**Où :** Sur le serveur FTP

**Avantages :**
- 🌍 Partagé entre tous les appareils
- 📂 Historique de 50 versions conservées
- 💾 Persistant (ne disparaît pas)

**Inconvénients :**
- 🌐 Nécessite une connexion internet
- ⏱️ Légèrement plus lent (réseau)

**Utilisation :**
- Bouton "☁️ Sauvegarder Serveur"
- À utiliser quand on veut forcer une sauvegarde importante
- Avant de fermer l'application

### 3. Sauvegarde Serveur Automatique
**Où :** Sur le serveur FTP (automatiquement)

**Avantages :**
- 🤖 Automatique après chaque modification
- 🌍 Synchronisé entre appareils
- 🔒 Sécurisé

**Inconvénients :**
- 🌐 Nécessite une connexion internet
- 📊 Plus de requêtes réseau

**Utilisation :**
- Cocher "☑ Sauvegarde auto serveur"
- Uniquement en mode Arbitre
- Parfait pour un tournoi avec affichage temps réel

---

## 🔄 Comment ça Fonctionne en Production

### Configuration Recommandée

#### Arbitre (Smartphone) :
```
Mode : 👨‍⚖️ Arbitre
☑ Sauvegarde automatique locale (30s)
☑ Sauvegarde automatique serveur
☐ Synchronisation automatique (pas nécessaire)
```

#### Projecteur/Écrans :
```
Mode : 👁️ Spectateur
☐ Sauvegarde automatique locale (pas nécessaire)
☐ Sauvegarde automatique serveur (bloqué)
☑ Synchronisation automatique (5s)
```

### Flux de Données :

```
┌──────────────┐                    ┌──────────────┐
│   ARBITRE    │                    │  SERVEUR FTP │
│ (Smartphone) │                    │   save.php   │
├──────────────┤                    ├──────────────┤
│              │                    │              │
│ Saisit un    │────sauvegarde─────▶│ Enregistre   │
│ résultat     │    automatique     │ les données  │
│              │                    │              │
│              │                    │   + Crée     │
│              │                    │ historique   │
│              │                    │              │
└──────────────┘                    └──────┬───────┘
                                           │
                                           │
                                    synchronisation
                                      (toutes les 5s)
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  PROJECTEUR  │
                                    │   (Écran)    │
                                    ├──────────────┤
                                    │              │
                                    │ Affiche les  │
                                    │ résultats    │
                                    │ à jour       │
                                    │              │
                                    └──────────────┘
```

**Résultat :**
- L'arbitre saisit sur son smartphone
- Sauvegarde automatique sur le serveur
- Le projecteur récupère les données toutes les 5 secondes
- Les spectateurs voient les résultats en quasi temps réel (5s max de décalage)

---

## ⚙️ Options Expliquées

### ☑ Sauvegarde automatique locale (30s)
**Ce qu'elle fait :**
- Toutes les 30 secondes, sauvegarde dans le navigateur
- Fonctionne même hors ligne

**Quand l'utiliser :**
- ✅ Toujours recommandé (backup de sécurité)
- ✅ Travail hors ligne

**Quand la désactiver :**
- ❌ Jamais (sauf si problème de performances)

### ☑ Sauvegarde automatique serveur
**Ce qu'elle fait :**
- À chaque modification, sauvegarde sur le serveur
- Crée un historique automatiquement

**Quand l'utiliser :**
- ✅ Mode Arbitre avec connexion internet stable
- ✅ Tournoi avec affichage temps réel

**Quand la désactiver :**
- ❌ Si connexion internet instable
- ❌ Si on veut contrôler manuellement les sauvegardes
- ❌ Mode Spectateur (bloqué automatiquement)

### ☑ Synchronisation automatique (5s)
**Ce qu'elle fait :**
- Toutes les 5 secondes, vérifie si le serveur a de nouvelles données
- Met à jour l'affichage si nécessaire

**Quand l'utiliser :**
- ✅ Mode Spectateur (affichage projecteur)
- ✅ Quand on veut voir les changements en temps réel

**Quand la désactiver :**
- ❌ Mode Arbitre (pas nécessaire, on crée les données)
- ❌ Si connexion internet très limitée

---

## 🎯 Scénarios d'Utilisation

### Scénario 1 : Tournoi Classique
```
Configuration :
- Arbitre : Smartphone avec "☑ Sauvegarde auto serveur"
- Projecteur : PC avec "☑ Synchronisation auto"

Déroulement :
1. Arbitre ouvre l'app sur smartphone
2. Mode Arbitre, sauvegarde auto serveur activée
3. Projecteur affiche en mode Spectateur
4. Arbitre circule et saisit les résultats
5. Projecteur se met à jour toutes les 5s
6. Spectateurs voient les résultats en temps réel

Résultat : ✅ Parfait
```

### Scénario 2 : Tournoi Hors Ligne
```
Configuration :
- Arbitre : Smartphone avec "☑ Sauvegarde auto locale"
- Pas de projecteur (ou hors ligne aussi)

Déroulement :
1. Arbitre travaille en mode Arbitre
2. Sauvegarde locale uniquement
3. À la fin du tournoi, ou quand internet revient :
   - Clic sur "☁️ Sauvegarder Serveur"
4. Les données sont envoyées sur le serveur

Résultat : ✅ Les données ne sont pas perdues
```

### Scénario 3 : Tournoi Multi-Salles
```
Configuration :
- Arbitre par salle : Smartphone en mode Arbitre
- Projecteur par salle : PC en mode Spectateur
- IMPORTANT : Un seul arbitre a "☑ Sauvegarde auto serveur"

Déroulement :
1. Arbitre principal : Mode Arbitre + auto serveur
2. Autres arbitres : Sauvegarde locale seulement
3. À la fin de chaque ronde :
   - Arbitres secondaires : Bouton "☁️ Sauvegarder Serveur"
   - Ou : consolidation manuelle des résultats

Résultat : ✅ Coordination nécessaire mais possible
```

### Scénario 4 : Problème Technique
```
Problème : L'arbitre perd sa connexion internet

Solution :
1. L'arbitre continue en local (sauvegarde locale auto)
2. Quand internet revient :
   - Clic sur "☁️ Sauvegarder Serveur"
3. Les données sont synchronisées

Résultat : ✅ Aucune perte de données
```

---

## 🚨 Erreurs Courantes et Solutions

### Erreur 1 : "Mode spectateur : sauvegarde serveur bloquée"
**Cause :** Tu es en mode Spectateur et tu essaies de sauvegarder

**Solution :**
1. Change le mode en "👨‍⚖️ Arbitre"
2. Ou : c'est normal si tu es sur un écran d'affichage

### Erreur 2 : La case "Sauvegarde auto serveur" se décoche toute seule
**Cause :** Tu es en mode Spectateur

**Solution :**
1. Change le mode en "👨‍⚖️ Arbitre"
2. Ensuite tu pourras cocher la case

### Erreur 3 : Les données ne se synchronisent pas entre appareils
**Causes possibles :**
- Le mode Spectateur n'a pas "☑ Synchronisation auto"
- Le serveur n'a pas reçu les données
- Pas de connexion internet

**Solutions :**
1. Vérifie que l'arbitre a bien sauvegardé (bouton ou auto)
2. Vérifie que le spectateur a "☑ Synchronisation auto"
3. Attends 5 secondes (délai de synchronisation)
4. Force un rechargement : Bouton "🔄 Recharger Serveur"

### Erreur 4 : Décalage de quelques secondes entre appareils
**Cause :** Normal ! La synchronisation se fait toutes les 5 secondes

**Solution :**
- C'est le comportement normal
- Le délai maximum est de 5 secondes
- Si tu veux un refresh immédiat : "🔄 Recharger Serveur"

---

## 📊 Résumé des Boutons

| Bouton | Action | Mode Arbitre | Mode Spectateur |
|--------|--------|--------------|-----------------|
| 💾 Sauvegarde Locale | Sauvegarde dans le navigateur | ✅ | ✅ |
| ☁️ Sauvegarder Serveur | Envoie sur le serveur | ✅ | ❌ Bloqué |
| 🔄 Recharger Serveur | Récupère du serveur | ✅ | ✅ |
| 📂 Historique | Liste des sauvegardes | ✅ | ✅ |

---

## 🎯 Checklist Avant un Tournoi

### Jour J - 1 :
- [ ] Tester l'application en local
- [ ] Vérifier que save.php fonctionne
- [ ] Tester avec 2 appareils (smartphone + PC)
- [ ] Vérifier la connexion internet sur site

### Jour J - Avant le tournoi :
- [ ] Smartphone arbitre chargé à 100%
- [ ] Ouvrir l'application en mode Arbitre
- [ ] Cocher "☑ Sauvegarde auto locale"
- [ ] Cocher "☑ Sauvegarde auto serveur" (si internet OK)
- [ ] Projecteur en mode Spectateur
- [ ] Cocher "☑ Synchronisation auto"
- [ ] Faire un test de sauvegarde

### Pendant le tournoi :
- [ ] Vérifier régulièrement que le projecteur est à jour
- [ ] En cas de doute : Bouton "🔄 Recharger Serveur"
- [ ] Si problème internet : Continuer en local

### Fin de tournoi :
- [ ] Vérifier que toutes les données sont sur le serveur
- [ ] Télécharger une copie de sauvegarde (Historique)
- [ ] Exporter les résultats finaux

---

## 💡 Astuces Pro

### Astuce 1 : Double Backup
```
Mode Arbitre :
☑ Sauvegarde auto locale (30s)
☑ Sauvegarde auto serveur

Résultat : Les données sont sauvegardées :
- En local (instantané)
- Sur le serveur (partagé)
→ Double sécurité !
```

### Astuce 2 : Synchronisation Rapide
```
Si tu veux que le projecteur se mette à jour plus vite :
1. Édite chessroom-save-system.js
2. Ligne 14 : SERVER_SYNC: 3000 (au lieu de 5000)
3. Synchronisation toutes les 3 secondes au lieu de 5
```

### Astuce 3 : Historique Manuel
```
À des moments clés (fin de ronde) :
1. Clic sur "☁️ Sauvegarder Serveur"
2. Clic sur "📂 Historique"
3. Télécharger la sauvegarde
→ Backup externe en cas de problème
```

---

## 🎉 Conclusion

Tu as maintenant un système de sauvegarde **professionnel** :
- ✅ Trois niveaux de sauvegarde (local, serveur manuel, serveur auto)
- ✅ Deux modes (Arbitre / Spectateur)
- ✅ Historique automatique (50 versions)
- ✅ Synchronisation temps réel
- ✅ Protection contre les conflits

**Bon tournoi ! ♟️🚀**
