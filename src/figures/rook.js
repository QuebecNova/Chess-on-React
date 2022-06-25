import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Rook extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackRook : piecesImages.WhiteRook,
      "Rook"
    )
  }
}

export default Rook;
