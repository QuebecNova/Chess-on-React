import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Bishop extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackBishop : piecesImages.WhiteBishop,
      "Bishop"
    )
  }
}

export default Bishop;
