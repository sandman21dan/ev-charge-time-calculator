import { elements } from './elements';
import { State } from '../types';

export class SoCSlider {
    private isDragging: 'current' | 'target' | null = null;
    private onUpdate: (current: number, target: number) => void;

    constructor(onUpdate: (current: number, target: number) => void) {
        this.onUpdate = onUpdate;
    }

    public updateUI(state: State) {
        elements.currentSoCVal.innerText = state.currentSoC.toString();
        elements.targetSoCVal.innerText = state.targetSoC.toString();

        elements.handleCurrent.style.left = state.currentSoC + '%';
        elements.handleTarget.style.left = state.targetSoC + '%';

        elements.sliderFill.style.left = state.currentSoC + '%';
        elements.sliderFill.style.width = (state.targetSoC - state.currentSoC) + '%';
    }

    public init(state: State) {
        const updateFromPointer = (e: MouseEvent | TouchEvent) => {
            const rect = elements.socSlider.getBoundingClientRect();
            let clientX: number;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = (e as MouseEvent).clientX;
            }
            
            const x = clientX - rect.left;
            let percent = Math.round((x / rect.width) * 100);
            percent = Math.max(0, Math.min(100, percent));

            let current = state.currentSoC;
            let target = state.targetSoC;

            if (this.isDragging === 'current') {
                current = Math.min(percent, state.targetSoC - 1);
            } else if (this.isDragging === 'target') {
                target = Math.max(percent, state.currentSoC + 1);
            }

            this.onUpdate(current, target);
        };

        const onStart = (type: 'current' | 'target') => (e: MouseEvent | TouchEvent) => {
            this.isDragging = type;
            const onEnd = () => {
                this.isDragging = null;
                document.removeEventListener('mousemove', updateFromPointer);
                document.removeEventListener('mouseup', onEnd);
                document.removeEventListener('touchmove', updateFromPointer);
                document.removeEventListener('touchend', onEnd);
            };
            document.addEventListener('mousemove', updateFromPointer);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', updateFromPointer);
            document.addEventListener('touchend', onEnd);
            e.preventDefault();
        };

        elements.handleCurrent.addEventListener('mousedown', onStart('current') as any);
        elements.handleCurrent.addEventListener('touchstart', onStart('current') as any);
        elements.handleTarget.addEventListener('mousedown', onStart('target') as any);
        elements.handleTarget.addEventListener('touchstart', onStart('target') as any);

        elements.socSlider.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target !== elements.handleCurrent && e.target !== elements.handleTarget) {
                const rect = elements.socSlider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = Math.round((x / rect.width) * 100);

                let current = state.currentSoC;
                let target = state.targetSoC;

                if (Math.abs(percent - current) < Math.abs(percent - target)) {
                    current = Math.min(percent, target - 1);
                    this.isDragging = 'current';
                } else {
                    target = Math.max(percent, current + 1);
                    this.isDragging = 'target';
                }
                this.onUpdate(current, target);
                onStart(this.isDragging)(e as any);
            }
        });
    }
}
