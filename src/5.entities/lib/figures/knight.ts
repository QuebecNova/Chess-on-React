import { KeyableSquares } from 'src/5.entities/model/types/Keyable'
import alphs from 'src/6.shared/lib/helpers/math/alphabetPositions'
import { Colors, Operators, Pieces } from 'src/6.shared/model/constants/board'
import piecesImages from 'src/6.shared/model/constants/piecesImages'
import Piece from './piece'

class Knight extends Piece {
    constructor(color: string) {
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
