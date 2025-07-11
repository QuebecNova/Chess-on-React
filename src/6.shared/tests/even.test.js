import { cleanup } from '@testing-library/react'
import isEven from '../lib/helpers/math/even'

afterEach(cleanup)

describe('math even', () => {
    it('is even', () => {
        expect(isEven(2)).toBe(true)
    })
})
