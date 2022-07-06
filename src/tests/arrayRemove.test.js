import { cleanup } from '@testing-library/react';
import arrayRemove from '../services/math/arrayRemove'

afterEach(cleanup)

describe('arrayRemove', () => {
    it('removing value from string array', () => {
        const arr = ['apple', 'banana', 'dadJokes']
    
        expect(arrayRemove(arr, 'dadJokes')).toStrictEqual(['apple', 'banana'])
    })
    
    it('removing value from number array', () => {
        const arr = [666, 1, 123]
    
        expect(arrayRemove(arr, 123)).toStrictEqual([666, 1])
    })

    it('removing value from string/number array', () => {
        const arr = [666, 'banana', 123]
    
        expect(arrayRemove(arr, 123)).toStrictEqual([666, 'banana'])
    })
})
