import { elements } from './ui/elements';
import { getInitialState, saveState } from './core/state';
import { calculateChargeTime } from './core/calculator';
import { applyTheme } from './ui/theme';
import { renderPresets } from './ui/renderers/presets';
import { updateResultsUI } from './ui/renderers/results';
import { SoCSlider } from './ui/slider';
import { State } from './types';

let state: State;
const slider = new SoCSlider((current, target) => {
    state.currentSoC = current;
    state.targetSoC = target;
    updateUI();
    calculate();
    saveState(state);
});

function init() {
    state = getInitialState();
    
    // Sync inputs with state
    elements.batteryCapacity.value = state.batteryCapacity.toString();
    elements.efficiencySlider.value = state.efficiency.toString();
    elements.efficiencyVal.innerText = state.efficiency.toString();
    elements.departureTime.value = state.departureTime;
    elements.customKwValue.value = state.customKw.toString();
    elements.inputVolts.value = state.volts.toString();
    elements.inputAmps.value = state.amps.toString();

    applyTheme(state);
    slider.init(state);
    setupEventListeners();
    updateUI();
    calculate();
}

function setupEventListeners() {
    elements.themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(state);
        saveState(state);
    });

    elements.batteryCapacity.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.batteryCapacity = parseFloat(target.value) || 0;
        calculate();
        saveState(state);
    });

    elements.efficiencySlider.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.efficiency = parseInt(target.value) || 90;
        elements.efficiencyVal.innerText = state.efficiency.toString();
        calculate();
        saveState(state);
    });

    elements.departureTime.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.departureTime = target.value;
        calculate();
        saveState(state);
    });

    elements.togglePowerMode.addEventListener('click', () => {
        state.powerMode = state.powerMode === 'kw' ? 'va' : 'kw';
        updateUI();
        calculate();
        saveState(state);
    });

    elements.customKwValue.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.customKw = parseFloat(target.value) || 0;
        state.chargingSpeed = state.customKw;
        calculate();
        saveState(state);
    });

    elements.inputVolts.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.volts = parseFloat(target.value) || 0;
        calculate();
        saveState(state);
    });

    elements.inputAmps.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.amps = parseFloat(target.value) || 0;
        calculate();
        saveState(state);
    });
}

function updateUI() {
    if (state.powerMode === 'kw') {
        elements.toggleText.innerText = 'Use Volts/Amps';
        elements.kwSelector.classList.remove('hidden');
        elements.vaSelector.classList.add('hidden');
        renderPresets(state, (speed, isCustom) => {
            state.chargingSpeed = speed;
            if (isCustom) {
                state.customKw = speed;
            }
            calculate();
            saveState(state);
        });
    } else {
        elements.toggleText.innerText = 'Use kW Presets';
        elements.kwSelector.classList.add('hidden');
        elements.vaSelector.classList.remove('hidden');
    }
    slider.updateUI(state);
}

function calculate() {
    const results = calculateChargeTime(state);
    updateResultsUI(results);
}

init();
