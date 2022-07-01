import Piece from "./piece";
import piecesImages from "../services/misc/piecesImages";
import alphs from "../services/math/alphabetPositions";
import { keyableSquares } from "../interfaces/keyable";

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
    movesLeadsToCheck : keyableSquares
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

        const pieceOnMove = squareState[move]
        const samePieceOnMove = pieceOnMove?.color === this.color
        const moveLeadsToCheck = movesLeadsToCheck?.[move]
        const movePassingValidation = (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9)

        if (samePieceOnMove) return
        if (moveLeadsToCheck) return
        if (movePassingValidation) moves.push(move)
    })

    return moves
  }
}

export default Knight;
