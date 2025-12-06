let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetOnNextInput = false;

const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.querySelector('.equal-btn');
const acButton = document.querySelector('.ac-btn');
const themeToggleCheckbox = document.getElementById('theme-toggle');
const modeLabel = document.querySelector('.mode-label');

/* ----------------- MECHANICAL “TOCK” CLICK SOUND (Web Audio API) ----------------- */

// Reuse a single AudioContext for better performance
let audioCtx = null;

function playClick() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // mechanical tock sound
    osc.type = 'triangle';
    osc.frequency.value = 150;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
}

// Attach sound to all calculator buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', playClick);
});

/* ----------------- CALCULATOR LOGIC ----------------- */

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (shouldResetOnNextInput) resetAll();
        currentInput += button.textContent;
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!currentInput) return;

        if (previousInput) calculate();

        operation = button.textContent;
        previousInput = currentInput;
        currentInput = '';
        shouldResetOnNextInput = false;
        updateDisplay();
    });
});

equalButton.addEventListener('click', () => {
    calculate();
    operation = null;
    shouldResetOnNextInput = true;
});

acButton.addEventListener('click', resetAll);

function calculate() {
    if (!previousInput || !currentInput || !operation) return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result = 0;

    switch (operation) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '×':
            result = prev * curr;
            break;
        case '÷':
            if (curr === 0) {
                alert('Cannot divide by zero!');
                return;
            }
            result = prev / curr;
            break;
    }

    currentInput = result.toString();
    previousInput = '';
    updateDisplay();
}

function updateDisplay() {
    resultDisplay.textContent = currentInput || '0';
    expressionDisplay.textContent =
        previousInput && operation ? `${previousInput} ${operation}` : '';
}

function resetAll() {
    currentInput = '';
    previousInput = '';
    operation = null;
    shouldResetOnNextInput = false;
    updateDisplay();
}

/* ----------------- THEME TOGGLE (LIGHT ↔ BLACKPINK DARK MODE) ----------------- */

function updateThemeLabel() {
    if (themeToggleCheckbox.checked) {
        modeLabel.textContent = "Light mode ☀️";
    } else {
        modeLabel.textContent = "Night mode ☾";
    }
}

themeToggleCheckbox.addEventListener('change', () => {
    const isDark = themeToggleCheckbox.checked;
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeLabel();
});

/* Set correct label on page load */
updateThemeLabel();

/* Initialize display */
updateDisplay();
