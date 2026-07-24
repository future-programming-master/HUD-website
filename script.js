// Local Storage Persistence Mapping Keys
const STATE_KEY = 'hud_system_state';

// Load stored profile configurations or initialize complete clean defaults
let systemState = JSON.parse(localStorage.getItem(STATE_KEY)) || {
    hp: 100,
    mp: 100,
    mpMax: 100,
    lastSavedDate: ""
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Calculate the current calendar timestamp string
    const todayStr = getTodayDateString();
    document.getElementById('date-display').textContent = todayStr;

    // 2. Automated Morning Awakening Lock Checker
    if (systemState.lastSavedDate !== todayStr) {
        // Trigger modal prompt to lock input interaction
        document.getElementById('awakening-modal').classList.remove('hidden');
    } else {
        // Render historical layout elements straight from system state data cache
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
        systemState.mp = 70; // Restores up to the capped limit baseline
        appendLogToSystem("[Awakening: Mediocre Sleep logged. HP +25, MP Max capped at 70.]");
    } else if (choice === 'trash') {
        systemState.hp = Math.max(0, systemState.hp - 10);
        systemState.mpMax = 40;
        systemState.mp = 40; // Restores up to the crushed baseline limits
        appendLogToSystem("[Awakening: Trash Sleep logged. HP -10, MP Max capped at 40.]");
    }

    // Hide prompt layer and update interface variables properties modules
    document.getElementById('awakening-modal').classList.add('hidden');
    saveStateToStorage();
    renderInterface();
}

function applyLifeEvent() {
    const textElement = document.getElementById('event-text');
    const hpElement = document.getElementById('event-hp');
    const mpElement = document.getElementById('event-mp');

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
    const newEntry = document.createElement('div');
    const styleIndicator = (hpMod < 0 || mpMod < 0) ? 'loss-msg' : 'gain-msg';
    newEntry.className = `log-entry ${styleIndicator}`;

    const hpSign = hpMod >= 0 ? `+${hpMod}` : `${hpMod}`;
    const mpSign = mpMod >= 0 ? `+${mpMod}` : `${mpMod}`;
    newEntry.textContent = `⚔️ ${finalEventName}: ${hpSign} HP, ${mpSign} MP`;

    logBox.appendChild(newEntry);
    logBox.scrollTop = logBox.scrollHeight;
    
    // Save current log HTML block properties inside LocalStorage persistence tree
    localStorage.setItem('hud_html_log', logBox.innerHTML);
    textElement.value = "";
}

function renderInterface() {
    // 1. Render numeric outputs
    document.getElementById('hp-current').textContent = systemState.hp;
    document.getElementById('mp-current').textContent = systemState.mp;
    document.getElementById('mp-max-label').textContent = systemState.mpMax;

    // 2. Scale horizontal vector graphic widths 
    document.getElementById('hp-fill').style.width = `${systemState.hp}%`;
    
    // Calculate percentage based on absolute total size, not 100% capacity limit
    document.getElementById('mp-fill').style.width = `${(systemState.mp / 100) * 100}%`;

    // 3. Load up historical strings inside scroll element 
    const savedHtmlLog = localStorage.getItem('hud_html_log');
    if (savedHtmlLog) {
        document.getElementById('combat-log').innerHTML = savedHtmlLog;
        const logBox = document.getElementById('combat-log');
        logBox.scrollTop = logBox.scrollHeight;
    }
}

// Single Page Application Navigation Tab Switcher Engine
function switchTab(targetTab) {
    // Collect layout panel objects
    const panels = document.querySelectorAll('.tab-panel');
    const tabs = document.querySelectorAll('.nav-tabs .tab-btn');

    // Hide panels and wipe selection borders styling
    panels.forEach(p => p.classList.add('hidden'));
    tabs.forEach(t => t.classList.remove('active-tab'));

    // Reveal designated path elements
    document.getElementById(`panel-${targetTab}`).classList.remove('hidden');
    document.getElementById(`tab-${targetTab}`).classList.add('active-tab');
}

function getTodayDateString() {
    const options = { month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options).toUpperCase();
}

function appendLogToSystem(message) {
    const logBox = document.getElementById('combat-log');
    const systemMsg = document.createElement('div');
    systemMsg.className = 'log-entry system-msg';
    systemMsg.textContent = message;
    logBox.appendChild(systemMsg);
    localStorage.setItem('hud_html_log', logBox.innerHTML);
}

function saveStateToStorage() {
    localStorage.setItem(STATE_KEY, JSON.stringify(systemState));
}

function clearLog() {
    document.getElementById('combat-log').innerHTML = '<div class="log-entry system-msg">[Log wiped clean.]</div>';
    localStorage.removeItem('hud_html_log');
}

