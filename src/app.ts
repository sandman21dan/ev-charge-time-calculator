// Types
interface Preset {
    a: number;
    v?: number;
    label?: string;
}

interface Region {
    name: string;
    volts: number;
    presets: Preset[];
}

interface Regions {
    [key: string]: Region;
}

interface State {
    batteryCapacity: number;
    currentSoC: number;
    targetSoC: number;
    powerMode: 'kw' | 'va';
    chargingSpeed: number;
    volts: number;
    amps: number;
    departureTime: string;
    customKw: number;
    region: string;
    efficiency: number;
    theme: 'dark' | 'light';
}

interface Elements {
    batteryCapacity: HTMLInputElement;
    efficiencySlider: HTMLInputElement;
    efficiencyVal: HTMLElement;
    currentSoCVal: HTMLElement;
    targetSoCVal: HTMLElement;
    socSlider: HTMLElement;
    handleCurrent: HTMLElement;
    handleTarget: HTMLElement;
    sliderFill: HTMLElement;
    togglePowerMode: HTMLElement;
    toggleText: HTMLElement;
    kwSelector: HTMLElement;
    vaSelector: HTMLElement;
    presetContainer: HTMLElement;
    voltageText: HTMLElement;
    customKwInput: HTMLElement;
    customKwValue: HTMLInputElement;
    inputVolts: HTMLInputElement;
    inputAmps: HTMLInputElement;
    departureTime: HTMLInputElement;
    resEnergy: HTMLElement;
    resWallEnergy: HTMLElement;
    resHours: HTMLElement;
    resMins: HTMLElement;
    resDeparture: HTMLElement;
    resPlugTime: HTMLElement;
    resPlugAMPM: HTMLElement;
    vaResultKw: HTMLElement;
    themeToggle: HTMLElement;
    themeIcon: HTMLElement;
}

// Constants & Presets
const REGIONS: Regions = {
    uk: {
        name: 'UK/Ireland',
        volts: 230,
        presets: [
            { a: 6 }, { a: 8 }, { a: 10 }, { a: 13, label: 'UK Socket' },
            { a: 16 }, { a: 32, label: 'Wallbox' }
        ]
    },
    eu: {
        name: 'Europe',
        volts: 230,
        presets: [
            { a: 6 }, { a: 8 }, { a: 10 }, { a: 16, label: 'Standard' },
            { a: 20 }, { a: 32, label: 'Wallbox' }
        ]
    },
    na: {
        name: 'North America',
        volts: 120,
        presets: [
            { a: 12, v: 120, label: 'L1 Household' },
            { a: 16, v: 240, label: 'L2 16A' },
            { a: 24, v: 240, label: 'L2 24A' },
            { a: 32, v: 240, label: 'L2 32A' },
            { a: 40, v: 240, label: 'L2 40A' },
            { a: 48, v: 240, label: 'L2 48A' }
        ]
    },
    au: {
        name: 'Australia/NZ',
        volts: 230,
        presets: [
            { a: 6 }, { a: 10, label: 'AU Socket' }, { a: 15 },
            { a: 32, label: 'Wallbox' }
        ]
    },
    sa_low: {
        name: 'South America (120V)',
        volts: 120,
        presets: [
            { a: 12, v: 120, label: 'Household' },
            { a: 16, v: 240 }, { a: 32, v: 240 }
        ]
    },
    sa_high: {
        name: 'South America (220V)',
        volts: 220,
        presets: [
            { a: 10 }, { a: 16 }, { a: 32 }
        ]
    },
    jp: {
        name: 'Japan',
        volts: 100,
        presets: [
            { a: 15, v: 100 }, { a: 16, v: 200 }, { a: 30, v: 200 }
        ]
    },
    cn: {
        name: 'China',
        volts: 220,
        presets: [
            { a: 8 }, { a: 10 }, { a: 13 }, { a: 16 }, { a: 32 }
        ]
    }
};

// State
let state: State = {
    batteryCapacity: 54,
    currentSoC: 20,
    targetSoC: 80,
    powerMode: 'kw', // 'kw' or 'va'
    chargingSpeed: 7.4,
    volts: 230,
    amps: 16,
    departureTime: '07:00',
    customKw: 11.0,
    region: 'uk',
    efficiency: 90,
    theme: 'dark'
};

// DOM Elements
const elements: Elements = {
    batteryCapacity: document.getElementById('batteryCapacity') as HTMLInputElement,
    efficiencySlider: document.getElementById('efficiencySlider') as HTMLInputElement,
    efficiencyVal: document.getElementById('efficiencyVal') as HTMLElement,
    currentSoCVal: document.getElementById('currentSoCVal') as HTMLElement,
    targetSoCVal: document.getElementById('targetSoCVal') as HTMLElement,
    socSlider: document.getElementById('socSlider') as HTMLElement,
    handleCurrent: document.getElementById('handleCurrent') as HTMLElement,
    handleTarget: document.getElementById('handleTarget') as HTMLElement,
    sliderFill: document.getElementById('sliderFill') as HTMLElement,
    togglePowerMode: document.getElementById('togglePowerMode') as HTMLElement,
    toggleText: document.getElementById('toggleText') as HTMLElement,
    kwSelector: document.getElementById('kwSelector') as HTMLElement,
    vaSelector: document.getElementById('vaSelector') as HTMLElement,
    presetContainer: document.getElementById('presetContainer') as HTMLElement,
    voltageText: document.getElementById('voltageText') as HTMLElement,
    customKwInput: document.getElementById('customKwInput') as HTMLElement,
    customKwValue: document.getElementById('customKwValue') as HTMLInputElement,
    inputVolts: document.getElementById('inputVolts') as HTMLInputElement,
    inputAmps: document.getElementById('inputAmps') as HTMLInputElement,
    departureTime: document.getElementById('departureTime') as HTMLInputElement,
    resEnergy: document.getElementById('resEnergy') as HTMLElement,
    resWallEnergy: document.getElementById('resWallEnergy') as HTMLElement,
    resHours: document.getElementById('resHours') as HTMLElement,
    resMins: document.getElementById('resMins') as HTMLElement,
    resDeparture: document.getElementById('resDeparture') as HTMLElement,
    resPlugTime: document.getElementById('resPlugTime') as HTMLElement,
    resPlugAMPM: document.getElementById('resPlugAMPM') as HTMLElement,
    vaResultKw: document.getElementById('vaResultKw') as HTMLElement,
    themeToggle: document.getElementById('themeToggle') as HTMLElement,
    themeIcon: document.getElementById('themeIcon') as HTMLElement
};

// Initialize
function init() {
    detectRegion();
    loadState(); // This might override the detected region if saved
    applyTheme();

    // Set default volts from region if not already set (e.g. first run)
    if (!localStorage.getItem('ev_planner_state')) {
        state.volts = REGIONS[state.region].volts;
    }

    renderPresets();
    setupEventListeners();
    updateUI();
    calculate();
}

function applyTheme() {
    const root = document.documentElement;
    if (state.theme === 'light') {
        root.classList.add('light-mode');
        elements.themeIcon.className = 'ph ph-sun';
    } else {
        root.classList.remove('light-mode');
        elements.themeIcon.className = 'ph ph-moon';
    }
}

function detectRegion() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language.toLowerCase();

    if (tz.includes('America')) {
        // Split South America
        const saHighCities = ['Santiago', 'Buenos_Aires', 'Montevideo', 'Lima', 'Asuncion'];
        if (saHighCities.some(city => tz.includes(city))) {
            state.region = 'sa_high';
        } else if (tz.includes('Sao_Paulo')) {
            state.region = 'sa_low'; // Brazil is mixed, but 127V is common
        } else if (tz.includes('Bogota') || tz.includes('Caracas') || tz.includes('Guayaquil')) {
            state.region = 'sa_low';
        } else {
            state.region = 'na';
        }
    } else if (tz.includes('London') || tz.includes('Dublin') || lang.includes('en-gb')) {
        state.region = 'uk';
    } else if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Auckland') || tz.includes('Perth')) {
        state.region = 'au';
    } else if (tz.includes('Tokyo') || tz.includes('Seoul')) {
        state.region = 'jp';
    } else if (tz.includes('Shanghai') || tz.includes('Hong_Kong') || tz.includes('Chongqing')) {
        state.region = 'cn';
    } else {
        state.region = 'eu';
    }
}

function renderPresets() {
    const region = REGIONS[state.region];
    elements.voltageText.innerText = `Suggested Amps are calculated at ${region.volts}V`;

    let html = '';
    region.presets.forEach((p) => {
        const volts = p.v || region.volts;
        const kw = (volts * p.a) / 1000;
        const isChecked = state.chargingSpeed === kw;

        html += `
                    <label class="radio-item">
                        <input type="radio" name="speed" value="${kw}" ${isChecked ? 'checked' : ''}>
                        <div class="radio-box">
                            <span class="radio-val">${kw.toFixed(1)}</span>
                            <span class="radio-sub"><i class="ph-fill ph-lightning" style="font-size: 8px;"></i> ${p.a}A</span>
                        </div>
                    </label>
                `;
    });

    // Add Custom Option
    const isCustom = !region.presets.some(p => ((p.v || region.volts) * p.a / 1000) === state.chargingSpeed);
    html += `
                <label class="radio-item col-span-2">
                    <input type="radio" name="speed" value="custom" id="speedCustom" ${isCustom ? 'checked' : ''}>
                    <div class="radio-box custom-box font-sans">
                        <i class="ph ph-faders"></i>
                        <span class="radio-val" style="font-size: 0.75rem; font-weight: 500;">Custom kW</span>
                    </div>
                </label>
            `;

    elements.presetContainer.innerHTML = html;

    // Re-attach listeners for newly created elements
    document.querySelectorAll('input[name="speed"]').forEach(r => {
        r.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value === 'custom') {
                elements.customKwInput.style.display = 'block';
                state.chargingSpeed = parseFloat(elements.customKwValue.value) || 0;
            } else {
                elements.customKwInput.style.display = 'none';
                state.chargingSpeed = parseFloat(target.value);
            }
            calculate();
            saveState();
        });
    });

    if (isCustom && state.powerMode === 'kw') {
        elements.customKwInput.style.display = 'block';
    }
}

function loadState() {
    const saved = localStorage.getItem('ev_planner_state');
    if (saved) {
        state = { ...state, ...JSON.parse(saved) };
    } else {
        // Try legacy keys
        const legacyBattery = localStorage.getItem('batteryCapacity');
        const legacySpeed = localStorage.getItem('chargingSpeed');
        const legacyCurrent = localStorage.getItem('currentCharge');
        const legacyTarget = localStorage.getItem('desiredCharge');
        const legacyTime = localStorage.getItem('chargeByTime');

        if (legacyBattery) state.batteryCapacity = parseFloat(legacyBattery);
        if (legacySpeed) state.chargingSpeed = parseFloat(legacySpeed);
        if (legacyCurrent) state.currentSoC = parseFloat(legacyCurrent);
        if (legacyTarget) state.targetSoC = parseFloat(legacyTarget);
        if (legacyTime) state.departureTime = legacyTime;
    }

    // Sync inputs with state
    elements.batteryCapacity.value = state.batteryCapacity.toString();
    elements.efficiencySlider.value = state.efficiency.toString();
    elements.efficiencyVal.innerText = state.efficiency.toString();
    elements.departureTime.value = state.departureTime;
    elements.customKwValue.value = state.customKw.toString();
    elements.inputVolts.value = state.volts.toString();
    elements.inputAmps.value = state.amps.toString();
}

function saveState() {
    localStorage.setItem('ev_planner_state', JSON.stringify(state));
}

function setupEventListeners() {
    elements.themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveState();
    });

    elements.batteryCapacity.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.batteryCapacity = parseFloat(target.value) || 0;
        calculate();
        saveState();
    });

    elements.efficiencySlider.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.efficiency = parseInt(target.value) || 90;
        elements.efficiencyVal.innerText = state.efficiency.toString();
        calculate();
        saveState();
    });

    elements.departureTime.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.departureTime = target.value;
        calculate();
        saveState();
    });

    elements.togglePowerMode.addEventListener('click', () => {
        state.powerMode = state.powerMode === 'kw' ? 'va' : 'kw';
        updateUI();
        calculate();
        saveState();
    });

    elements.customKwValue.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.customKw = parseFloat(target.value) || 0;
        state.chargingSpeed = state.customKw;
        calculate();
        saveState();
    });

    elements.inputVolts.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.volts = parseFloat(target.value) || 0;
        calculate();
        saveState();
    });

    elements.inputAmps.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        state.amps = parseFloat(target.value) || 0;
        calculate();
        saveState();
    });

    // Slider Logic
    setupSlider();
}

function setupSlider() {
    let isDragging: 'current' | 'target' | null = null;

    const updateFromPointer = (e: MouseEvent | TouchEvent) => {
        const rect = elements.socSlider.getBoundingClientRect();
        let clientX: number;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        const x = clientX - rect.left;
        let percent = Math.round((x / rect.width) * 100);
        percent = Math.max(0, Math.min(100, percent));

        if (isDragging === 'current') {
            state.currentSoC = Math.min(percent, state.targetSoC - 1);
        } else if (isDragging === 'target') {
            state.targetSoC = Math.max(percent, state.currentSoC + 1);
        }

        updateSliderUI();
        calculate();
        saveState();
    };

    const onStart = (type: 'current' | 'target') => (e: MouseEvent | TouchEvent) => {
        isDragging = type;
        document.addEventListener('mousemove', updateFromPointer);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', updateFromPointer);
        document.addEventListener('touchend', onEnd);
        e.preventDefault();
    };

    const onEnd = () => {
        isDragging = null;
        document.removeEventListener('mousemove', updateFromPointer);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', updateFromPointer);
        document.removeEventListener('touchend', onEnd);
    };

    elements.handleCurrent.addEventListener('mousedown', onStart('current') as EventListener);
    elements.handleCurrent.addEventListener('touchstart', onStart('current') as EventListener);
    elements.handleTarget.addEventListener('mousedown', onStart('target') as EventListener);
    elements.handleTarget.addEventListener('touchstart', onStart('target') as EventListener);

    // Click on track to jump
    elements.socSlider.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.target !== elements.handleCurrent && e.target !== elements.handleTarget) {
            const rect = elements.socSlider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.round((x / rect.width) * 100);

            // Move closest handle
            if (Math.abs(percent - state.currentSoC) < Math.abs(percent - state.targetSoC)) {
                state.currentSoC = Math.min(percent, state.targetSoC - 1);
                isDragging = 'current';
            } else {
                state.targetSoC = Math.max(percent, state.currentSoC + 1);
                isDragging = 'target';
            }
            updateSliderUI();
            calculate();
            saveState();
            onStart(isDragging)(e);
        }
    });
}

function updateUI() {
    if (state.powerMode === 'kw') {
        elements.toggleText.innerText = 'Use Volts/Amps';
        elements.kwSelector.classList.remove('hidden');
        elements.vaSelector.classList.add('hidden');
    } else {
        elements.toggleText.innerText = 'Use kW Presets';
        elements.kwSelector.classList.add('hidden');
        elements.vaSelector.classList.remove('hidden');
    }
    updateSliderUI();
}

function updateSliderUI() {
    elements.currentSoCVal.innerText = state.currentSoC.toString();
    elements.targetSoCVal.innerText = state.targetSoC.toString();

    elements.handleCurrent.style.left = state.currentSoC + '%';
    elements.handleTarget.style.left = state.targetSoC + '%';

    elements.sliderFill.style.left = state.currentSoC + '%';
    elements.sliderFill.style.width = (state.targetSoC - state.currentSoC) + '%';
}

function calculate() {
    const energyNeeded = ((state.targetSoC - state.currentSoC) / 100) * state.batteryCapacity;

    let speed = state.chargingSpeed;
    if (state.powerMode === 'va') {
        speed = (state.volts * state.amps) / 1000;
        elements.vaResultKw.innerText = speed.toFixed(2);
    }

    const efficiencyFactor = state.efficiency / 100;
    const effectiveSpeed = speed * efficiencyFactor;
    const energyFromWall = energyNeeded / efficiencyFactor;

    const hoursNeeded = effectiveSpeed > 0 ? energyNeeded / effectiveSpeed : 0;

    const hours = Math.floor(hoursNeeded);
    const mins = Math.round((hoursNeeded - hours) * 60);

    // Time calculation
    const [depH, depM] = state.departureTime.split(':').map(Number);
    const depDate = new Date();
    depDate.setHours(depH, depM, 0, 0);

    const plugDate = new Date(depDate.getTime() - hoursNeeded * 60 * 60 * 1000);

    // Update Results
    elements.resEnergy.innerText = energyNeeded.toFixed(1);
    elements.resWallEnergy.innerText = energyFromWall.toFixed(1);
    elements.resHours.innerText = hours.toString();
    elements.resMins.innerText = mins.toString();

    // Format Departure for display
    const depLabel = depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    elements.resDeparture.innerText = depLabel;

    // Format Plug-in Time
    let plugH = plugDate.getHours();
    const ampm = plugH >= 12 ? 'PM' : 'AM';
    plugH = plugH % 12;
    plugH = plugH ? plugH : 12; // the hour '0' should be '12'
    const plugM = plugDate.getMinutes().toString().padStart(2, '0');

    elements.resPlugTime.innerText = `${plugH.toString().padStart(2, '0')}:${plugM}`;
    elements.resPlugAMPM.innerText = ampm;
}

init();
