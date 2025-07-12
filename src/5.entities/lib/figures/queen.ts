import { KeyableSquares } from 'src/5.entities/model/types/Keyable'
import { Colors, Pieces } from 'src/6.shared/model/constants/board'
import piecesImages from 'src/6.shared/model/constants/piecesImages'
import { Bishop, Rook } from './index'
import Piece from './piece'

class Queen extends Piece {
    constructor(color: string) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackQueen
                : piecesImages.WhiteQueen,
            Pieces.Queen
        )
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
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
