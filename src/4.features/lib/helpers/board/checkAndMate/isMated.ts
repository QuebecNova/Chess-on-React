import { setupBoard } from 'src/4.features/config/setupBoard'
import { KeyableSquares } from 'src/5.entities/model'
import { BoardState, Pieces, sounds } from 'src/6.shared/model'
import { getMovesThatLeadsToCheck } from './getMovesThatLeadsToCheck'

export function isMated(
    squares: KeyableSquares,
    turn: string
): boolean | string {
    //simulating next move for check
    const allLegalMoves = []
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

            //checked or not
            if (squares[field].onCheck) sounds.check.play()
        }
    }

    if (
        allLegalMoves.length === 1 &&
        allLegalMoves[0].length === 1 &&
        squares[allLegalMoves[0][0]].type === Pieces.King
    ) {
        return BoardState.Stalemate
    }

    const mated = allLegalMoves.every((legalMoves) => legalMoves.length === 0)

    return mated
}
