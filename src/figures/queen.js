import Piece from "./piece.js";
import piecesImages from "../services/piecesImages.js";

class Queen extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackQueen : piecesImages.WhiteQueen,
      "Queen"
    )
  }
}

export default Queen;
