import { playPlacedPieceSound } from 'src/4.features/lib/helpers'
import { Chessboard, Fen, StockfishDifficultyLevels } from 'src/5.entities/lib'
import {
    IPiece,
    KeyableSquares,
    PlayedMove,
    Player,
    Premove,
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
    PREMOVE: 'PREMOVE',
    RESET_PREMOVES: 'RESET_PREMOVES',
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
          payload: { promotionMove: Move & { premove?: boolean } }
      }
    | {
          type: typeof GameActionTypes.FEN
          payload: { fen: string }
      }
    | {
          type: typeof GameActionTypes.NEW_MOVE
          payload: Move & { promotionTo?: IPiece }
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
    | {
          type: typeof GameActionTypes.PREMOVE
          payload: Omit<Premove, 'piece'>
      }
    | {
          type: typeof GameActionTypes.RESET_PREMOVES
      }

export const reducer = (state: GameState, action: GameActions) => {
    switch (action.type) {
        case GameActionTypes.WITH_COMPUTER:
        case GameActionTypes.FEN:
        case GameActionTypes.COMPUTER_DIFFICULTY:
        case GameActionTypes.SQUARES:
        case GameActionTypes.IN_GAME:
        case GameActionTypes.TURN:
        case GameActionTypes.PROMOTION_MOVE:
        case GameActionTypes.PLAYED_MOVES:
        case GameActionTypes.VARIANT:
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
            state.chessboard.setupBoard(action.payload.side)
            return state
        case GameActionTypes.RESTART_GAME:
            //changing players colors
            const newState = getInitialState()
            if (state.players[Colors.Black].isCurrentUser) {
                newState.players[Colors.Black].isCurrentUser = false
                newState.players[Colors.White].isCurrentUser = true
            } else if (state.players[Colors.White].isCurrentUser) {
                newState.players[Colors.White].isCurrentUser = false
                newState.players[Colors.Black].isCurrentUser = true
            }

            newState.players[Colors.Black].timer = newState.initTimer
            newState.players[Colors.White].timer = newState.initTimer
            newState.variant =
                state.variant === Colors.White ? Colors.Black : Colors.White
            if (state.withComputer) {
                newState.withComputer = true
            }
            if (state.isOfflineMode) {
                newState.isOfflineMode = true
            }
            newState.isInGame = true
            state.chessboard.setupBoard(newState.variant)
            newState.chessboard = state.chessboard
            sounds.newGame.play()
            return {
                ...newState,
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
            let localState = state

            function playNewMove(
                newState: GameState,
                action: { payload: Move & { promotionTo?: IPiece } },
                premove?: true
            ) {
                if (!localState.premoves.length) {
                    localState.premovedSquares = {}
                }

                const result = state.chessboard.move(
                    action.payload.from,
                    action.payload.to,
                    action.payload.promotionTo
                )

                if (result.invalid || !result.playedMove) {
                    localState.premoves = []
                    localState.premovedSquares = {}
                    return
                }

                if (
                    result.playedMove.takenPiece &&
                    state.premovedSquares[result.playedMove.to]
                ) {
                    localState.premoves = []
                    localState.premovedSquares = {}
                }

                const newSquares = state.chessboard.squares

                playPlacedPieceSound(!!result.playedMove.takenPiece)

                if (action.payload.promotionTo || state.promotionMove) {
                    newState.promotionMove = null
                }

                const turn =
                    newState.turn === Colors.White ? Colors.Black : Colors.White

                const endCondition = state.chessboard.endState.condition

                if (newState.isOfflineMode) {
                    newState.players[newState.turn].isCurrentUser = false
                    newState.players[turn].isCurrentUser = true
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

                const playedMoves = state.chessboard.playedMoves

                if (newState.increment) {
                    newState.players[newState.turn].timer =
                        newState.players[newState.turn].timer +
                        newState.increment * 1000
                }

                if (premove) {
                    newState.premoves.shift()
                }

                localState = {
                    ...newState,
                    squares: newSquares,
                    playedMoves,
                    turn,
                    fen: new Fen(newSquares, playedMoves, turn).fen,
                    endState,
                }
            }
            playNewMove(localState, action)
            const premove = localState.premoves[0]
            if (premove) {
                playNewMove(
                    localState,
                    {
                        payload: premove,
                    },
                    true
                )
            }

            return localState
        case GameActionTypes.END_STATE:
            return { ...state, endState: action.payload }
        case GameActionTypes.TAKEBACK:
            const {
                squares: newSquares,
                turn,
                playedMoves,
            } = state.chessboard.takeback(
                action.payload.color,
                state.isOfflineMode
            )

            state.viewSquares = null
            state.premovedSquares = {}
            state.premoves = []
            state.squares = newSquares

            return { ...state, turn, playedMoves }
        case GameActionTypes.VIEW_SQUARES:
            if (action.payload.moveIndex === state.playedMoves.length - 1) {
                state.viewSquares = null
            } else {
                const move = state.playedMoves[action.payload.moveIndex]
                if (!!move.takenPiece || move.isEnpassant) {
                    sounds.takePiece.play()
                } else {
                    sounds.placePiece.play()
                }
                state.viewSquares = move.squares
            }
            return { ...state }
        case GameActionTypes.PREMOVE:
            let squares = { ...state.squares, ...state.premovedSquares }
            const piece = squares[action.payload.from]
            let piecesOnFields: KeyableSquares = {
                [action.payload.from]: null,
                [action.payload.to]: action.payload.promotionTo ?? piece,
            }

            if (action.payload.promotionTo) {
                state.promotionMove = null
            }

            if (piece?.canCastleTo?.length) {
                const { modifiedPieceOnField } = Chessboard.getFieldsForCastle(
                    squares,
                    action.payload.from,
                    action.payload.to,
                    true
                )
                piecesOnFields = { ...piecesOnFields, ...modifiedPieceOnField }
            }

            state.premoves.push({ ...action.payload, piece })

            state.premovedSquares = {
                ...state.premovedSquares,
                ...piecesOnFields,
            }
            return { ...state }
        case GameActionTypes.RESET_PREMOVES:
            state.premoves = []
            state.premovedSquares = {}
            return state
        default:
            return state
    }
}
