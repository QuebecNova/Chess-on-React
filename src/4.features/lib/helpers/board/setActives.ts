import { ActiveFields } from 'src/4.features/model'
import { FieldStates } from 'src/6.shared/model'

export function addActives(
    moves: Array<string>,
    currentPiece: string,
    setActiveFields: React.Dispatch<React.SetStateAction<ActiveFields>>
): ActiveFields {
    //adding available moves on board
    const movesActiveFields: ActiveFields = {}
    moves.forEach((move) => {
        movesActiveFields[move] = FieldStates.PieceCanMoveHere
    })
    movesActiveFields[currentPiece] = FieldStates.CurrentPiece
    setActiveFields({ ...movesActiveFields })
    return movesActiveFields
}

export function removeActives(
    activeFields: ActiveFields,
    setActiveFields: React.Dispatch<React.SetStateAction<ActiveFields>>
): void {
    //clear available moves on board
    const clearedActiveFields: ActiveFields = {}
    for (const field in activeFields) {
        clearedActiveFields[field] = null
    }
    setActiveFields({ ...clearedActiveFields })
}
