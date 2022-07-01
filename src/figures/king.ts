import Piece from "./piece";
import piecesImages from "../services/misc/piecesImages";
import alphs from "../services/math/alphabetPositions";
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
    
    const isKingOnCheck = movesLeadsToCheck?.[from]
    if (isKingOnCheck) {
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

        const moveLeadsToCheck = movesLeadsToCheck?.[move]
        const movePassingValidation = (move && !move[2] && parseInt(move[1]) > 0 && parseInt(move[1]) < 9 && index < 11)
        
        const pieceOnMove = squareState[move]
        const samePieceOnMove = pieceOnMove?.color === this.color

        const kingOnCheck = movesLeadsToCheck?.[from]

        if (samePieceOnMove && pieceOnMove.type !== 'King') return

        //castle logic
        const kingMoved = this.lastMoves.length > 0
        const castilngMove = index > 7
        
        if (castilngMove) {
        
            const castlingToRight = index === 8
            const castlingToLeft = index === 9

            //GOD HELP ME
            //THAT'S SMELLS LIKE A BOLEAN ALGEBRA
            const castlePassingValidationToRight = 
                (!kingMoved 
                && squareState[rookRight]?.type === 'Rook' 
                && initialState[rookRight]?.type === 'Rook' 
                && initialState[rookRight]?.lastMoves.length === 0
                && !pieceOnMove
                && !squareState[rawMoves[2]]
                && !kingOnCheck
                && !movesLeadsToCheck?.[rawMoves[2]])

            const castlePassingValidationToLeft = 
                (!kingMoved 
                && squareState[rookLeft]?.type === 'Rook'
                && initialState[rookLeft]?.type === 'Rook' 
                && initialState[rookLeft]?.lastMoves.length === 0
                && !pieceOnMove
                && !squareState[rawMoves[6]]
                && !squareState[rawMoves[11]]
                && !kingOnCheck
                && !movesLeadsToCheck?.[rawMoves[6]])

            if (castlingToRight && castlePassingValidationToRight) {
                moves.push(rawMoves[8])
                moves.push('castleRight')
                return
            }
            
            if (castlingToLeft && castlePassingValidationToLeft) {
                moves.push(rawMoves[9])
                moves.push('castleLeft')
                return
            }
        }

        if (moveLeadsToCheck) return
        if (movePassingValidation) moves.push(move)

        //checking that enemy piece attacking field that used to castle king
        //or your piece blocking castling
        //or (king or rook) moved or not on the right spot
        //if true => delete castle move

        const sameColorPieceBlockingCastleToLeft = 
        (squareState[rawMoves[6]] 
        || squareState[rawMoves[9]] 
        || squareState[rawMoves[11]])

        const rookLeftMoved = 
            (squareState[rookLeft]?.type === 'Rook'  && initialState[rookLeft]?.lastMoves.length !== 0)

        const rookRightMoved =
            (squareState[rookRight]?.type === 'Rook' && initialState[rookRight]?.lastMoves.length !== 0)

        const somethingBlockingCastleToLeft = 
            (movesLeadsToCheck?.[rawMoves[6]]
            || kingOnCheck
            || kingMoved
            || !squareState[rookLeft]
            || rookLeftMoved
            || sameColorPieceBlockingCastleToLeft)

        const somethingBlockingCastleToRight =
            (movesLeadsToCheck?.[rawMoves[2]]
            || kingOnCheck
            || kingMoved
            || !squareState[rookRight]
            || rookRightMoved 
            || squareState[rawMoves[2]] 
            || squareState[rawMoves[8]])

        if (somethingBlockingCastleToLeft) {
            moves = arrayRemove(moves, rawMoves[9])
        }
        if (somethingBlockingCastleToRight)  {
            moves = arrayRemove(moves, rawMoves[8])
        }
    })
    
    return moves
  }
}

export default King;
