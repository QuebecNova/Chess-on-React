import { ValueOf } from '../types/ValueOf'

export const Colors = {
    White: 'white',
    Black: 'black',
} as const
export type Colors = ValueOf<typeof Colors>

export const Fields = {
    BlackField: 'blackField',
    WhiteField: 'whiteField',
} as const
export type Fields = ValueOf<typeof Fields>

export const FieldStates = {
    PieceCanMoveHere: 'pieceCanMoveHere',
    CurrentPiece: 'currentPiece',
} as const
export type FieldStates = ValueOf<typeof FieldStates>

export const Moves = {
    CastleRight: 'castleRight',
    CastleLeft: 'castleLeft',
    Enpassant: 'enpassant',
    EnpassantLeft: 'enpassantLeft',
    EnpassantRight: 'enpassantRight',
} as const
export type Moves = ValueOf<typeof Moves>

export const Pieces = {
    King: 'K',
    Queen: 'Q',
    Rook: 'R',
    Bishop: 'B',
    Knight: 'N',
    Pawn: 'P',
} as const
export type Pieces = ValueOf<typeof Pieces>

export const BoardState = {
    Stalemate: 'stalemate',
    Checkmate: 'Checkmate',
    Draw: 'draw',
    Check: 'check',
} as const
export type BoardState = ValueOf<typeof BoardState>

export const Directions = {
    Right: 'right',
    Left: 'left',
} as const
export type Directions = ValueOf<typeof Directions>

export const Operators = {
    Forward: 'forward',
    Backward: 'backward',
} as const
export type Operators = ValueOf<typeof Operators>

export const CastlingSide = {
    QueenSide: 'queenSide',
    KingSide: 'kingSide',
} as const
export type CastlingSide = ValueOf<typeof CastlingSide>
