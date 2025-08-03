import { setupBoard } from 'src/4.features/config/setupBoard'
import { Chessboard, Fen, StockfishDifficultyLevels } from 'src/5.entities/lib'
import {
    KeyableSquares,
    PlayedMove,
    Player,
    Premove,
} from 'src/5.entities/model'
import { Colors, EndCondition, Move } from 'src/6.shared/model'
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
    promotionMove: (Move & { premove?: boolean }) | null
    endState: {
        condition: EndCondition | null
        color: Colors | null
    }
    initTimer: number
    increment: number
    players: {
        [key in Colors]: Player
    }
    playedMoves: PlayedMove[]
    fen: string
    withComputer: boolean
    computerDifficulty: keyof StockfishDifficultyLevels
    isOfflineMode: boolean
    viewSquares: KeyableSquares | null
    premoves: Premove[] //queue
    premovedSquares: KeyableSquares
    chessboard: Chessboard
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
    endState: {
        condition: null,
        color: null,
    },
    initTimer: 300000,
    increment: 1,
    players: {
        [Colors.Black]: new Player(Colors.Black, false, false),
        [Colors.White]: new Player(Colors.White, false, true),
    },
    playedMoves: [],
    fen: new Fen(setupBoard()).fen,
    withComputer: false,
    computerDifficulty: 1,
    isOfflineMode: false,
    viewSquares: null,
    premoves: [],
    premovedSquares: {},
    chessboard: new Chessboard({ squares: setupBoard() }),
})

export const createGameStore = () =>
    createStore<GameStore>()(
        devtools(redux(reducer, getInitialState()), {
            name: 'game-store',
        })
    )
