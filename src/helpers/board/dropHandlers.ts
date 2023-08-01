import { keyableSquares } from '../../types/keyable'
import IPiece from '../../types/IPiece'
import alphs from '../math/alphabetPositions'

export function checkForCastle(
    squares: keyableSquares,
    dropField: string,
    from: string,
    castleAvailable: string[]
) {
    if (!castleAvailable) return

    const modifiedPieceOnField = {
        [from]: null,
    }

    let rookInitialPieceField = ''

    const kingMovedLeft = alphs.changeAlphPos(from, '-', 2) === dropField
    const kingMovedRight = alphs.changeAlphPos(from, '+', 2) === dropField
    let castledRookLeft: string
    let castledRookRight: string
    const rookLeft: string = alphs.changeAlphPos(from, '-', 4)
    const rookRight: string = alphs.changeAlphPos(from, '+', 3)

    castleAvailable.forEach((castle) => {
        if (castle.includes('Left') && kingMovedLeft)
            castledRookLeft = alphs.changeAlphPos(rookLeft, '+', 3)
        if (castle.includes('Right') && kingMovedRight)
            castledRookRight = alphs.changeAlphPos(rookRight, '-', 2)
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
    squares: keyableSquares,
    dropField: string,
    from: string,
    enpassantAvailable: string
): keyableSquares {
    if (!enpassantAvailable) return

    const modifiedPieceOnField: keyableSquares = {
        [from]: null,
    }

    const piece: IPiece = squares[from]

    let enpassantedField: string
    if (piece.color === 'White' && enpassantAvailable.includes('Left'))
        enpassantedField = alphs.changeAlphPos(from, '-', 1)
    if (piece.color === 'White' && enpassantAvailable.includes('Right'))
        enpassantedField = alphs.changeAlphPos(from, '+', 1)
    if (piece.color === 'Black' && enpassantAvailable.includes('Left'))
        enpassantedField = alphs.changeAlphPos(from, '-', 1)
    if (piece.color === 'Black' && enpassantAvailable.includes('Right'))
        enpassantedField = alphs.changeAlphPos(from, '+', 1)
    if (
        dropField === alphs.changeAlphPos(from, '+', 1, '+', 1) ||
        dropField === alphs.changeAlphPos(from, '+', 1, '-', 1) ||
        dropField === alphs.changeAlphPos(from, '-', 1, '-', 1) ||
        dropField === alphs.changeAlphPos(from, '-', 1, '+', 1)
    ) {
        modifiedPieceOnField[enpassantedField] = null
    }

    return modifiedPieceOnField
}
