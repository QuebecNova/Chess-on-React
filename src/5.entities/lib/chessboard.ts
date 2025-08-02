import { setupBoard } from 'src/4.features/config/setupBoard'
import { getSquares } from 'src/4.features/lib/helpers'
import {
    CastlingSide,
    Colors,
    EndCondition,
    Move,
    Moves,
    Operators,
    Pieces,
} from 'src/6.shared/model'
import { IPiece, KeyableSquares, PlayedMove, Premove } from '../model'
import { alphs } from './alphabetPositions'
import { Fen } from './fen'
import { Piece } from './figures/piece'
import { Rook } from './figures/rook'

type EndState = {
    condition: EndCondition | null
    color: Colors | null
}

type BoardConstructorArguments = {
    squares: KeyableSquares
    playedMoves?: PlayedMove[]
    endState?: EndState
    variant?: Colors
    turn?: Colors
}

export class Chessboard {
    squares: KeyableSquares
    playedMoves: PlayedMove[]
    fen: string
    endState: {
        condition: EndCondition | null
        color: Colors | null
    }
    variant: Colors = Colors.White
    turn: Colors = Colors.White
    initialPositions: KeyableSquares
    readonly nullSquares = getSquares(null)

    initArguments: BoardConstructorArguments

    constructor(args: BoardConstructorArguments) {
        this.initArguments = args
        this.setupBoard()
    }

    setupBoard(variant: Colors = this.initArguments.variant) {
        const {
            squares,
            playedMoves = [],
            endState = { condition: null, color: null },
            turn = Colors.White,
        } = this.initArguments

        this.squares = squares
        this.initialPositions = squares
        this.playedMoves = playedMoves
        this.turn = turn
        this.fen = new Fen(squares, this.playedMoves, this.turn).fen
        this.endState = endState
        this.variant = variant ? variant : Colors.White
    }

    getPremoves(field: string, premoves: Premove[], piece: IPiece): string[] {
        let moves: string[] = []
        if (this.turn !== this.variant) {
            moves = Piece.filterInvalidMoves(
                piece.getRawMoves(field, this.variant, this.squares, premoves),
                piece,
                premoves,
                field
            )
        }

        return moves
    }

    //TODO: caching
    getMoves(field: string): string[] {
        const piece = this.squares[field]
        if (!piece) return []
        const moves = piece.canMove(
            field,
            this.squares,
            this.getMovesThatLeadsToCheck(piece, field),
            setupBoard(),
            this.playedMoves
        )

        return moves
    }

    move(
        from: string,
        to: string,
        promotionTo: IPiece = null
    ): { playedMove?: PlayedMove; invalid: boolean } {
        if (
            (
                [
                    EndCondition.Checkmate,
                    EndCondition.Draw,
                    EndCondition.Resign,
                    EndCondition.Stalemate,
                    EndCondition.TimeExpired,
                ] as EndCondition[]
            ).includes(this.endState.condition) ||
            !this.squares[from]
        ) {
            return {
                invalid: true,
            }
        }

        const moves = this.getMoves(from)

        const piece = this.squares[from]

        if (!moves.includes(to)) {
            return {
                invalid: true,
            }
        }
        if (Chessboard.isPromotion(piece, to) && !promotionTo) {
            return {
                invalid: true,
            }
        }
        let takenPiece = this.squares[to]

        const move: Move = {
            from,
            to,
        }

        let modifiedSquares: KeyableSquares = {
            [from]: null,
            [to]: promotionTo ? promotionTo : piece,
        }

        //enpassant and castle dataset
        let enpassanted = false
        if (piece.canEnpassantOn) {
            const [isEnpassanted, enpassantedFields, enpassantedPiece] =
                Chessboard.getFieldsForEnpassant(this.squares, from, to)
            if (isEnpassanted) {
                modifiedSquares = { ...modifiedSquares, ...enpassantedFields }
                enpassanted = true
                takenPiece = enpassantedPiece
            }
        }
        let castledSide: CastlingSide | null = null
        if (piece.canCastleTo?.length) {
            const { modifiedPieceOnField, castlingSide } =
                Chessboard.getFieldsForCastle(this.squares, from, to)
            modifiedSquares = {
                ...modifiedSquares,
                ...modifiedPieceOnField,
            }
            castledSide = castlingSide
        }

        this.squares = { ...this.squares, ...modifiedSquares }

        this.turn = this.turn === Colors.White ? Colors.Black : Colors.White

        const endCondition = this.getEndCondition()

        this.endState = {
            condition: endCondition,
            color: this.turn,
        }

        const playedMove: PlayedMove = {
            ...move,
            piece,
            takenPiece: takenPiece ? takenPiece : null,
            endState: this.endState,
            castlingSide: castledSide,
            promotionTo,
            isEnpassant: enpassanted,
            squares: this.squares,
        }

        piece.addMove && piece.addMove(move)
        this.playedMoves.push(playedMove)

        return { playedMove, invalid: false }
    }

    static getFieldsForCastle(
        squares: KeyableSquares,
        from: string,
        to: string,
        premove?: boolean
    ) {
        const piece = squares[from]
        if (!piece?.canCastleTo?.length) return

        const modifiedPieceOnField: KeyableSquares = {
            [from]: null,
        }

        const kingMovedLeft =
            alphs.changeAlphPos(from, Operators.Backward, 2) === to
        const kingMovedRight =
            alphs.changeAlphPos(from, Operators.Forward, 2) === to
        let castledRookLeft: string
        let castledRookRight: string
        const rookLeft: string = alphs.changeAlphPos(
            from,
            Operators.Backward,
            4
        )
        const rookRight: string = alphs.changeAlphPos(
            from,
            Operators.Forward,
            3
        )

        if (piece.canCastleTo.includes(CastlingSide.QueenSide) && kingMovedLeft)
            castledRookLeft = alphs.changeAlphPos(
                rookLeft,
                Operators.Forward,
                3
            )

        if (piece.canCastleTo.includes(CastlingSide.KingSide) && kingMovedRight)
            castledRookRight = alphs.changeAlphPos(
                rookRight,
                Operators.Backward,
                2
            )

        let castlingSide: CastlingSide

        if (castledRookLeft) {
            modifiedPieceOnField[rookLeft] = null
            if (!premove) {
                squares[rookLeft].addMove({
                    from: rookLeft,
                    to: castledRookLeft,
                })
            }
            modifiedPieceOnField[castledRookLeft] = squares[rookLeft]
            castlingSide = CastlingSide.QueenSide
        }

        if (castledRookRight) {
            modifiedPieceOnField[rookRight] = null
            if (!premove) {
                squares[rookRight].addMove({
                    from: rookRight,
                    to: castledRookRight,
                })
            }
            modifiedPieceOnField[castledRookRight] = squares[rookRight]
            castlingSide = CastlingSide.KingSide
        }

        return { modifiedPieceOnField, castlingSide }
    }

    static getFieldsForEnpassant(
        squares: KeyableSquares,
        from: string,
        to: string
    ): [boolean, KeyableSquares, IPiece | null] {
        const piece: IPiece = squares[from]
        if (!piece.canEnpassantOn) return

        const modifiedPieceOnField: KeyableSquares = {
            [from]: null,
        }

        let enpassantedField: string
        let isEnpassanted = false
        let takenPiece = null
        if (
            piece.color === Colors.White &&
            piece.canEnpassantOn === Moves.EnpassantLeft
        )
            enpassantedField = alphs.changeAlphPos(from, Operators.Backward, 1)
        if (
            piece.color === Colors.White &&
            piece.canEnpassantOn === Moves.EnpassantRight
        )
            enpassantedField = alphs.changeAlphPos(from, Operators.Forward, 1)
        if (
            piece.color === Colors.Black &&
            piece.canEnpassantOn === Moves.EnpassantLeft
        )
            enpassantedField = alphs.changeAlphPos(from, Operators.Backward, 1)
        if (
            piece.color === Colors.Black &&
            piece.canEnpassantOn === Moves.EnpassantRight
        )
            enpassantedField = alphs.changeAlphPos(from, Operators.Forward, 1)
        if (
            to ===
                alphs.changeAlphPos(
                    from,
                    Operators.Forward,
                    1,
                    Operators.Forward,
                    1
                ) ||
            to ===
                alphs.changeAlphPos(
                    from,
                    Operators.Forward,
                    1,
                    Operators.Backward,
                    1
                ) ||
            to ===
                alphs.changeAlphPos(
                    from,
                    Operators.Backward,
                    1,
                    Operators.Backward,
                    1
                ) ||
            (to ===
                alphs.changeAlphPos(
                    from,
                    Operators.Backward,
                    1,
                    Operators.Forward,
                    1
                ) &&
                enpassantedField)
        ) {
            modifiedPieceOnField[enpassantedField] = null
            takenPiece = squares[enpassantedField]
            isEnpassanted = true
        }

        return [isEnpassanted, modifiedPieceOnField, takenPiece]
    }

    static isPromotion(piece: IPiece, to: string) {
        const blackPawnOnPromotionField =
            to[1] === '1' &&
            piece.type === Pieces.Pawn &&
            piece.color === Colors.Black
        const whitePawnOnPromotionField =
            to[1] === '8' &&
            piece.type === Pieces.Pawn &&
            piece.color === Colors.White
        return blackPawnOnPromotionField || whitePawnOnPromotionField
    }

    getMovesThatLeadsToCheck(piece: IPiece, field: string): KeyableSquares {
        const kingOnCheckAfterThisMoves: KeyableSquares = {
            ...this.nullSquares,
        }
        //simulating next move for check
        const moves = piece.canMove(
            field,
            this.squares,
            null,
            this.initialPositions
        )
        moves.forEach((move: string) => {
            const pieceOnField: KeyableSquares = {
                [field]: null,
                [move]: piece,
            }
            const simulateNextMoveSquares = {
                ...this.squares,
                ...pieceOnField,
            }

            const simulateNextOppositeMoves: KeyableSquares = {
                ...this.nullSquares,
            }
            for (const field in simulateNextMoveSquares) {
                if (
                    simulateNextOppositeMoves &&
                    simulateNextMoveSquares[field] &&
                    simulateNextMoveSquares[field].color !== this.turn
                ) {
                    const moves = simulateNextMoveSquares[field].canMove(
                        field,
                        simulateNextMoveSquares,
                        null,
                        this.initialPositions
                    )
                    moves.forEach((move) => {
                        if (move)
                            simulateNextOppositeMoves[move] =
                                simulateNextMoveSquares[field]
                    })
                }
            }
            for (const field in simulateNextMoveSquares) {
                if (
                    simulateNextOppositeMoves[field] &&
                    simulateNextMoveSquares[field]?.type === Pieces.King &&
                    simulateNextMoveSquares[field]?.color === this.turn
                ) {
                    kingOnCheckAfterThisMoves[move] =
                        simulateNextMoveSquares[field]
                }
            }
        })
        return kingOnCheckAfterThisMoves
    }

    getEndCondition(): EndCondition | null {
        //simulating next move for check
        const allLegalMoves = []
        let checked = false
        for (const field in this.squares) {
            if (this.squares[field]?.color === this.turn) {
                allLegalMoves.push(
                    this.squares[field].canMove(
                        field,
                        this.squares,
                        this.getMovesThatLeadsToCheck(
                            this.squares[field],
                            field
                        ),
                        setupBoard()
                    )
                )
                if (this.squares[field].onCheck) checked = true
            }
        }
        if (
            allLegalMoves.length === 1 &&
            allLegalMoves[0].length === 1 &&
            this.squares[allLegalMoves[0][0]]?.type === Pieces.King
        ) {
            return EndCondition.Stalemate
        }

        if (allLegalMoves.every((legalMoves) => legalMoves.length === 0))
            return EndCondition.Checkmate
        if (checked) return EndCondition.Check
        return null
    }

    takeback(color: Colors, isOfflineMode: boolean) {
        const newSquares = { ...this.squares }
        const lastPlayedMove = this.playedMoves.at(-1)
        if (!lastPlayedMove) return

        function resetCastling(move: PlayedMove) {
            const [rookField, rook] = Rook.find(
                newSquares,
                move.castlingSide,
                move.piece.color
            )
            if (!rook.lastMoves.at(-1)) return
            newSquares[rookField] = null
            newSquares[rook.lastMoves.at(-1).from] = rook
            rook.lastMoves.pop()
        }

        function resetEnpassant(move: PlayedMove) {
            const lastEnpassantedPawnPlayedMove =
                move.takenPiece.lastMoves.at(-1)
            if (lastEnpassantedPawnPlayedMove) {
                newSquares[lastEnpassantedPawnPlayedMove.to] = move.takenPiece
            }
        }

        function resetMove(move: PlayedMove) {
            if (!!move.takenPiece && !move.isEnpassant) {
                newSquares[move.to] = move.takenPiece
            } else {
                newSquares[move.to] = null
            }
            newSquares[move.from] = move.piece
            move.piece.lastMoves?.pop()
        }

        if (lastPlayedMove.piece.color !== color && !isOfflineMode) {
            const secondLastPlayedMove = this.playedMoves.at(-2)
            if (lastPlayedMove.castlingSide) {
                resetCastling(lastPlayedMove)
            }
            if (lastPlayedMove.isEnpassant) {
                resetEnpassant(lastPlayedMove)
            }
            resetMove(lastPlayedMove)
            if (secondLastPlayedMove) {
                if (secondLastPlayedMove.castlingSide) {
                    resetCastling(secondLastPlayedMove)
                }
                if (secondLastPlayedMove.isEnpassant) {
                    resetEnpassant(secondLastPlayedMove)
                }
                resetMove(secondLastPlayedMove)
            } else {
                this.turn =
                    this.turn === Colors.White ? Colors.Black : Colors.White
            }
            this.playedMoves = this.playedMoves.slice(0, -2)
        } else {
            if (lastPlayedMove.castlingSide) {
                resetCastling(lastPlayedMove)
            }
            if (lastPlayedMove.isEnpassant) {
                resetEnpassant(lastPlayedMove)
            }
            resetMove(lastPlayedMove)
            lastPlayedMove.piece.lastMoves.pop()
            this.playedMoves = this.playedMoves.slice(0, -1)
            this.turn = this.turn === Colors.White ? Colors.Black : Colors.White
        }
        this.squares = newSquares
        console.log(this.playedMoves)

        return {
            turn: this.turn,
            squares: this.squares,
            playedMoves: this.playedMoves,
        }
    }
}
