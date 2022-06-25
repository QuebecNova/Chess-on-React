import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions.js";
import { rawMakedMoves } from "../components/Board.jsx";

class Pawn extends Piece {
  constructor(color) {
    super(
      color,
      color === 'Black' ? piecesImages.BlackPawn : piecesImages.WhitePawn,
      'Pawn'
    )
  }

  lastMove = []

  canMove(from, squareState, initialState) {

    const moves = []
    let pieceInfront = false

    if (this.color === 'Black') {
        const blackMoves = [
            from[0] + (parseInt(from[1]) - 1),
            from[0] + (parseInt(from[1]) - 2),
            alphs.changeAlphPos(from, '-', 1, '-', 1),
            alphs.changeAlphPos(from, '+', 1, '-', 1),
            alphs.changeAlphPos(from, '-', 1),
            alphs.changeAlphPos(from, '+', 1),
        ]
        blackMoves.forEach((move, index) => {
            
            if ((index < 2 && squareState[move]) || (index < 2 && pieceInfront)) {
                pieceInfront = true
                return
            }
            
            if (index === 1 && !initialState[from]) return 
            
            if (index > 1) {
                if (!squareState[move]) {
                    return
                } else if (squareState[move].color === 'Black') {
                    return
                }
            }

            if (index > 3 
                && squareState[move]
                && squareState[move].lastMove
                && initialState[squareState[move].lastMove.at(-1)] 
                && parseInt(squareState[move].lastMove.at(-1)[1]) === (parseInt(move[1]) - 2)
                && rawMakedMoves.at(-1) === (`P${squareState[move].lastMove.at(-1)}`) 
                && squareState[move].color === 'White') 
            {
                if (index === 4) {
                    moves.push(blackMoves[2])
                    moves.push('enpassantLeft')
                } else {
                    moves.push(blackMoves[3])
                    moves.push('enpassantRight')
                }
            }

            if (move[0] && move[1] && move[1] <= 8 && move[1] > 0 && index < 4) moves.push(move)
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
            
            if ((index < 2 && squareState[move]) || (index < 2 && pieceInfront)) {
                pieceInfront = true
                return
            }

            if (index === 1 && !initialState[from]) return

            if (index > 1) {
                if (!squareState[move]) {
                    return
                } else if (squareState[move].color === 'White') {
                    return
                }
            }

            if (index > 3 
                && squareState[move]
                && squareState[move].lastMove
                && initialState[squareState[move].lastMove.at(-1)]
                && parseInt(squareState[move].lastMove.at(-1)[1]) === (parseInt(move[1]) + 2)
                && rawMakedMoves.at(-1) === (`P${squareState[move].lastMove.at(-1)}`) 
                && squareState[move].color === 'Black') 
            {
                if (index === 4) {
                    moves.push(whiteMoves[2])
                    moves.push('enpassantLeft')
                } else {
                    moves.push(whiteMoves[3])
                    moves.push('enpassantRight')
                }
            }

            if (move[0] && move[1] && move[1] <= 8 && move[1] > 0 && index < 4) moves.push(move)
        })
    }

    return moves
  }
}

export default Pawn;
