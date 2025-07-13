import { Dispatch } from 'src/6.shared/model/types/Dispatch'
import { createStore } from 'zustand'
import { devtools, persist, redux } from 'zustand/middleware'
import { GameActions, reducer } from './reducer'
export { GameActionTypes } from './reducer'

export type GameState = {
    id: string | null
}

export type GameStore = GameState & Dispatch<GameActions>

const initialState: GameState = {
    id: null,
}

export const createGameStore = () => createStore<GameStore>()(
    devtools(
        persist(redux(reducer, initialState), {
            name: 'game-store',
        })
    )
)
