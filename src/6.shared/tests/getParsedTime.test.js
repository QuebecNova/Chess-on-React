import { cleanup } from '@testing-library/react'
import getParsedTime from '../lib/helpers/getParsedTime'

afterEach(cleanup)

describe('getParsedTime', () => {
    it('returning right date', () => {
        const hundredSeconds = 100 * 1000
        const hundredMinutes = 100 * 60 * 1000
        const oneHourHundredMinutesTwoSeconds = ((1 * 60 + 100) * 60 + 2) * 1000
        expect(getParsedTime(hundredSeconds)).toStrictEqual([0, 1, 40]) //1 minute, 40 seconds
        expect(getParsedTime(hundredMinutes)).toStrictEqual([1, 40, 0]) //1 hour, 40 minutes
        expect(getParsedTime(oneHourHundredMinutesTwoSeconds)).toStrictEqual([
            2, 40, 2,
        ]) // 2 hours, 40 minutes, 2 seconds
    })
})
