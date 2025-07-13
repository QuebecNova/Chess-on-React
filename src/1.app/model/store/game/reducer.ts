import { GameState } from '.'

export const GameActionTypes = {
    START: 'START',
} as const

export type GameActions = {
    type: typeof GameActionTypes.START
    payload: { id: string }
}

export const reducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.START:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
