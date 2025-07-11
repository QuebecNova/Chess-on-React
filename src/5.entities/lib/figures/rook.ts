import piecesImages from 'src/6.shared/lib/helpers/misc/piecesImages'
import Piece from './piece'
import { KeyableSquares } from 'src/5.entities/model/Keyable'
import alphs from 'src/6.shared/lib/helpers/math/alphabetPositions'

class Rook extends Piece {
    constructor(color: string) {
        super(
            color,
            color === 'Black' ? piecesImages.BlackRook : piecesImages.WhiteRook,
            'Rook'
        )
    }

    lastMoves: string[] = []

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const moves: string[] = []

        const rawMoves: string[] = [
            // rows 0-13
            // 0-6 left
            alphs.changeAlphPos(from, '-', 1),
            alphs.changeAlphPos(from, '-', 2),
            alphs.changeAlphPos(from, '-', 3),
            alphs.changeAlphPos(from, '-', 4),
            alphs.changeAlphPos(from, '-', 5),
            alphs.changeAlphPos(from, '-', 6),
            alphs.changeAlphPos(from, '-', 7),

            // 7-13 right
            alphs.changeAlphPos(from, '+', 1),
            alphs.changeAlphPos(from, '+', 2),
            alphs.changeAlphPos(from, '+', 3),
            alphs.changeAlphPos(from, '+', 4),
            alphs.changeAlphPos(from, '+', 5),
            alphs.changeAlphPos(from, '+', 6),
            alphs.changeAlphPos(from, '+', 7),

            // cols 14-27
            // 14-20 back
            from[0] + (parseInt(from[1]) - 1),
            from[0] + (parseInt(from[1]) - 2),
            from[0] + (parseInt(from[1]) - 3),
            from[0] + (parseInt(from[1]) - 4),
            from[0] + (parseInt(from[1]) - 5),
            from[0] + (parseInt(from[1]) - 6),
            from[0] + (parseInt(from[1]) - 7),

            // 20-27 front
            from[0] + (parseInt(from[1]) + 1),
            from[0] + (parseInt(from[1]) + 2),
            from[0] + (parseInt(from[1]) + 3),
            from[0] + (parseInt(from[1]) + 4),
            from[0] + (parseInt(from[1]) + 5),
            from[0] + (parseInt(from[1]) + 6),
            from[0] + (parseInt(from[1]) + 7),
        ]

        let pieceInbackCol = false
        let pieceInfrontCol = false

        let pieceInbackRow = false
        let pieceInfrontRow = false

        rawMoves.forEach((move, index) => {
            const movePassingValidation =
                move &&
                !move[2] &&
                parseInt(move[1]) > 0 &&
                parseInt(move[1]) < 9
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
}

export default Rook
