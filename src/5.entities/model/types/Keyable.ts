import { IPiece } from './IPiece'

export interface KeyableSquares {
    [key: string]: IPiece | null
}

export interface KeyablePieceOnField {
    [key: string]: IPiece | null
}

export interface Keyable<T> {
    [key: string]: T
}
