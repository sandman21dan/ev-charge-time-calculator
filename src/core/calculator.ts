import { State, CalculationResults } from '../types';

export function calculateChargeTime(state: State): CalculationResults {
    const energyNeeded = ((state.targetSoC - state.currentSoC) / 100) * state.batteryCapacity;

    let speed = state.chargingSpeed;
    let vaResultKw: string | undefined;

    if (state.powerMode === 'va') {
        speed = (state.volts * state.amps) / 1000;
        vaResultKw = speed.toFixed(2);
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

    // Format Departure for display
    const departureLabel = depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Format Plug-in Time
    let plugH = plugDate.getHours();
    const ampm = plugH >= 12 ? 'PM' : 'AM';
    plugH = plugH % 12;
    plugH = plugH ? plugH : 12; // the hour '0' should be '12'
    const plugM = plugDate.getMinutes().toString().padStart(2, '0');

    return {
        energyNeeded,
        energyFromWall,
        hoursNeeded,
        hours,
        mins,
        departureLabel,
        plugTime: {
            time: `${plugH.toString().padStart(2, '0')}:${plugM}`,
            ampm
        },
        vaResultKw
    };
}
