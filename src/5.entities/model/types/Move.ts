import { IPiece, KeyableSquares } from 'src/5.entities/model'
import { CastlingSide, Colors, EndCondition, Move } from 'src/6.shared/model'

export type PlayedMove = Move & {
    piece: IPiece
    takenPiece: IPiece | null
    castlingSide: CastlingSide | null
    promotionTo: IPiece | null
    endState: {
        condition: EndCondition | null
        color: Colors | null
    }
    isEnpassant: boolean
    squares: KeyableSquares
}

export type Premove = Move & { promotionTo?: IPiece; piece: IPiece }
