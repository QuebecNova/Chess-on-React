export const Colors = {
    White: 'white',
    Black: 'black',
}
export type Colors = (typeof Colors)[keyof typeof Colors]

export const Fields = {
    BlackField: 'blackField',
    WhiteField: 'whiteField',
}
export type Fields = (typeof Fields)[keyof typeof Fields]

export const FieldStates = {
    PieceCanMoveHere: 'pieceCanMoveHere',
    CurrentPiece: 'currentPiece',
}
export type FieldStates = (typeof FieldStates)[keyof typeof FieldStates]

export const Moves = {
    CastleRight: 'castleRight',
    CastleLeft: 'castleLeft',
    Enpassant: 'enpassant',
    EnpassantLeft: 'enpassantLeft',
    EnpassantRight: 'enpassantRight',
}
export type Moves = (typeof Moves)[keyof typeof Moves]

export const Pieces = {
    King: 'King',
    Queen: 'Queen',
    Rook: 'Rook',
    Bishop: 'Bishop',
    Knight: 'Knight',
    Pawn: 'Pawn',
}
export type Pieces = (typeof Pieces)[keyof typeof Pieces]

export const BoardState = {
    Stalemate: 'stalemate',
    Mate: 'mate',
    Draw: 'draw',
}
export type BoardState = (typeof BoardState)[keyof typeof BoardState]

export const Directions = {
    Right: 'right',
    Left: 'left',
}
export type Directions = (typeof Directions)[keyof typeof Directions]

export const Operators = {
    Forward: 'forward',
    Backward: 'backward',
} as const
export type Operators = (typeof Operators)[keyof typeof Operators]
