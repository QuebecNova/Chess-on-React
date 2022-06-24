import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";

class Pawn extends Piece {
    constructor(color) {
        super(color, (color === 'black' ? piecesImages.BlackPawn : piecesImages.WhitePawn))
    }
}

export default Pawn