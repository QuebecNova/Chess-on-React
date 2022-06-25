import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions.js";

class King extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKing : piecesImages.WhiteKing,
      "King"
    )
  }

  canMove(from, squareState) {
    const moves = []
    
    const rawMoves = [
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
        moves.push(move)
    })

    return moves
  }
}

export default King;
