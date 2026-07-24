const STATE_KEY = 'hud_system_state';

// Global state container initialization
let systemState = JSON.parse(localStorage.getItem(STATE_KEY)) || {
    hp: 100,
    mp: 100,
    mpMax: 100,
    lastSavedDate: ""
};

if (!systemState.mpMax || systemState.mpMax <= 0) systemState.mpMax = 100;
if (systemState.hp === undefined) systemState.hp = 100;
if (systemState.mp === undefined) systemState.mp = 100;

// SAFE BOOT SYSTEM: Binds functions globally to the browser window immediately
window.switchTab = function(targetTab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-tabs .tab-btn').forEach(t => t.remove('active-tab'));
    
    const panel = document.getElementById(`panel-${targetTab}`);
    const tabBtn = document.getElementById(`tab-${targetTab}`);
    
    if (panel) panel.classList.remove('hidden');
    if (tabBtn) tabBtn.classList.add('active-tab');
};

window.processAwakening = function(choice) {
    const todayStr = getTodayDateString();
    systemState.lastSavedDate = todayStr;

    if (choice === 'perfect') {
        systemState.hp = 100; systemState.mpMax = 100; systemState.mp = 100;
        appendLogToSystem("[Awakening: Perfect Rest logged.]");
    } else if (choice === 'mediocre') {
        systemState.hp = Math.min(100, systemState.hp + 25); systemState.mpMax = 70; systemState.mp = 70;
        appendLogToSystem("[Awakening: Mediocre Sleep logged.]");
    } else if (choice === 'trash') {
        systemState.hp = Math.max(0, systemState.hp - 10); systemState.mpMax = 40; systemState.mp = 40;
        appendLogToSystem("[Awakening: Trash Sleep logged.]");
    }

    const modal = document.getElementById('awakening-modal');
    if (modal) modal.classList.add('hidden');
    
    saveStateToStorage();
    renderInterface();
};

window.applyLifeEvent = function() {
    const textElement = document.getElementById('event-text');
    const hpElement = document.getElementById('event-hp');
    const mpElement = document.getElementById('event-mp');

    if (!textElement || !hpElement || !mpElement) return;
    const rawName = textElement.value.trim();

    if (rawName === "") {
        textElement.style.borderColor = "#ff4d4d"; 
        textElement.placeholder = "ERROR: NAME IS REQUIRED TO LOG EVENT!";
        return;
    }

    textElement.style.borderColor = "#45a29e";
    textElement.placeholder = "Type event name (REQUIRED)...";

    const hpMod = parseInt(hpElement.value) || 0;
    const mpMod = parseInt(mpElement.value) || 0;

    systemState.hp = Math.min(100, Math.max(0, systemState.hp + hpMod));
    systemState.mp = Math.min(systemState.mpMax, Math.max(0, systemState.mp + mpMod));

    saveStateToStorage();
    renderInterface();

    const logBox = document.getElementById('combat-log');
    if (logBox) {
        const newEntry = document.createElement('div');
        newEntry.className = `log-entry ${(hpMod < 0 || mpMod < 0) ? 'loss-msg' : 'gain-msg'}`;
        newEntry.textContent = `⚔️ ${rawName}: ${hpMod >= 0 ? '+' : ''}${hpMod} HP, ${mpMod >= 0 ? '+' : ''}${mpMod} MP`;
        logBox.appendChild(newEntry);
        logBox.scrollTop = logBox.scrollHeight;
        localStorage.setItem('hud_html_log', logBox.innerHTML);
    }
    
    textElement.value = "";
};

window.clearLog = function() {
    const logBox = document.getElementById('combat-log');
    if (logBox) logBox.innerHTML = '<div class="log-entry system-msg">[Log wiped clean.]</div>';
    localStorage.removeItem('hud_html_log');
};

function renderInterface() {
    const hpCurrentEl = document.getElementById('hp-current');
    const mpCurrentEl = document.getElementById('mp-current');
    const mpMaxEl = document.getElementById('mp-max-label');
    const hpFillEl = document.getElementById('hp-fill');
    const mpFillEl = document.getElementById('mp-fill');

    if (hpCurrentEl) hpCurrentEl.textContent = systemState.hp;
    if (mpCurrentEl) mpCurrentEl.textContent = systemState.mp;
    if (mpMaxEl) mpMaxEl.textContent = systemState.mpMax;

    if (hpFillEl) hpFillEl.style.width = `${systemState.hp}%`;
    if (mpFillEl) mpFillEl.style.width = `${(systemState.mp / systemState.mpMax) * 100}%`;

    const logBox = document.getElementById('combat-log');
    const savedHtmlLog = localStorage.getItem('hud_html_log');
    if (logBox && savedHtmlLog) {
        logBox.innerHTML = savedHtmlLog;
        logBox.scrollTop = logBox.scrollHeight;
    }
}

function getTodayDateString() {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
}

function appendLogToSystem(message) {
    const logBox = document.getElementById('combat-log');
    if (logBox) {
        const systemMsg = document.createElement('div');
        systemMsg.className = 'log-entry system-msg';
        systemMsg.textContent = message;
        logBox.appendChild(systemMsg);
        localStorage.setItem('hud_html_log', logBox.innerHTML);
    }
}

function saveStateToStorage() {
    localStorage.setItem(STATE_KEY, JSON.stringify(systemState));
}

// Global initialization listener
document.addEventListener("DOMContentLoaded", () => {
    const todayStr = getTodayDateString();
    const dateDisplay = document.getElementById('date-display');
    if (dateDisplay) dateDisplay.textContent = todayStr;

    const modal = document.getElementById('awakening-modal');
    if (systemState.lastSavedDate !== todayStr && modal) {
        modal.classList.remove('hidden');
    } else {
        renderInterface();
    }
});


