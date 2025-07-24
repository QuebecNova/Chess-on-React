import { setupBoard } from 'src/4.features/config/setupBoard'
import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { Pieces } from 'src/6.shared/model'
import { getSquares } from '../getSquares'

const initialPositions = setupBoard()
const nullSquares = getSquares(null)

export function getMovesThatLeadsToCheck(
    squares: KeyableSquares,
    draggedPiece: IPiece,
    coords: string,
    turn: string
): KeyableSquares {
    const kingOnCheckAfterThisMoves = { ...nullSquares }
    //simulating next move for check
    const moves = draggedPiece.canMove(coords, squares, null, initialPositions)
    moves.forEach((move: string) => {
        const pieceOnField = {
            [coords]: null,
            [move]: draggedPiece,
        }
        const simulateNextMoveSquares = {
            ...squares,
            ...pieceOnField,
        }

        const simulateNextOppositeMoves = { ...nullSquares }
        for (const field in simulateNextMoveSquares) {
            if (
                simulateNextOppositeMoves &&
                simulateNextMoveSquares[field] &&
                simulateNextMoveSquares[field].color !== turn
            ) {
                const moves = simulateNextMoveSquares[field].canMove(
                    field,
                    simulateNextMoveSquares,
                    null,
                    initialPositions
                )

                moves.forEach((move) => {
                    if (move)
                        simulateNextOppositeMoves[move] =
                            simulateNextMoveSquares[field]
                })
            }
        }

        for (const field in simulateNextMoveSquares) {
            if (
                simulateNextOppositeMoves[field] &&
                simulateNextMoveSquares[field]?.type === Pieces.King &&
                simulateNextMoveSquares[field]?.color === turn
            ) {
                kingOnCheckAfterThisMoves[move] = simulateNextMoveSquares[field]
            }
        }
    })

    return kingOnCheckAfterThisMoves
}
