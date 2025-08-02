import {
    IPiece,
    KeyableSquares,
    PlayedMove,
    Premove,
} from 'src/5.entities/model'
import {
    Colors,
    Move,
    Moves,
    Operators,
    Pieces,
    piecesImages,
} from 'src/6.shared/model'
import { alphs } from '../alphabetPositions'
import { Piece } from './piece'

export class Pawn extends Piece {
    canEnpassantOn: Moves | null
    readonly lastMoves: Move[]

    constructor(color: Colors) {
        super(
            color,
            color === Colors.Black
                ? piecesImages.BlackPawn
                : piecesImages.WhitePawn,
            Pieces.Pawn
        )
        this.lastMoves = []
        this.canEnpassantOn = null
    }

    getRawMoves(from: string, color: Colors): string[] {
        const blackMoves = [
            //basic moves
            alphs.changeNumPos(from, Operators.Backward, 1),
            alphs.changeNumPos(from, Operators.Backward, 2),
            //eat figures moves
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Backward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Backward,
                1
            ),
            //enpassant helper moves
            alphs.changeAlphPos(from, Operators.Backward, 1),
            alphs.changeAlphPos(from, Operators.Forward, 1),
        ]

        const whiteMoves = [
            alphs.changeNumPos(from, Operators.Forward, 1),
            alphs.changeNumPos(from, Operators.Forward, 2),
            alphs.changeAlphPos(
                from,
                Operators.Backward,
                1,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(
                from,
                Operators.Forward,
                1,
                Operators.Forward,
                1
            ),
            alphs.changeAlphPos(from, Operators.Backward, 1),
            alphs.changeAlphPos(from, Operators.Forward, 1),
        ]
        return color === Colors.White ? whiteMoves : blackMoves
    }

    canMove(
        from: string,
        squareState: KeyableSquares,
        movesLeadsToCheck: KeyableSquares,
        initialState: KeyableSquares = {},
        playedMoves: PlayedMove[] = []
    ): string[] {
        const moves: string[] = []
        let pieceInfront = false

        if (this.color === Colors.Black) {
            const blackMoves = this.getRawMoves(from, Colors.Black)
            blackMoves.forEach((move, index) => {
                const num = alphs.getNum(move)
                const pieceOnMove = squareState[move]
                const opponentPieceOnMove = pieceOnMove?.color !== this.color
                const moveLeadsToCheck = movesLeadsToCheck?.[move]

                const moveIsAnyOfForwardMove = index < 2
                const moveIsTwoFieldsForward = index === 1
                const moveIsEatMove = index > 3
                const pieceOnLeftSide = index === 4

                const pawnNotMoved = !initialState?.[from]

                const isOppositePawnMovedTwoSquaresForward = () =>
                    parseInt(pieceOnMove.lastMoves.slice().pop()?.from?.[1]) ===
                    num - 2

                const isOppositePawnMovedForFirstTime = () =>
                    initialState?.[pieceOnMove.lastMoves.slice().pop()?.from]

                const isOppositePawnMadeMoveIsLast = () =>
                    playedMoves.slice().pop()?.from ===
                    pieceOnMove.lastMoves.slice().pop()?.from

                const isEnpassantAvailable =
                    moveIsEatMove &&
                    pieceOnMove?.type === Pieces.Pawn &&
                    isOppositePawnMovedTwoSquaresForward() &&
                    isOppositePawnMovedForFirstTime() &&
                    isOppositePawnMadeMoveIsLast() &&
                    opponentPieceOnMove

                if (
                    (moveIsAnyOfForwardMove && pieceOnMove) ||
                    (moveIsAnyOfForwardMove && pieceInfront)
                ) {
                    pieceInfront = true
                    return
                }

                if (moveIsTwoFieldsForward && pawnNotMoved) return

                if (index > 1) {
                    if (!pieceOnMove) {
                        return
                    } else if (pieceOnMove.color === Colors.Black) {
                        return
                    }
                }

                if (isEnpassantAvailable) {
                    if (pieceOnLeftSide) {
                        moves.push(blackMoves[2])
                        this.canEnpassantOn = Moves.EnpassantLeft
                    } else {
                        moves.push(blackMoves[3])
                        this.canEnpassantOn = Moves.EnpassantRight
                    }
                } else {
                    this.canEnpassantOn = null
                }

                if (moveLeadsToCheck) return
                if (this.isMoveValid(move, index)) moves.push(move)
            })
        } else {
            //same but for white pawns
            const whiteMoves = this.getRawMoves(from, Colors.White)
            whiteMoves.forEach((move, index) => {
                const num = alphs.getNum(move)
                const pieceOnMove = squareState[move]
                const opponentPieceOnMove = pieceOnMove?.color !== this.color
                const moveLeadsToCheck = movesLeadsToCheck?.[move]

                const moveIsAnyOfForwardMove = index < 2
                const moveIsTwoFieldsForward = index === 1
                const moveIsEatMove = index > 3
                const pieceOnLeftSide = index === 4

                const pawnNotMoved = !initialState?.[from]

                const isOppositePawnMovedTwoSquaresForward = () =>
                    parseInt(pieceOnMove.lastMoves.slice().pop()?.from?.[1]) ===
                    num + 2

                const isOppositePawnMovedForFirstTime = () =>
                    initialState?.[pieceOnMove.lastMoves.slice().pop()?.from]

                const isOppositePawnMadeMoveIsLast = () =>
                    playedMoves.slice().pop()?.from ===
                    pieceOnMove.lastMoves.slice().pop()?.from

                const isEnpassantAvailable =
                    moveIsEatMove &&
                    pieceOnMove?.type === Pieces.Pawn &&
                    isOppositePawnMovedTwoSquaresForward() &&
                    isOppositePawnMovedForFirstTime() &&
                    isOppositePawnMadeMoveIsLast() &&
                    opponentPieceOnMove

                if (
                    (moveIsAnyOfForwardMove && pieceOnMove) ||
                    (moveIsAnyOfForwardMove && pieceInfront)
                ) {
                    pieceInfront = true
                    return
                }

                if (moveIsTwoFieldsForward && pawnNotMoved) return

                if (index > 1) {
                    if (!pieceOnMove) {
                        return
                    } else if (pieceOnMove.color === Colors.White) {
                        return
                    }
                }

                if (isEnpassantAvailable) {
                    if (pieceOnLeftSide) {
                        moves.push(whiteMoves[2])
                        this.canEnpassantOn = Moves.EnpassantLeft
                    } else {
                        moves.push(whiteMoves[3])
                        this.canEnpassantOn = Moves.EnpassantRight
                    }
                } else {
                    this.canEnpassantOn = null
                }

                if (moveLeadsToCheck) return
                if (this.isMoveValid(move, index)) moves.push(move)
            })
        }

        return moves
    }

    isMoveValid(
        move: string,
        index: number,
        premoves?: Premove[],
        field?: string
    ) {
        const num = alphs.getNum(move)
        const isPawnPremoved = premoves?.some(
            (move) =>
                move.piece.type === Pieces.Pawn &&
                move.piece.color === this.color &&
                move.to === field
        )

        return (
            move &&
            !move[2] &&
            num > 0 &&
            num < 9 &&
            index < 4 &&
            (this.lastMoves.length || isPawnPremoved ? index !== 1 : true)
        )
    }

    addMove(move: Move) {
        this.lastMoves.push(move)
        return this.lastMoves
    }

    static find(squares: KeyableSquares, color: Colors): [string, IPiece] | [] {
        return (
            Object.entries(squares).find(([_, piece]) =>
                Pawn.checkForPawn(piece, color)
            ) || []
        )
    }

    static checkForPawn(piece: IPiece, color: Colors) {
        return piece?.type === Pieces.Pawn && piece?.color === color
    }
}
