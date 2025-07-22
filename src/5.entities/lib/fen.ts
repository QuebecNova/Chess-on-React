import { CastlingSide, Colors, Operators, Pieces } from 'src/6.shared/model'
import { KeyableSquares, PlayedMove } from '../model'
import { alphs } from './alphabetPositions'

//https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

type IFen = {
    readonly fen: string
    readonly turn: Colors
    readonly playedMoves: PlayedMove[]
    readonly squares: KeyableSquares
}

export class Fen implements IFen {
    readonly fen: string
    readonly turn: Colors
    readonly playedMoves: PlayedMove[]
    readonly squares: KeyableSquares

    constructor(
        squares: KeyableSquares,
        playedMoves: PlayedMove[] = [],
        turn: Colors = Colors.White
    ) {
        this.playedMoves = playedMoves
        this.squares = squares
        this.turn = turn
        this.fen = this.#convertToFen()
    }

    #convertToFen(): string {
        let fen = this.#getPositions()
        fen += ' '
        fen += this.#getTurn()
        fen += this.#getCastlingRights()
        fen += this.#getEnpassantTargetSquare()
        fen += this.#getHalfmoves()
        fen += this.#getFullmoves()

        return fen
    }

    #getPositions() {
        let emptySquares = 0
        const squaresArr = Object.entries(this.squares)
        return squaresArr.reduce((acc, [_, piece], index) => {
            if (piece) {
                if (emptySquares) {
                    acc += emptySquares.toString()
                    emptySquares = 0
                }

                acc +=
                    piece.color === Colors.White
                        ? piece.type
                        : piece.type.toLowerCase()
            } else {
                emptySquares += 1
            }

            if (
                index &&
                (index + 1) % 8 === 0 &&
                index !== squaresArr.length - 1
            ) {
                if (emptySquares) {
                    acc += emptySquares.toString()
                    emptySquares = 0
                }
                acc += '/'
            }

            return acc
        }, '')
    }

    #getTurn() {
        return this.turn === Colors.White ? 'w' : 'b'
    }

    #getCastlingRights() {
        let castlingRights = {
            [Colors.White]: {
                [CastlingSide.QueenSide]: 'Q',
                [CastlingSide.KingSide]: 'K',
            },
            [Colors.Black]: {
                [CastlingSide.QueenSide]: 'q',
                [CastlingSide.KingSide]: 'k',
            },
        }

        const kingMoves = Fen.filterPlayedMovesByType(
            this.playedMoves,
            Pieces.King
        )
        kingMoves.forEach((move) => {
            castlingRights[move.piece.color] = {
                queenSide: '',
                kingSide: '',
            }
        })

        const rookMoves = Fen.filterPlayedMovesByType(
            this.playedMoves,
            Pieces.Rook
        )
        rookMoves.forEach((move) => {
            if (move.piece.side) {
                castlingRights[move.piece.color][move.piece.side] = ''
            }
        })
        let castlingRightsFen = Object.values(castlingRights).reduce(
            (acc, curr) => {
                Object.values(curr).forEach((right) => (acc += right))
                return acc
            },
            ''
        )
        if (castlingRightsFen.length) {
            return ' ' + castlingRightsFen
        } else {
            return ' -'
        }
    }

    #getEnpassantTargetSquare() {
        const lastMove = this.playedMoves.at(-1)
        if (!lastMove || lastMove.piece.type !== Pieces.Pawn) return ' -'

        const fromRow = alphs.getNum(lastMove.from)
        const toRow = alphs.getNum(lastMove.to)

        const pawnMovedTwoSquares = Math.abs(fromRow - toRow) === 2

        if (pawnMovedTwoSquares) {
            const enpassantTargetSquare = alphs.changeNumPos(
                lastMove.from,
                lastMove.piece.color === Colors.White
                    ? Operators.Forward
                    : Operators.Backward,
                1
            )
            return ' ' + enpassantTargetSquare
        } else {
            return ' -'
        }
    }

    #getHalfmoves() {
        const halfMoveIndex = this.playedMoves.findLastIndex(
            (move) => move.isCapture || move.piece.type === Pieces.Pawn
        )
        if (halfMoveIndex !== -1) {
            return ' ' + (this.playedMoves.length - halfMoveIndex - 1)
        } else {
            return ' ' + 0
        }
    }

    #getFullmoves() {
        return ' ' + this.playedMoves.length
    }

    static filterPlayedMovesByType(playedMoves: PlayedMove[], type: Pieces) {
        return playedMoves.filter((value) => value.piece.type === type)
    }
}
