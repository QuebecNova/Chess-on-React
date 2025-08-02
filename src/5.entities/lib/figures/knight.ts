import { KeyableSquares } from 'src/5.entities/model'
import { Colors, Operators, Pieces, piecesImages } from 'src/6.shared/model'
import { alphs } from '../alphabetPositions'
import { Piece } from './piece'

export class Knight extends Piece {
    constructor(color: Colors) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackKnight
                : piecesImages.WhiteKnight,
            Pieces.Knight
        )
    }

    getRawMoves(from: string) {
        const moves = [
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Forward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Forward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Backward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Backward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                2,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                2,
                Operators.Backward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                2,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                2,
                Operators.Backward,
                1
            ),
        ]
        return moves
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const moves: string[] = []

        this.getRawMoves(from).forEach((move) => {
            const pieceOnMove = squareState[move]
            const samePieceOnMove = pieceOnMove?.color === this.color
            const moveLeadsToCheck = movesLeadsToCheck?.[move]

            if (samePieceOnMove) return
            if (moveLeadsToCheck) return
            if (this.isMoveValid(move)) moves.push(move)
        })

        return moves
    }
}
