import { InitialState, UserState } from '.'

export const UserActionTypes = {
    AUTH: 'AUTH',
    LOGOUT: 'LOGOUT',
} as const

export type UserActions =
    | {
          type: typeof UserActionTypes.AUTH
          payload: { email: string }
      }
    | { type: typeof UserActionTypes.LOGOUT }

export const reducer = (state: UserState, action: UserActions) => {
    switch (action.type) {
        case UserActionTypes.AUTH:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                error: null,
            }
        case UserActionTypes.LOGOUT:
            return {
                ...InitialState,
            }
        default:
            return state
    }
}
