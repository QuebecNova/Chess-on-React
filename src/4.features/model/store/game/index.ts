import { setupBoard } from 'src/4.features/config/setupBoard'
import { Fen } from 'src/5.entities/lib'
import { KeyableSquares, PlayedMove, Player } from 'src/5.entities/model'
import { BoardState, Colors, Move } from 'src/6.shared/model'
import { Dispatch } from 'src/6.shared/model/types/Dispatch'
import { createStore } from 'zustand'
import { devtools, redux } from 'zustand/middleware'
import { GameActions, reducer } from './reducer'
export { GameActionTypes } from './reducer'

export type GameState = {
    id: string | null
    variant: Colors | null
    turn: Colors
    squares: KeyableSquares
    timeExpired: boolean
    isInGame: boolean
    promotionMove: Move | null
    boardState: BoardState | null
    players: {
        [key in Colors]: Player
    }
    playedMoves: PlayedMove[]
    fen: string
}

export type GameStore = GameState & Dispatch<GameActions>

export const getInitialState = (): GameState => ({
    id: null,
    variant: Colors.White,
    promotionMove: null,
    turn: Colors.White,
    squares: setupBoard(),
    timeExpired: false,
    isInGame: false,
    boardState: null,
    players: {
        [Colors.Black]: new Player(Colors.Black, false, false),
        [Colors.White]: new Player(Colors.White, false, false),
    },
    playedMoves: [],
    fen: new Fen(setupBoard()).fen,
})

export const createGameStore = () =>
    createStore<GameStore>()(
        devtools(redux(reducer, getInitialState()), {
            name: 'game-store',
        })
    )
