import { KeyableSquares } from 'src/5.entities/model'
import { Colors, Pieces, piecesImages } from 'src/6.shared/model'
import { alphs } from '../alphabetPositions'
import { Bishop } from './bishop'
import { Piece } from './piece'
import { Rook } from './rook'

export class Queen extends Piece {
    constructor(color: Colors) {
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
            const num = alphs.getNum(move)
            const movePassingValidation = move && !move[2] && num > 0 && num < 9
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
