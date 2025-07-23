import { setupBoard } from 'src/4.features/config/setupBoard'
import { getBoardState } from 'src/4.features/lib/helpers'
import { Fen, StockfishDifficultyLevels } from 'src/5.entities/lib'
import {
    KeyableSquares,
    NewMove,
    PlayedMove,
    Player,
} from 'src/5.entities/model'
import { BoardState, Colors, Move, sounds } from 'src/6.shared/model'
import { GameState, getInitialState } from '.'

export const GameActionTypes = {
    SQUARES: 'SQUARES',
    TIME_EXPIRED: 'TIME_EXPIRED',
    SEND_RESTART_REQUEST: 'SEND_RESTART_REQUEST',
    VARIANT: 'VARIANT',
    PLAYING_SIDE: 'PLAYING_SIDE',
    TURN: 'TURN',
    IN_GAME: 'IN_GAME',
    RESTART_GAME: 'RESTART_GAME',
    RESET_STORE: 'RESET_STORE',
    PLAYED_MOVES: 'PLAYED_MOVES',
    ADD_MOVE: 'ADD_MOVE',
    PLAYER: 'PLAYER',
    TIMERS: 'TIMERS',
    TIMER: 'TIMER',
    PROMOTION_MOVE: 'PROMOTION_MOVE',
    FEN: 'FEN',
    NEW_MOVE: 'NEW_MOVE',
    WITH_COMPUTER: 'WITH_COMPUTER',
    COMPUTER_DIFFICULTY: 'COMPUTER_DIFFICULTY',
} as const

export type GameActions =
    | {
          type: typeof GameActionTypes.SQUARES
          payload: { squares: KeyableSquares }
      }
    | {
          type: typeof GameActionTypes.TIME_EXPIRED
          payload: { isTimeExpired: boolean }
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
          type: typeof GameActionTypes.PLAYING_SIDE
          payload: { side: Colors }
      }
    | {
          type: typeof GameActionTypes.TURN
          payload: { turn: Colors }
      }
    | {
          type: typeof GameActionTypes.RESTART_GAME
      }
    | {
          type: typeof GameActionTypes.RESET_STORE
      }
    | {
          type: typeof GameActionTypes.PLAYED_MOVES
          payload: { moves: PlayedMove[] }
      }
    | {
          type: typeof GameActionTypes.ADD_MOVE
          payload: { move: PlayedMove }
      }
    | {
          type: typeof GameActionTypes.PLAYER
          payload: { color: Colors; player: Player }
      }
    | {
          type: typeof GameActionTypes.TIMERS
          payload: { timer: number }
      }
    | {
          type: typeof GameActionTypes.TIMER
          payload: { playerColor: Colors; timer: number }
      }
    | {
          type: typeof GameActionTypes.PROMOTION_MOVE
          payload: { move: Move }
      }
    | {
          type: typeof GameActionTypes.FEN
          payload: { fen: string }
      }
    | {
          type: typeof GameActionTypes.NEW_MOVE
          payload: NewMove
      }
    | {
          type: typeof GameActionTypes.WITH_COMPUTER
          payload: { withComputer: boolean }
      }
    | {
          type: typeof GameActionTypes.COMPUTER_DIFFICULTY
          payload: { computerDifficulty: StockfishDifficultyLevels }
      }

export const reducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.SQUARES:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.TIME_EXPIRED:
            state.timeExpired = action.payload.isTimeExpired
            state.boardState = BoardState.TimeExpired
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
            state.variant = action.payload.variant
            return state
        case GameActionTypes.PLAYING_SIDE:
            state.variant = action.payload.side
            state.players[action.payload.side].isCurrentUser = true
            state.players[
                action.payload.side === Colors.Black
                    ? Colors.White
                    : Colors.Black
            ].isCurrentUser = false
            return state
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

            state.players[Colors.Black].timer = state.initTimer
            state.players[Colors.White].timer = state.initTimer

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
                boardState: null,
                promotionMove: null,
                fen: new Fen(setupBoard()).fen,
            }
        case GameActionTypes.RESET_STORE:
            return getInitialState()
        case GameActionTypes.PLAYED_MOVES:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.PLAYER:
            state.players[action.payload.color] = action.payload.player
            return state
        case GameActionTypes.TIMERS:
            state.players[Colors.White].timer = action.payload.timer
            state.players[Colors.Black].timer = action.payload.timer
            state.initTimer = action.payload.timer
            return state
        case GameActionTypes.TIMER:
            state.players[action.payload.playerColor].timer =
                action.payload.timer
            return state
        case GameActionTypes.ADD_MOVE:
            return {
                ...state,
                playedMoves: [...state.playedMoves, action.payload.move],
            }
        case GameActionTypes.PROMOTION_MOVE:
            state.promotionMove = action.payload.move
            return state
        case GameActionTypes.NEW_MOVE:
            if (action.payload.promotionTo) {
                state.promotionMove = null
            }

            const turn =
                state.turn === Colors.White ? Colors.Black : Colors.White

            const boardState = getBoardState(action.payload.squares, turn)

            if (
                boardState === BoardState.Check ||
                boardState === BoardState.Checkmate
            )
                sounds.check.play()

            const playedMove: PlayedMove = {
                ...action.payload.move,
                piece: action.payload.piece,
                boardState,
                castlingSide: action.payload.castlingSide
                    ? action.payload.castlingSide
                    : null,
                promotionTo: action.payload.promotionTo
                    ? action.payload.promotionTo
                    : null,
                isEnpassant: action.payload.isEnpassant ?? false,
            }
            const playedMoves = [...state.playedMoves, playedMove]

            return {
                ...state,
                squares: action.payload.squares,
                playedMoves,
                turn,
                fen: new Fen(action.payload.squares, playedMoves, turn).fen,
                boardState,
            }
        case GameActionTypes.FEN:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.WITH_COMPUTER:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.COMPUTER_DIFFICULTY:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
