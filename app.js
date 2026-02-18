// Global state
let character = null;

// Wait for SDK to be available
function waitForOBR() {
    return new Promise((resolve, reject) => {
        if (typeof window.OBR !== 'undefined') {
            resolve(window.OBR);
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds
        
        const interval = setInterval(() => {
            attempts++;
            
            if (typeof window.OBR !== 'undefined') {
                clearInterval(interval);
                resolve(window.OBR);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                reject(new Error('Owlbear SDK not available. Make sure this extension is loaded from within Owlbear Rodeo.'));
            }
        }, 100);
    });
}

// Initialize Owlbear Rodeo SDK
async function initializeOwlbear() {
    try {
        const OBR = await waitForOBR();
        await OBR.onReady();
        console.log('Owlbear Rodeo SDK ready!');
        
        // Set extension height
        OBR.action.setHeight(600);
        
        // Load saved character from Owlbear's storage
        loadCharacterFromStorage();
    } catch (error) {
        console.error('Failed to initialize Owlbear SDK:', error);
        showError(error.message || 'Failed to connect to Owlbear Rodeo');
    }
}

// Save character to Owlbear's persistent storage
async function saveCharacterToStorage() {
    if (!character) return;
    
    try {
        await window.OBR.room.setMetadata({
            'character-tracker/character': character
        });
    } catch (error) {
        console.error('Failed to save character:', error);
    }
}

// Load character from Owlbear's storage
async function loadCharacterFromStorage() {
    try {
        const metadata = await window.OBR.room.getMetadata();
        const savedCharacter = metadata['character-tracker/character'];
        
        if (savedCharacter) {
            character = savedCharacter;
            displayCharacter();
        }
    } catch (error) {
        console.error('Failed to load character:', error);
    }
}

// Parse character data (eientracker format)
function parseCharacter(data) {
    try {
        // Try parsing as JSON first
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Eientracker format with stats
        return {
            characterName: parsed.characterName || parsed.name || 'Unknown Character',
            HP: parsed.HP || parsed.maxHP || 100,
            MP: parsed.MP || parsed.maxMP || 50,
            IP: parsed.IP || parsed.maxIP || 100,
            Armor: parsed.Armor || 0,
            Barrier: parsed.Barrier || 0,
            maxHP: parsed.maxHP || 100,
            maxMP: parsed.maxMP || 50,
            maxIP: parsed.maxIP || 100,
            maxArmor: parsed.maxArmor || 20,
            maxBarrier: parsed.maxBarrier || 15,
            stats: {
                force: parsed.stats?.force || parsed.force || 10,
                mind: parsed.stats?.mind || parsed.mind || 10,
                grace: parsed.stats?.grace || parsed.grace || 10,
                soul: parsed.stats?.soul || parsed.soul || 10,
                heart: parsed.stats?.heart || parsed.heart || 10
            }
        };
    } catch (error) {
        throw new Error('Invalid character data format. Please use valid JSON.');
    }
}

// Display character in UI
function displayCharacter() {
    if (!character) return;
    
    // Hide import section, show character section
    document.getElementById('import-section').style.display = 'none';
    document.getElementById('character-section').style.display = 'block';
    
    // Set character name
    document.getElementById('character-name').textContent = character.characterName;
    
    // Update resource displays
    document.getElementById('hp-current').textContent = character.HP;
    document.getElementById('hp-max').textContent = character.maxHP;
    document.getElementById('mp-current').textContent = character.MP;
    document.getElementById('mp-max').textContent = character.maxMP;
    document.getElementById('ip-current').textContent = character.IP;
    document.getElementById('ip-max').textContent = character.maxIP;
    document.getElementById('armor-current').textContent = character.Armor;
    document.getElementById('armor-max').textContent = character.maxArmor;
    document.getElementById('barrier-current').textContent = character.Barrier;
    document.getElementById('barrier-max').textContent = character.maxBarrier;
    
    // Update stats display
    document.getElementById('force-value').textContent = `d${character.stats.force}`;
    document.getElementById('mind-value').textContent = `d${character.stats.mind}`;
    document.getElementById('grace-value').textContent = `d${character.stats.grace}`;
    document.getElementById('soul-value').textContent = `d${character.stats.soul}`;
    document.getElementById('heart-value').textContent = `d${character.stats.heart}`;
    
    // Update dropdowns with character's stats
    updateStatDropdowns();
    
    hideError();
}

// Update the stat dropdown options
function updateStatDropdowns() {
    const stat1Select = document.getElementById('stat1');
    const stat2Select = document.getElementById('stat2');
    
    // Clear existing options
    stat1Select.innerHTML = '';
    stat2Select.innerHTML = '';
    
    // Add stat options
    const stats = [
        { name: 'FORCE', value: character.stats.force },
        { name: 'MIND', value: character.stats.mind },
        { name: 'GRACE', value: character.stats.grace },
        { name: 'SOUL', value: character.stats.soul },
        { name: 'HEART', value: character.stats.heart }
    ];
    
    stats.forEach(stat => {
        const option1 = document.createElement('option');
        option1.value = stat.value;
        option1.textContent = `${stat.name} (d${stat.value})`;
        stat1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = stat.value;
        option2.textContent = `${stat.name} (d${stat.value})`;
        stat2Select.appendChild(option2);
    });
}

// Attack roll (eientracker logic: roll two stats + modifier, count hits where result <= gate)
function performAttack() {
    const dice1 = parseInt(document.getElementById('stat1').value);
    const dice2 = parseInt(document.getElementById('stat2').value);
    const modifier = parseInt(document.getElementById('modifier').value) || 0;
    const gate = parseInt(document.getElementById('gate').value) || 1;
    
    // Get stat names for display
    const stat1Name = document.getElementById('stat1').options[document.getElementById('stat1').selectedIndex].text.split(' ')[0];
    const stat2Name = document.getElementById('stat2').options[document.getElementById('stat2').selectedIndex].text.split(' ')[0];
    
    // Roll the dice
    const roll1 = Math.floor(Math.random() * dice1) + 1;
    const roll2 = Math.floor(Math.random() * dice2) + 1;
    
    // Add modifier
    const result1 = roll1 + modifier;
    const result2 = roll2 + modifier;
    
    // Count hits (result <= gate)
    let hits = 0;
    if (result1 <= gate) hits++;
    if (result2 <= gate) hits++;
    
    // Display result
    const resultDiv = document.getElementById('roll-result');
    const detailsDiv = resultDiv.querySelector('.roll-details');
    const totalDiv = resultDiv.querySelector('.roll-total');
    
    detailsDiv.innerHTML = `
        🎲 <strong>${stat1Name}</strong> d${dice1}: [${roll1}] ${modifier >= 0 ? '+' : ''}${modifier} = <strong>${result1}</strong> ${result1 <= gate ? '✅' : '❌'}<br>
        🎲 <strong>${stat2Name}</strong> d${dice2}: [${roll2}] ${modifier >= 0 ? '+' : ''}${modifier} = <strong>${result2}</strong> ${result2 <= gate ? '✅' : '❌'}<br>
        Gate: <strong>≤${gate}</strong>
    `;
    totalDiv.textContent = `${hits} HIT${hits !== 1 ? 'S' : ''}`;
    resultDiv.style.display = 'block';
    
    // Send roll to Owlbear chat
    sendRollToChat(stat1Name, stat2Name, dice1, dice2, modifier, gate, roll1, roll2, result1, result2, hits);
    
    return { roll1, roll2, result1, result2, hits };
}

// Send roll result to Owlbear Rodeo's chat
async function sendRollToChat(stat1Name, stat2Name, dice1, dice2, modifier, gate, roll1, roll2, result1, result2, hits) {
    try {
        await window.OBR.notification.show(
            `${character.characterName}: ${stat1Name}+${stat2Name} = ${hits} hit${hits !== 1 ? 's' : ''}! (d${dice1}+d${dice2}${modifier >= 0 ? '+' : ''}${modifier}, gate ≤${gate})`,
            'INFO'
        );
    } catch (error) {
        console.error('Failed to send roll to chat:', error);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Hide error message
function hideError() {
    document.getElementById('error-message').style.display = 'none';
}

// Clear character
async function clearCharacter() {
    character = null;
    document.getElementById('import-section').style.display = 'block';
    document.getElementById('character-section').style.display = 'none';
    document.getElementById('roll-result').style.display = 'none';
    document.getElementById('character-input').value = '';
    
    // Clear from storage
    try {
        await window.OBR.room.setMetadata({
            'character-tracker/character': null
        });
    } catch (error) {
        console.error('Failed to clear character:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Import button
    document.getElementById('import-btn').addEventListener('click', () => {
        const input = document.getElementById('character-input').value.trim();
        
        if (!input) {
            showError('Please enter character data');
            return;
        }
        
        try {
            character = parseCharacter(input);
            displayCharacter();
            saveCharacterToStorage();
        } catch (error) {
            showError(error.message);
        }
    });
    
    // File upload
    document.getElementById('file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                character = parseCharacter(event.target.result);
                displayCharacter();
                saveCharacterToStorage();
            } catch (error) {
                showError(error.message);
            }
        };
        reader.readAsText(file);
    });
    
    // Attack button
    document.getElementById('attack-btn').addEventListener('click', () => {
        if (!character) return;
        performAttack();
    });
    
    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('Clear current character?')) {
            clearCharacter();
        }
    });
    
    // Initialize Owlbear SDK
    initializeOwlbear();
});
