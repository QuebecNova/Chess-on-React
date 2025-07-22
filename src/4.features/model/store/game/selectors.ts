import { useGameStore } from '../../providers'

export const useCurrentPlayer = () => {
    return useGameStore((state) =>
        state.players.black.isCurrentUser
            ? state.players.black
            : state.players.white
    )
}
