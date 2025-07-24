import { Piece } from 'src/5.entities/lib/figures/piece'
import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { CastlingSide, Colors, EndCondition, Move } from 'src/6.shared/model'

export type PlayedMove = Move & {
    piece: IPiece
    takenPiece: IPiece | null
    castlingSide: CastlingSide | null
    promotionTo: Piece | null
    endState: {
        condition: EndCondition | null
        color: Colors | null
    }
    isEnpassant: boolean
    squares: KeyableSquares
}

export type NewMove = {
    squares: KeyableSquares
    move: Move
    piece: Piece
    takenPiece: IPiece | null
    promotionTo?: Piece | null
    isEnpassant?: boolean
    castlingSide?: CastlingSide
}
