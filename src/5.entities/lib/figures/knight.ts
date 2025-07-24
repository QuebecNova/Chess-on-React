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

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const moves: string[] = []

        const rawMoves: string[] = [
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

        rawMoves.forEach((move) => {
            const num = alphs.getNum(move)
            const pieceOnMove = squareState[move]
            const samePieceOnMove = pieceOnMove?.color === this.color
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            const movePassingValidation = move && !move[2] && num > 0 && num < 9

            if (samePieceOnMove) return
            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)
        })

        return moves
    }
}
