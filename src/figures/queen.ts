import Piece from "./piece";
import piecesImages from "../services/piecesImages";
import Bishop from "./bishop";
import Rook from "./rook";
import { keyableSquares } from "../interfaces/keyable";

class Queen extends Piece {
  constructor(color : string) {
    super(
      color,
      color === "Black" ? piecesImages.BlackQueen : piecesImages.WhiteQueen,
      "Queen"
    )
  }

  canMove(
    from : string, 
    squareState : keyableSquares, 
    movesLeadsToCheck : keyableSquares
    ) {
    const moves = []

    console.log();

    const QueenExtendsBishop = new Bishop(this.color)
    const QueenExtendsRook = new Rook(this.color)
    
    const diagonalRawMoves = QueenExtendsBishop.canMove(from, squareState, movesLeadsToCheck)
    const linearRawMoves = QueenExtendsRook.canMove(from, squareState, movesLeadsToCheck)

    const rawMoves = [...diagonalRawMoves, ...linearRawMoves]

    rawMoves.forEach(move => {
        if (squareState[move] && squareState[move].color === this.color) return
        if (movesLeadsToCheck && movesLeadsToCheck[move]) return
        if (move && !move[2] && move[1] > 0 && move[1] < 9) moves.push(move)
    })

    return moves
  }
}

export default Queen;
