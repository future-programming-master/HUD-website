// Centralized state system
const state = {
    hp: 100,
    mp: 100,
    level: 99
};

// Handle explicit + and - step button clicking
function changeStat(type, amount) {
    let newValue = state[type] + amount;
    
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0; // Allowed 0 for death/empty pool states
    
    state[type] = newValue;
    updateUI(type);
}

// Fixed listeners to securely catch manual text input typing changes instantly
function setStat(type) {
    const inputElement = document.getElementById(`${type}-input`);
    let newValue = parseInt(inputElement.value);

    if (isNaN(newValue)) return; 
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;

    state[type] = newValue;
    
    // Explicit update targeting text components and graphic width frames
    document.getElementById(`${type}-current`).textContent = newValue;
    document.getElementById(`${type}-fill`).style.width = `${newValue}%`;
}

// New system controlling player profile levels
function changeLevel(amount) {
    let newLevel = state.level + amount;
    if (newLevel < 1) newLevel = 1;
    if (newLevel > 999) newLevel = 999; // RPG maximum level expansion cap
    
    state.level = newLevel;
    document.getElementById('level-value').textContent = newLevel;
}

// Global UI synchronization engine
function updateUI(type) {
    const currentVal = state[type];
    document.getElementById(`${type}-current`).textContent = currentVal;
    document.getElementById(`${type}-input`).value = currentVal;
    document.getElementById(`${type}-fill`).style.width = `${currentVal}%`;
}
