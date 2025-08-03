'use client'

import { Card, Show } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { useIsGameEnded } from 'src/4.features/model/store/game/selectors'
import { Player } from 'src/5.entities/model'
import ShowCounter from 'src/6.shared/ui/timer/ShowCounter'

type TimerProps = {
    player: Player
} & Card.RootProps

export default function Timer({ player, ...props }: TimerProps) {
    const [countDown, setCountDown] = useState(player.timer)
    const playedMoves = useGameStore((state) => state.playedMoves)
    const turn = useGameStore((state) => state.turn)
    const dispatch = useGameStore((state) => state.dispatch)
    const isGameEnded = useIsGameEnded()

    useEffect(() => {
        if (player.timer === Infinity) return
        if (player.timer) setCountDown(player.timer)
        if (player.timer <= 0) {
            dispatch({
                type: GameActionTypes.TIME_EXPIRED,
                payload: { isTimeExpired: true, color: player.color },
            })
            return
        }
        if (player.color !== turn || !playedMoves.length || isGameEnded) return
        let sec = 0
        const interval = setInterval(() => {
            sec += 1
            const newTime = countDown - sec * 1000
            dispatch({
                type: GameActionTypes.TIMER,
                payload: {
                    playerColor: player.color,
                    timer: newTime,
                },
            })
            setCountDown(newTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [countDown, player, player.timer, turn])

    return (
        <Show when={player.timer !== Infinity}>
            <Card.Root backgroundColor="gray.800" {...props}>
                <Card.Body py={2}>
                    <ShowCounter timer={player.timer} />
                </Card.Body>
            </Card.Root>
        </Show>
    )
}
