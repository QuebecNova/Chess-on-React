'use client'

import { Show, Text } from '@chakra-ui/react'
import { ReactElement, useEffect, useState } from 'react'
import { playSoundOnEnd } from 'src/4.features/lib/helpers'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { useIsGameEnded } from 'src/4.features/model/store/game/selectors'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { capitalize } from 'src/6.shared/lib/helpers'
import { EndCondition } from 'src/6.shared/model'
import Button from 'src/6.shared/ui/button'
import { Modal } from 'src/6.shared/ui/modal'
import Waiting from './Waiting'

export default function EndMessage(): ReactElement {
    const dispatch = useGameStore((state) => state.dispatch)
    const turn = useGameStore((state) => state.turn)
    const players = useGameStore((state) => state.players)
    const endState = useGameStore((state) => state.endState)
    const isOfflineMode = useGameStore((state) => state.isOfflineMode)
    const withComputer = useGameStore((state) => state.withComputer)
    const [open, setOpen] = useState(false)
    const isGameEnded = useIsGameEnded()
    const [isRestarting, setIsRestarting] = useState(false)

    const [waitingForAccept, setWaitingForAccept] = useState(false)

    const isStaleMate = endState.condition === EndCondition.Stalemate
    const isCheckmated = endState.condition === EndCondition.Checkmate
    const isTimeExpired = endState.condition === EndCondition.TimeExpired
    const isResign = endState.condition === EndCondition.Resign
    const isDraw = endState.condition === EndCondition.Draw

    const win = (isCheckmated || isTimeExpired) && endState.color !== turn
    const draw = isStaleMate || isDraw
    const lose =
        (isCheckmated || isTimeExpired || isResign) && endState.color === turn

    useEffect(() => {
        if (win) {
            playSoundOnEnd({ win })
        }
        if (draw) {
            playSoundOnEnd({ draw })
        }
        if (lose) {
            playSoundOnEnd({ lose })
        }
        setOpen(isGameEnded)
    }, [isGameEnded])

    function restart() {
        setOpen(false)
        if (isOfflineMode || withComputer) {
            dispatch({
                type: GameActionTypes.RESTART_GAME,
            })
            return
        }
        socket.emit('restart-game')
        setWaitingForAccept(true)
    }

    const isOpponentWantsRestart = () =>
        Object.values(players).find(
            (player) => player.wantsRestart && !player.isCurrentUser
        )

    if (waitingForAccept)
        return (
            <Waiting
                waitingForAccept={waitingForAccept}
                setWaitingForAccept={setWaitingForAccept}
            />
        )

    if (!isOpponentWantsRestart())
        return (
            <Modal
                size="xs"
                open={open}
                onClose={() => setOpen(false)}
                onExitComplete={restart}
                title={<Text>Game ended</Text>}
                body={
                    <Show
                        when={isStaleMate || isDraw}
                        fallback={
                            <Text textAlign="center">
                                {capitalize(endState.condition || '')} for{' '}
                                {endState.color}
                            </Text>
                        }
                    >
                        <Text textAlign="center">
                            {capitalize(endState.condition || '')}
                        </Text>
                    </Show>
                }
                footer={
                    <Button
                        mt={2}
                        onClick={() => {
                            setIsRestarting(true)
                            setOpen(false)
                        }}
                    >
                        {settings.offlineMode ? 'Restart' : 'Send rematch'}
                    </Button>
                }
            />
        )
}
