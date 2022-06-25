import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions.js";

class Knight extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKnight : piecesImages.WhiteKnight,
      "Knight"
    )
  }

  canMove(from, squareState) {
    const moves = []
    
    const rawMoves = [
        alphs.changeAlphPos(from, '+', 1, '+', 2),
        alphs.changeAlphPos(from, '-', 1, '+', 2),
        alphs.changeAlphPos(from, '+', 1, '-', 2),
        alphs.changeAlphPos(from, '-', 1, '-', 2),
        alphs.changeAlphPos(from, '+', 2, '+', 1),
        alphs.changeAlphPos(from, '+', 2, '-', 1),
        alphs.changeAlphPos(from, '-', 2, '+', 1),
        alphs.changeAlphPos(from, '-', 2, '-', 1),
    ]

    rawMoves.forEach(move => {
        if (squareState[move] && squareState[move].color === this.color) return
        moves.push(move)
    })

    return moves
  }
}

export default Knight;
