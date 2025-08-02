import { Dispatch } from 'src/6.shared/model/types/Dispatch'
import { createStore } from 'zustand'
import { devtools, persist, redux } from 'zustand/middleware'
import { reducer, UserActions } from './reducer'
export { UserActionTypes } from './reducer'

export type UserState = {
    isAuthenticated: boolean
    id: string | null
    username: string | null
    email: string | null
    profilePicture: string | null
    token: string | null
    error: string | null
    loading: boolean
}

export type UserStore = UserState & Dispatch<UserActions>

export const InitialState: UserState = {
    isAuthenticated: false,
    id: null,
    username: null,
    email: null,
    profilePicture: null,
    token: null,
    error: null,
    loading: false,
}

export const createUserStore = () =>
    createStore<UserStore>()(
        devtools(
            persist(redux(reducer, InitialState), {
                name: 'user-store',
            })
        )
    )
