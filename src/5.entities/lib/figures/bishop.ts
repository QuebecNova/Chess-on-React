import { KeyableSquares } from 'src/5.entities/model'
import { Colors, Operators, Pieces, piecesImages } from 'src/6.shared/model'
import { alphs } from '../alphabetPositions'
import { Piece } from './piece'

export class Bishop extends Piece {
    constructor(color: Colors) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackBishop
                : piecesImages.WhiteBishop,
            Pieces.Bishop
        )
    }
    getRawMoves(from: string): string[] {
        const moves: string[] = [
            //NW diagonal 0-6
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                2,
                Operators.Forward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                3,
                Operators.Forward,
                3
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                4,
                Operators.Forward,
                4
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                5,
                Operators.Forward,
                5
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                6,
                Operators.Forward,
                6
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                7,
                Operators.Forward,
                7
            ),

            //SE diagonal 7-13
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Backward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                2,
                Operators.Backward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                3,
                Operators.Backward,
                3
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                4,
                Operators.Backward,
                4
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                5,
                Operators.Backward,
                5
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                6,
                Operators.Backward,
                6
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                7,
                Operators.Backward,
                7
            ),

            //NE diagonal 14-20
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                2,
                Operators.Forward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                3,
                Operators.Forward,
                3
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                4,
                Operators.Forward,
                4
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                5,
                Operators.Forward,
                5
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                6,
                Operators.Forward,
                6
            ),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                7,
                Operators.Forward,
                7
            ),

            //SW diagonal 14-27
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Backward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                2,
                Operators.Backward,
                2
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                3,
                Operators.Backward,
                3
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                4,
                Operators.Backward,
                4
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                5,
                Operators.Backward,
                5
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                6,
                Operators.Backward,
                6
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                7,
                Operators.Backward,
                7
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

        let NWDiagonalHavePiece = false
        let SEDiagonalHavePiece = false
        let NEDiagonalHavePiece = false
        let SWDiagonalHavePiece = false

        this.getRawMoves(from).forEach((move, index) => {
            const moveLeadsToCheck = movesLeadsToCheck?.[move]

            const pieceOnMove = squareState[move]

            const NWDiagonal = index < 7
            const SEDiagonal = index > 6 && index < 14
            const NEDiagonal = index > 13 && index < 21
            const SWDiagonal = index > 20

            if (NWDiagonal && NWDiagonalHavePiece) return
            if (SEDiagonal && SEDiagonalHavePiece) return
            if (NEDiagonal && NEDiagonalHavePiece) return
            if (SWDiagonal && SWDiagonalHavePiece) return

            if (pieceOnMove) {
                const sameColor = pieceOnMove.color === this.color
                const enemyColor = pieceOnMove.color !== this.color

                if (NWDiagonal) {
                    if (sameColor) {
                        NWDiagonalHavePiece = true
                        return
                    } else if (enemyColor) {
                        NWDiagonalHavePiece = true
                    }
                }

                if (SEDiagonal) {
                    if (sameColor) {
                        SEDiagonalHavePiece = true
                        return
                    } else if (enemyColor) {
                        SEDiagonalHavePiece = true
                    }
                }

                if (NEDiagonal) {
                    if (sameColor) {
                        NEDiagonalHavePiece = true
                        return
                    } else if (enemyColor) {
                        NEDiagonalHavePiece = true
                    }
                }

                if (SWDiagonal) {
                    if (sameColor) {
                        SWDiagonalHavePiece = true
                        return
                    } else if (enemyColor) {
                        SWDiagonalHavePiece = true
                    }
                }
            }

            if (moveLeadsToCheck) return
            if (this.isMoveValid(move)) moves.push(move)
        })

        return moves
    }
}
