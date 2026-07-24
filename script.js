// Centralized state system
const stats = {
    hp: 100,
    mp: 100
};

// Function called by the plus and minus adjustment buttons
function changeStat(type, amount) {
    let newValue = stats[type] + amount;
    
    // Enforce strict boundaries between 1 and 100
    if (newValue > 100) newValue = 100;
    if (newValue < 1) newValue = 1;
    
    stats[type] = newValue;
    updateUI(type);
}

// Function called when a user types directly into the numerical input box
function setStat(type) {
    const inputElement = document.getElementById(`${type}-input`);
    let newValue = parseInt(inputElement.value);

    // Dynamic corrections for empty values or values out of bounds
    if (isNaN(newValue)) return; 
    if (newValue > 100) newValue = 100;
    if (newValue < 1) newValue = 1;

    stats[type] = newValue;
    updateUI(type);
}

// Updates the view on your phone instantly
function updateUI(type) {
    const currentVal = stats[type];
    
    // 1. Update text totals
    document.getElementById(`${type}-current`).textContent = currentVal;
    
    // 2. Sync input field box numerical values
    document.getElementById(`${type}-input`).value = currentVal;
    
    // 3. Move the graphical progress bar fill matching percentages
    document.getElementById(`${type}-fill`).style.width = `${currentVal}%`;
}

