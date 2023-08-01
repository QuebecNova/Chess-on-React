import {
    isKeyableString,
    keyablePieceOnField,
    keyableSquares,
} from '../../types/keyable'

export function parsePieceOnField(
    pieceData: keyablePieceOnField,
    squares: keyableSquares
): keyablePieceOnField {
    //parsing raw piece data to valid pieceOnField data for setSquares

    const pieceOnField = {}

    for (const [key, value] of Object.entries(pieceData)) {
        if (value && isKeyableString(value)) {
            pieceOnField[key] = squares[value.from]
        } else {
            pieceOnField[key] = null
        }
    }

    return pieceOnField
}
