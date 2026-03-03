import { describe, it, expect, vi } from 'vitest';
import { detectRegion } from './detector';

describe('region detector', () => {
    it('detects North America from New York timezone', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'America/New_York',
            locale: 'en-US'
        } as any);
        
        expect(detectRegion()).toBe('na');
    });

    it('detects UK from London timezone', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'Europe/London',
            locale: 'en-GB'
        } as any);

        expect(detectRegion()).toBe('uk');
    });

    it('detects South America (High) from Santiago', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'America/Santiago',
            locale: 'es-CL'
        } as any);

        expect(detectRegion()).toBe('sa_high');
    });

    it('detects South America (Low) from Sao Paulo', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'America/Sao_Paulo',
            locale: 'pt-BR'
        } as any);

        expect(detectRegion()).toBe('sa_low');
    });

    it('detects Australia from Sydney', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'Australia/Sydney',
            locale: 'en-AU'
        } as any);

        expect(detectRegion()).toBe('au');
    });

    it('detects Japan from Tokyo', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'Asia/Tokyo',
            locale: 'ja-JP'
        } as any);

        expect(detectRegion()).toBe('jp');
    });

    it('falls back to EU for unknown timezones', () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            timeZone: 'Europe/Berlin',
            locale: 'de-DE'
        } as any);

        expect(detectRegion()).toBe('eu');
    });
});
