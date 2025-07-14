import { ValueOf } from '../types/ValueOf'

export const Colors = {
    White: 'white',
    Black: 'black',
}
export type Colors = ValueOf<typeof Colors>

export const Fields = {
    BlackField: 'blackField',
    WhiteField: 'whiteField',
}
export type Fields = ValueOf<typeof Fields>

export const FieldStates = {
    PieceCanMoveHere: 'pieceCanMoveHere',
    CurrentPiece: 'currentPiece',
}
export type FieldStates = ValueOf<typeof FieldStates>

export const Moves = {
    CastleRight: 'castleRight',
    CastleLeft: 'castleLeft',
    Enpassant: 'enpassant',
    EnpassantLeft: 'enpassantLeft',
    EnpassantRight: 'enpassantRight',
}
export type Moves = ValueOf<typeof Moves>

export const Pieces = {
    King: 'King',
    Queen: 'Queen',
    Rook: 'Rook',
    Bishop: 'Bishop',
    Knight: 'Knight',
    Pawn: 'Pawn',
}
export type Pieces = ValueOf<typeof Pieces>

export const BoardState = {
    Stalemate: 'stalemate',
    Mate: 'mate',
    Draw: 'draw',
}
export type BoardState = ValueOf<typeof BoardState>

export const Directions = {
    Right: 'right',
    Left: 'left',
}
export type Directions = ValueOf<typeof Directions>

export const Operators = {
    Forward: 'forward',
    Backward: 'backward',
} as const
export type Operators = ValueOf<typeof Operators>
