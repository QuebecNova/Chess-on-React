import { EndCondition } from 'src/6.shared/model'
import { useGameStore } from '../../providers'

export const useCurrentPlayer = () =>
    useGameStore((state) =>
        state.players.black.isCurrentUser
            ? state.players.black
            : state.players.white
    )

export const useIsOfflineMode = () =>
    useGameStore(
        (state) =>
            state.players.black.isCurrentUser &&
            state.players.white.isCurrentUser
    )

export const useIsGameEnded = () =>
    useGameStore(
        (state) =>
            (
                [
                    EndCondition.Checkmate,
                    EndCondition.Draw,
                    EndCondition.TimeExpired,
                    EndCondition.Stalemate,
                    EndCondition.Resign,
                ] as EndCondition[]
            ).includes(state.endState.condition) || state.timeExpired
    )
