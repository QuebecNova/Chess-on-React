import { cleanup } from '@testing-library/react';
import even from '../services/math/even';

afterEach(cleanup)

describe('math even', () => {
    it('is even', () => {
        expect(even.isEven(2)).toBe(true)
    })
    
    it('define color from index in row when setup board', () => {
        //we want to be colors like that: https://thumbs.dreamstime.com/b/chess-board-print-play-4438435.jpg
        
        let index = 0
        let row = 1
    
        // first field in first row in board is white field
        expect(even.defineColor(index, row)).toBe('whiteField')
    
        // first field in second row in board is black field
        row = 2
        expect(even.defineColor(index, row)).toBe('blackField') 
    
        index = 1
        // second field in second row in board is white field
        expect(even.defineColor(index, row)).toBe('whiteField')
})
})