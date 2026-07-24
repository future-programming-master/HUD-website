// Centralized safe local storage keys
const HP_KEY = 'hud_live_hp';
const MP_KEY = 'hud_live_mp';
const DAY_KEY = 'hud_live_day';
const LOG_KEY = 'hud_live_log';

// Instantly read existing memory or fallback cleanly to defaults
const state = {
    hp: parseInt(localStorage.getItem(HP_KEY)) !== null && !isNaN(parseInt(localStorage.getItem(HP_KEY))) ? parseInt(localStorage.getItem(HP_KEY)) : 100,
    mp: parseInt(localStorage.getItem(MP_KEY)) !== null && !isNaN(parseInt(localStorage.getItem(MP_KEY))) ? parseInt(localStorage.getItem(MP_KEY)) : 100,
    level: parseInt(localStorage.getItem(DAY_KEY)) !== null && !isNaN(parseInt(localStorage.getItem(DAY_KEY))) ? parseInt(localStorage.getItem(DAY_KEY)) : 1
};

// Immediate DOM paint execution without waiting for slow browser wrappers
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial State UI Render
    updateUI('hp');
    updateUI('mp');
    document.getElementById('level-value').textContent = state.level;
    
    // 2. Load historical log elements strings cleanly
    const savedLog = localStorage.getItem(LOG_KEY);
    if (savedLog) {
        document.getElementById('combat-log').innerHTML = savedLog;
        scrollLogToBottom();
    }
});

// Primary calculations execution processor engine 
function applyLifeEvent() {
    const textInput = document.getElementById('event-text');
    const hpInput = document.getElementById('event-hp');
    const mpInput = document.getElementById('event-mp');

    let eventName = textInput.value.trim();
    let hpChange = parseInt(hpInput.value) || 0;
    let mpChange = parseInt(mpInput.value) || 0;

    if (eventName === "") {
        eventName = "Action Logged";
    }

    // Apply strict boundaries limits
    state.hp = Math.min(100, Math.max(0, state.hp + hpChange));
    state.mp = Math.min(100, Math.max(0, state.mp + mpChange));

    // Update layout properties immediately
    updateUI('hp');
    updateUI('mp');

    // Build log frame elements cleanly
    appendLogMessage(eventName, hpChange, mpChange);

    // Save states values locally
    localStorage.setItem(HP_KEY, state.hp);
    localStorage.setItem(MP_KEY, state.mp);

    // Reset input fields defaults properties container cleanly
    textInput.value = "";
}

// Controls layout strings parsing elements safely
function appendLogMessage(name, hp, mp) {
    const logBox = document.getElementById('combat-log');
    
    let hpPart = hp >= 0 ? `+${hp}HP` : `${hp}HP`;
    let mpPart = mp >= 0 ? `+${mp}MP` : `${mp}MP`;
    
    let styleClass = (hp < 0 || mp < 0) ? 'loss-msg' : 'gain-msg';
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${styleClass}`;
    entry.textContent = `⚔️ ${name}: ${hpPart}, ${mpPart}`;
    
    logBox.appendChild(entry);
    scrollLogToBottom();

    // Cache log historical items data properties strings
    localStorage.setItem(LOG_KEY, logBox.innerHTML);
}

function changeLevel(amount) {
    // Isolated system explicitly adding/subtracting exactly 1 unit
    state.level = Math.max(1, state.level + amount);
    document.getElementById('level-value').textContent = state.level;
    localStorage.setItem(DAY_KEY, state.level);
}

function updateUI(type) {
    document.getElementById(`${type}-current`).textContent = state[type];
    document.getElementById(`${type}-fill`).style.width = `${state[type]}%`;
}

function scrollLogToBottom() {
    const logBox = document.getElementById('combat-log');
    logBox.scrollTop = logBox.scrollHeight;
}

function clearLog() {
    const logBox = document.getElementById('combat-log');
    logBox.innerHTML = '<div class="log-entry system-msg">[Log wiped clean.]</div>';
    localStorage.removeItem(LOG_KEY);
}

