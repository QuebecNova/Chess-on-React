import Piece from "./piece";
import piecesImages from "../services/misc/piecesImages";
import alphs from "../services/math/alphabetPositions";
import { keyableSquares } from "../interfaces/keyable";

class Bishop extends Piece {
  constructor(color : string) {
    super(
      color,
      color === "Black" ? piecesImages.BlackBishop : piecesImages.WhiteBishop,
      "Bishop"
    )
  }
  
  canMove(
    from : string, 
    squareState : keyableSquares, 
    movesLeadsToCheck : keyableSquares
    ) : string[] {
        
    const moves : string[] = []
    
    const rawMoves : string[] = [
        //NW diagonal 0-6
        alphs.changeAlphPos(from, '+', 1, '+', 1),
        alphs.changeAlphPos(from, '+', 2, '+', 2),
        alphs.changeAlphPos(from, '+', 3, '+', 3),
        alphs.changeAlphPos(from, '+', 4, '+', 4),
        alphs.changeAlphPos(from, '+', 5, '+', 5),
        alphs.changeAlphPos(from, '+', 6, '+', 6),
        alphs.changeAlphPos(from, '+', 7, '+', 7),

        //SE diagonal 7-13
        alphs.changeAlphPos(from, '-', 1, '-', 1),
        alphs.changeAlphPos(from, '-', 2, '-', 2),
        alphs.changeAlphPos(from, '-', 3, '-', 3),
        alphs.changeAlphPos(from, '-', 4, '-', 4),
        alphs.changeAlphPos(from, '-', 5, '-', 5),
        alphs.changeAlphPos(from, '-', 6, '-', 6),
        alphs.changeAlphPos(from, '-', 7, '-', 7),

        //NE diagonal 14-20
        alphs.changeAlphPos(from, '-', 1, '+', 1),
        alphs.changeAlphPos(from, '-', 2, '+', 2),
        alphs.changeAlphPos(from, '-', 3, '+', 3),
        alphs.changeAlphPos(from, '-', 4, '+', 4),
        alphs.changeAlphPos(from, '-', 5, '+', 5),
        alphs.changeAlphPos(from, '-', 6, '+', 6),
        alphs.changeAlphPos(from, '-', 7, '+', 7),

        //SW diagonal 14-27
        alphs.changeAlphPos(from, '+', 1, '-', 1),
        alphs.changeAlphPos(from, '+', 2, '-', 2),
        alphs.changeAlphPos(from, '+', 3, '-', 3),
        alphs.changeAlphPos(from, '+', 4, '-', 4),
        alphs.changeAlphPos(from, '+', 5, '-', 5),
        alphs.changeAlphPos(from, '+', 6, '-', 6),
        alphs.changeAlphPos(from, '+', 7, '-', 7),
    ]

    let NWDiagonalHavePiece = false
    let SEDiagonalHavePiece = false
    let NEDiagonalHavePiece = false
    let SWDiagonalHavePiece = false

    rawMoves.forEach((move, index) => {

        const moveLeadsToCheck = movesLeadsToCheck?.[move]
        const movePassingValidation = (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9)
        const pieceOnMove = squareState[move]

        const NWDiagonal = index < 7
        const SEDiagonal = (index > 6 && index < 14)
        const NEDiagonal = (index > 13 && index < 21)
        const SWDiagonal = index > 20
        
        if (NWDiagonal && NWDiagonalHavePiece) return
        if (SEDiagonal && SEDiagonalHavePiece) return
        if (NEDiagonal && NEDiagonalHavePiece) return
        if (SWDiagonal && SWDiagonalHavePiece) return
        
        if (pieceOnMove) {
            
            const sameColor = pieceOnMove.color === this.color
            const enemyColor = pieceOnMove.color !== this.color

            if (NWDiagonal) {
                if (sameColor) {
                    NWDiagonalHavePiece = true
                    return
                } else if (enemyColor) {
                    NWDiagonalHavePiece = true
                }
            }

            if (SEDiagonal) {
                if (sameColor) {
                    SEDiagonalHavePiece = true
                    return
                } else if (enemyColor) {
                    SEDiagonalHavePiece = true
                }
            }

            if (NEDiagonal) {
                if (sameColor) {
                    NEDiagonalHavePiece = true
                    return
                } else if (enemyColor) {
                    NEDiagonalHavePiece = true
                }
            }

            if (SWDiagonal) {
                if (sameColor) {
                    SWDiagonalHavePiece = true
                    return
                } else if (enemyColor) {
                    SWDiagonalHavePiece = true
                }
            }
        }

        if (moveLeadsToCheck) return
        if (movePassingValidation) moves.push(move)
    })

    return moves
  }
}

export default Bishop;
