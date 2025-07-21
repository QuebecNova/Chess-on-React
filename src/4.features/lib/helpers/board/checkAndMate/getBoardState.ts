import { setupBoard } from 'src/4.features/config/setupBoard'
import { KeyableSquares } from 'src/5.entities/model'
import { BoardState, Pieces } from 'src/6.shared/model'
import { getMovesThatLeadsToCheck } from './getMovesThatLeadsToCheck'

export function getBoardState(
    squares: KeyableSquares,
    turn: string
): BoardState | null {
    //simulating next move for check
    const allLegalMoves = []
    let checked = false
    for (const field in squares) {
        if (squares[field]?.color === turn) {
            allLegalMoves.push(
                squares[field].canMove(
                    field,
                    squares,
                    getMovesThatLeadsToCheck(
                        squares,
                        squares[field],
                        field,
                        turn
                    ),
                    setupBoard()
                )
            )
            if (squares[field].onCheck) checked = true
        }
    }

    if (
        allLegalMoves.length === 1 &&
        allLegalMoves[0].length === 1 &&
        squares[allLegalMoves[0][0]].type === Pieces.King
    ) {
        return BoardState.Stalemate
    }
    if (allLegalMoves.every((legalMoves) => legalMoves.length === 0))
        return BoardState.Checkmate
    if (checked) return BoardState.Check
    return null
}
