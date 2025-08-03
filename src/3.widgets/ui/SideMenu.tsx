import { Box, Flex, Show } from '@chakra-ui/react'
import { useGameStore } from 'src/4.features/model/providers'
import {
    AcceptRestart,
    Chat,
    EndMessage,
    PlayedMoves,
    Player,
    Timer,
} from 'src/4.features/ui'
import { Colors } from 'src/6.shared/model'

export function SideMenu() {
    const players = useGameStore((state) => state.players)
    const variant = useGameStore((state) => state.variant)
    const isOfflineMode = useGameStore((state) => state.isOfflineMode)
    const withComputer = useGameStore((state) => state.withComputer)

    return (
        <Box h="full">
            <Flex
                h="full"
                flexDirection="column"
                alignItems="start"
                justifyContent="center"
            >
                <EndMessage />
                <AcceptRestart />
                <Timer
                    borderTopLeftRadius={0}
                    borderBottomRightRadius={0}
                    borderBottomLeftRadius={0}
                    player={
                        variant === Colors.White
                            ? players[Colors.Black]
                            : players[Colors.White]
                    }
                />
                <Player
                    borderTopLeftRadius={0}
                    borderBottomRightRadius={0}
                    borderBottomLeftRadius={0}
                    player={
                        variant === Colors.White
                            ? players[Colors.Black]
                            : players[Colors.White]
                    }
                />
                <PlayedMoves />
                <Player
                    borderTopLeftRadius={0}
                    borderTopRightRadius={0}
                    borderBottomLeftRadius={0}
                    player={players[variant]}
                />
                <Timer
                    borderTopLeftRadius={0}
                    borderTopRightRadius={0}
                    borderBottomLeftRadius={0}
                    player={players[variant]}
                />
            </Flex>
            <Show when={!withComputer && !isOfflineMode}>
                <Chat />
            </Show>
        </Box>
    )
}
