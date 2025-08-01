import { KeyableSquares } from 'src/5.entities/model'
import { Colors, Pieces, piecesImages } from 'src/6.shared/model'
import { Bishop } from './bishop'
import { Piece } from './piece'
import { Rook } from './rook'

export class Queen extends Piece {
    bishop: Bishop
    rook: Rook

    constructor(color: Colors) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackQueen
                : piecesImages.WhiteQueen,
            Pieces.Queen
        )
        this.bishop = new Bishop(this.color)
        this.rook = new Rook(this.color)
    }

    getRawMoves(from: string): string[] {
        return this.rook.getRawMoves(from).concat(this.bishop.getRawMoves(from))
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const moves: string[] = []

        const diagonalRawMoves = this.bishop.canMove(
            from,
            squareState,
            movesLeadsToCheck
        )
        const linearRawMoves = this.rook.canMove(
            from,
            squareState,
            movesLeadsToCheck
        )

        const rawMoves: string[] = [...diagonalRawMoves, ...linearRawMoves]
        rawMoves.forEach((move) => {
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            const pieceOnMove = squareState[move]
            const sameColorPieceOnMove = pieceOnMove?.color === this.color

            if (sameColorPieceOnMove) return
            if (moveLeadsToCheck) return
            if (this.isMoveValid(move)) moves.push(move)
        })

        return moves
    }
}
