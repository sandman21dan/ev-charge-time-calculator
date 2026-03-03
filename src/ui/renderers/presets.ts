import { elements } from '../elements';
import { State } from '../../types';
import { REGIONS } from '../../regions';

export function renderPresets(state: State, onSpeedChange: (speed: number, isCustom: boolean) => void): void {
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
            let newSpeed: number;
            let custom = false;
            if (target.value === 'custom') {
                elements.customKwInput.style.display = 'block';
                newSpeed = parseFloat(elements.customKwValue.value) || 0;
                custom = true;
            } else {
                elements.customKwInput.style.display = 'none';
                newSpeed = parseFloat(target.value);
            }
            onSpeedChange(newSpeed, custom);
        });
    });

    if (isCustom && state.powerMode === 'kw') {
        elements.customKwInput.style.display = 'block';
    } else {
        elements.customKwInput.style.display = 'none';
    }
}
