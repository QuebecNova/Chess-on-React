import { setupBoard } from 'src/4.features/config/setupBoard'
import { KeyableSquares, Player } from 'src/5.entities/model'
import { Colors } from 'src/6.shared/model'
import { GameState } from '.'

export const GameActionTypes = {
    SQUARES: 'SQUARES',
    IS_TIMER_SET: 'IS_TIMER_SET',
    TIME_EXPIRED: 'TIME_EXPIRED',
    SETTINGS_READY: 'SETTINGS_READY',
    SEND_RESTART_REQUEST: 'SEND_RESTART_REQUEST',
    VARIANT: 'VARIANT',
    TURN: 'TURN',
    IN_GAME: 'IM_GAME',
    RESTART_GAME: 'RESTART_GAME',
    PLAYED_MOVES: 'PLAYED_MOVES',
    ADD_MOVE: 'ADD_MOVE',
    PLAYER: 'PLAYER',
    PROMOTED_FIELD: 'PROMOTED_FIELD',
} as const

export type GameActions =
    | {
          type: typeof GameActionTypes.SQUARES
          payload: { squares: KeyableSquares }
      }
    | {
          type: typeof GameActionTypes.IS_TIMER_SET
          payload: { isTimerSet: boolean }
      }
    | {
          type: typeof GameActionTypes.TIME_EXPIRED
          payload: { isTimeExpired: boolean }
      }
    | {
          type: typeof GameActionTypes.SETTINGS_READY
          payload: { isSettingsReady: boolean }
      }
    | {
          type: typeof GameActionTypes.IN_GAME
          payload: { isInGame: boolean }
      }
    | {
          type: typeof GameActionTypes.SEND_RESTART_REQUEST
      }
    | {
          type: typeof GameActionTypes.VARIANT
          payload: { variant: Colors }
      }
    | {
          type: typeof GameActionTypes.TURN
          payload: { turn: Colors }
      }
    | {
          type: typeof GameActionTypes.RESTART_GAME
      }
    | {
          type: typeof GameActionTypes.PLAYED_MOVES
          payload: { moves: string[] }
      }
    | {
          type: typeof GameActionTypes.ADD_MOVE
          payload: { move: string }
      }
    | {
          type: typeof GameActionTypes.PLAYER
          payload: { color: Colors; player: Player }
      }
    | {
          type: typeof GameActionTypes.PROMOTED_FIELD
          payload: { promotedField: string }
      }

export const reducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.SQUARES:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.IS_TIMER_SET:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.TIME_EXPIRED:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.SETTINGS_READY:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.IN_GAME:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.SEND_RESTART_REQUEST:
            console.error('Not implemented')
            return state
        case GameActionTypes.VARIANT:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.TURN:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.RESTART_GAME:
            //changing players colors
            if (state.players[Colors.Black].isCurrentUser) {
                state.players[Colors.Black].isCurrentUser = false
                state.players[Colors.White].isCurrentUser = true
            } else if (state.players[Colors.White].isCurrentUser) {
                state.players[Colors.White].isCurrentUser = false
                state.players[Colors.Black].isCurrentUser = true
            }

            state.players[Colors.Black].timer = 60000
            state.players[Colors.White].timer = 60000

            return {
                ...state,
                squares: setupBoard(),
                playedMoves: [],
                timeExpired: false,
                isTimerSet: false,
                turn: Colors.White,
                variant:
                    state.variant === Colors.White
                        ? Colors.Black
                        : Colors.White,
            }
        case GameActionTypes.PLAYED_MOVES:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.PLAYER:
            state[action.payload.color] = action.payload.player
            return state
        case GameActionTypes.ADD_MOVE:
            state.playedMoves.push(action.payload.move)
            return state
        case GameActionTypes.PROMOTED_FIELD:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
