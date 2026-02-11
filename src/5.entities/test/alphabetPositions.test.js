import { cleanup } from '@testing-library/react'
import { Operators } from '../../6.shared/model'
import alphs from '../lib/helpers/math/alphabetPositions'

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
        expect(alphs.changeAlphPos(initialPos, Operators.Forward, 1)).toBe('c4')
        expect(alphs.changeAlphPos(initialPos, Operators.Backward, 1)).toBe(
            'a4'
        )
        expect(
            alphs.changeAlphPos(
                initialPos,
                Operators.Forward,
                4,
                Operators.Backward,
                2
            )
        ).toBe('f2')
        expect(
            alphs.changeAlphPos(
                initialPos,
                Operators.Backward,
                1,
                Operators.Backward,
                3
            )
        ).toBe('a1')
        expect(
            alphs.changeAlphPos(
                initialPos,
                Operators.Backward,
                3,
                Operators.Forward,
                2
            )
        ).toBe(NaN)
    })
})
