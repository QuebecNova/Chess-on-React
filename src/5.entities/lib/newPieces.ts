import { Colors, Pieces } from 'src/6.shared/model'
import { Bishop } from './figures/bishop'
import { Knight } from './figures/knight'
import { Queen } from './figures/queen'
import { Rook } from './figures/rook'

export const NewPieces = {
    [Pieces.Rook]: (color: Colors) => new Rook(color),
    [Pieces.Queen]: (color: Colors) => new Queen(color),
    [Pieces.Knight]: (color: Colors) => new Knight(color),
    [Pieces.Bishop]: (color: Colors) => new Bishop(color),
} as const
