import Piece from "./piece";
import piecesImages from "../services/piecesImages";
import alphs from "../services/alphabetPositions";
import arrayRemove from "../services/arrayRemove";
import { keyableSquares } from "../interfaces/keyable";

class King extends Piece {
    
  lastMoves : Array<string>
  onCheck : boolean

  constructor(color : string) {
    super(
      color,
      color === "Black" ? piecesImages.BlackKing : piecesImages.WhiteKing,
      "King"
    )
    this.lastMoves = []
    this.onCheck = false
  }


  canMove(
    from : string, 
    squareState : keyableSquares, 
    movesLeadsToCheck : keyableSquares, 
    initialState? : keyableSquares
    ) {
    
    if (movesLeadsToCheck && movesLeadsToCheck[from]) {
        this.onCheck = true
    } else {
        this.onCheck = false
    }

    let moves = []

    //rooks here
    const rookRight = alphs.changeAlphPos(from, '+', 3)
    const rookLeft = alphs.changeAlphPos(from, '-', 4)
    
    const rawMoves = [
        //circular moves starting from kingpos[1] + 1
        from[0] + (parseInt(from[1]) + 1),
        alphs.changeAlphPos(from, '+', 1, '+', 1),
        alphs.changeAlphPos(from, '+', 1),
        alphs.changeAlphPos(from, '+', 1, '-', 1),
        from[0] + (parseInt(from[1]) - 1),
        alphs.changeAlphPos(from, '-', 1, '-', 1),
        alphs.changeAlphPos(from, '-', 1),
        alphs.changeAlphPos(from, '-', 1, '+', 1),
        //castling
        alphs.changeAlphPos(from, '+', 2),
        alphs.changeAlphPos(from, '-', 2),
        from,
        alphs.changeAlphPos(from, '-', 3),
    ]

    rawMoves.forEach((move, index) => {
        if (squareState[move] && squareState[move].color === this.color && squareState[move].type !== 'King') return
        if (index > 7) {
            //checking for castle available
            //GOD HELP ME
            //THAT'S SMELLS LIKE A BOLEAN ALGEBRA
            if (index === 8 
                && (this.lastMoves.length === 0 
                    && squareState[rookRight] 
                    && squareState[rookRight].type === 'Rook' 
                    && initialState[rookRight].type === 'Rook' 
                    && initialState[rookRight].lastMoves.length === 0
                    && !squareState[rawMoves[2]]
                    && !squareState[move]
                    && movesLeadsToCheck
                    && !movesLeadsToCheck[rawMoves[2]]
                    && !movesLeadsToCheck[move]))
            {
                moves.push(rawMoves[8])
                moves.push('castleRight')
                return
            }
            
            if (index === 9
                && (this.lastMoves.length === 0 
                    && squareState[rookLeft] 
                    && squareState[rookLeft].type === 'Rook'
                    && initialState[rookLeft].type === 'Rook' 
                    && initialState[rookLeft].lastMoves.length === 0
                    && !squareState[rawMoves[6]]
                    && !squareState[move]
                    && !squareState[rawMoves[11]]
                    && movesLeadsToCheck
                    && !movesLeadsToCheck[rawMoves[6]]
                    && !movesLeadsToCheck[move]))
            {
                moves.push(rawMoves[9])
                moves.push('castleLeft')
                return
            }
        }
        if (movesLeadsToCheck && movesLeadsToCheck[move]) return
        if (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9 && index < 11) moves.push(move)

        if (movesLeadsToCheck) {
            if (movesLeadsToCheck[rawMoves[6]]
                || movesLeadsToCheck[from]
                || this.lastMoves.length !== 0
                || !squareState[rookLeft] 
                || (initialState[rookLeft] 
                    && squareState[rookLeft].type === 'Rook' 
                    && initialState[rookLeft].lastMoves.length !== 0) 
                || squareState[rawMoves[6]] 
                || squareState[rawMoves[9]] 
                || squareState[rawMoves[11]]) {
                moves = arrayRemove(moves, rawMoves[9])
            }
            if (movesLeadsToCheck[rawMoves[2]]
                || movesLeadsToCheck[from]
                || this.lastMoves.length !== 0
                || !squareState[rookRight]
                || (initialState[rookRight] 
                    && squareState[rookRight].type === 'Rook' 
                    && initialState[rookRight].lastMoves.length !== 0) 
                || squareState[rawMoves[2]] 
                || squareState[rawMoves[8]])  {
                moves = arrayRemove(moves, rawMoves[8])
            }
        }
    })
    
    return moves
  }
}

export default King;
