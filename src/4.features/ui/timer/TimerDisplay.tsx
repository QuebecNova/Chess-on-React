'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Player } from 'src/5.entities/model'
import ShowCounter from 'src/6.shared/ui/timer/ShowCounter'

type TimerProps = {
    player: Player
}

export default function Timer({ player }: TimerProps) {
    const [countDown, setCountDown] = useState(player.timer)

    const dispatch = useGameStore((state) => state.dispatch)

    useEffect(() => {
        if (player.timer) setCountDown(player.timer)
        if (player.timer <= 0) {
            dispatch({
                type: GameActionTypes.TIME_EXPIRED,
                payload: { isTimeExpired: true },
            })
            return
        }
        if (!player.isPlaying) return
        let sec = 0
        const interval = setInterval(() => {
            sec += 1
            const removedTime = countDown - sec * 1000
            player.timer = removedTime
            setCountDown(removedTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [countDown, player, player.timer, player.isPlaying])

    return (
        <>
            <p>{player.color} time:</p>
            <ShowCounter timer={player.timer} />
        </>
    )
}
