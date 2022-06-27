import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";
import getSquares from "../services/getSquares.js";
import alphs from "../services/alphabetPositions.js";

class King extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKing : piecesImages.WhiteKing,
      "King"
    )
  }
  
  canMove(from, squareState, movesLeadsToCheck) {
    
    const moves = []
    
    const rawMoves = [
        //circular moves starting from kingpos[1] + 1
        from[0] + (parseInt(from[1]) + 1),
        alphs.changeAlphPos(from, '+', 1, '+', 1),
        alphs.changeAlphPos(from, '+', 1),
        alphs.changeAlphPos(from, '+', 1, '-', 1),
        from[0] + (parseInt(from[1]) - 1),
        alphs.changeAlphPos(from, '-', 1, '-', 1),
        alphs.changeAlphPos(from, '-', 1),
        alphs.changeAlphPos(from, '-', 1, '+', 1),
    ]

    rawMoves.forEach(move => {
        if (squareState[move] && squareState[move].color === this.color) return
        if (movesLeadsToCheck && movesLeadsToCheck[move]) return
        if (move && !move[2] && move[1] > 0 && move[1] < 9) moves.push(move)
    })

    return moves
  }
}

export default King;
