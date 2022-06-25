import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class King extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKing : piecesImages.WhiteKing,
      "King"
    )
  }
}

export default King;
