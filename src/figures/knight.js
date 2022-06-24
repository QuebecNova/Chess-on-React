import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Knight extends Piece {
    constructor(color) {
        super(color, (color === 'black' ? piecesImages.BlackKnight : piecesImages.WhiteKnight))
    }
}

export default Knight