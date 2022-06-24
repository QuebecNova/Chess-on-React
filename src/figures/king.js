import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class King extends Piece {
    constructor(color) {
        super(color, (color === 'black' ? piecesImages.BlackKing : piecesImages.WhiteKing))
    }
}

export default King