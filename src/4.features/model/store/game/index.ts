import { setupBoard } from 'src/4.features/config/setupBoard'
import { KeyableSquares, Player } from 'src/5.entities/model'
import { Colors } from 'src/6.shared/model'
import { Dispatch } from 'src/6.shared/model/types/Dispatch'
import { createStore } from 'zustand'
import { devtools, persist, redux } from 'zustand/middleware'
import { GameActions, reducer } from './reducer'
export { GameActionTypes } from './reducer'

export type GameState = {
    id: string | null
    variant: Colors | null
    turn: Colors
    squares: KeyableSquares
    timeExpired: boolean
    isTimerSet: boolean
    isInGame: boolean
    isSettingsReady: boolean
    promotedField: string | null
    players: {
        [key: Colors]: Player
    }
    playedMoves: string[]
}

export type GameStore = GameState & Dispatch<GameActions>

const initialState: GameState = {
    id: null,
    variant: null,
    promotedField: null,
    turn: Colors.White,
    squares: setupBoard(),
    isSettingsReady: false,
    timeExpired: false,
    isInGame: false,
    isTimerSet: false,
    players: {
        [Colors.Black]: new Player(Colors.Black, false, false),
        [Colors.White]: new Player(Colors.White, false, false),
    },
    playedMoves: [],
}

export const createGameStore = () =>
    createStore<GameStore>()(
        devtools(
            redux(reducer, initialState), {
                name: 'game-store',
            }
        )
    )
