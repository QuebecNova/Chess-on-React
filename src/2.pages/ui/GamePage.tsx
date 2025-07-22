'use client'

import { Show } from '@chakra-ui/react'
import { Game } from 'src/3.widgets/ui'
import ComputerGame from 'src/3.widgets/ui/ComputerGame'
import { useGameStore } from 'src/4.features/model/providers'

export default function GamePage() {
    const withComputer = useGameStore((state) => state.withComputer)

    return (
        <Show when={!withComputer} fallback={<ComputerGame disabled={false} />}>
            <Game disabled={false} />
        </Show>
    )
}
