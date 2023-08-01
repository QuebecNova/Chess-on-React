import Coords from '../../types/Coords'
import { keyableNumbers } from '../../types/keyable'

function getFieldCoordinates(
    coords: keyableNumbers,
    chessBoardOffsets: keyableNumbers,
    fieldSizes: Array<number>,
    variant: string
): Coords {
    //displaying coordinates of the mouse related to the board
    // example: cursor at b3: b = row(2), 3 = col(3)
    // if cursor out the board one of the coords is 0

    //mouse positions(x, y) including borders, and board offset

    let x = coords.x - chessBoardOffsets.left - 5
    let y = coords.y - chessBoardOffsets.top - 5

    const xCoord = x
    const yCoord = y

    const fieldCoords = { row: 0, col: 0 }

    if (variant === 'black') {
        x = yCoord
        y = xCoord
    }

    fieldSizes.forEach((fieldStartsOn, index) => {
        if (x >= fieldStartsOn && x <= fieldSizes[index + 1]) {
            const row = index + 1
            variant === 'black'
                ? (fieldCoords.col = row)
                : (fieldCoords.row = row)
        }
    })

    const fieldSizesReversed = fieldSizes.slice().reverse()
    fieldSizesReversed.forEach((fieldStartsOn, index) => {
        if (y <= fieldStartsOn && y >= fieldSizesReversed[index + 1]) {
            const col = index + 1
            variant === 'black'
                ? (fieldCoords.row = col)
                : (fieldCoords.col = col)
        }
    })

    return fieldCoords
}

export default getFieldCoordinates
