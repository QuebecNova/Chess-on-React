import setupBoard from "../configs/setupBoard"
import getSquares from "./getSquares"

const calculateMoves = {
    getCurrentMoves(squares, turn, legalMovesOnNextMove) {
        const allCurrentMoves = getSquares(false)
        for (const field in squares) {
            if (squares[field] && squares[field].color === turn) {
                const moves = squares[field].canMove(field, squares, legalMovesOnNextMove, setupBoard())
                moves.forEach(move => {
                    if (move) allCurrentMoves[move] = true
                })
            }
        }
        return allCurrentMoves
    },

    getOppositeMoves(squares, turn, legalMovesOnNextMove) {
        const allOpositeMoves = getSquares(false)
        for (const field in squares) {
            if (squares[field] && squares[field].color !== turn) {
                const moves = squares[field].canMove(field, squares, legalMovesOnNextMove, setupBoard())
                moves.forEach(move => {
                    if (move) allOpositeMoves[move] = true
                })
            }
        }
        return allOpositeMoves
    }
}


export default calculateMoves