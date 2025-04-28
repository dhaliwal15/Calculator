let isDegreeMode = true; // Default mode is degrees

// Setup for SpeechRecognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false; // Stop after one command
recognition.interimResults = false; // Do not show partial results
recognition.maxAlternatives = 1; // Only return the best match

// Function to append character to display
function appendCharacter(character) {
    const display = document.getElementById('display');
    display.value += character;
}

// Function to clear the display
function clearDisplay() {
    const display = document.getElementById('display');
    display.value = '';
} 

// Function to delete the last character
function deleteLastCharacter() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

// Function to calculate the result
function calculateResult() {
    const display = document.getElementById('display');
    try {
        let expression = display.value;

        // Adjust trigonometric functions based on mode (degree/radian)
        if (isDegreeMode) {
            expression = expression.replace(/Math.sin\(/g, 'Math.sin(Math.PI / 180 * ');
            expression = expression.replace(/Math.cos\(/g, 'Math.cos(Math.PI / 180 * ');
            expression = expression.replace(/Math.tan\(/g, 'Math.tan(Math.PI / 180 * ');
        } else {
            expression = expression.replace(/Math.sin\(/g, 'Math.sin(');
            expression = expression.replace(/Math.cos\(/g, 'Math.cos(');
            expression = expression.replace(/Math.tan\(/g, 'Math.tan(');
        }

        const result = eval(expression);
        display.value = result;
    } catch (e) {
        display.value = 'Error';
    }
}

// Function to toggle between Degrees and Radians
function toggleMode() {
    isDegreeMode = !isDegreeMode;
    const modeButton = document.querySelector('.mode-btn');
    modeButton.textContent = isDegreeMode ? 'Mode: Degrees' : 'Mode: Radians';
}

// Voice Command function to capture voice input
function startVoiceRecognition() {
    recognition.start();
}

// Event listener for voice recognition result
recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript.toLowerCase();
    const display = document.getElementById('display');
    
    // Parse the voice input and perform corresponding actions
    const commands = {
        'clear': clearDisplay,
        'delete': deleteLastCharacter,
        'equals': calculateResult,
        'mode': toggleMode,
        'plus': '+',
        'minus': '-',
        'multiply': '*',
        'divide': '/',
        'sin': 'Math.sin(',
        'cos': 'Math.cos(',
        'tan': 'Math.tan(',
        'log': 'Math.log(',
        'sqrt': 'Math.sqrt(',
        'pi': 'Math.PI',
        'e': 'Math.exp(',
        'open parenthesis': '(',
        'close parenthesis': ')',
        'dot': '.',
        'percent': '%',
        'power': '^'
    };

    // Check if the spoken command matches any key in the command object
    if (commands[spokenText]) {
        if (typeof commands[spokenText] === 'function') {
            commands[spokenText](); // Execute function (e.g., clearDisplay)
        } else {
            appendCharacter(commands[spokenText]); // Append operator or function (e.g., '+', 'sin(')
        }
    } else {
        // If no match, just append the spoken text (for numbers or invalid commands)
        display.value += spokenText;
    }
};

// Handle errors during voice recognition
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
};

// Automatically start voice recognition when button is clicked
document.querySelector('.voice-btn').addEventListener('click', startVoiceRecognition);