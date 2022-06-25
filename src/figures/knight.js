import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Knight extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKnight : piecesImages.WhiteKnight,
      "Knight"
    )
  }
}

export default Knight;
