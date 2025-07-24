import { setupBoard } from 'src/4.features/config/setupBoard'
import { KeyableSquares } from 'src/5.entities/model'
import { EndCondition, Pieces } from 'src/6.shared/model'
import { getMovesThatLeadsToCheck } from './getMovesThatLeadsToCheck'

export function getEndCondition(
    squares: KeyableSquares,
    turn: string
): EndCondition | null {
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
        return EndCondition.Stalemate
    }
    if (allLegalMoves.every((legalMoves) => legalMoves.length === 0))
        return EndCondition.Checkmate
    if (checked) return EndCondition.Check
    return null
}
