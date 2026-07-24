// Local tracking variables with built-in LocalStorage safely tracking updates
const state = {
    hp: parseInt(localStorage.getItem('hud_hp')) || 100,
    mp: parseInt(localStorage.getItem('hud_mp')) || 100,
    level: parseInt(localStorage.getItem('hud_day')) || 1
};

// Initial UI compilation initialization setup
window.onload = function() {
    updateUI('hp');
    updateUI('mp');
    document.getElementById('level-value').textContent = state.level;
    
    // Load up saved log entries historical string data 
    const savedLog = localStorage.getItem('hud_log');
    if (savedLog) {
        document.getElementById('combat-log').innerHTML = savedLog;
        scrollLogToBottom();
    }
};

// Processes custom inputs submitted by the logging card form
function applyLifeEvent() {
    const textInput = document.getElementById('event-text');
    const hpInput = document.getElementById('event-hp');
    const mpInput = document.getElementById('event-mp');

    let eventName = textInput.value.trim();
    let hpChange = parseInt(hpInput.value) || 0;
    let mpChange = parseInt(mpInput.value) || 0;

    if (eventName === "") {
        eventName = "Unspecified Activity";
    }

    // Apply arithmetic values boundaries limits
    state.hp = Math.min(100, Math.max(0, state.hp + hpChange));
    state.mp = Math.min(100, Math.max(0, state.mp + mpChange));

    // Update graphical stat assets immediately
    updateUI('hp');
    updateUI('mp');

    // Build modern retro string tracking data items
    appendLogMessage(eventName, hpChange, mpChange);

    // Save values locally so phone refreshes don't wipe data
    localStorage.setItem('hud_hp', state.hp);
    localStorage.setItem('hud_mp', state.mp);

    // Empty text container cleanly back to defaults 
    textInput.value = "";
}

// Generates elements structured cleanly inside the scrolling dashboard element box
function appendLogMessage(name, hp, mp) {
    const logBox = document.getElementById('combat-log');
    
    let hpPart = hp >= 0 ? `+${hp}HP` : `${hp}HP`;
    let mpPart = mp >= 0 ? `+${mp}MP` : `${mp}MP`;
    
    // Determine overall message tone styling categories based on results
    let styleClass = (hp < 0 || mp < 0) ? 'loss-msg' : 'gain-msg';
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${styleClass}`;
    entry.textContent = `⚔️ ${name}: ${hpPart}, ${mpPart}`;
    
    logBox.appendChild(entry);
    scrollLogToBottom();

    // Cache log box state HTML data
    localStorage.setItem('hud_log', logBox.innerHTML);
}

function scrollLogToBottom() {
    const logBox = document.getElementById('combat-log');
    logBox.scrollTop = logBox.scrollHeight;
}

function changeLevel(amount) {
    state.level = Math.max(1, state.level + amount);
    document.getElementById('level-value').textContent = state.level;
    localStorage.setItem('hud_day', state.level);
}

function updateUI(type) {
    document.getElementById(`${type}-current`).textContent = state[type];
    document.getElementById(`${type}-fill`).style.width = `${state[type]}%`;
}

