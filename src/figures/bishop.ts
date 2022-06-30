import Piece from "./piece";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions";
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
    ) {
    const moves = []

    let NWDiagonalMoved = false
    let SEDiagonalMoved = false
    let NEDiagonalMoved = false
    let SWDiagonalMoved = false
    
    const rawMoves = [
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

    rawMoves.forEach((move, index) => {

        const moveLeadsToCheck = movesLeadsToCheck && movesLeadsToCheck[move]
        const movePassingValidation = (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9)

        const NWDiagonal = index < 7
        const SEDiagonal = (index > 6 && index < 14)
        const NEDiagonal = (index > 13 && index < 21)
        const SWDiagonal = index > 20
        
        if (NWDiagonal && NWDiagonalMoved) return
        if (SEDiagonal && SEDiagonalMoved) return
        if (NEDiagonal && NEDiagonalMoved) return
        if (SWDiagonal && SWDiagonalMoved) return
        
        if (squareState[move]) {
            
            const sameColor = squareState[move].color === this.color
            const enemyColor = squareState[move].color !== this.color

            if (NWDiagonal) {
                if (sameColor) {
                    NWDiagonalMoved = true
                    return
                } else if (enemyColor) {
                    NWDiagonalMoved = true
                }
            }

            if (SEDiagonal) {
                if (sameColor) {
                    SEDiagonalMoved = true
                    return
                } else if (enemyColor) {
                    SEDiagonalMoved = true
                }
            }

            if (NEDiagonal) {
                if (sameColor) {
                    NEDiagonalMoved = true
                    return
                } else if (enemyColor) {
                    NEDiagonalMoved = true
                }
            }

            if (SWDiagonal) {
                if (sameColor) {
                    SWDiagonalMoved = true
                    return
                } else if (enemyColor) {
                    SWDiagonalMoved = true
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
