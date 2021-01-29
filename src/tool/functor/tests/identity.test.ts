

import {Identity} from '../identity';


describe('test Identity', () => {
    it('join', () => {
        expect(Identity.of(1).join()).toBe(1);
    });
    it('map', () => {
        expect(Identity.of(1).map(x => x + 1).join()).toBe(2);
    });
    it('chain', () => {
        const result = Identity.of(1).chain(x => Identity.of(x + 1));
        expect(result).toBeInstanceOf(Identity);
        expect(result.join()).toBe(2);
    });
});
