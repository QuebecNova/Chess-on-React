import { Piece } from 'src/5.entities/lib/figures/piece'
import { IPiece } from 'src/5.entities/model'
import { BoardState, CastlingSide, Move } from 'src/6.shared/model'

export type PlayedMove = Move & {
    piece: IPiece
    castlingSide: CastlingSide | null
    promotionTo: Piece | null
    boardState: BoardState | null
    isEnpassant: boolean
}
