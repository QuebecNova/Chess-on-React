import { setupBoard } from 'src/4.features/config/setupBoard'
import {
    getEndCondition,
    playPlacedPieceSound,
} from 'src/4.features/lib/helpers'
import { Fen, Rook, StockfishDifficultyLevels } from 'src/5.entities/lib'
import {
    KeyableSquares,
    NewMove,
    PlayedMove,
    Player,
} from 'src/5.entities/model'
import { Colors, EndCondition, Move, sounds } from 'src/6.shared/model'
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
    OFFLINE: 'OFFLINE',
    END_STATE: 'END_STATE',
    TAKEBACK: 'TAKEBACK',
    VIEW_SQUARES: 'VIEW_SQUARES',
    INCREMENT: 'INCREMENT',
} as const

export type GameActions =
    | {
          type: typeof GameActionTypes.SQUARES
          payload: { squares: KeyableSquares }
      }
    | {
          type: typeof GameActionTypes.TIME_EXPIRED
          payload: { isTimeExpired: boolean; color: Colors }
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
          payload: { promotionMove: Move }
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
          payload: { computerDifficulty: keyof StockfishDifficultyLevels }
      }
    | {
          type: typeof GameActionTypes.OFFLINE
          payload: { isOfflineMode: boolean }
      }
    | {
          type: typeof GameActionTypes.END_STATE
          payload: { condition: EndCondition; color: Colors }
      }
    | {
          type: typeof GameActionTypes.TAKEBACK
          payload: { color: Colors }
      }
    | {
          type: typeof GameActionTypes.VIEW_SQUARES
          payload: { moveIndex: number }
      }
    | {
          type: typeof GameActionTypes.INCREMENT
          payload: { increment: number }
      }

export const reducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.WITH_COMPUTER:
        case GameActionTypes.FEN:
        case GameActionTypes.COMPUTER_DIFFICULTY:
        case GameActionTypes.SQUARES:
        case GameActionTypes.IN_GAME:
        case GameActionTypes.VARIANT:
        case GameActionTypes.TURN:
        case GameActionTypes.PROMOTION_MOVE:
        case GameActionTypes.PLAYED_MOVES:
        case GameActionTypes.OFFLINE:
        case GameActionTypes.INCREMENT:
            return {
                ...state,
                ...action.payload,
            }
        case GameActionTypes.TIME_EXPIRED:
            state.timeExpired = action.payload.isTimeExpired
            state.endState.condition = EndCondition.TimeExpired
            state.endState.color = action.payload.color
            return { ...state }
        case GameActionTypes.SEND_RESTART_REQUEST:
            console.error('Not implemented')
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

            sounds.newGame.play()

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
                endState: { condition: null, color: null },
                promotionMove: null,
                fen: new Fen(setupBoard()).fen,
                vieSquares: null,
            }
        case GameActionTypes.RESET_STORE:
            return getInitialState()
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
        case GameActionTypes.NEW_MOVE:
            if (
                (
                    [
                        EndCondition.Checkmate,
                        EndCondition.Draw,
                        EndCondition.Resign,
                        EndCondition.Stalemate,
                        EndCondition.TimeExpired,
                    ] as EndCondition[]
                ).includes(state.endState.condition)
            )
                return

            playPlacedPieceSound(action.payload.move.isCapture)

            if (action.payload.promotionTo) {
                state.promotionMove = null
            }

            const turn =
                state.turn === Colors.White ? Colors.Black : Colors.White

            const endCondition = getEndCondition(action.payload.squares, turn)

            if (state.isOfflineMode) {
                state.players[state.turn].isCurrentUser = false
                state.players[turn].isCurrentUser = true
            }

            const endState = {
                condition: endCondition,
                color: turn,
            }

            if (
                endCondition === EndCondition.Check ||
                endCondition === EndCondition.Checkmate
            )
                sounds.check.play()

            const playedMove: PlayedMove = {
                ...action.payload.move,
                piece: action.payload.piece,
                takenPiece: action.payload.takenPiece
                    ? action.payload.takenPiece
                    : action.payload.move.isCapture
                      ? state.squares[action.payload.move.to]
                      : null,
                endState,
                castlingSide: action.payload.castlingSide
                    ? action.payload.castlingSide
                    : null,
                promotionTo: action.payload.promotionTo
                    ? action.payload.promotionTo
                    : null,
                isEnpassant: action.payload.isEnpassant ?? false,
                squares: action.payload.squares,
            }
            const playedMoves = [...state.playedMoves, playedMove]

            if (state.increment) {
                state.players[state.turn].timer =
                    state.players[state.turn].timer + state.increment * 1000
            }

            return {
                ...state,
                squares: action.payload.squares,
                playedMoves,
                turn,
                fen: new Fen(action.payload.squares, playedMoves, turn).fen,
                endState,
            }
        case GameActionTypes.END_STATE:
            return { ...state, endState: action.payload }
        case GameActionTypes.TAKEBACK:
            const newSquares = { ...state.squares }
            const lastPlayedMove = state.playedMoves.at(-1)
            if (!lastPlayedMove) return state

            function resetCastling(move: PlayedMove) {
                const [rookField, rook] = Rook.find(
                    newSquares,
                    move.castlingSide,
                    move.piece.color
                )
                if (!rook.lastMoves.at(-1)) return
                newSquares[rookField] = null
                newSquares[rook.lastMoves.at(-1).from] = rook
                rook.lastMoves.pop()
            }

            function resetEnpassant(move: PlayedMove) {
                const lastEnpassantedPawnPlayedMove =
                    move.takenPiece.lastMoves.at(-1)
                if (lastEnpassantedPawnPlayedMove) {
                    newSquares[lastEnpassantedPawnPlayedMove.to] =
                        move.takenPiece
                }
            }

            function resetMove(move: PlayedMove) {
                if (move.isCapture && !move.isEnpassant) {
                    newSquares[move.to] = move.takenPiece
                } else {
                    newSquares[move.to] = null
                }
                newSquares[move.from] = move.piece
                move.piece.lastMoves?.pop()
            }

            if (
                lastPlayedMove.piece.color !== action.payload.color &&
                !state.isOfflineMode
            ) {
                const secondLastPlayedMove = state.playedMoves.at(-2)
                if (lastPlayedMove.castlingSide) {
                    resetCastling(lastPlayedMove)
                }
                if (lastPlayedMove.isEnpassant) {
                    resetEnpassant(lastPlayedMove)
                }
                resetMove(lastPlayedMove)
                if (secondLastPlayedMove) {
                    if (secondLastPlayedMove.castlingSide) {
                        resetCastling(secondLastPlayedMove)
                    }
                    if (secondLastPlayedMove.isEnpassant) {
                        resetEnpassant(secondLastPlayedMove)
                    }
                    resetMove(secondLastPlayedMove)
                } else {
                    state.turn =
                        state.turn === Colors.White
                            ? Colors.Black
                            : Colors.White
                }
                state.playedMoves = state.playedMoves.slice(0, -2)
            } else {
                if (lastPlayedMove.castlingSide) {
                    resetCastling(lastPlayedMove)
                }
                if (lastPlayedMove.isEnpassant) {
                    resetEnpassant(lastPlayedMove)
                }
                resetMove(lastPlayedMove)
                lastPlayedMove.piece.lastMoves.pop()
                state.playedMoves = state.playedMoves.slice(0, -1)
                state.turn =
                    state.turn === Colors.White ? Colors.Black : Colors.White
            }

            state.viewSquares = null

            return { ...state, squares: newSquares }
        case GameActionTypes.VIEW_SQUARES:
            if (action.payload.moveIndex === state.playedMoves.length - 1) {
                state.viewSquares = null
            } else {
                const move = state.playedMoves[action.payload.moveIndex]
                if (move.isCapture || move.isEnpassant) {
                    sounds.takePiece.play()
                } else {
                    sounds.placePiece.play()
                }
                state.viewSquares = move.squares
            }
            return { ...state }
        default:
            return state
    }
}
