import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Rook extends Piece {
    constructor(color) {
        super(color, (color === 'black' ? piecesImages.BlackRook : piecesImages.WhiteRook))
    }
}

export default Rook