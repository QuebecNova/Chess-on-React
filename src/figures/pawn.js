import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Pawn extends Piece {
  constructor(color) {
    super(
      color,
      color === "black" ? piecesImages.BlackPawn : piecesImages.WhitePawn,
      "Pawn"
    )
  }

  canMove(from) {
    const moves = [
        from
    ]
  }

  getPath() {

  }
}

export default Pawn;
