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
      
      const movePassingValidation = move && !move[2] && move[1] > 0 && move[1] < 9
      const moveLeadsToCheck = movesLeadsToCheck && movesLeadsToCheck[move]
      const pieceOnMove = squareState[move]
      const sameColorPieceOnMove = pieceOnMove && pieceOnMove.color === this.color

        if (sameColorPieceOnMove) return
        if (moveLeadsToCheck) return
        if (movePassingValidation) moves.push(move)
    })

    return moves
  }
}

export default Queen;
