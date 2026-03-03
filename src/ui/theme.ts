import { elements } from './elements';
import { State } from '../types';

export function applyTheme(state: State): void {
    const root = document.documentElement;
    if (state.theme === 'light') {
        root.classList.add('light-mode');
        elements.themeIcon.className = 'ph ph-sun';
    } else {
        root.classList.remove('light-mode');
        elements.themeIcon.className = 'ph ph-moon';
    }
}
