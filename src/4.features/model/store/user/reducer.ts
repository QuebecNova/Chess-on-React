import { InitialState, UserState } from '.'

export const UserActionTypes = {
    SIGN_IN: 'SIGN_IN',
    LOGOUT: 'LOGOUT',
} as const

export type UserActions =
    | {
          type: typeof UserActionTypes.SIGN_IN
          payload: { email: string; username?: string; profilePicture: string }
      }
    | { type: typeof UserActionTypes.LOGOUT }

export const reducer = (state: UserState, action: UserActions) => {
    switch (action.type) {
        case UserActionTypes.SIGN_IN:
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
