import Piece from './piece'
import { KeyableSquares } from 'src/5.entities/model/Keyable'
import alphs from 'src/6.shared/lib/helpers/math/alphabetPositions'
import piecesImages from 'src/6.shared/lib/helpers/misc/piecesImages'

class Knight extends Piece {
    constructor(color: string) {
        super(
            color,
            color === 'Black'
                ? piecesImages.BlackKnight
                : piecesImages.WhiteKnight,
            'Knight'
        )
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const moves: string[] = []

        const rawMoves: string[] = [
            alphs.changeAlphPos(from, '+', 1, '+', 2),
            alphs.changeAlphPos(from, '-', 1, '+', 2),
            alphs.changeAlphPos(from, '+', 1, '-', 2),
            alphs.changeAlphPos(from, '-', 1, '-', 2),
            alphs.changeAlphPos(from, '+', 2, '+', 1),
            alphs.changeAlphPos(from, '+', 2, '-', 1),
            alphs.changeAlphPos(from, '-', 2, '+', 1),
            alphs.changeAlphPos(from, '-', 2, '-', 1),
        ]

        rawMoves.forEach((move) => {
            const pieceOnMove = squareState[move]
            const samePieceOnMove = pieceOnMove?.color === this.color
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            const movePassingValidation =
                move &&
                !move[2] &&
                parseInt(move[1]) > 0 &&
                parseInt(move[1]) < 9

            if (samePieceOnMove) return
            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)
        })

        return moves
    }
}

export default Knight
