'use client'

import React from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { socket } from 'src/6.shared/api'

type Props = {
    waitingForAccept: boolean
    setWaitingForAccept: React.Dispatch<React.SetStateAction<boolean>>
}

let once = false

export default function Waiting({
    waitingForAccept,
    setWaitingForAccept,
}: Props) {
    const dispatch = useGameStore((state) => state.dispatch)
    socket.on('player-accepted-restart', () => {
        if (once) return
        once = true
        setWaitingForAccept(false)
        dispatch({
            type: GameActionTypes.RESTART_GAME,
        })
    })

    if (waitingForAccept)
        return (
            <div className={`board__mated`}>
                <p>Waiting for accept...</p>
            </div>
        )
}
