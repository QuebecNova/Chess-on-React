import Piece from "./piece.js";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions.js";

class Rook extends Piece {
  constructor(color) {
    super(
      color,
      color === "Black" ? piecesImages.BlackRook : piecesImages.WhiteRook,
      "Rook"
    )
  }
  canMove(from, squareState) {
    const moves = []

    let pieceInbackCol = false
    let pieceInfrontCol = false

    let pieceInbackRow = false
    let pieceInfrontRow = false
    
    const rawMoves = [
        // rows 0-13
        // 0-6 left
        alphs.changeAlphPos(from, '-', 1),
        alphs.changeAlphPos(from, '-', 2),
        alphs.changeAlphPos(from, '-', 3),
        alphs.changeAlphPos(from, '-', 4),
        alphs.changeAlphPos(from, '-', 5),
        alphs.changeAlphPos(from, '-', 6),
        alphs.changeAlphPos(from, '-', 7),
        
        // 7-13 right
        alphs.changeAlphPos(from, '+', 1),
        alphs.changeAlphPos(from, '+', 2),
        alphs.changeAlphPos(from, '+', 3),
        alphs.changeAlphPos(from, '+', 4),
        alphs.changeAlphPos(from, '+', 5),
        alphs.changeAlphPos(from, '+', 6),
        alphs.changeAlphPos(from, '+', 7),

        // cols 14-27
        // 14-20 back
        from[0] + (parseInt(from[1]) - 1),
        from[0] + (parseInt(from[1]) - 2),
        from[0] + (parseInt(from[1]) - 3),
        from[0] + (parseInt(from[1]) - 4),
        from[0] + (parseInt(from[1]) - 5),
        from[0] + (parseInt(from[1]) - 6),
        from[0] + (parseInt(from[1]) - 7),

        // 20-27 front
        from[0] + (parseInt(from[1]) + 1),
        from[0] + (parseInt(from[1]) + 2),
        from[0] + (parseInt(from[1]) + 3),
        from[0] + (parseInt(from[1]) + 4),
        from[0] + (parseInt(from[1]) + 5),
        from[0] + (parseInt(from[1]) + 6),
        from[0] + (parseInt(from[1]) + 7),
    ]

    rawMoves.forEach((move, index) => {

        //backRowMoves = index < 7
        //frontRowMoves = (index > 6 && index < 14)

        //backColMoves = (index > 13 && index < 21)
        //frontColMoves = index > 20

        if (index < 7 && pieceInbackRow) return
        if ((index > 6 && index < 14) && pieceInfrontRow) return
        if ((index > 13 && index < 21) && pieceInbackCol) return
        if (index > 20 && pieceInfrontCol) return

        if (squareState[move]) {
            
            const sameColor = squareState[move].color === this.color
            const enemyColor = squareState[move].color !== this.color

            if (index < 7) {
                //backRowMoves = index < 7
                if (sameColor) {
                    pieceInbackRow = true
                    return
                } else if (enemyColor) {
                    pieceInbackRow = true
                }
            }

            if (index > 6 && index < 14) {
                //frontRowMoves = (index > 6 && index < 14)
                if (sameColor) {
                    pieceInfrontRow = true
                    return
                } else if (enemyColor) {
                    pieceInfrontRow = true
                }
            }

            if (index > 13 && index < 21) {
                //backColMoves = (index > 13 && index < 20)
                if (sameColor) {
                    pieceInbackCol = true
                    return
                } else if (enemyColor) {
                    pieceInbackCol = true
                }
            }

            if (index > 20) {
                //frontColMoves = index > 20
                if (sameColor) {
                    pieceInfrontCol = true
                    return
                } else if (enemyColor) {
                    pieceInfrontCol = true
                }
            }
        }

        moves.push(move)
    })

    return moves
  }
}

export default Rook;
