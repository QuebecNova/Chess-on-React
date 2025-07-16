import { KeyablePieceOnField, KeyableSquares } from 'src/5.entities/model'
import { isKeyableString } from 'src/6.shared/model'

export function parsePieceOnField(
    pieceData: KeyablePieceOnField,
    squares: KeyableSquares
): KeyablePieceOnField {
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
