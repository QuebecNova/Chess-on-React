import { Piece } from 'src/5.entities/lib/figures/piece'
import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { BoardState, CastlingSide, Move } from 'src/6.shared/model'

export type PlayedMove = Move & {
    piece: IPiece
    castlingSide: CastlingSide | null
    promotionTo: Piece | null
    boardState: BoardState | null
    isEnpassant: boolean
}

export type NewMove = {
    squares: KeyableSquares
    move: Move
    piece: Piece
    promotionTo?: Piece | null
    isEnpassant?: boolean
    castlingSide?: CastlingSide
}
