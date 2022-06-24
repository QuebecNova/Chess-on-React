import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions.js";

class Pawn extends Piece {
  constructor(color) {
    super(
      color,
      color === 'black' ? piecesImages.BlackPawn : piecesImages.WhitePawn,
      'Pawn'
    )
  }

  canMove(from) {
    const rawMoves = []
    if (this.color === 'black') {
        const blackMoves = [
            from[0] + (parseInt(from[1]) - 1),
            from[0] + (parseInt(from[1]) - 2),
            alphs.changeAlphPos(from, '-', 1, '-', 1),
            alphs.changeAlphPos(from, '+', 1, '-', 1),
        ]
        blackMoves.forEach(move => {
            if (move[0] && move[1] && move[1] <= 8) rawMoves.push(move)
        })
    } else {
        const whiteMoves = [
            from[0] + (parseInt(from[1]) + 1),
            from[0] + (parseInt(from[1]) + 2),
            alphs.changeAlphPos(from, '-', 1, '+', 1),
            alphs.changeAlphPos(from, '+', 1, '+', 1),
        ]
        whiteMoves.forEach(move => {
            if (move[0] && move[1] && move[1] <= 8) rawMoves.push(move)
        })
    }


    return rawMoves
  }

  getPath() {

  }
}

export default Pawn;
