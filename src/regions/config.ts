import { Regions } from '../types';

export const REGIONS: Regions = {
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
