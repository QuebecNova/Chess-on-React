import { alphs, Bishop, Knight, Queen, Rook } from 'src/5.entities/lib'
import {
    CastlingSide,
    Colors,
    EndCondition,
    Operators,
    Pieces,
} from 'src/6.shared/model'
import { KeyableSquares, NewMove, PlayedMove } from '../model'

export const notation = {
    //e4
    //https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
    getShortAlgebraic(move: PlayedMove, moveNumber: number) {
        const pieceType = move.piece.type === Pieces.Pawn ? '' : move.piece.type
        const capture = move.isCapture
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
    ): NewMove & { isCapture: boolean } {
        const from = move.slice(0, 2)
        const to = move.slice(2, 4)
        const promotionToStr = move.slice(4, 5).toUpperCase()
        const fromCol = alphs.posIn[alphs.getAlph(from)]
        const toCol = alphs.posIn[alphs.getAlph(to)]
        const piece = squares[from]
        const piecesOnField: KeyableSquares = {
            [from]: null,
            [to]: piece,
        }
        let isCapture = !!squares[to]
        let takenPiece = isCapture ? squares[to] : null
        let castlingSide: CastlingSide = null
        let isEnpassant = false
        let promotionTo = null

        if (piece.type === Pieces.King) {
            const isQueenSideCastling = fromCol - toCol === 2
            const isKingSideCastling = fromCol - toCol === -2

            let rookNewField: string = null
            if (isQueenSideCastling) {
                castlingSide = CastlingSide.QueenSide
                const [rookOldField, rook] = Rook.find(
                    squares,
                    CastlingSide.QueenSide,
                    piece.color
                )
                if (rook) {
                    rookNewField = alphs.changeAlphPos(
                        rookOldField,
                        Operators.Forward,
                        3
                    )
                    rook.addMove({
                        from: rookOldField,
                        to: rookNewField,
                        isCapture: false,
                    })
                    piecesOnField[rookOldField] = null
                    piecesOnField[rookNewField] = rook
                }
            }
            if (isKingSideCastling) {
                castlingSide = CastlingSide.KingSide
                const [rookOldField, rook] = Rook.find(
                    squares,
                    CastlingSide.KingSide,
                    piece.color
                )
                if (rook) {
                    rookNewField = alphs.changeAlphPos(
                        rookOldField,
                        Operators.Backward,
                        2
                    )
                    rook.addMove({
                        from: rookOldField,
                        to: rookNewField,
                        isCapture: false,
                    })
                    piecesOnField[rookOldField] = null
                    piecesOnField[rookNewField] = rook
                }
            }
        }

        if (piece.type === Pieces.Pawn && playedMoves.length) {
            const lastPlayedMove = playedMoves.at(-1)
            const lastMoveFromNum = alphs.getNum(lastPlayedMove?.from)
            const lastMoveToNum = alphs.getNum(lastPlayedMove?.to)

            const isPromotion = promotionToStr.length
            isEnpassant =
                Math.abs(fromCol - toCol) === 1 &&
                lastPlayedMove?.piece?.type === Pieces.Pawn &&
                Math.abs(lastMoveFromNum - lastMoveToNum) === 2 &&
                [
                    alphs.changeAlphPos(from, Operators.Forward, 1),
                    alphs.changeAlphPos(from, Operators.Backward, 1),
                ].includes(lastPlayedMove?.to)

            if (isEnpassant) {
                takenPiece = piecesOnField[lastPlayedMove.to]
                piecesOnField[lastPlayedMove.to] = null
                isCapture = true
            }

            if (isPromotion) {
                const newPieces = {
                    [Pieces.Rook]: () => new Rook(piece.color),
                    [Pieces.Queen]: () => new Queen(piece.color),
                    [Pieces.Knight]: () => new Knight(piece.color),
                    [Pieces.Bishop]: () => new Bishop(piece.color),
                }
                promotionTo = newPieces[promotionToStr]()
                piecesOnField[to] = promotionTo
            }
        }

        return {
            squares: {
                ...squares,
                ...piecesOnField,
            },
            move: { from, to, isCapture },
            piece,
            takenPiece,
            promotionTo,
            isEnpassant,
            castlingSide,
            isCapture,
        }
    },
} as const
