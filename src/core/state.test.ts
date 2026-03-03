/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInitialState, saveState } from './state';
import * as regions from '../regions';

vi.mock('../regions', async () => {
    const actual = await vi.importActual('../regions');
    return {
        ...actual as any,
        detectRegion: vi.fn(),
    };
});

// Manual mock for localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('state management', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('initializes with defaults when storage is empty', () => {
        vi.mocked(regions.detectRegion).mockReturnValue('uk');
        const state = getInitialState();
        
        expect(state.region).toBe('uk');
        expect(state.volts).toBe(230); // UK default
        expect(state.batteryCapacity).toBe(54); // Global default
    });

    it('restores state from localStorage', () => {
        vi.mocked(regions.detectRegion).mockReturnValue('eu');
        const savedState = {
            batteryCapacity: 100,
            currentSoC: 10,
            targetSoC: 90,
            region: 'na'
        };
        window.localStorage.setItem('ev_planner_state', JSON.stringify(savedState));

        const state = getInitialState();
        expect(state.batteryCapacity).toBe(100);
        expect(state.region).toBe('na');
        expect(state.currentSoC).toBe(10);
    });

    it('migrates legacy keys correctly', () => {
        vi.mocked(regions.detectRegion).mockReturnValue('uk');
        
        window.localStorage.setItem('batteryCapacity', '75');
        window.localStorage.setItem('chargingSpeed', '11');
        window.localStorage.setItem('currentCharge', '15');
        window.localStorage.setItem('desiredCharge', '95');

        const state = getInitialState();
        
        expect(state.batteryCapacity).toBe(75);
        expect(state.chargingSpeed).toBe(11);
        expect(state.currentSoC).toBe(15);
        expect(state.targetSoC).toBe(95);
    });

    it('saves state to localStorage', () => {
        const state = getInitialState();
        state.batteryCapacity = 82;
        
        saveState(state);
        
        const stored = JSON.parse(window.localStorage.getItem('ev_planner_state') || '{}');
        expect(stored.batteryCapacity).toBe(82);
    });
});
