import '@testing-library/jest-dom';
import { getIconSize } from '../DynamicMarker/DynamicMarker';

describe('mapUtils', () => {
    describe('getIconSize', () => {
        it('returns large icons for zoom level 16 and above', () => {
            expect(getIconSize(16)).toEqual([40, 40]);
            expect(getIconSize(17)).toEqual([40, 40]);
        });

        it('returns medium icons for zoom levels 14 and 15', () => {
            expect(getIconSize(14)).toEqual([30, 30]);
            expect(getIconSize(15)).toEqual([30, 30]);
        });

        it('returns small icons for zoom level 13', () => {
            expect(getIconSize(13)).toEqual([20, 20]);
        });

        it('returns zero size for zoom levels below 13', () => {
            expect(getIconSize(12)).toEqual([0, 0]);
            expect(getIconSize(11)).toEqual([0, 0]);
        });
    });
});