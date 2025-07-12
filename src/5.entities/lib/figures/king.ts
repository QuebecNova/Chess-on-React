import { KeyableSquares } from 'src/5.entities/model/types/Keyable'
import alphs from 'src/6.shared/lib/helpers/math/alphabetPositions'
import arrayRemove from 'src/6.shared/lib/helpers/math/arrayRemove'
import {
    Colors,
    Moves,
    Operators,
    Pieces,
} from 'src/6.shared/model/constants/board'
import piecesImages from 'src/6.shared/model/constants/piecesImages'
import Piece from './piece'

class King extends Piece {
    lastMoves: string[]
    onCheck: boolean

    constructor(color: string) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackKing
                : piecesImages.WhiteKing,
            Pieces.King
        )
        this.lastMoves = []
        this.onCheck = false
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares,
        initialState?: KeyableSquares
    ): string[] {
        const isKingOnCheck = movesLeadsToCheck?.[from]
        if (isKingOnCheck) {
            this.onCheck = true
        } else {
            this.onCheck = false
        }

        let moves = []

        //rooks here
        const rookRight = alphs.changeAlphPos(from, Operators.Forward, 3)
        const rookLeft = alphs.changeAlphPos(from, Operators.Backward, 4)

        const rawMoves: string[] = [
            //circular moves starting from kingpos[1] + 1
            from[0] + (parseInt(from[1]) + 1),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(from, Operators.Forward, 1),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Backward,
                1
            ),
            from[0] + (parseInt(from[1]) - 1),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Backward,
                1
            ),
            alphs.changeAlphPos(from, Operators.Backward, 1),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Forward,
                1
            ),
            //castling
            alphs.changeAlphPos(from, Operators.Forward, 2),
            alphs.changeAlphPos(from, Operators.Backward, 2),
            from,
            alphs.changeAlphPos(from, Operators.Backward, 3),
        ]

        rawMoves.forEach((move, index) => {
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            const movePassingValidation =
                move &&
                !move[2] &&
                parseInt(move[1]) > 0 &&
                parseInt(move[1]) < 9 &&
                index < 11

            const pieceOnMove = squareState[move]
            const samePieceOnMove = pieceOnMove?.color === this.color

            const kingOnCheck = movesLeadsToCheck?.[from]

            if (samePieceOnMove && pieceOnMove.type !== Pieces.King) return

            //castle logic
            const kingMoved = this.lastMoves.length > 0
            const castilngMove = index > 7

            if (castilngMove) {
                const castlingToRight = index === 8
                const castlingToLeft = index === 9

                //GOD HELP ME
                //THAT'S SMELLS LIKE A BOLEAN ALGEBRA
                const castlePassingValidationToRight =
                    !kingMoved &&
                    squareState[rookRight]?.type === Pieces.Rook &&
                    initialState[rookRight]?.type === Pieces.Rook &&
                    initialState[rookRight]?.lastMoves.length === 0 &&
                    !pieceOnMove &&
                    !squareState[rawMoves[2]] &&
                    !kingOnCheck &&
                    !movesLeadsToCheck?.[rawMoves[2]]

                const castlePassingValidationToLeft =
                    !kingMoved &&
                    squareState[rookLeft]?.type === Pieces.Rook &&
                    initialState[rookLeft]?.type === Pieces.Rook &&
                    initialState[rookLeft]?.lastMoves.length === 0 &&
                    !pieceOnMove &&
                    !squareState[rawMoves[6]] &&
                    !squareState[rawMoves[11]] &&
                    !kingOnCheck &&
                    !movesLeadsToCheck?.[rawMoves[6]]

                if (castlingToRight && castlePassingValidationToRight) {
                    moves.push(rawMoves[8])
                    moves.push(Moves.CastleRight)
                    return
                }

                if (castlingToLeft && castlePassingValidationToLeft) {
                    moves.push(rawMoves[9])
                    moves.push(Moves.CastleLeft)
                    return
                }
            }

            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)

            //checking that enemy piece attacking field that used to castle king
            //or your piece blocking castling
            //or (king or rook) moved or not on the right spot
            //if true => delete castle move

            const sameColorPieceBlockingCastleToLeft =
                squareState[rawMoves[6]] ||
                squareState[rawMoves[9]] ||
                squareState[rawMoves[11]]

            const rookLeftMoved =
                squareState[rookLeft]?.type === Pieces.Rook &&
                initialState[rookLeft]?.lastMoves.length !== 0

            const rookRightMoved =
                squareState[rookRight]?.type === Pieces.Rook &&
                initialState[rookRight]?.lastMoves.length !== 0

            const somethingBlockingCastleToLeft =
                movesLeadsToCheck?.[rawMoves[6]] ||
                kingOnCheck ||
                kingMoved ||
                !squareState[rookLeft] ||
                rookLeftMoved ||
                sameColorPieceBlockingCastleToLeft

            const somethingBlockingCastleToRight =
                movesLeadsToCheck?.[rawMoves[2]] ||
                kingOnCheck ||
                kingMoved ||
                !squareState[rookRight] ||
                rookRightMoved ||
                squareState[rawMoves[2]] ||
                squareState[rawMoves[8]]

            if (somethingBlockingCastleToLeft) {
                moves = arrayRemove(moves, rawMoves[9])
            }
            if (somethingBlockingCastleToRight) {
                moves = arrayRemove(moves, rawMoves[8])
            }
        })

        return moves
    }
}

export default King
