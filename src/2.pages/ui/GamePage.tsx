'use client'

import { Show } from '@chakra-ui/react'
import { Game } from 'src/3.widgets/ui'
import ComputerGame from 'src/3.widgets/ui/ComputerGame'
import { useGameStore } from 'src/4.features/model/providers'
import { useIsGameEnded } from 'src/4.features/model/store/game/selectors'

export default function GamePage() {
    const withComputer = useGameStore((state) => state.withComputer)
    const viewSquares = useGameStore((state) => state.viewSquares)
    const isGameEnded = useIsGameEnded()

    return (
        <Show
            when={!withComputer}
            fallback={<ComputerGame disabled={isGameEnded || !!viewSquares} />}
        >
            <Game disabled={isGameEnded || !!viewSquares} />
        </Show>
    )
}
