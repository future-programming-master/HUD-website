const STATE_KEY = 'hud_system_state';
let systemState = JSON.parse(localStorage.getItem(STATE_KEY)) || { hp: 100, mp: 100, mpMax: 100, lastSavedDate: "" };

if (!systemState.mpMax || systemState.mpMax <= 0) systemState.mpMax = 100;
if (systemState.hp === undefined) systemState.hp = 100;
if (systemState.mp === undefined) systemState.mp = 100;

// Safe Event Listener Setup — Zero security policies violations
document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Date
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
    if (document.getElementById('date-display')) document.getElementById('date-display').textContent = todayStr;

    // 2. Setup Navigation Tab Clicks
    document.getElementById('tab-hud').addEventListener('click', () => switchTab('hud'));
    document.getElementById('tab-stats').addEventListener('click', () => switchTab('stats'));
    document.getElementById('tab-quests').addEventListener('click', () => switchTab('quests'));

    // 3. Setup Action Form Click
    document.getElementById('submit-event-btn').addEventListener('click', applyLifeEvent);
    document.getElementById('clear-log-btn').addEventListener('click', clearLog);

    // 4. Setup Modal Buttons Clicks
    document.getElementById('btn-perfect').addEventListener('click', () => processAwakening('perfect'));
    document.getElementById('btn-mediocre').addEventListener('click', () => processAwakening('mediocre'));
    document.getElementById('btn-trash').addEventListener('click', () => processAwakening('trash'));

    // 5. Initialize Display or show overlay popup
    const modal = document.getElementById('awakening-modal');
    if (systemState.lastSavedDate !== todayStr && modal) {
        modal.classList.remove('hidden');
    } else {
        renderInterface();
    }
});

function switchTab(targetTab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-tabs .tab-btn').forEach(t => t.remove('active-tab'));
    if (document.getElementById(`panel-${targetTab}`)) document.getElementById(`panel-${targetTab}`).classList.remove('hidden');
    if (document.getElementById(`tab-${targetTab}`)) document.getElementById(`tab-${targetTab}`).classList.add('active-tab');
}

function processAwakening(choice) {
    systemState.lastSavedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
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
    document.getElementById('awakening-modal').classList.add('hidden');
    localStorage.setItem(STATE_KEY, JSON.stringify(systemState));
    renderInterface();
}

function applyLifeEvent() {
    const textElement = document.getElementById('event-text');
    const hpElement = document.getElementById('event-hp');
    const mpElement = document.getElementById('event-mp');
    const rawName = textElement.value.trim();

    if (rawName === "") {
        textElement.style.borderColor = "#ff4d4d";
        textElement.placeholder = "NAME REQUIRED!";
        return;
    }

    textElement.style.borderColor = "#45a29e";
    textElement.placeholder = "Type event name (REQUIRED)...";
    const hpMod = parseInt(hpElement.value) || 0;
    const mpMod = parseInt(mpElement.value) || 0;

    systemState.hp = Math.min(100, Math.max(0, systemState.hp + hpMod));
    systemState.mp = Math.min(systemState.mpMax, Math.max(0, systemState.mp + mpMod));

    localStorage.setItem(STATE_KEY, JSON.stringify(systemState));
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
}

function renderInterface() {
    document.getElementById('hp-current').textContent = systemState.hp;
    document.getElementById('mp-current').textContent = systemState.mp;
    document.getElementById('mp-max-label').textContent = systemState.mpMax;
    document.getElementById('hp-fill').style.width = `${systemState.hp}%`;
    document.getElementById('mp-fill').style.width = `${(systemState.mp / systemState.mpMax) * 100}%`;
    
    const logBox = document.getElementById('combat-log');
    const savedHtmlLog = localStorage.getItem('hud_html_log');
    if (logBox && savedHtmlLog) {
        logBox.innerHTML = savedHtmlLog;
        logBox.scrollTop = logBox.scrollHeight;
    }
}

function appendLogToSystem(message) {
    const logBox = document.getElementById('combat-log');
    if (logBox) {
        const msg = document.createElement('div'); msg.className = 'log-entry system-msg'; msg.textContent = message;
        logBox.appendChild(msg); localStorage.setItem('hud_html_log', logBox.innerHTML);
    }
}

function clearLog() {
    document.getElementById('combat-log').innerHTML = '<div class="log-entry system-msg">[Log wiped clean.]</div>';
    localStorage.removeItem('hud_html_log');
}