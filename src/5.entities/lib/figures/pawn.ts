import { KeyableSquares, PlayedMove } from 'src/5.entities/model'
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

            blackMoves.forEach((move, index) => {
                const num = alphs.getNum(move)
                const pieceOnMove = squareState[move]
                const opponentPieceOnMove = pieceOnMove?.color !== this.color
                const moveLeadsToCheck = movesLeadsToCheck?.[move]
                const movePassingValidation =
                    move[0] && move[1] && num <= 8 && num > 0 && index < 4

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
                        moves.push(Moves.EnpassantLeft)
                    } else {
                        moves.push(blackMoves[3])
                        moves.push(Moves.EnpassantRight)
                    }
                }

                if (moveLeadsToCheck) return
                if (movePassingValidation) moves.push(move)
            })
        } else {
            //same but for white pawns
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

            whiteMoves.forEach((move, index) => {
                const num = alphs.getNum(move)
                const pieceOnMove = squareState[move]
                const opponentPieceOnMove = pieceOnMove?.color !== this.color
                const moveLeadsToCheck = movesLeadsToCheck?.[move]
                const movePassingValidation =
                    move &&
                    move[1] &&
                    !move[2] &&
                    num < 9 &&
                    num > 0 &&
                    index < 4

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
                        moves.push(Moves.EnpassantLeft)
                    } else {
                        moves.push(whiteMoves[3])
                        moves.push(Moves.EnpassantRight)
                    }
                }

                if (moveLeadsToCheck) return
                if (movePassingValidation) moves.push(move)
            })
        }

        return moves
    }

    addMove(move: Move) {
        this.lastMoves.push(move)
        return this.lastMoves
    }
}
