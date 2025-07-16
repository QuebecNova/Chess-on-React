import { IPiece } from 'src/5.entities/model'
import { Moves, Pieces } from 'src/6.shared/model'

export function setEnpassant(
    moves: Array<string>,
    piece: IPiece,
    setEnpassantAvailable: React.Dispatch<React.SetStateAction<string>>
) {
    if (
        moves.length &&
        piece.type === Pieces.Pawn &&
        moves.slice().pop().includes(Moves.Enpassant)
    ) {
        setEnpassantAvailable(moves.slice().pop())
    }
}

export function setCastle(
    moves: Array<string>,
    piece: IPiece,
    setCastleAvailable: React.Dispatch<React.SetStateAction<string[]>>
) {
    if (moves.length && piece.type === Pieces.King) {
        const castleOnThisSides: Array<string> = []
        if (moves.includes(Moves.CastleRight))
            castleOnThisSides.push(Moves.CastleRight)
        if (moves.includes(Moves.CastleLeft))
            castleOnThisSides.push(Moves.CastleLeft)
        setCastleAvailable(castleOnThisSides)
    }
}
