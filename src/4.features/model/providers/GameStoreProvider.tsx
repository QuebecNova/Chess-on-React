'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createGameStore, GameStore } from '../store/game'

export type GameStoreApi = ReturnType<typeof createGameStore>

export const GameStoreContext = createContext<GameStoreApi | undefined>(
    undefined
)

export interface GameStoreProviderProps {
    children: ReactNode
}

export const GameStoreProvider = ({ children }: GameStoreProviderProps) => {
    const storeRef = useRef<GameStoreApi | null>(null)
    if (storeRef.current === null) {
        storeRef.current = createGameStore()
    }

    return (
        <GameStoreContext.Provider value={storeRef.current}>
            {children}
        </GameStoreContext.Provider>
    )
}

export const useGameStore = <T,>(selector: (store: GameStore) => T): T => {
    const gameStoreContext = useContext(GameStoreContext)

    if (!gameStoreContext) {
        throw new Error(`useGameStore must be used within GameStoreProvider`)
    }

    return useStore(gameStoreContext, selector)
}
