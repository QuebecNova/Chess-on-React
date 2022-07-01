import Piece from "./piece";
import piecesImages from "../services/misc/piecesImages";
import alphs from "../services/math/alphabetPositions";
import { rawMakedMoves } from "../components/Board";
import { keyableSquares } from "../interfaces/keyable";

class Pawn extends Piece {

  lastMoves : Array<string>

  constructor(color : string) {
    super(
      color,
      color === 'Black' ? piecesImages.BlackPawn : piecesImages.WhitePawn,
      'Pawn'
    )
    this.lastMoves = []
  }

  canMove(
    from : string, 
    squareState : keyableSquares, 
    movesLeadsToCheck : keyableSquares, 
    initialState? : keyableSquares
    ) {

    const moves : Array<string> = []
    let pieceInfront = false

    if (this.color === 'Black') {
        const blackMoves = [
            //basic moves
            from[0] + (parseInt(from[1]) - 1),
            from[0] + (parseInt(from[1]) - 2),
            //eat figures moves
            alphs.changeAlphPos(from, '-', 1, '-', 1),
            alphs.changeAlphPos(from, '+', 1, '-', 1),
            //enpassant helper moves
            alphs.changeAlphPos(from, '-', 1),
            alphs.changeAlphPos(from, '+', 1),
        ]

        blackMoves.forEach((move, index) => {

            const pieceOnMove = squareState[move]
            const opponentPieceOnMove = pieceOnMove && pieceOnMove.color !== this.color
            const moveLeadsToCheck = movesLeadsToCheck && movesLeadsToCheck[move]
            const movePassingValidation = (move[0] && move[1] && parseInt(move[1]) <= 8 && parseInt(move[1]) > 0 && index < 4)

            const moveIsAnyOfForwardMove = index < 2
            const moveIsTwoFieldsForward = index === 1
            const moveIsEatMove = index > 3
            const pieceOnLeftSide = index === 4

            const pawnNotMoved = initialState && !initialState[from]

            const isEnpassantAvailable = 
                (moveIsEatMove
                && initialState
                && pieceOnMove
                && pieceOnMove.type === 'Pawn'
                && initialState[pieceOnMove.lastMoves.slice().pop()] 
                && parseInt(pieceOnMove.lastMoves.slice().pop()[1]) === (parseInt(move[1]) - 2)
                && rawMakedMoves.slice().pop() === (`P${pieceOnMove.lastMoves.slice().pop()}`) 
                && opponentPieceOnMove)
            
            if ((moveIsAnyOfForwardMove && pieceOnMove) || (moveIsAnyOfForwardMove && pieceInfront)) {
                pieceInfront = true
                return
            }

            if (moveIsTwoFieldsForward && pawnNotMoved) return
            
            if (index > 1) {
                if (!pieceOnMove) {
                    return
                } else if (pieceOnMove.color === 'Black') {
                    return
                }
            }
            
            if (isEnpassantAvailable)
            {
                if (pieceOnLeftSide) {
                    moves.push(blackMoves[2])
                    moves.push('enpassantLeft')
                } else {
                    moves.push(blackMoves[3])
                    moves.push('enpassantRight')
                }
            }

            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)
        })
    } else {
        //same but for white pawns
        const whiteMoves = [
            from[0] + (parseInt(from[1]) + 1),
            from[0] + (parseInt(from[1]) + 2),
            alphs.changeAlphPos(from, '-', 1, '+', 1),
            alphs.changeAlphPos(from, '+', 1, '+', 1),
            alphs.changeAlphPos(from, '-', 1),
            alphs.changeAlphPos(from, '+', 1),
        ]

        whiteMoves.forEach((move, index) => {

            const pieceOnMove = squareState[move]
            const opponentPieceOnMove = pieceOnMove && pieceOnMove.color !== this.color
            const moveLeadsToCheck = movesLeadsToCheck && movesLeadsToCheck[move]
            const movePassingValidation = (move && move[1] && !move[2] && parseInt(move[1]) < 9 && parseInt(move[1]) > 0 && index < 4)

            const moveIsAnyOfForwardMove = index < 2
            const moveIsTwoFieldsForward = index === 1
            const moveIsEatMove = index > 3
            const pieceOnLeftSide = index === 4

            const pawnNotMoved = initialState && !initialState[from]

            const isEnpassantAvailable = 
                (moveIsEatMove
                && initialState
                && pieceOnMove
                && pieceOnMove.type === 'Pawn'
                && initialState[pieceOnMove.lastMoves.slice().pop()]
                && parseInt(pieceOnMove.lastMoves.slice().pop()[1]) === (parseInt(move[1]) + 2)
                && rawMakedMoves.slice().pop() === (`P${pieceOnMove.lastMoves.slice().pop()}`) 
                && opponentPieceOnMove)
            
            if ((moveIsAnyOfForwardMove && pieceOnMove) || (moveIsAnyOfForwardMove && pieceInfront)) {
                pieceInfront = true
                return
            }

            if (moveIsTwoFieldsForward && pawnNotMoved) return

            if (index > 1) {
                if (!pieceOnMove) {
                    return
                } else if (pieceOnMove.color === 'White') {
                    return
                }
            }

            if (isEnpassantAvailable)
            {
                if (pieceOnLeftSide) {
                    moves.push(whiteMoves[2])
                    moves.push('enpassantLeft')
                } else {
                    moves.push(whiteMoves[3])
                    moves.push('enpassantRight')
                }
            }

            if (moveLeadsToCheck) return
            if (movePassingValidation) moves.push(move)
        })
    }

    return moves
  }
}

export default Pawn;
