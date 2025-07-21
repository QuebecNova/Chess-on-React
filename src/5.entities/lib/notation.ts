import { alphs } from 'src/5.entities/lib'
import { BoardState, CastlingSide, Colors, Pieces } from 'src/6.shared/model'
import { PlayedMove } from '../model'

export const notation = {
    getAlgebraic(move: PlayedMove, moveNumber: number) {
        const pieceType = move.piece.type === Pieces.Pawn ? '' : move.piece.type
        const capture = move.isCapture
            ? move.piece.type === Pieces.Pawn
                ? `${alphs.getAlph(move.from)}x`
                : 'x'
            : ''
        const promotion = move.promotionTo
            ? `=${move.piece.color === Colors.White ? move.promotionTo.type : move.promotionTo.type.toLowerCase()}`
            : ''
        const check = move.boardState === BoardState.Check ? '+' : ''
        if (move.boardState === BoardState.Checkmate) {
            return `${move.piece.color === Colors.White ? '1-0' : '0-1'}`
        }
        if (move.isEnpassant) {
            return `${moveNumber}. ${alphs.getAlph(move.from)}x${move.to}`
        }
        if (move.castlingSide) {
            return `${moveNumber}. ${move.castlingSide === CastlingSide.KingSide ? 'O-O' : 'O-O-O'}`
        }

        return `${moveNumber}. ${pieceType}${capture}${move.from}${promotion}${check}`
    },
} as const
