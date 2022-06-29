import Piece from "./piece";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions";
import { keyableSquares, keyableBoolean } from "../interfaces/keyable";

class Knight extends Piece {
  constructor(color : string) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKnight : piecesImages.WhiteKnight,
      "Knight"
    )
  }

  canMove(
    from : string, 
    squareState : keyableSquares, 
    movesLeadsToCheck : keyableBoolean
    ) {
    const moves : Array<string> = []
    
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
        if (squareState[move] && (squareState[move].color === this.color)) return
        if (movesLeadsToCheck && movesLeadsToCheck[move]) return
        if (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9) moves.push(move)
    })

    return moves
  }
}

export default Knight;
