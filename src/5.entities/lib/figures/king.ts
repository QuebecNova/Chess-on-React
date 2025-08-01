import { KeyableSquares, Premove } from 'src/5.entities/model'
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
import { Rook } from './rook'

export class King extends Piece {
    readonly lastMoves: Move[]
    readonly canCastleTo: CastlingSide[]
    onCheck: boolean

    constructor(color: Colors) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackKing
                : piecesImages.WhiteKing,
            Pieces.King
        )
        this.lastMoves = []
        this.onCheck = false
        this.canCastleTo = []
    }

    getRawMoves(
        from: string,
        color?: Colors,
        squares?: KeyableSquares,
        premoves?: Premove[]
    ): string[] {
        const moves = [
            //circular moves starting from kingpos[1] + 1
            alphs.changeNumPos(from, Operators.Forward, 1),
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
            alphs.changeNumPos(from, Operators.Backward, 1),
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
        ]

        const kingPremoved = premoves
            ? premoves.some(
                  (move) =>
                      move.piece.color === this.color &&
                      move.piece.type === this.type
              )
            : false

        if (!squares || this.lastMoves.length || kingPremoved) return moves

        const [_, kingSideRook] = Rook.find(
            squares,
            CastlingSide.KingSide,
            this.color
        )
        const [__, queenSideRook] = Rook.find(
            squares,
            CastlingSide.QueenSide,
            this.color
        )

        const premovedKingSideRook = premoves
            ? premoves.some((move) =>
                  Rook.checkForRook(
                      move.piece,
                      CastlingSide.KingSide,
                      this.color
                  )
              )
            : false
        const premovedQueenSideRook = premoves
            ? premoves.some((move) =>
                  Rook.checkForRook(
                      move.piece,
                      CastlingSide.QueenSide,
                      this.color
                  )
              )
            : false

        if (kingSideRook?.lastMoves?.length === 0 && !premovedKingSideRook) {
            moves.push(alphs.changeAlphPos(from, Operators.Forward, 2))
            this.canCastleTo.push(CastlingSide.KingSide)
        } else {
            this.#removeCastlingSide(CastlingSide.KingSide)
        }
        if (queenSideRook?.lastMoves?.length === 0 && !premovedQueenSideRook) {
            moves.push(alphs.changeAlphPos(from, Operators.Backward, 2))
            this.canCastleTo.push(CastlingSide.QueenSide)
        } else {
            this.#removeCastlingSide(CastlingSide.QueenSide)
        }
        return moves
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares
    ): string[] {
        const isKingOnCheck = movesLeadsToCheck?.[from]
        this.onCheck = !!isKingOnCheck

        let moves: string[] = []

        //rooks here
        const [_, rookRight] = Rook.find(
            squareState,
            CastlingSide.KingSide,
            this.color
        )
        const [__, rookLeft] = Rook.find(
            squareState,
            CastlingSide.QueenSide,
            this.color
        )

        const rawMoves = this.getRawMoves(from)
            .slice(0, 8)
            .concat([
                alphs.changeAlphPos(from, Operators.Forward, 2),
                alphs.changeAlphPos(from, Operators.Backward, 2),
                from,
                alphs.changeAlphPos(from, Operators.Backward, 3),
            ])

        rawMoves.forEach((move, index) => {
            const moveLeadsToCheck = movesLeadsToCheck?.[move]
            if (moveLeadsToCheck) return

            const pieceOnMove = squareState[move]
            const samePieceOnMove = pieceOnMove?.color === this.color

            if (samePieceOnMove && pieceOnMove.type !== Pieces.King) return

            //castle logic
            const kingMoved = this.lastMoves.length > 0
            const castilngMove = index > 7

            if (castilngMove) {
                const castlingToRight = index === 8
                const castlingToLeft = index === 9

                //GOD HELP ME
                //THAT'S SMELLS LIKE A BOOLEAN ALGEBRA

                const pieceBlockingCastleToLeft =
                    squareState[rawMoves[6]] ||
                    squareState[rawMoves[9]] ||
                    squareState[rawMoves[11]]

                const pieceBlockingCastleToRight =
                    squareState[rawMoves[2]] || squareState[rawMoves[8]]

                const rookLeftMoved = rookLeft?.lastMoves?.length !== 0

                const rookRightMoved = rookRight?.lastMoves?.length !== 0

                const castlePassingValidationToRight =
                    !kingMoved &&
                    !rookRightMoved &&
                    !pieceOnMove &&
                    !squareState[rawMoves[2]] &&
                    !isKingOnCheck &&
                    !movesLeadsToCheck?.[rawMoves[2]] &&
                    !pieceBlockingCastleToRight

                const castlePassingValidationToLeft =
                    !kingMoved &&
                    !rookLeftMoved &&
                    !pieceOnMove &&
                    !squareState[rawMoves[6]] &&
                    !squareState[rawMoves[11]] &&
                    !isKingOnCheck &&
                    !movesLeadsToCheck?.[rawMoves[6]] &&
                    !pieceBlockingCastleToLeft

                if (castlingToRight && castlePassingValidationToRight) {
                    moves.push(rawMoves[8])
                    this.canCastleTo.push(CastlingSide.KingSide)
                    return
                } else {
                    this.#removeCastlingSide(CastlingSide.KingSide)
                }

                if (castlingToLeft && castlePassingValidationToLeft) {
                    moves.push(rawMoves[9])
                    this.canCastleTo.push(CastlingSide.QueenSide)
                    return
                } else {
                    this.#removeCastlingSide(CastlingSide.QueenSide)
                }
            }

            if (this.isMoveValid(move) && index < 8) moves.push(move)
        })

        return moves
    }

    #removeCastlingSide(castlingSide: CastlingSide) {
        this.canCastleTo.filter((side) => side == castlingSide)
    }

    addMove(move: Move) {
        this.lastMoves.push(move)
        return this.lastMoves
    }
}
