import { cleanup } from '@testing-library/react'
import alphs from '../helpers/math/alphabetPositions'

afterEach(cleanup)

describe('alphs', () => {
    it('posIn returning number from field column', () => {
        expect(alphs.posIn['a']).toBe(1)
        expect(alphs.posIn['c']).toBe(3)
    })

    it('posOut returning field column from number', () => {
        expect(alphs.posOut[1]).toBe('a')
        expect(alphs.posOut[3]).toBe('c')
    })

    it('changeAlphPos modifying field position', () => {
        const initialPos = 'b4'
        expect(alphs.changeAlphPos(initialPos, '+', 1)).toBe('c4')
        expect(alphs.changeAlphPos(initialPos, '-', 1)).toBe('a4')
        expect(alphs.changeAlphPos(initialPos, '+', 4, '-', 2)).toBe('f2')
        expect(alphs.changeAlphPos(initialPos, '-', 1, '-', 3)).toBe('a1')
        expect(alphs.changeAlphPos(initialPos, '-', 3, '+', 2)).toBe(NaN)
    })
})
