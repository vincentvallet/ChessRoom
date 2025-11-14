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
// - tournamentName
// - currentSaveMode
// - autoSaveLocalEnabled
// - autoSaveServerEnabled
// - autoSyncEnabled
// - localSaveInterval
// - serverSyncInterval
// - lastServerTimestamp

// Variable locale pour ce module
let lastSaveStatus = { type: '', message: '', timestamp: null };

// ===== INTERFACE UTILISATEUR =====

// HTML à ajouter dans la barre d'outils
const saveControlsHTML = `
<div class="save-controls" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
    <div style="margin-bottom: 15px;">
        <label style="font-weight: bold; display: block; margin-bottom: 8px;">🎮 Mode de Fonctionnement</label>
        <select id="modeSelector" style="padding: 8px; border-radius: 4px; border: 1px solid #ddd; width: 100%;">
            <option value="arbiter">👨‍⚖️ Arbitre (Saisie + Sauvegarde)</option>
            <option value="spectator">👁️ Spectateur (Lecture seule)</option>
        </select>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
        <button id="btnSaveLocal" class="save-btn" style="padding: 10px; border-radius: 4px; border: none; background: #28a745; color: white; cursor: pointer;">
            💾 Sauvegarde Locale
        </button>
        <button id="btnSaveServer" class="save-btn" style="padding: 10px; border-radius: 4px; border: none; background: #007bff; color: white; cursor: pointer;">
            ☁️ Sauvegarder Serveur
        </button>
        <button id="btnLoadServer" class="save-btn" style="padding: 10px; border-radius: 4px; border: none; background: #17a2b8; color: white; cursor: pointer;">
            🔄 Recharger Serveur
        </button>
        <button id="btnShowHistory" class="save-btn" style="padding: 10px; border-radius: 4px; border: none; background: #6c757d; color: white; cursor: pointer;">
            📂 Historique
        </button>
    </div>
    
    <div style="border-top: 1px solid #ddd; padding-top: 12px;">
        <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
            <input type="checkbox" id="chkAutoSaveLocal" checked style="margin-right: 8px;">
            <span>💾 Sauvegarde automatique locale (30s)</span>
        </label>
        <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
            <input type="checkbox" id="chkAutoSaveServer" style="margin-right: 8px;">
            <span>☁️ Sauvegarde automatique serveur (après chaque résultat)</span>
        </label>
        <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
            <input type="checkbox" id="chkAutoSync" checked style="margin-right: 8px;">
            <span>🔄 Synchronisation automatique (5s)</span>
        </label>
    </div>
    
    <div id="saveStatus" style="margin-top: 12px; padding: 10px; border-radius: 4px; font-size: 13px; display: none;">
        <!-- Messages de statut -->
    </div>
</div>
`;

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
            tournamentName: tournamentName || 'tournoi',
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
            tournamentName: tournamentName || 'tournoi',
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

async function loadFromServer() {
    if (!USE_SERVER_SYNC) return false;
    
    try {
        showSaveStatus('sync', '🔄 Chargement depuis le serveur...');
        
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            showSaveStatus('error', 'Erreur lors du chargement serveur');
            return false;
        }
        
        const data = await response.json();
        
        if (data && data.roundsStore && typeof data.roundsStore === 'object' && 
            Object.keys(data.roundsStore).length > 0) {
            
            // Vérifier si les données ont changé
            const currentJson = JSON.stringify(roundsStore);
            const serverJson = JSON.stringify(data.roundsStore);
            
            if (currentJson === serverJson) {
                showSaveStatus('info', 'ℹ️ Les données sont déjà à jour');
                return false;
            }
            
            // Demander confirmation si on a des données locales non sauvegardées
            if (currentSaveMode === SAVE_CONFIG.modes.ARBITER && 
                Object.keys(roundsStore).length > 0) {
                if (!confirm('⚠️ Charger les données du serveur écrasera vos modifications locales. Continuer ?')) {
                    showSaveStatus('warning', 'Chargement annulé');
                    return false;
                }
            }
            
            roundsStore = data.roundsStore;
            currentRoundKey = data.currentRoundKey || 'ronde1';
            arbiterPassword = data.arbiterPassword || null;
            tournamentName = data.tournamentName || '';
            
            // Migration des données
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
        
        showSaveStatus('info', 'Aucune donnée sur le serveur');
        return false;
    } catch (error) {
        console.error('❌ Erreur chargement serveur:', error);
        showSaveStatus('error', 'Erreur lors du chargement serveur');
        return false;
    }
}

// ===== SYNCHRONISATION AUTOMATIQUE =====

function syncFromServerIfNeeded() {
    // Uniquement en mode spectateur ou si autoSync activé
    if (currentSaveMode !== SAVE_CONFIG.modes.SPECTATOR && !autoSyncEnabled) {
        return;
    }
    
    // Ne pas synchroniser si une modale est ouverte
    if (document.querySelector('.modal-overlay[style*="display: flex"]')) {
        return;
    }
    
    loadFromServer();
}

// ===== GESTION DE L'HISTORIQUE =====

async function loadHistoryList() {
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
        tournamentName = data.tournamentName || '';
        
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

function showHistoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; padding: 25px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;';
    
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px;">📂 Historique des Sauvegardes</h2>
        <div id="historyList" style="margin-bottom: 20px;">
            <p>Chargement...</p>
        </div>
        <button id="closeHistoryModal" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Fermer
        </button>
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
        
        const listHTML = history.slice(0, SAVE_CONFIG.maxHistoryDisplay).map(item => `
            <div style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold;">${item.filename}</div>
                    <div style="font-size: 13px; color: #666;">📅 ${item.date}</div>
                    <div style="font-size: 12px; color: #999;">📦 ${(item.size / 1024).toFixed(1)} Ko</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="restore-btn" data-file="${item.filename}" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        ↩️ Restaurer
                    </button>
                    <a href="${SERVER_URL}?history=${encodeURIComponent(item.filename)}" download="${item.filename}" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block;">
                        ⬇️ Télécharger
                    </a>
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
    });
    
    // Fermer la modale
    document.getElementById('closeHistoryModal').addEventListener('click', () => {
        modal.remove();
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
    const chkAutoSaveServer = document.getElementById('chkAutoSaveServer');
    const chkAutoSync = document.getElementById('chkAutoSync');
    const btnSaveServer = document.getElementById('btnSaveServer');
    
    if (mode === SAVE_CONFIG.modes.ARBITER) {
        // Mode Arbitre : peut sauvegarder
        if (modeSelector) modeSelector.value = 'arbiter';
        if (btnSaveServer) btnSaveServer.disabled = false;
        if (chkAutoSaveServer) chkAutoSaveServer.disabled = false;
        
        showSaveStatus('info', '👨‍⚖️ Mode Arbitre activé - Vous pouvez sauvegarder');
    } else {
        // Mode Spectateur : lecture seule
        if (modeSelector) modeSelector.value = 'spectator';
        if (btnSaveServer) btnSaveServer.disabled = true;
        if (chkAutoSaveServer) {
            chkAutoSaveServer.checked = false;
            chkAutoSaveServer.disabled = true;
        }
        autoSaveServerEnabled = false;
        
        showSaveStatus('info', '👁️ Mode Spectateur activé - Lecture seule');
    }
    
    // Réinitialiser les intervalles
    setupAutoSaveIntervals();
}

// ===== CONFIGURATION DES INTERVALLES =====

function setupAutoSaveIntervals() {
    // Nettoyer les anciens intervalles
    if (localSaveInterval) clearInterval(localSaveInterval);
    if (serverSyncInterval) clearInterval(serverSyncInterval);
    
    // Sauvegarde locale automatique
    if (autoSaveLocalEnabled) {
        localSaveInterval = setInterval(() => {
            saveToLocalStorage();
        }, SAVE_CONFIG.intervals.LOCAL_SAVE);
    }
    
    // Synchronisation serveur (uniquement en mode spectateur ou si autoSync activé)
    if (autoSyncEnabled || currentSaveMode === SAVE_CONFIG.modes.SPECTATOR) {
        serverSyncInterval = setInterval(() => {
            syncFromServerIfNeeded();
        }, SAVE_CONFIG.intervals.SERVER_SYNC);
    }
}

// ===== ÉVÉNEMENTS DE L'INTERFACE =====

function initSaveControls() {
    // Le HTML est déjà présent dans index.html, on attache juste les event listeners
    console.log('🔧 Initialisation des contrôles de sauvegarde...');
    
    // Attendre un peu que le DOM soit complètement chargé
    setTimeout(() => {
        // Event listeners
    // Event listeners
    const modeSelector = document.getElementById('modeSelector');
    const btnSaveLocal = document.getElementById('btnSaveLocal');
    const btnSaveServer = document.getElementById('btnSaveServer');
    const btnLoadServer = document.getElementById('btnLoadServer');
    const btnShowHistory = document.getElementById('btnShowHistory');
    const chkAutoSaveLocal = document.getElementById('chkAutoSaveLocal');
    const chkAutoSaveServer = document.getElementById('chkAutoSaveServer');
    const chkAutoSync = document.getElementById('chkAutoSync');
    
    console.log('🔍 Éléments trouvés:', {
        modeSelector: !!modeSelector,
        btnSaveLocal: !!btnSaveLocal,
        btnSaveServer: !!btnSaveServer,
        btnLoadServer: !!btnLoadServer,
        btnShowHistory: !!btnShowHistory,
        chkAutoSaveLocal: !!chkAutoSaveLocal,
        chkAutoSaveServer: !!chkAutoSaveServer,
        chkAutoSync: !!chkAutoSync
    });
    
    if (!btnSaveLocal) {
        console.error('❌ Boutons non trouvés ! Vérifier que le HTML est bien présent.');
        return;
    }
    
    modeSelector?.addEventListener('change', (e) => {
        setMode(e.target.value);
    });
    
    btnSaveLocal?.addEventListener('click', () => {
        console.log('💾 Clic sur Sauvegarde Locale');
        saveToLocalStorage();
    });
    
    btnSaveServer?.addEventListener('click', () => {
        console.log('☁️ Clic sur Sauvegarder Serveur');
        saveToServer();
    });
    
    btnLoadServer?.addEventListener('click', () => {
        console.log('🔄 Clic sur Recharger Serveur');
        loadFromServer();
    });
    
    btnShowHistory?.addEventListener('click', () => {
        console.log('📂 Clic sur Historique');
        showHistoryModal();
    });
    
    chkAutoSaveLocal?.addEventListener('change', (e) => {
        autoSaveLocalEnabled = e.target.checked;
        setupAutoSaveIntervals();
        showSaveStatus('info', autoSaveLocalEnabled ? 
            '✅ Sauvegarde locale auto activée' : 
            '⏸️ Sauvegarde locale auto désactivée');
    });
    
    chkAutoSaveServer?.addEventListener('change', (e) => {
        autoSaveServerEnabled = e.target.checked;
        if (currentSaveMode !== SAVE_CONFIG.modes.ARBITER) {
            e.target.checked = false;
            autoSaveServerEnabled = false;
            showSaveStatus('warning', '⚠️ Disponible uniquement en mode Arbitre');
        } else {
            showSaveStatus('info', autoSaveServerEnabled ? 
                '✅ Sauvegarde serveur auto activée' : 
                '⏸️ Sauvegarde serveur auto désactivée');
        }
    });
    
    chkAutoSync?.addEventListener('change', (e) => {
        autoSyncEnabled = e.target.checked;
        setupAutoSaveIntervals();
        showSaveStatus('info', autoSyncEnabled ? 
            '✅ Synchronisation auto activée' : 
            '⏸️ Synchronisation auto désactivée');
    });
    
    console.log('✅ Event listeners attachés');
    
    // Initialiser les intervalles
    setupAutoSaveIntervals();
    }, 500); // Attendre 500ms pour être sûr que le DOM est prêt
}

// ===== HOOK DE SAUVEGARDE APRÈS RÉSULTAT =====

// À appeler après chaque saisie de résultat
function onResultSaved() {
    // Toujours sauvegarder localement
    saveToLocalStorage();
    
    // Sauvegarder sur serveur si option activée et mode arbitre
    if (autoSaveServerEnabled && currentSaveMode === SAVE_CONFIG.modes.ARBITER) {
        saveToServer();
    }
}

// ===== INITIALISATION =====

// À appeler au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initSaveControls();
    
    // Charger depuis le serveur au démarrage
    loadFromServer();
    
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
