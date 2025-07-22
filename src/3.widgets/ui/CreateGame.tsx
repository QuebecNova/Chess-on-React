import { Card, Container, Stack, Tabs } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsFillPlusSquareFill } from 'react-icons/bs'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { BotDifficulty, StartingSettings } from 'src/4.features/ui'
import {
    isStockfishDifficultyLevels,
    StockfishDifficultyLevels,
} from 'src/5.entities/lib'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { Button } from 'src/6.shared/ui'
import { Modal } from 'src/6.shared/ui/modal'
import { v4 as uuidv4 } from 'uuid'
const RoomID = uuidv4()

export default function CreateGame() {
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    const [newRoomCreated, setNewRoomCreated] = useState(false)
    const computerDifficulty = useGameStore((state) => state.computerDifficulty)
    const router = useRouter()
    const dispatch = useGameStore((state) => state.dispatch)

    function setOffline(bot?: boolean) {
        if (bot) {
            dispatch({
                type: GameActionTypes.WITH_COMPUTER,
                payload: { withComputer: true },
            })
        }
        router.push('/1213')
        settings.offlineMode = true
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

    function changeDifficulty(difficulty: StockfishDifficultyLevels) {
        dispatch({
            type: GameActionTypes.COMPUTER_DIFFICULTY,
            payload: {
                computerDifficulty: difficulty,
            },
        })
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
                                <BsFillPlusSquareFill />
                                Lobby
                            </Tabs.Trigger>
                            <Tabs.Trigger value="inplay">
                                <BsFillPlusSquareFill />
                                In play
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="create">
                            <Stack gap="4">
                                <Modal
                                    trigger={
                                        <Button onClick={displayID}>
                                            New Game
                                        </Button>
                                    }
                                    body={<StartingSettings />}
                                    title="Create a game"
                                    footer={
                                        <Button colorPalette="teal">
                                            Create
                                        </Button>
                                    }
                                />
                                <Modal
                                    trigger={
                                        <Button onClick={join}>Join</Button>
                                    }
                                    title="Join a game"
                                    body={<>пиши сука код</>}
                                />
                                <Modal
                                    trigger={
                                        <Button onClick={join}>
                                            Play with the computer
                                        </Button>
                                    }
                                    title="Play with the computer"
                                    body={
                                        <>
                                            <BotDifficulty
                                                mb="6"
                                                justifyContent="center"
                                                value={computerDifficulty.toString()}
                                                onValueChange={({ value }) => {
                                                    const num = parseInt(value)
                                                    if (
                                                        isStockfishDifficultyLevels(
                                                            num
                                                        )
                                                    ) {
                                                        changeDifficulty(num)
                                                    }
                                                }}
                                            />
                                            <StartingSettings />
                                        </>
                                    }
                                    footer={
                                        <Button
                                            colorPalette="teal"
                                            onClick={() => setOffline(true)}
                                        >
                                            Play
                                        </Button>
                                    }
                                />
                                <Modal
                                    trigger={<Button>Offline mode</Button>}
                                    title="Play in offline mode"
                                    body={<StartingSettings />}
                                    footer={
                                        <Button
                                            colorPalette="teal"
                                            onClick={() => setOffline()}
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
