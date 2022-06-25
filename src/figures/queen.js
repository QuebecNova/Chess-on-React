import Piece from "./piece.js";
import piecesImages from "../services/piecesImages.js";
import Bishop from "./bishop.js";
import Rook from "./rook.js";

class Queen extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackQueen : piecesImages.WhiteQueen,
      "Queen"
    )
  }

  canMove(from, squareState) {
    const moves = []

    console.log();

    const QueenExtendsBishop = new Bishop(this.color)
    const QueenExtendsRook = new Rook(this.color)
    
    const diagonalRawMoves = QueenExtendsBishop.canMove(from, squareState)
    const linearRawMoves = QueenExtendsRook.canMove(from, squareState)

    const rawMoves = [...diagonalRawMoves, ...linearRawMoves]

    rawMoves.forEach(move => {
        if (squareState[move] && squareState[move].color === this.color) return
        moves.push(move)
    })

    return moves
  }
}

export default Queen;
