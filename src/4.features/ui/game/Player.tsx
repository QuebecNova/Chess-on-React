import { Card, Flex, Show, Status } from '@chakra-ui/react'
import { useGameStore } from 'src/4.features/model/providers'
import { Player } from 'src/5.entities/model'

export default function PlayerBox({
    player,
    ...props
}: { player: Player } & Card.RootProps) {
    const withComputer = useGameStore((state) => state.withComputer)
    const computerDifficulty = useGameStore((state) => state.computerDifficulty)
    return (
        <Card.Root backgroundColor="gray.800" w="full" {...props}>
            <Card.Body py={2}>
                <Flex gap={2}>
                    <Status.Root colorPalette="green">
                        <Status.Indicator />
                    </Status.Root>
                    <Show
                        when={player.isCurrentUser}
                        fallback={
                            withComputer
                                ? `Stockfish lvl ${computerDifficulty}`
                                : 'Opponent'
                        }
                    >
                        You
                    </Show>
                </Flex>
            </Card.Body>
        </Card.Root>
    )
}
