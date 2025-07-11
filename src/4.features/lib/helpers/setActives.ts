import { KeyableSquares } from "src/5.entities/model/Keyable"

export function addActives(
    moves: Array<string>,
    currentPiece: string,
    setActiveFields: React.Dispatch<React.SetStateAction<KeyableSquares>>
): KeyableSquares {
    //adding available moves on board
    const movesActiveFields = {}
    moves.forEach((move) => {
        movesActiveFields[move] = 'pieceCanMoveHere'
    })
    movesActiveFields[currentPiece] = 'currentPiece'
    setActiveFields({ ...movesActiveFields })
    return movesActiveFields
}

export function removeActives(
    activeFields: KeyableSquares,
    setActiveFields: React.Dispatch<React.SetStateAction<KeyableSquares>>
): void {
    //clear available moves on board
    const clearedActiveFields = {}
    for (const field in activeFields) {
        clearedActiveFields[field] = false
    }
    setActiveFields({ ...clearedActiveFields })
}
