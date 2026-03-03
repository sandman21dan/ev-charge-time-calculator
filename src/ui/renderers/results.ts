import { elements } from '../elements';
import { CalculationResults } from '../../types';

export function updateResultsUI(results: CalculationResults): void {
    elements.resEnergy.innerText = results.energyNeeded.toFixed(1);
    elements.resWallEnergy.innerText = results.energyFromWall.toFixed(1);
    elements.resHours.innerText = results.hours.toString();
    elements.resMins.innerText = results.mins.toString();
    elements.resDeparture.innerText = results.departureLabel;
    elements.resPlugTime.innerText = results.plugTime.time;
    elements.resPlugAMPM.innerText = results.plugTime.ampm;

    if (results.vaResultKw) {
        elements.vaResultKw.innerText = results.vaResultKw;
    }
}
