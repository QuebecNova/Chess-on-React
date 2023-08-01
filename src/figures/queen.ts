import Piece from './piece'
import piecesImages from '../helpers/misc/piecesImages'
import Bishop from './bishop'
import Rook from './rook'
import { keyableSquares } from '../types/keyable'

class Queen extends Piece {
    constructor(color: string) {
        super(
            color,
            color === 'Black'
                ? piecesImages.BlackQueen
                : piecesImages.WhiteQueen,
            'Queen'
        )
    }

    canMove(
        from: string,
        squareState: keyableSquares,
        movesLeadsToCheck: keyableSquares
    ): string[] {
        const moves: string[] = []

        const QueenExtendsBishop = new Bishop(this.color)
        const QueenExtendsRook = new Rook(this.color)

        const diagonalRawMoves = QueenExtendsBishop.canMove(
            from,
            squareState,
            movesLeadsToCheck
        )
        const linearRawMoves = QueenExtendsRook.canMove(
            from,
            squareState,
            movesLeadsToCheck
        )

        const rawMoves: string[] = [...diagonalRawMoves, ...linearRawMoves]

        rawMoves.forEach((move) => {
            const movePassingValidation =
                move &&
                !move[2] &&
                parseInt(move[1]) > 0 &&
                parseInt(move[1]) < 9
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            const pieceOnMove = squareState[move]
            const sameColorPieceOnMove = pieceOnMove?.color === this.color

            if (sameColorPieceOnMove) return
            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)
        })

        return moves
    }
}

export default Queen
