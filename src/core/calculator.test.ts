import { describe, it, expect } from 'vitest';
import { calculateChargeTime } from './calculator';
import { State } from '../types';

describe('calculator logic', () => {
    const baseState: State = {
        batteryCapacity: 50,
        currentSoC: 20,
        targetSoC: 80,
        powerMode: 'kw',
        chargingSpeed: 10,
        volts: 230,
        amps: 16,
        departureTime: '08:00',
        customKw: 10,
        region: 'eu',
        efficiency: 100, // simplify for base tests
        theme: 'dark'
    };

    it('calculates energy needed correctly (20% -> 80% of 50kWh = 30kWh)', () => {
        const results = calculateChargeTime(baseState);
        expect(results.energyNeeded).toBe(30);
    });

    it('calculates duration correctly (30kWh @ 10kW = 3h)', () => {
        const results = calculateChargeTime(baseState);
        expect(results.hoursNeeded).toBe(3);
        expect(results.hours).toBe(3);
        expect(results.mins).toBe(0);
    });

    it('accounts for efficiency loss', () => {
        const state = { ...baseState, efficiency: 90 };
        const results = calculateChargeTime(state);
        
        // 30kWh needed, 90% efficiency
        // Effective speed = 10 * 0.9 = 9kW
        // Hours = 30 / 9 = 3.333h = 3h 20m
        expect(results.hours).toBe(3);
        expect(results.mins).toBe(20);
        expect(results.energyFromWall).toBeCloseTo(33.33, 1);
    });

    it('handles Va power mode correctly', () => {
        const state: State = { 
            ...baseState, 
            powerMode: 'va', 
            volts: 230, 
            amps: 10 
        };
        const results = calculateChargeTime(state);
        // 230V * 10A = 2.3kW
        // 30kWh / 2.3kW = 13.043h = 13h 3m
        expect(results.vaResultKw).toBe('2.30');
        expect(results.hours).toBe(13);
        expect(results.mins).toBe(3);
    });

    it('calculates plug-in time correctly within same day', () => {
        const state: State = { ...baseState, departureTime: '12:00' }; // 12:00 PM
        // 3h charge duration
        const results = calculateChargeTime(state);
        expect(results.plugTime.time).toBe('09:00');
        expect(results.plugTime.ampm).toBe('AM');
    });

    it('calculates plug-in time wrapping around midnight (yesterday)', () => {
        const state: State = { ...baseState, departureTime: '01:00' }; // 1:00 AM
        // 3h charge duration (should be 10:00 PM previous night)
        const results = calculateChargeTime(state);
        expect(results.plugTime.time).toBe('10:00');
        expect(results.plugTime.ampm).toBe('PM');
    });
});
