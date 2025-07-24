import { KeyableSquares } from 'src/5.entities/model'
import {
    CastlingSide,
    Colors,
    Move,
    Operators,
    Pieces,
    piecesImages,
} from 'src/6.shared/model'
import { alphs } from '../alphabetPositions'
import { Piece } from './piece'

export class Rook extends Piece {
    readonly lastMoves: Move[] = []
    readonly side?: CastlingSide

    constructor(color: Colors, side?: CastlingSide) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackRook
                : piecesImages.WhiteRook,
            Pieces.Rook
        )

        this.side = side
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const moves: string[] = []

        const rawMoves: string[] = [
            // rows 0-13
            // 0-6 left
            alphs.changeAlphPos(from, Operators.Backward, 1),
            alphs.changeAlphPos(from, Operators.Backward, 2),
            alphs.changeAlphPos(from, Operators.Backward, 3),
            alphs.changeAlphPos(from, Operators.Backward, 4),
            alphs.changeAlphPos(from, Operators.Backward, 5),
            alphs.changeAlphPos(from, Operators.Backward, 6),
            alphs.changeAlphPos(from, Operators.Backward, 7),

            // 7-13 right
            alphs.changeAlphPos(from, Operators.Forward, 1),
            alphs.changeAlphPos(from, Operators.Forward, 2),
            alphs.changeAlphPos(from, Operators.Forward, 3),
            alphs.changeAlphPos(from, Operators.Forward, 4),
            alphs.changeAlphPos(from, Operators.Forward, 5),
            alphs.changeAlphPos(from, Operators.Forward, 6),
            alphs.changeAlphPos(from, Operators.Forward, 7),

            // cols 14-27
            // 14-20 back
            alphs.changeNumPos(from, Operators.Backward, 1),
            alphs.changeNumPos(from, Operators.Backward, 2),
            alphs.changeNumPos(from, Operators.Backward, 3),
            alphs.changeNumPos(from, Operators.Backward, 4),
            alphs.changeNumPos(from, Operators.Backward, 5),
            alphs.changeNumPos(from, Operators.Backward, 6),
            alphs.changeNumPos(from, Operators.Backward, 7),

            // 20-27 front
            alphs.changeNumPos(from, Operators.Forward, 1),
            alphs.changeNumPos(from, Operators.Forward, 2),
            alphs.changeNumPos(from, Operators.Forward, 3),
            alphs.changeNumPos(from, Operators.Forward, 4),
            alphs.changeNumPos(from, Operators.Forward, 5),
            alphs.changeNumPos(from, Operators.Forward, 6),
            alphs.changeNumPos(from, Operators.Forward, 7),
        ]

        let pieceInbackCol = false
        let pieceInfrontCol = false

        let pieceInbackRow = false
        let pieceInfrontRow = false

        rawMoves.forEach((move, index) => {
            const num = alphs.getNum(move)
            const movePassingValidation = move && !move[2] && num > 0 && num < 9
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            const pieceOnMove = squareState[move]

            const sameColorOnMove = pieceOnMove?.color === this.color
            const enemyColorOnMove = pieceOnMove?.color !== this.color

            const backRowMoves = index < 7
            const frontRowMoves = index > 6 && index < 14
            const backColMoves = index > 13 && index < 21
            const frontColMoves = index > 20

            if (backRowMoves && pieceInbackRow) return
            if (frontRowMoves && pieceInfrontRow) return
            if (backColMoves && pieceInbackCol) return
            if (frontColMoves && pieceInfrontCol) return

            if (pieceOnMove) {
                if (backRowMoves) {
                    if (sameColorOnMove) {
                        pieceInbackRow = true
                        return
                    } else if (enemyColorOnMove) {
                        pieceInbackRow = true
                    }
                }

                if (frontRowMoves) {
                    if (sameColorOnMove) {
                        pieceInfrontRow = true
                        return
                    } else if (enemyColorOnMove) {
                        pieceInfrontRow = true
                    }
                }

                if (backColMoves) {
                    if (sameColorOnMove) {
                        pieceInbackCol = true
                        return
                    } else if (enemyColorOnMove) {
                        pieceInbackCol = true
                    }
                }

                if (frontColMoves) {
                    if (sameColorOnMove) {
                        pieceInfrontCol = true
                        return
                    } else if (enemyColorOnMove) {
                        pieceInfrontCol = true
                    }
                }
            }

            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)
        })

        return moves
    }

    addMove(move: Move) {
        this.lastMoves.push(move)
        return this.lastMoves
    }

    static find(squares: KeyableSquares, side: CastlingSide, color: Colors) {
        return Object.entries(squares).find(
            ([_, rook]) =>
                rook.type === Pieces.Rook &&
                rook?.side === side &&
                rook?.color === color
        )
    }
}
