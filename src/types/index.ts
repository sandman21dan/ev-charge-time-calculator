export interface Preset {
    a: number;
    v?: number;
    label?: string;
}

export interface Region {
    name: string;
    volts: number;
    presets: Preset[];
}

export interface Regions {
    [key: string]: Region;
}

export interface State {
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

export interface CalculationResults {
    energyNeeded: number;
    energyFromWall: number;
    hoursNeeded: number;
    hours: number;
    mins: number;
    departureLabel: string;
    plugTime: {
        time: string;
        ampm: string;
    };
    vaResultKw?: string;
}
