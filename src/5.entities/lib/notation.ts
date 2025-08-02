import { alphs } from 'src/5.entities/lib'
import {
    CastlingSide,
    Colors,
    EndCondition,
    Move,
    Pieces,
} from 'src/6.shared/model'
import { IPiece, KeyableSquares, PlayedMove } from '../model'
import { NewPieces } from './newPieces'

export const notation = {
    //e4
    //https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
    getShortAlgebraic(move: PlayedMove, moveNumber: number) {
        const pieceType = move.piece.type === Pieces.Pawn ? '' : move.piece.type
        const capture = !!move.takenPiece
            ? move.piece.type === Pieces.Pawn
                ? `${alphs.getAlph(move.from)}x`
                : 'x'
            : ''
        const promotion = move.promotionTo
            ? `=${move.piece.color === Colors.White ? move.promotionTo.type : move.promotionTo.type.toLowerCase()}`
            : ''
        const check = move.endState.condition === EndCondition.Check ? '+' : ''
        if (move.endState.condition === EndCondition.Checkmate) {
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

    //e2e4
    parseLongAlgebraic(
        squares: KeyableSquares,
        playedMoves: PlayedMove[],
        move: string
    ): Move & { promotionTo: IPiece } {
        const from = move.slice(0, 2)
        const to = move.slice(2, 4)
        const promotionToStr = move
            .slice(4, 5)
            .toUpperCase() as keyof typeof NewPieces
        const piece = squares[from]
        let promotionTo = null

        if (piece.type === Pieces.Pawn && playedMoves.length) {
            const isPromotion = promotionToStr.length

            if (isPromotion) {
                promotionTo = NewPieces[promotionToStr](piece.color)
            }
        }

        return {
            from,
            to,
            promotionTo,
        }
    },
} as const
