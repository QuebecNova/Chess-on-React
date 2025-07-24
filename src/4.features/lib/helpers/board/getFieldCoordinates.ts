import { Coords } from 'src/5.entities/model'
import { Colors, KeyableNumbers } from 'src/6.shared/model'

export function getFieldCoordinates(
    coords: KeyableNumbers,
    chessBoardOffsets: KeyableNumbers,
    fieldSizes: Array<number>,
    variant: string
): Coords {
    //displaying coordinates of the mouse related to the board
    // example: cursor at b3: b = row(2), 3 = col(3)
    // if cursor out the board one of the coords is 0

    //mouse positions(x, y) including borders, and board offset

    let x = coords.x - chessBoardOffsets.left + (window ? window.scrollX : 0)
    let y = coords.y - chessBoardOffsets.top + (window ? window.scrollY : 0)

    const xCoord = x
    const yCoord = y

    const fieldCoords = { row: 0, col: 0 }

    if (variant === Colors.Black) {
        x = yCoord
        y = xCoord
    }

    fieldSizes.forEach((fieldStartsOn, index) => {
        if (x >= fieldStartsOn && x <= fieldSizes[index + 1]) {
            const row = index + 1
            variant === Colors.Black
                ? (fieldCoords.col = row)
                : (fieldCoords.row = row)
        }
    })

    const fieldSizesReversed = fieldSizes.slice().reverse()
    fieldSizesReversed.forEach((fieldStartsOn, index) => {
        if (y <= fieldStartsOn && y >= fieldSizesReversed[index + 1]) {
            const col = index + 1
            variant === Colors.Black
                ? (fieldCoords.row = col)
                : (fieldCoords.col = col)
        }
    })

    return fieldCoords
}
