// Strict Global State Tracking Variable Definitions
const STATE_KEY = 'hud_system_state';

let systemState = JSON.parse(localStorage.getItem(STATE_KEY)) || {
    hp: 100,
    mp: 100,
    mpMax: 100,
    lastSavedDate: ""
};

// Triggers layout paint checks the millisecond DOM compiles safely
document.addEventListener("DOMContentLoaded", () => {
    // 1. Calculate and update the current calendar timestamp string safely
    const todayStr = getTodayDateString();
    const dateDisplay = document.getElementById('date-display');
    if (dateDisplay) {
        dateDisplay.textContent = todayStr;
    }

    // 2. Automated Morning Awakening Lock Checker
    const modal = document.getElementById('awakening-modal');
    if (systemState.lastSavedDate !== todayStr && modal) {
        modal.classList.remove('hidden');
    } else {
        renderInterface();
    }
});

// Process option selection made via daily awakening overlay prompt
function processAwakening(choice) {
    const todayStr = getTodayDateString();
    systemState.lastSavedDate = todayStr;

    if (choice === 'perfect') {
        systemState.hp = 100;
        systemState.mpMax = 100;
        systemState.mp = 100;
        appendLogToSystem("[Awakening: Perfect Rest logged. HP restored to 100, MP Max sets to 100.]");
    } else if (choice === 'mediocre') {
        systemState.hp = Math.min(100, systemState.hp + 25);
        systemState.mpMax = 70;
        systemState.mp = 70;
        appendLogToSystem("[Awakening: Mediocre Sleep logged. HP +25, MP Max capped at 70.]");
    } else if (choice === 'trash') {
        systemState.hp = Math.max(0, systemState.hp - 10);
        systemState.mpMax = 40;
        systemState.mp = 40;
        appendLogToSystem("[Awakening: Trash Sleep logged. HP -10, MP Max capped at 40.]");
    }

    // Hide prompt layer safely
    const modal = document.getElementById('awakening-modal');
    if (modal) modal.classList.add('hidden');
    
    saveStateToStorage();
    renderInterface();
}

function applyLifeEvent() {
    const textElement = document.getElementById('event-text');
    const hpElement = document.getElementById('event-hp');
    const mpElement = document.getElementById('event-mp');

    if (!textElement || !hpElement || !mpElement) return;

    const rawName = textElement.value.trim();
    const hpMod = parseInt(hpElement.value) || 0;
    const mpMod = parseInt(mpElement.value) || 0;
    const finalEventName = rawName === "" ? "Activity Tracked" : rawName;

    // Enforce limits parsing custom cap boundaries dynamically
    systemState.hp = Math.min(100, Math.max(0, systemState.hp + hpMod));
    systemState.mp = Math.min(systemState.mpMax, Math.max(0, systemState.mp + mpMod));

    saveStateToStorage();
    renderInterface();

    // Create entry element inside scroll history box
    const logBox = document.getElementById('combat-log');
    if (logBox) {
        const newEntry = document.createElement('div');
        const styleIndicator = (hpMod < 0 || mpMod < 0) ? 'loss-msg' : 'gain-msg';
        newEntry.className = `log-entry ${styleIndicator}`;

        const hpSign = hpMod >= 0 ? `+${hpMod}` : `${hpMod}`;
        const mpSign = mpMod >= 0 ? `+${mpMod}` : `${mpMod}`;
        newEntry.textContent = `⚔️ ${finalEventName}: ${hpSign} HP, ${mpSign} MP`;

        logBox.appendChild(newEntry);
        logBox.scrollTop = logBox.scrollHeight;
        localStorage.setItem('hud_html_log', logBox.innerHTML);
    }
    
    textElement.value = "";
}

function renderInterface() {
    // Safety check wrappers to prevent textContent property errors
    const hpCurrentEl = document.getElementById('hp-current');
    const mpCurrentEl = document.getElementById('mp-current');
    const mpMaxEl = document.getElementById('mp-max-label');
    const hpFillEl = document.getElementById('hp-fill');
    const mpFillEl = document.getElementById('mp-fill');

    if (hpCurrentEl) hpCurrentEl.textContent = systemState.hp;
    if (mpCurrentEl) mpCurrentEl.textContent = systemState.mp;
    if (mpMaxEl) mpMaxEl.textContent = systemState.mpMax;

    if (hpFillEl) hpFillEl.style.width = `${systemState.hp}%`;
    if (mpFillEl) mpFillEl.style.width = `${(systemState.mp / 100) * 100}%`;

    // Load historical strings inside scroll element 
    const logBox = document.getElementById('combat-log');
    const savedHtmlLog = localStorage.getItem('hud_html_log');
    if (logBox && savedHtmlLog) {
        logBox.innerHTML = savedHtmlLog;
        logBox.scrollTop = logBox.scrollHeight;
    }
}

function switchTab(targetTab) {
    const panels = document.querySelectorAll('.tab-panel');
    const tabs = document.querySelectorAll('.nav-tabs .tab-btn');

    panels.forEach(p => p.classList.add('hidden'));
    tabs.forEach(t => t.classList.remove('active-tab'));

    const targetPanel = document.getElementById(`panel-${targetTab}`);
    const targetTabBtn = document.getElementById(`tab-${targetTab}`);
    
    if (targetPanel) targetPanel.classList.remove('hidden');
    if (targetTabBtn) targetTabBtn.classList.add('active-tab');
}

function getTodayDateString() {
    const options = { month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options).toUpperCase();
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

function clearLog() {
    const logBox = document.getElementById('combat-log');
    if (logBox) {
        logBox.innerHTML = '<div class="log-entry system-msg">[Log wiped clean.]</div>';
    }
    localStorage.removeItem('hud_html_log');
}


