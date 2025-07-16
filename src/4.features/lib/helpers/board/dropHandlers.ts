import { alphs } from 'src/5.entities/lib'
import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { Colors, Directions, Moves, Operators } from 'src/6.shared/model'

export function checkForCastle(
    squares: KeyableSquares,
    dropField: string,
    from: string,
    castleAvailable: string[]
) {
    if (!castleAvailable) return

    const modifiedPieceOnField = {
        [from]: null,
    }

    let rookInitialPieceField = ''

    const kingMovedLeft =
        alphs.changeAlphPos(from, Operators.Backward, 2) === dropField
    const kingMovedRight =
        alphs.changeAlphPos(from, Operators.Forward, 2) === dropField
    let castledRookLeft: string
    let castledRookRight: string
    const rookLeft: string = alphs.changeAlphPos(from, Operators.Backward, 4)
    const rookRight: string = alphs.changeAlphPos(from, Operators.Forward, 3)

    castleAvailable.forEach((castle) => {
        if (castle.includes(Directions.Left) && kingMovedLeft)
            castledRookLeft = alphs.changeAlphPos(
                rookLeft,
                Operators.Forward,
                3
            )
        if (castle.includes(Directions.Right) && kingMovedRight)
            castledRookRight = alphs.changeAlphPos(
                rookRight,
                Operators.Backward,
                2
            )
    })

    if (castledRookLeft) {
        modifiedPieceOnField[rookLeft] = null
        modifiedPieceOnField[castledRookLeft] = squares[rookLeft]
        rookInitialPieceField = rookLeft
    }

    if (castledRookRight) {
        modifiedPieceOnField[rookRight] = null
        modifiedPieceOnField[castledRookRight] = squares[rookRight]
        rookInitialPieceField = rookRight
    }

    return { modifiedPieceOnField, rookInitialPieceField }
}

export function checkForEnpassant(
    squares: KeyableSquares,
    dropField: string,
    from: string,
    enpassantAvailable: string
): KeyableSquares {
    if (!enpassantAvailable) return

    const modifiedPieceOnField: KeyableSquares = {
        [from]: null,
    }

    const piece: IPiece = squares[from]
    let enpassantedField: string
    if (
        piece.color === Colors.White &&
        enpassantAvailable.includes(Moves.EnpassantLeft)
    )
        enpassantedField = alphs.changeAlphPos(from, Operators.Backward, 1)
    if (
        piece.color === Colors.White &&
        enpassantAvailable.includes(Moves.EnpassantRight)
    )
        enpassantedField = alphs.changeAlphPos(from, Operators.Forward, 1)
    if (
        piece.color === Colors.Black &&
        enpassantAvailable.includes(Moves.EnpassantLeft)
    )
        enpassantedField = alphs.changeAlphPos(from, Operators.Backward, 1)
    if (
        piece.color === Colors.Black &&
        enpassantAvailable.includes(Moves.EnpassantRight)
    )
        enpassantedField = alphs.changeAlphPos(from, Operators.Forward, 1)
    if (
        dropField ===
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Forward,
                1
            ) ||
        dropField ===
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Backward,
                1
            ) ||
        dropField ===
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Backward,
                1
            ) ||
        (dropField ===
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Forward,
                1
            ) &&
            enpassantedField)
    ) {
        modifiedPieceOnField[enpassantedField] = null
    }

    return modifiedPieceOnField
}
