import { cleanup } from '@testing-library/react'
import defineColor from 'src/6.shared/lib/helpers/board/defineColor'

afterEach(cleanup)

describe('define color of square on board', () => {
    it('define color from index in row when setup board', () => {
        //we want to be colors like that: https://thumbs.dreamstime.com/b/chess-board-print-play-4438435.jpg

        let index = 0
        let row = 1

        // first field in first row in board is white field
        expect(defineColor(index, row)).toBe('whiteField')

        // first field in second row in board is black field
        row = 2
        expect(defineColor(index, row)).toBe('blackField')

        index = 1
        // second field in second row in board is white field
        expect(defineColor(index, row)).toBe('whiteField')
    })
})