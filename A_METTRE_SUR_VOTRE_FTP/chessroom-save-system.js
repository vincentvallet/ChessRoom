// ============================================
// SYSTÈME DE SAUVEGARDE SÉCURISÉ - VERSION CORRIGÉE
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

// Variable locale pour ce module
let lastSaveStatus = { type: '', message: '', timestamp: null };

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

async function loadFromServer(isAutoSync = false) {
    if (!USE_SERVER_SYNC) return false;
    
    try {
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
            
            // CORRECTION: En mode spectateur, ne JAMAIS demander confirmation
            // En mode arbitre, demander uniquement si action manuelle ET données locales existent
            if (!isAutoSync && 
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
                            b.players.white = { name: b.players.white, elo: null };
                            b.players.black = { name: b.players.black, elo: null };
                        }
                        if (!b.players) {
                            b.players = { white: { name: "", elo: null }, black: { name: "", elo: null } };
                        }
                    });
                });
            });
            
            loadStateFromStore(currentRoundKey);
            updateRoundSelector();
            
            if (!isAutoSync) {
                showSaveStatus('success', '✅ Données chargées depuis le serveur');
            }
            return true;
        } else {
            if (!isAutoSync) showSaveStatus('warning', 'Aucune donnée sur le serveur');
            return false;
        }
    } catch (error) {
        console.error('Erreur chargement serveur:', error);
        if (!isAutoSync) showSaveStatus('error', 'Erreur lors du chargement');
        return false;
    }
}

// NOUVEAU: Fonction pour charger depuis localStorage
async function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            showSaveStatus('info', 'Aucune sauvegarde locale trouvée');
            return false;
        }
        
        const data = JSON.parse(saved);
        
        if (data && data.roundsStore && typeof data.roundsStore === 'object') {
            roundsStore = data.roundsStore;
            currentRoundKey = data.currentRoundKey || 'ronde1';
            arbiterPassword = data.arbiterPassword || null;
            
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
                            b.players.white = { name: b.players.white, elo: null };
                            b.players.black = { name: b.players.black, elo: null };
                        }
                        if (!b.players) {
                            b.players = { white: { name: "", elo: null }, black: { name: "", elo: null } };
                        }
                    });
                });
            });
            
            loadStateFromStore(currentRoundKey);
            updateRoundSelector();
            
            showSaveStatus('success', '✅ Données chargées depuis le localStorage');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur chargement localStorage:', error);
        showSaveStatus('error', 'Erreur lors du chargement local');
        return false;
    }
}

// NOUVEAU: Fonction pour purger le localStorage
function purgeLocalStorage() {
    if (!confirm('⚠️ ATTENTION : Supprimer TOUTES les sauvegardes locales ?\n\nCette action est irréversible.\n\nAssurez-vous d\'avoir sauvegardé sur le serveur si nécessaire.')) {
        return;
    }
    
    try {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem(SAVE_KEY_TIMESTAMP);
        showSaveStatus('success', '🗑️ Sauvegardes locales supprimées');
    } catch (error) {
        console.error('Erreur purge localStorage:', error);
        showSaveStatus('error', 'Erreur lors de la suppression');
    }
}

// ===== SYNCHRONISATION AUTOMATIQUE =====

async function syncFromServerIfNeeded() {
    // CORRECTION: Supprimer le délai anti-conflit
    // La synchronisation se fait maintenant immédiatement après chaque action
    
    // En mode spectateur, toujours synchroniser depuis le serveur
    if (currentSaveMode === SAVE_CONFIG.modes.SPECTATOR) {
        await loadFromServer(true); // true = auto sync silencieux
    }
}

// ===== HISTORIQUE SERVEUR =====

async function loadFromHistory(filename) {
    if (!filename) return false;
    
    try {
        showSaveStatus('sync', '🔄 Chargement de l\'historique...');
        
        const response = await fetch(`${SERVER_URL}?history=${encodeURIComponent(filename)}`);
        if (!response.ok) {
            showSaveStatus('error', 'Erreur lors du chargement de l\'historique');
            return false;
        }
        
        const data = await response.json();
        
        if (data && data.roundsStore) {
            if (confirm(`⚠️ Restaurer cette sauvegarde écrasera toutes les données actuelles. Continuer ?`)) {
                roundsStore = data.roundsStore;
                currentRoundKey = data.currentRoundKey || 'ronde1';
                arbiterPassword = data.arbiterPassword || null;
                
                // Migration
                Object.values(roundsStore).forEach(roundState => {
                    if (!roundState.physicalTables) roundState.physicalTables = [];
                    if (!roundState.rooms) roundState.rooms = [];
                    if (!roundState.nextRoomId) roundState.nextRoomId = 1;
                    roundState.physicalTables.forEach(pt => {
                        if (!pt.arbiterComment) pt.arbiterComment = { text: "", flag: "none" };
                        pt.boards.forEach(b => {
                            if (b.score === undefined) b.score = { white: "", black: "" };
                            if (b.players && b.players.white && typeof b.players.white === 'string') {
                                b.players.white = { name: b.players.white, elo: null };
                                b.players.black = { name: b.players.black, elo: null };
                            }
                            if (!b.players) {
                                b.players = { white: { name: "", elo: null }, black: { name: "", elo: null } };
                            }
                        });
                    });
                });
                
                loadStateFromStore(currentRoundKey);
                updateRoundSelector();
                
                // Sauvegarder immédiatement
                saveToLocalStorage();
                if (currentSaveMode === SAVE_CONFIG.modes.ARBITER) {
                    await saveToServer();
                }
                
                showSaveStatus('success', '✅ Historique restauré');
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Erreur restauration historique:', error);
        showSaveStatus('error', 'Erreur lors de la restauration');
        return false;
    }
}

// NOUVEAU: Fonction pour supprimer un fichier d'historique
async function deleteHistoryFile(filename, buttonElement) {
    if (!confirm(`Supprimer définitivement le fichier "${filename}" ?\n\nCette action est irréversible.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}?delete=${encodeURIComponent(filename)}`);
        if (!response.ok) {
            showSaveStatus('error', 'Erreur lors de la suppression');
            return;
        }
        
        const result = await response.json();
        if (result.success) {
            // Retirer visuellement l'élément
            const historyItem = buttonElement.closest('.history-item');
            if (historyItem) {
                historyItem.style.opacity = '0';
                setTimeout(() => historyItem.remove(), 300);
            }
            showSaveStatus('success', `Fichier ${filename} supprimé`);
        } else {
            showSaveStatus('error', 'Impossible de supprimer le fichier');
        }
    } catch (error) {
        console.error('Erreur suppression:', error);
        showSaveStatus('error', 'Erreur lors de la suppression');
    }
}

// NOUVEAU: Fonction pour supprimer TOUT l'historique
async function deleteAllHistory() {
    if (!confirm('⚠️ ATTENTION : Supprimer TOUT l\'historique du serveur ?\n\nCette action est IRRÉVERSIBLE et supprimera toutes les sauvegardes automatiques.\n\nLes données actuelles ne seront pas affectées.')) {
        return;
    }
    
    // Double confirmation pour sécurité
    if (!confirm('Confirmez-vous vraiment la suppression de TOUT l\'historique ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${SERVER_URL}?delete_all=true`);
        if (!response.ok) {
            showSaveStatus('error', 'Erreur lors de la suppression');
            return;
        }
        
        const result = await response.json();
        if (result.success) {
            // Fermer la modale et recharger
            const modal = document.getElementById('historyModal');
            if (modal) modal.remove();
            
            showSaveStatus('success', result.message);
        } else {
            showSaveStatus('error', 'Impossible de supprimer l\'historique');
        }
    } catch (error) {
        console.error('Erreur suppression totale:', error);
        showSaveStatus('error', 'Erreur lors de la suppression');
    }
}

async function showHistoryModal() {
    if (!USE_SERVER_SYNC) {
        alert('La synchronisation serveur doit être activée pour voir l\'historique.');
        return;
    }
    
    try {
        showSaveStatus('sync', '🔄 Chargement de l\'historique...');
        
        const response = await fetch(`${SERVER_URL}?list_history=true`);
        if (!response.ok) {
            showSaveStatus('error', 'Erreur lors du chargement de l\'historique');
            return;
        }
        
        const result = await response.json();
        if (!result.success || !result.history) {
            showSaveStatus('warning', 'Aucun historique trouvé');
            return;
        }
        
        showHistoryList(result.history);
        showSaveStatus('success', 'Historique chargé');
    } catch (error) {
        console.error('Erreur chargement historique:', error);
        showSaveStatus('error', 'Impossible de charger l\'historique');
    }
}

function showHistoryList(historyItems) {
    // Créer la modale
    const modal = document.createElement('div');
    modal.id = 'historyModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #2c3e50;">📂 Historique des sauvegardes</h2>
                <button id="closeHistoryModal" style="background: #eb3349; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 1.2em; cursor: pointer; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
            
            <div style="margin-bottom: 15px; padding: 10px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <strong>ℹ️ Info :</strong> Les sauvegardes sont créées automatiquement à chaque modification.
            </div>
            
            <button id="deleteAllHistoryBtn" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 20px; width: 100%;">
                🗑️ Supprimer TOUT l'historique
            </button>
            
            <div id="historyList"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remplir la liste
    const listDiv = document.getElementById('historyList');
    
    if (historyItems.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">Aucune sauvegarde trouvée</p>';
        return;
    }
    
    // Limiter l'affichage
    const displayItems = historyItems.slice(0, SAVE_CONFIG.maxHistoryDisplay);
    
    const listHTML = displayItems.map(item => `
        <div class="history-item" style="border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin-bottom: 10px; transition: all 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">${item.filename}</div>
                    <div style="color: #6c757d; font-size: 0.9em;">
                        📅 ${item.date} | 💾 ${(item.size / 1024).toFixed(2)} Ko
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="restore-btn" data-file="${item.filename}" style="padding: 8px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; width: auto; margin-bottom: 0;">
                        🔄 Restaurer
                    </button>
                    <a href="${SERVER_URL}?history=${encodeURIComponent(item.filename)}" download="${item.filename}" style="padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; white-space: nowrap; width: auto; margin-bottom: 0;">
                        ⬇️ Télécharger
                    </a>
                    <button class="delete-btn" data-file="${item.filename}" style="padding: 8px 12px; background: #eb3349; color: white; border: none; border-radius: 4px; cursor: pointer; width: auto; margin-bottom: 0;">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    listDiv.innerHTML = listHTML;
    
    // Event listeners
    document.querySelectorAll('.restore-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const filename = btn.dataset.file;
            const success = await loadFromHistory(filename);
            if (success) {
                modal.remove();
            }
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            deleteHistoryFile(btn.dataset.file, btn);
        });
    });
    
    document.getElementById('closeHistoryModal').addEventListener('click', () => {
        modal.remove();
    });
    
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
    const btnShowHistory = document.getElementById('btnShowHistory');
    
    if (mode === SAVE_CONFIG.modes.ARBITER) {
        // Mode Arbitre : peut sauvegarder
        if (modeSelector) modeSelector.value = 'arbiter';
        if (btnShowHistory) btnShowHistory.disabled = false;
        if (saveStrategySelector) saveStrategySelector.disabled = false;
        
        document.body.classList.remove('spectator-mode');
        
        showSaveStatus('info', '👨‍⚖️ Mode Arbitre activé - Vous pouvez modifier et sauvegarder');
    } else {
        // Mode Spectateur : lecture seule
        if (modeSelector) modeSelector.value = 'spectator';
        if (btnShowHistory) btnShowHistory.disabled = false; // Peut voir l'historique
        if (saveStrategySelector) saveStrategySelector.disabled = true;
        
        document.body.classList.add('spectator-mode');
        
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
    
    const strategySelect = document.getElementById('saveStrategySelector');
    if (!strategySelect) return;
    
    const strategy = strategySelect.value;
    
    // CORRECTION: Stratégies strictement séparées - pas de mélange
    if (strategy === 'local_only') {
        // MODE LOCAL : Sauvegarde locale uniquement, AUCUNE synchronisation serveur
        if (currentSaveMode === SAVE_CONFIG.modes.ARBITER) {
            localSaveInterval = setInterval(() => {
                saveToLocalStorage();
            }, SAVE_CONFIG.intervals.LOCAL_SAVE);
        }
        // Pas de serverSyncInterval en mode local
        console.log('Mode local: Sauvegarde locale activée, serveur désactivé');
        
    } else if (strategy === 'server_only') {
        // MODE SERVEUR : Synchronisation serveur uniquement, pas de sauvegarde locale auto
        serverSyncInterval = setInterval(() => {
            syncFromServerIfNeeded();
        }, SAVE_CONFIG.intervals.SERVER_SYNC);
        console.log('Mode serveur: Synchronisation serveur activée');
    }
}

// ===== ÉVÉNEMENTS DE L'INTERFACE =====

function initSaveControls() {
    console.log('🔧 Initialisation des contrôles de sauvegarde...');
    
    setTimeout(() => {
        const modeSelector = document.getElementById('modeSelector');
        const saveStrategySelector = document.getElementById('saveStrategySelector');
        const btnShowHistory = document.getElementById('btnShowHistory');
        
        console.log('🔍 Éléments trouvés:', {
            modeSelector: !!modeSelector,
            saveStrategySelector: !!saveStrategySelector,
            btnShowHistory: !!btnShowHistory
        });
        
        if (!modeSelector) {
            console.error('❌ Sélecteur de mode non trouvé !');
            return;
        }
        
        // Listener pour changement de mode avec validation
        modeSelector?.addEventListener('change', (e) => {
            const newMode = e.target.value;
            
            // Si on passe de spectateur à arbitre, demander le mot de passe
            if (newMode === 'arbiter' && currentSaveMode === SAVE_CONFIG.modes.SPECTATOR) {
                if (!arbiterPassword) {
                    // Pas de mot de passe défini, créer un maintenant
                    alert("⚠️ Aucun mot de passe arbitre n'est défini.\n\nVeuillez en créer un pour sécuriser l'accès au mode Arbitre.");
                    document.getElementById('arbiterPassModal').style.display = 'flex';
                    modeSelector.value = 'spectator'; // Rester en spectateur
                    return;
                }
                
                // Afficher la modale de validation
                document.getElementById('switchToArbiterModal').style.display = 'flex';
                document.getElementById('switchArbiterPassInput').value = '';
                document.getElementById('switchArbiterPassInput').focus();
                
                // Remettre temporairement en spectateur (sera changé après validation)
                modeSelector.value = 'spectator';
            } else {
                // Passage de arbitre à spectateur : toujours autorisé
                setMode(newMode);
            }
        });
        
        // Listener pour la stratégie
        saveStrategySelector?.addEventListener('change', (e) => {
            const newStrategy = e.target.value;
            
            // CORRECTION: Recharger les données selon la nouvelle stratégie
            if (newStrategy === 'server_only') {
                console.log('Changement vers mode serveur - Chargement serveur...');
                loadFromServer(false); // false = action manuelle, afficher confirmation si conflit
            } else if (newStrategy === 'local_only') {
                console.log('Changement vers mode local - Chargement localStorage...');
                const hasLocalData = localStorage.getItem(SAVE_KEY);
                if (hasLocalData) {
                    loadFromLocalStorage();
                } else {
                    showSaveStatus('info', 'Mode local activé - Aucune sauvegarde locale');
                }
            }
            
            setupAutoSaveIntervals();
            showSaveStatus('info', '📡 Stratégie de sauvegarde mise à jour.');
        });
        
        btnShowHistory?.addEventListener('click', () => {
            console.log('📂 Clic sur Historique');
            showHistoryModal();
        });
        
        console.log('✅ Event listeners attachés');
        
        // Initialiser les intervalles
        setupAutoSaveIntervals();
    }, 500);
}

// Fonction pour valider le passage en mode Arbitre
window.validateSwitchToArbiter = function() {
    const passwordInput = document.getElementById('switchArbiterPassInput');
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === arbiterPassword) {
        // Mot de passe correct
        document.getElementById('switchToArbiterModal').style.display = 'none';
        document.getElementById('modeSelector').value = 'arbiter';
        setMode(SAVE_CONFIG.modes.ARBITER);
        showSaveStatus('success', '✅ Mode Arbitre activé');
    } else {
        // Mot de passe incorrect
        alert('❌ Mot de passe incorrect');
        passwordInput.value = '';
        passwordInput.focus();
    }
};

// Fonction pour annuler le passage en mode Arbitre
window.cancelSwitchToArbiter = function() {
    document.getElementById('switchToArbiterModal').style.display = 'none';
    document.getElementById('modeSelector').value = 'spectator';
};

// ===== HOOK DE SAUVEGARDE APRÈS RÉSULTAT =====

function onResultSaved() {
    // CORRECTION: Sauvegarder IMMÉDIATEMENT selon la stratégie stricte
    
    const strategySelect = document.getElementById('saveStrategySelector');
    if (!strategySelect) return;
    
    const strategy = strategySelect.value;
    
    // Vérifier qu'on est bien en mode arbitre
    if (currentSaveMode !== SAVE_CONFIG.modes.ARBITER) {
        console.log('Mode spectateur - Pas de sauvegarde');
        return;
    }
    
    // CORRECTION: Mode strictement séparé
    if (strategy === 'local_only') {
        // MODE LOCAL : Sauvegarder UNIQUEMENT en local
        console.log('Sauvegarde locale immédiate');
        saveToLocalStorage();
    } else if (strategy === 'server_only') {
        // MODE SERVEUR : Sauvegarder UNIQUEMENT sur serveur
        console.log('Sauvegarde serveur immédiate');
        saveToServer();
    }
}

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', () => {
    initSaveControls();
    
    // CORRECTION: Charger VRAIMENT selon la stratégie
    const strategySelect = document.getElementById('saveStrategySelector');
    const strategy = strategySelect ? strategySelect.value : 'server_only';
    
    // IMPORTANT: Vérifier d'abord si on a des données locales
    const hasLocalData = localStorage.getItem(SAVE_KEY);
    
    if (strategy === 'local_only') {
        // MODE LOCAL : Charger UNIQUEMENT depuis localStorage, jamais depuis serveur
        if (hasLocalData) {
            console.log('Mode local: Chargement depuis localStorage');
            loadFromLocalStorage();
        } else {
            console.log('Mode local: Aucune donnée locale - Nouveau tournoi');
            showSaveStatus('info', 'Mode local - Nouveau tournoi');
        }
    } else {
        // MODE SERVEUR : Charger depuis serveur
        console.log('Mode serveur: Chargement depuis serveur');
        loadFromServer(true);
    }
    
    // NOUVEAU: Démarrer en mode SPECTATEUR par défaut
    setMode(SAVE_CONFIG.modes.SPECTATOR);
    
    // NOUVEAU: Listener pour Enter dans la modale de switch
    const switchModal = document.getElementById('switchToArbiterModal');
    if (switchModal) {
        switchModal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                validateSwitchToArbiter();
            } else if (e.key === 'Escape') {
                cancelSwitchToArbiter();
            }
        });
    }
    
    showSaveStatus('success', '🚀 Système de sauvegarde initialisé - Mode Spectateur');
});

// ===== EXPORT DES FONCTIONS =====

window.ChessRoomSave = {
    saveLocal: saveToLocalStorage,
    saveServer: saveToServer,
    loadServer: loadFromServer,
    showHistory: showHistoryModal,
    setMode: setMode,
    onResultSaved: onResultSaved
};
