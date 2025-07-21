import { alphs } from 'src/5.entities/lib'
import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { CastlingSide, Colors, Moves, Operators } from 'src/6.shared/model'

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
        if (castle.includes(Moves.CastleLeft) && kingMovedLeft)
            castledRookLeft = alphs.changeAlphPos(
                rookLeft,
                Operators.Forward,
                3
            )
        if (castle.includes(Moves.CastleRight) && kingMovedRight)
            castledRookRight = alphs.changeAlphPos(
                rookRight,
                Operators.Backward,
                2
            )
    })

    let castlingSide: CastlingSide

    if (castledRookLeft) {
        modifiedPieceOnField[rookLeft] = null
        modifiedPieceOnField[castledRookLeft] = squares[rookLeft]
        rookInitialPieceField = rookLeft
        castlingSide = CastlingSide.QueenSide
    }

    if (castledRookRight) {
        modifiedPieceOnField[rookRight] = null
        modifiedPieceOnField[castledRookRight] = squares[rookRight]
        rookInitialPieceField = rookRight
        castlingSide = CastlingSide.KingSide
    }

    return { modifiedPieceOnField, rookInitialPieceField, castlingSide }
}

export function checkForEnpassant(
    squares: KeyableSquares,
    dropField: string,
    from: string,
    enpassantAvailable: string
): [boolean, KeyableSquares] {
    if (!enpassantAvailable) return

    const modifiedPieceOnField: KeyableSquares = {
        [from]: null,
    }

    const piece: IPiece = squares[from]
    let enpassantedField: string
    let isEnpassanted = false
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
        isEnpassanted = true
    }

    return [isEnpassanted, modifiedPieceOnField]
}
