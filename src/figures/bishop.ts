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

    let NWdiagonalMoves = false
    let SEdiagonalMoves = false
    let NEdiagonalMoves = false
    let SWdiagonalMoves = false
    
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

        //NWdiagonalMoves = index < 7
        //SEdiagonalMoves = (index > 6 && index < 14)

        //NEdiagonalMoves = (index > 13 && index < 21)
        //SWdiagonalMoves = index > 20

        
        if (index < 7 && NWdiagonalMoves) return
        if ((index > 6 && index < 14) && SEdiagonalMoves) return
        if ((index > 13 && index < 21) && NEdiagonalMoves) return
        if (index > 20 && SWdiagonalMoves) return
        
        if (squareState[move]) {
            
            const sameColor = squareState[move].color === this.color
            const enemyColor = squareState[move].color !== this.color

            if (index < 7) {
                //backRowMoves = index < 7
                if (sameColor) {
                    NWdiagonalMoves = true
                    return
                } else if (enemyColor) {
                    NWdiagonalMoves = true
                }
            }

            if (index > 6 && index < 14) {
                //frontRowMoves = (index > 6 && index < 14)
                if (sameColor) {
                    SEdiagonalMoves = true
                    return
                } else if (enemyColor) {
                    SEdiagonalMoves = true
                }
            }

            if (index > 13 && index < 21) {
                //backColMoves = (index > 13 && index < 21)
                if (sameColor) {
                    NEdiagonalMoves = true
                    return
                } else if (enemyColor) {
                    NEdiagonalMoves = true
                }
            }

            if (index > 20) {
                //frontColMoves = index > 20
                if (sameColor) {
                    SWdiagonalMoves = true
                    return
                } else if (enemyColor) {
                    SWdiagonalMoves = true
                }
            }
        }
        
        if (movesLeadsToCheck && movesLeadsToCheck[move]) return

        if (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9) moves.push(move)
    })

    return moves
  }
}

export default Bishop;
