'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { socket } from 'src/6.shared/api'
import Button from 'src/6.shared/ui/button'

export default function AcceptRestart() {
    const dispatch = useGameStore((state) => state.dispatch)
    const [opponnentWantsRestart, setOpponentWantsRestart] =
        useState<boolean>(false)

    //listening on event, when another player send you request for restart a game
    useEffect(() => {
        socket.on('player-restarted-game', () => {
            setOpponentWantsRestart(true)
        })

        return () => {
            socket.removeListener('player-restarted-game')
        }
    }, [])
    //

    function accept() {
        setOpponentWantsRestart(false)
        dispatch({
            type: GameActionTypes.RESTART_GAME,
        })
        socket.emit('player-accepting-restart')
    }

    function reject() {
        socket.emit('player-rejecting-restart')
    }

    if (opponnentWantsRestart)
        return (
            <div className={`board__accept-restart`}>
                <p>Opponent wants a restart</p>
                <Button onClick={() => accept()}>Accept</Button>
                <Button onClick={() => reject()}>Reject</Button>
            </div>
        )
}
