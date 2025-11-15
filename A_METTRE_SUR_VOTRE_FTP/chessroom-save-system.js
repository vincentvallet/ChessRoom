// ============================================
// NOUVEAU SYSTÈME DE SAUVEGARDE SÉCURISÉ
// À intégrer dans index.html
// ============================================

// ===== CONFIGURATION =====
const SAVE_CONFIG = {
    modes: {
        ARBITER: 'arbiter',          // Peut sauvegarder
        SPECTATOR: 'spectator'       // Lecture seule
    },
    intervals: {
        LOCAL_SAVE: 30000,           // 30 secondes
        SERVER_SYNC: 5000            // 5 secondes
    },
    maxHistoryDisplay: 20            // Nombre d'historiques affichés
};

// Note: Les variables globales sont déclarées dans index.html :
// - currentSaveMode
// - localSaveInterval
// - serverSyncInterval
// - lastServerTimestamp
//
// SUPPRIMÉ:
// - tournamentName
// - autoSaveLocalEnabled
// - autoSaveServerEnabled
// - autoSyncEnabled


// Variable locale pour ce module
let lastSaveStatus = { type: '', message: '', timestamp: null };

// ===== INTERFACE UTILISATEUR =====

// HTML (Maintenant directement dans index.html)

// ===== FONCTIONS DE STATUT =====

function showSaveStatus(type, message) {
    const statusDiv = document.getElementById('saveStatus');
    if (!statusDiv) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        sync: '🔄'
    };
    
    const colors = {
        success: '#d4edda',
        error: '#f8d7da',
        warning: '#fff3cd',
        info: '#d1ecf1',
        sync: '#e7f3ff'
    };
    
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    
    statusDiv.style.display = 'block';
    statusDiv.style.background = colors[type] || colors.info;
    statusDiv.style.border = `1px solid ${colors[type]}`;
    statusDiv.innerHTML = `${icons[type]} ${message} <small>(${timestamp})</small>`;
    
    lastSaveStatus = { type, message, timestamp };
    
    // Masquer après 5 secondes pour les succès
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// ===== FONCTIONS DE SAUVEGARDE =====

async function saveToLocalStorage() {
    try {
        saveCurrentStateToStore();
        
        const dataToSave = {
            roundsStore: JSON.parse(JSON.stringify(roundsStore)),
            currentRoundKey: currentRoundKey,
            arbiterPassword: arbiterPassword,
            // SUPPRIMÉ: tournamentName
            lastModified: Date.now()
        };
        
        // Nettoyer les handlers
        Object.values(dataToSave.roundsStore).forEach(roundState => {
            if (roundState.physicalTables) {
                roundState.physicalTables.forEach(t => {
                    delete t.mouseDownHandler;
                });
            }
        });
        
        const json = JSON.stringify(dataToSave);
        localStorage.setItem(SAVE_KEY, json);
        localStorage.setItem(SAVE_KEY_TIMESTAMP, Date.now().toString());
        
        showSaveStatus('success', '💾 Sauvegarde locale réussie');
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde locale:', error);
        showSaveStatus('error', 'Erreur lors de la sauvegarde locale');
        return false;
    }
}

async function saveToServer() {
    if (!USE_SERVER_SYNC) {
        showSaveStatus('warning', 'Synchronisation serveur désactivée');
        return false;
    }
    
    if (currentSaveMode !== SAVE_CONFIG.modes.ARBITER) {
        showSaveStatus('warning', '⚠️ Mode spectateur : sauvegarde serveur bloquée');
        return false;
    }
    
    try {
        saveCurrentStateToStore();
        
        const dataToSave = {
            roundsStore: JSON.parse(JSON.stringify(roundsStore)),
            currentRoundKey: currentRoundKey,
            arbiterPassword: arbiterPassword,
            // SUPPRIMÉ: tournamentName (le script PHP utilisera une valeur par défaut)
            lastModified: Date.now(),
            savedBy: currentSaveMode
        };
        
        // Nettoyer les handlers
        Object.values(dataToSave.roundsStore).forEach(roundState => {
            if (roundState.physicalTables) {
                roundState.physicalTables.forEach(t => {
                    delete t.mouseDownHandler;
                });
            }
        });
        
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                lastServerTimestamp = result.timestamp;
                showSaveStatus('success', `☁️ Sauvegarde serveur réussie`);
                return true;
            }
        } else if (response.status === 409) {
            showSaveStatus('warning', '⚠️ Sauvegarde en cours, réessayez');
        } else {
            showSaveStatus('error', 'Erreur serveur : ' + response.status);
        }
        return false;
    } catch (error) {
        console.error('❌ Erreur serveur:', error);
        showSaveStatus('error', 'Impossible de contacter le serveur');
        return false;
    }
}

// MODIFIÉ: Ajout du paramètre isAutoSync
async function loadFromServer(isAutoSync = false) {
    if (!USE_SERVER_SYNC) return false;
    
    try {
        // NOUVEAU: Ne pas afficher "Chargement..." pour la synchro auto silencieuse
        if (!isAutoSync) {
            showSaveStatus('sync', '🔄 Chargement depuis le serveur...');
        }
        
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            if (!isAutoSync) showSaveStatus('error', 'Erreur lors du chargement serveur');
            return false;
        }
        
        const data = await response.json();
        
        if (data && data.roundsStore && typeof data.roundsStore === 'object' && 
            Object.keys(data.roundsStore).length > 0) {
            
            // Vérifier si les données ont changé
            const currentJson = JSON.stringify(roundsStore);
            const serverJson = JSON.stringify(data.roundsStore);
            
            if (currentJson === serverJson) {
                if (!isAutoSync) showSaveStatus('info', 'ℹ️ Les données sont déjà à jour');
                return false;
            }
            
            // MODIFIÉ: Supprimer la confirmation pour la synchro auto
            if (!isAutoSync && // NE PAS DEMANDER SI AUTOSYNC
                currentSaveMode === SAVE_CONFIG.modes.ARBITER && 
                Object.keys(roundsStore).length > 0) {
                if (!confirm('⚠️ Charger les données du serveur écrasera vos modifications locales. Continuer ?')) {
                    showSaveStatus('warning', 'Chargement annulé');
                    return false;
                }
            }
            
            roundsStore = data.roundsStore;
            currentRoundKey = data.currentRoundKey || 'ronde1';
            arbiterPassword = data.arbiterPassword || null;
            // SUPPRIMÉ: tournamentName
            
            // ... [Migration identique] ...
            Object.values(roundsStore).forEach(roundState => {
                if (!roundState.physicalTables) roundState.physicalTables = [];
                if (!roundState.rooms) roundState.rooms = [];
                if (!roundState.nextRoomId) roundState.nextRoomId = 1;
                roundState.physicalTables.forEach(pt => {
                    if (!pt.arbiterComment) pt.arbiterComment = { text: "", flag: "none" };
                    pt.boards.forEach(b => {
                        if (b.score === undefined) b.score = { white: "", black: "" };
                        if (b.players && b.players.white && typeof b.players.white === 'string') {
                            b.players = {
                                white: { name: b.players.white, elo: "", comment: "" },
                                black: { name: b.players.black, elo: "", comment: "" }
                            };
                        } else if (b.players) {
                            if (b.players.white) {
                                if (!b.players.white.elo) b.players.white.elo = "";
                                if (!b.players.white.comment) b.players.white.comment = "";
                            }
                            if (b.players.black) {
                                if (!b.players.black.elo) b.players.black.elo = "";
                                if (!b.players.black.comment) b.players.black.comment = "";
                            }
                        }
                    });
                });
                if (!roundState.historyStack) roundState.historyStack = [];
                if (!roundState.redoStack) roundState.redoStack = [];
            });
            
            updateRoundSelector();
            loadStateFromStore(currentRoundKey);
            showSaveStatus('success', '✅ Données chargées depuis le serveur');
            return true;
        }
        
        if (!isAutoSync) showSaveStatus('info', 'Aucune donnée sur le serveur');
        return false;
    } catch (error) {
        console.error('❌ Erreur chargement serveur:', error);
        if (!isAutoSync) showSaveStatus('error', 'Erreur lors du chargement serveur');
        return false;
    }
}

// ===== SYNCHRONISATION AUTOMATIQUE =====

function syncFromServerIfNeeded() {
    // Ne pas synchroniser si une modale est ouverte (s'applique à tout le monde)
    if (document.querySelector('.modal-overlay[style*="display: flex"]')) {
        return;
    }

    // CAS 1: MODE SPECTATEUR
    // Un spectateur charge TOUJOURS les données, sans délai.
    if (currentSaveMode === SAVE_CONFIG.modes.SPECTATOR) {
        loadFromServer(true);
        return; // C'est tout pour le spectateur.
    }

    // CAS 2: MODE ARBITRE
    // Si on arrive ici, on est en mode Arbitre.
    
    // 1. Vérifier le Cooldown (pour éviter les conflits de sauvegarde)
    if (currentSaveMode === SAVE_CONFIG.modes.ARBITER) {
        const SYNC_COOLDOWN = 10000; // 10 secondes
        if (Date.now() - lastLocalSaveTime < SYNC_COOLDOWN) {
            // console.log('Synchro auto en pause (cooldown post-sauvegarde)');
            return; // L'arbitre vient de sauvegarder, on attend.
        }
    }
    
    // 2. Vérifier la stratégie de l'arbitre
    const strategySelect = document.getElementById('saveStrategySelector');
    if (!strategySelect) return;
    
    const strategy = strategySelect.value;
    const enableSync = (strategy === 'server_local' || strategy === 'server_only');
    
    if (enableSync) {
        // L'arbitre est en mode synchro et n'est pas en cooldown
        loadFromServer(true);
    }
    // Si enableSync est faux (mode local ou manuel), ne rien faire.
}

// ===== GESTION DE L'HISTORIQUE =====

async function loadHistoryList() {
    // ... [Fonction identique] ...
    try {
        const response = await fetch(SERVER_URL + '?list_history=1');
        if (!response.ok) return [];
        
        const result = await response.json();
        return result.success ? result.history : [];
    } catch (error) {
        console.error('Erreur chargement historique:', error);
        return [];
    }
}

async function loadFromHistory(filename) {
    // ... [Fonction identique, garde la confirmation] ...
    try {
        const response = await fetch(SERVER_URL + '?history=' + encodeURIComponent(filename));
        if (!response.ok) {
            showSaveStatus('error', 'Impossible de charger cette sauvegarde');
            return false;
        }
        
        const data = await response.json();
        
        if (!confirm(`Restaurer la sauvegarde "${filename}" ?\n\n⚠️ Cela écrasera les données actuelles.`)) {
            return false;
        }
        
        roundsStore = data.roundsStore;
        currentRoundKey = data.currentRoundKey || 'ronde1';
        arbiterPassword = data.arbiterPassword || null;
        // SUPPRIMÉ: tournamentName
        
        updateRoundSelector();
        loadStateFromStore(currentRoundKey);
        showSaveStatus('success', `✅ Sauvegarde "${filename}" restaurée`);
        return true;
    } catch (error) {
        console.error('Erreur restauration:', error);
        showSaveStatus('error', 'Erreur lors de la restauration');
        return false;
    }
}

// =============================================
// NOUVELLES FONCTIONS DE SUPPRESSION
// =============================================

async function deleteHistoryFile(filename, btnElement) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le fichier "${filename}" ?\n\nCette action est irréversible.`)) {
        return;
    }
    
    try {
        const response = await fetch(SERVER_URL + '?delete=' + encodeURIComponent(filename));
        const result = await response.json();
        
        if (result.success) {
            showSaveStatus('success', result.message || 'Fichier supprimé');
            // Supprimer l'élément de la liste
            btnElement.closest('div[style*="border: 1px solid #ddd"]').remove();
        } else {
            showSaveStatus('error', result.error || 'Erreur de suppression');
        }
    } catch (e) {
        showSaveStatus('error', 'Erreur de connexion lors de la suppression');
    }
}

async function deleteAllHistory() {
    if (!confirm(`ATTENTION !\n\nVous allez supprimer TOUS les fichiers d'historique sur le serveur.\n\nCette action est irréversible. Continuer ?`)) {
        return;
    }
    
    try {
        const response = await fetch(SERVER_URL + '?delete_all=true');
        const result = await response.json();
        
        if (result.success) {
            showSaveStatus('success', result.message || 'Historique effacé');
            // Vider la liste
            const listDiv = document.getElementById('historyList');
            if (listDiv) {
                listDiv.innerHTML = '<p>Aucune sauvegarde disponible.</p>';
            }
        } else {
            showSaveStatus('error', result.error || 'Erreur de suppression');
        }
    } catch (e) {
        showSaveStatus('error', 'Erreur de connexion lors de la suppression');
    }
}

// =============================================
// MODIFICATION DE LA MODALE D'HISTORIQUE
// =============================================

function showHistoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; padding: 25px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;';
    
    // MODIFIÉ: Ajout des boutons de suppression
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px;">📂 Historique des Sauvegardes</h2>
        <div id="historyList" style="margin-bottom: 20px;">
            <p>Chargement...</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <button id="deleteAllHistoryBtn" style="padding: 10px 20px; background: #eb3349; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto; margin-bottom: 0;">
                🗑️ Tout Supprimer
            </button>
            <button id="closeHistoryModal" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto; margin-bottom: 0;">
                Fermer
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Charger la liste
    loadHistoryList().then(history => {
        const listDiv = document.getElementById('historyList');
        
        if (history.length === 0) {
            listDiv.innerHTML = '<p>Aucune sauvegarde disponible.</p>';
            return;
        }
        
        // MODIFIÉ: Ajout du bouton "Supprimer"
        const listHTML = history.slice(0, SAVE_CONFIG.maxHistoryDisplay).map(item => `
            <div style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="min-width: 150px;">
                    <div style="font-weight: bold;">${item.filename}</div>
                    <div style="font-size: 13px; color: #666;">📅 ${item.date}</div>
                    <div style="font-size: 12px; color: #999;">📦 ${(item.size / 1024).toFixed(1)} Ko</div>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="restore-btn" data-file="${item.filename}" style="padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto; margin-bottom: 0;">
                        ↩️ Restaurer
                    </button>
                    <a href="${SERVER_URL}?history=${encodeURIComponent(item.filename)}" download="${item.filename}" style="padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; width: auto; margin-bottom: 0; font-size: 14px; font-weight: 600;">
                        ⬇️ Télécharger
                    </a>
                    <button class="delete-btn" data-file="${item.filename}" style="padding: 8px 12px; background: #eb3349; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto; margin-bottom: 0;">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `).join('');
        
        listDiv.innerHTML = listHTML;
        
        // Event listeners pour les boutons de restauration
        document.querySelectorAll('.restore-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const filename = btn.dataset.file;
                const success = await loadFromHistory(filename);
                if (success) {
                    modal.remove();
                }
            });
        });

        // NOUVEAU: Event listeners pour les boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteHistoryFile(btn.dataset.file, btn);
            });
        });
    });
    
    // Fermer la modale
    document.getElementById('closeHistoryModal').addEventListener('click', () => {
        modal.remove();
    });

    // NOUVEAU: Event listener pour "Tout Supprimer"
    document.getElementById('deleteAllHistoryBtn').addEventListener('click', () => {
        deleteAllHistory();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== GESTION DES MODES =====

function setMode(mode) {
    currentSaveMode = mode;
    
    const modeSelector = document.getElementById('modeSelector');
    const saveStrategySelector = document.getElementById('saveStrategySelector');
    const btnForceSaveServer = document.getElementById('btnForceSaveServer');
    
    if (mode === SAVE_CONFIG.modes.ARBITER) {
        // Mode Arbitre : peut sauvegarder
        if (modeSelector) modeSelector.value = 'arbiter';
        if (btnForceSaveServer) btnForceSaveServer.disabled = false;
        if (saveStrategySelector) saveStrategySelector.disabled = false;
        
        // NOUVEAU: Retire la classe de verrouillage
        document.body.classList.remove('spectator-mode');
        
        showSaveStatus('info', '👨‍⚖️ Mode Arbitre activé - Vous pouvez sauvegarder');
    } else {
        // Mode Spectateur : lecture seule
        if (modeSelector) modeSelector.value = 'spectator';
        if (btnForceSaveServer) btnForceSaveServer.disabled = true;
        if (saveStrategySelector) saveStrategySelector.disabled = true;
        
        // NOUVEAU: Ajoute la classe de verrouillage
        document.body.classList.add('spectator-mode');
        
        showSaveStatus('info', '👁️ Mode Spectateur activé - Lecture seule');
    }
    
    // Réinitialiser les intervalles
    setupAutoSaveIntervals();
}

// ===== CONFIGURATION DES INTERVALLES =====

// MODIFIÉ: Utilise le nouveau dropdown
function setupAutoSaveIntervals() {
    // Nettoyer les anciens intervalles
    if (localSaveInterval) clearInterval(localSaveInterval);
    if (serverSyncInterval) clearInterval(serverSyncInterval);
    
    const strategySelect = document.getElementById('saveStrategySelector');
    if (!strategySelect) return; // Pas encore prêt
    
    const strategy = strategySelect.value;
    
    // Déterminer les actions basées sur la stratégie
    const enableLocalSave = (strategy === 'server_local' || strategy === 'local_only');
    const enableServerSync = (strategy === 'server_local' || strategy === 'server_only');
    
    // Sauvegarde locale automatique
    if (enableLocalSave) {
        localSaveInterval = setInterval(() => {
            saveToLocalStorage();
        }, SAVE_CONFIG.intervals.LOCAL_SAVE);
    }
    
    // Synchronisation serveur (uniquement en mode spectateur OU si autoSync activé)
    if (enableServerSync || currentSaveMode === SAVE_CONFIG.modes.SPECTATOR) {
        serverSyncInterval = setInterval(() => {
            syncFromServerIfNeeded();
        }, SAVE_CONFIG.intervals.SERVER_SYNC);
    }
}

// ===== ÉVÉNEMENTS DE L'INTERFACE =====

// MODIFIÉ: Utilise les nouveaux IDs de boutons et le dropdown
function initSaveControls() {
    console.log('🔧 Initialisation des contrôles de sauvegarde...');
    
    setTimeout(() => {
        const modeSelector = document.getElementById('modeSelector');
        const saveStrategySelector = document.getElementById('saveStrategySelector');
        const btnForceSaveServer = document.getElementById('btnForceSaveServer');
        const btnLoadServer = document.getElementById('btnLoadServer');
        const btnShowHistory = document.getElementById('btnShowHistory');
        
        console.log('🔍 Éléments trouvés:', {
            modeSelector: !!modeSelector,
            saveStrategySelector: !!saveStrategySelector,
            btnForceSaveServer: !!btnForceSaveServer,
            btnLoadServer: !!btnLoadServer,
            btnShowHistory: !!btnShowHistory
        });
        
        if (!btnForceSaveServer) {
            console.error('❌ Boutons non trouvés ! Vérifier que le HTML est bien présent.');
            return;
        }
        
        modeSelector?.addEventListener('change', (e) => {
            setMode(e.target.value);
        });
        
        // NOUVEAU: Listener pour la stratégie
        saveStrategySelector?.addEventListener('change', (e) => {
            setupAutoSaveIntervals();
            showSaveStatus('info', '📡 Stratégie de sauvegarde mise à jour.');
        });
        
        btnForceSaveServer?.addEventListener('click', () => {
            console.log('☁️ Clic sur Forcer Sauvegarde Serveur');
            saveToServer();
        });
        
        btnLoadServer?.addEventListener('click', () => {
            console.log('🔄 Clic sur Recharger Serveur');
            loadFromServer(false); // false = action manuelle, afficher confirmation
        });
        
        btnShowHistory?.addEventListener('click', () => {
            console.log('📂 Clic sur Historique');
            showHistoryModal();
        });
        
        // SUPPRIMÉ: Listeners pour les anciennes cases à cocher
        
        console.log('✅ Event listeners attachés');
        
        // Initialiser les intervalles
        setupAutoSaveIntervals();
    }, 500);
}

// ===== HOOK DE SAUVEGARDE APRÈS RÉSULTAT =====

// MODIFIÉ: Utilise le nouveau dropdown
function onResultSaved() {
    // NOUVEAU: Mettre à jour le timestamp de la dernière action locale
    // Cela met en pause la synchro auto pour éviter les conflits
    lastLocalSaveTime = Date.now(); 

    const strategySelect = document.getElementById('saveStrategySelector');
    if (!strategySelect) return;
    
    const strategy = strategySelect.value;
    
    // Déterminer les actions basées sur la stratégie
    const saveLocal = (strategy === 'server_local' || strategy === 'local_only');
    const saveServer = (strategy === 'server_local' || strategy === 'server_only');
    
    // Toujours sauvegarder localement si l'option est active
    if (saveLocal) {
        saveToLocalStorage();
    }
    
    // Sauvegarder sur serveur si option activée et mode arbitre
    if (saveServer && currentSaveMode === SAVE_CONFIG.modes.ARBITER) {
        saveToServer();
    }
}

// ===== INITIALISATION =====

// À appeler au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initSaveControls();
    
    // Charger depuis le serveur au démarrage
    loadFromServer(true); // true = synchro auto, silencieuse
    
    showSaveStatus('success', '🚀 Système de sauvegarde initialisé');
});

// ===== EXPORT DES FONCTIONS =====
// Ces fonctions peuvent être appelées depuis d'autres parties du code

window.ChessRoomSave = {
    saveLocal: saveToLocalStorage,
    saveServer: saveToServer,
    loadServer: loadFromServer,
    showHistory: showHistoryModal,
    setMode: setMode,
    onResultSaved: onResultSaved
};