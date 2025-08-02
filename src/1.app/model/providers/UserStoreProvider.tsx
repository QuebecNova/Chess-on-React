'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { createUserStore, UserStore } from 'src/4.features/model/store'
import { useStore } from 'zustand'

export type UserStoreApi = ReturnType<typeof createUserStore>

export const UserStoreContext = createContext<UserStoreApi | undefined>(
    undefined
)

export interface UserStoreProviderProps {
    children: ReactNode
}

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
    const storeRef = useRef<UserStoreApi | null>(null)
    if (storeRef.current === null) {
        storeRef.current = createUserStore()
    }

    return (
        <UserStoreContext.Provider value={storeRef.current}>
            {children}
        </UserStoreContext.Provider>
    )
}

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
    const userStoreContext = useContext(UserStoreContext)

    if (!userStoreContext) {
        throw new Error(`useUserStore must be used within UserStoreProvider`)
    }

    return useStore(userStoreContext, selector)
}
