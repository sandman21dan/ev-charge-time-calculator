export function detectRegion(): string {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language.toLowerCase();

    if (tz.includes('America')) {
        // Split South America
        const saHighCities = ['Santiago', 'Buenos_Aires', 'Montevideo', 'Lima', 'Asuncion'];
        if (saHighCities.some(city => tz.includes(city))) {
            return 'sa_high';
        } else if (tz.includes('Sao_Paulo')) {
            return 'sa_low'; // Brazil is mixed, but 127V is common
        } else if (tz.includes('Bogota') || tz.includes('Caracas') || tz.includes('Guayaquil')) {
            return 'sa_low';
        } else {
            return 'na';
        }
    } else if (tz.includes('London') || tz.includes('Dublin') || lang.includes('en-gb')) {
        return 'uk';
    } else if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Auckland') || tz.includes('Perth')) {
        return 'au';
    } else if (tz.includes('Tokyo') || tz.includes('Seoul')) {
        return 'jp';
    } else if (tz.includes('Shanghai') || tz.includes('Hong_Kong') || tz.includes('Chongqing')) {
        return 'cn';
    } else {
        return 'eu';
    }
}
