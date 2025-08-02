import { Badge, Card, Container, Stack, Tabs } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsFillPeopleFill, BsFillPlusSquareFill } from 'react-icons/bs'
import { OnSettingsChange } from 'src/4.features/model'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { BotDifficulty, StartingSettings } from 'src/4.features/ui'
import { isStockfishDifficultyLevels } from 'src/5.entities/lib'
import { socket } from 'src/6.shared/api'
import { sounds } from 'src/6.shared/model'
import { Button } from 'src/6.shared/ui'
import { Modal } from 'src/6.shared/ui/modal'
import { v4 as uuidv4 } from 'uuid'

const RoomID = uuidv4()

export default function CreateGame() {
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    const [newRoomCreated, setNewRoomCreated] = useState(false)
    const computerDifficulty = useGameStore((state) => state.computerDifficulty)
    const variant = useGameStore((state) => state.variant)
    const initTimer = useGameStore((state) => state.initTimer)
    const increment = useGameStore((state) => state.increment)
    const withComputer = useGameStore((state) => state.withComputer)
    const isOfflineMode = useGameStore((state) => state.isOfflineMode)
    const router = useRouter()
    const dispatch = useGameStore((state) => state.dispatch)

    const getInitialState = () => ({
        timer: initTimer,
        increment,
        computerDifficulty,
        variant,
        withComputer,
        isOfflineMode,
    })

    const [settings, setSettings] =
        useState<Parameters<OnSettingsChange>[0]>(getInitialState)

    function onPlay() {
        dispatch({
            type: GameActionTypes.STARTING_SETTINGS,
            payload: { settings },
        })
        router.push('/1213')
        sounds.newGame.play()
    }

    function displayID() {
        socket.emit('new-game-ID', RoomID)
        setNewRoomCreated(true)
    }

    async function join() {
        socket.on('room-error', (msg) => {
            setError(msg)
            return
        })
        socket.emit('connect-to-game', inputValue)
    }

    function onSettingsChange(newSettings: Parameters<OnSettingsChange>[0]) {
        setSettings((prev) => ({ ...prev, ...newSettings }))
    }

    socket.on('room-valid', () => {
        // app.setInGame(true)
    })

    return (
        <Container maxW="lg">
            <Card.Root
                bgGradient="to-b"
                gradientFrom="gray.700"
                gradientTo="gray.800"
            >
                <Card.Body>
                    <Tabs.Root defaultValue="create" fitted>
                        <Tabs.List>
                            <Tabs.Trigger value="create">
                                <BsFillPlusSquareFill />
                                Create
                            </Tabs.Trigger>
                            <Tabs.Trigger value="lobby">
                                <BsFillPeopleFill />
                                Lobby
                            </Tabs.Trigger>
                            <Tabs.Trigger value="inplay">
                                <Badge>0</Badge>
                                In play
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="create">
                            <Stack gap="4">
                                <Modal
                                    onSubmit={onPlay}
                                    trigger={
                                        <Button
                                            onClick={displayID}
                                            disabled={true}
                                        >
                                            New Game
                                        </Button>
                                    }
                                    body={
                                        <StartingSettings
                                            onSettingsChange={onSettingsChange}
                                        />
                                    }
                                    title="Create a game"
                                    footer={
                                        <Button
                                            colorPalette="teal"
                                            type="submit"
                                        >
                                            Create
                                        </Button>
                                    }
                                />
                                <Modal
                                    onSubmit={onPlay}
                                    trigger={
                                        <Button onClick={join} disabled={true}>
                                            Join
                                        </Button>
                                    }
                                    title="Join a game"
                                    body={<>пиши сука код</>}
                                />
                                <Modal
                                    onSubmit={onPlay}
                                    trigger={
                                        <Button
                                            onClick={() =>
                                                onSettingsChange({
                                                    ...getInitialState(),
                                                    withComputer: true,
                                                })
                                            }
                                        >
                                            Play with the computer
                                        </Button>
                                    }
                                    title="Play with the computer"
                                    body={
                                        <>
                                            <BotDifficulty
                                                mb="6"
                                                justifyContent="center"
                                                value={settings.computerDifficulty.toString()}
                                                onValueChange={({ value }) => {
                                                    const num = parseInt(value)
                                                    if (
                                                        isStockfishDifficultyLevels(
                                                            num
                                                        )
                                                    ) {
                                                        onSettingsChange({
                                                            computerDifficulty:
                                                                num,
                                                        })
                                                    }
                                                }}
                                            />
                                            <StartingSettings
                                                onSettingsChange={
                                                    onSettingsChange
                                                }
                                            />
                                        </>
                                    }
                                    footer={
                                        <Button
                                            colorPalette="teal"
                                            type="submit"
                                        >
                                            Play
                                        </Button>
                                    }
                                />
                                <Modal
                                    onSubmit={onPlay}
                                    trigger={
                                        <Button
                                            onClick={() =>
                                                onSettingsChange({
                                                    ...getInitialState(),
                                                    isOfflineMode: true,
                                                })
                                            }
                                        >
                                            Offline mode
                                        </Button>
                                    }
                                    title="Play in offline mode"
                                    body={
                                        <StartingSettings
                                            onSettingsChange={onSettingsChange}
                                        />
                                    }
                                    footer={
                                        <Button
                                            colorPalette="teal"
                                            type="submit"
                                        >
                                            Play
                                        </Button>
                                    }
                                />
                            </Stack>
                        </Tabs.Content>
                        <Tabs.Content value="lobby">LOBBY</Tabs.Content>
                        <Tabs.Content value="inplay">INPLAY</Tabs.Content>
                    </Tabs.Root>
                </Card.Body>
            </Card.Root>
        </Container>
    )
}
