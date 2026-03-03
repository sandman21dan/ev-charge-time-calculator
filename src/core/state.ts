import { State } from '../types';
import { REGIONS, detectRegion } from '../regions';

const STORAGE_KEY = 'ev_planner_state';

const DEFAULT_STATE: State = {
    batteryCapacity: 54,
    currentSoC: 20,
    targetSoC: 80,
    powerMode: 'kw',
    chargingSpeed: 7.4,
    volts: 230,
    amps: 16,
    departureTime: '07:00',
    customKw: 11.0,
    region: 'uk',
    efficiency: 90,
    theme: 'dark'
};

export function getInitialState(): State {
    let state = { ...DEFAULT_STATE };
    state.region = detectRegion();

    const saved = localStorage.getItem(STORAGE_KEY);
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

        // Set default volts from region if first run
        state.volts = REGIONS[state.region].volts;
    }

    return state;
}

export function saveState(state: State): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
