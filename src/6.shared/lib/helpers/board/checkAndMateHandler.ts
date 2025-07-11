
import setupBoard from 'src/3.widgets/config/setupBoard'
import { KeyableSquares } from 'src/5.entities/model/Keyable'
import IPiece from 'src/5.entities/model/IPiece'
import sounds from 'src/6.shared/lib/helpers/misc/sounds'
import getSquares from 'src/4.features/lib/helpers/getSquares'

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
                simulateNextMoveSquares[field]?.type === 'King' &&
                simulateNextMoveSquares[field]?.color === turn
            ) {
                kingOnCheckAfterThisMoves[move] = simulateNextMoveSquares[field]
            }
        }
    })

    return kingOnCheckAfterThisMoves
}

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
                    initialPositions
                )
            )

            //checked or not
            if (squares[field].onCheck) sounds.check.play()
        }
    }

    if (
        allLegalMoves.length === 1 &&
        allLegalMoves[0].length === 1 &&
        squares[allLegalMoves[0][0]].type === 'King'
    ) {
        return 'stalemate'
    }

    const mated = allLegalMoves.every((legalMoves) => legalMoves.length === 0)

    return mated
}
