import { keyableSquares } from "../../interfaces/keyable"

export function addActives(moves : Array<string>, currentPiece : string, setActiveFields : React.Dispatch<React.SetStateAction<keyableSquares>>) : keyableSquares {
    const movesActiveFields = {}
    moves.forEach((move) => {
        movesActiveFields[move] = 'pieceCanMoveHere'
    })
    movesActiveFields[currentPiece] = 'currentPiece'
    setActiveFields({...movesActiveFields})
    return movesActiveFields
}

export function removeActives(activeFields : keyableSquares, setActiveFields : React.Dispatch<React.SetStateAction<keyableSquares>>) : void {
    const clearedActiveFields = {}
    for (const field in activeFields) {
        clearedActiveFields[field] = false
    }
    setActiveFields({...clearedActiveFields})
}