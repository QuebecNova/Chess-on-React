'use client'

import { ReactElement, useState } from 'react'
import { playSoundWhenMated } from 'src/4.features/lib/helpers'
import { useMated } from 'src/4.features/lib/hooks'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { Colors } from 'src/6.shared/model'
import Button from 'src/6.shared/ui/button'
import Waiting from './Waiting'

export default function MatedMessage(): ReactElement {
    const dispatch = useGameStore((state) => state.dispatch)
    const squares = useGameStore((state) => state.squares)
    const turn = useGameStore((state) => state.turn)
    const variant = useGameStore((state) => state.variant)
    const timeExpired = useGameStore((state) => state.timeExpired)
    const players = useGameStore((state) => state.players)

    const [mated, isStaleMate] = useMated(squares, turn)

    const [waitingForAccept, setWaitingForAccept] = useState(false)

    function restart() {
        if (settings.offlineMode) {
            dispatch({
                type: GameActionTypes.RESTART_GAME,
            })
            return
        }
        socket.emit('restart-game')
        setWaitingForAccept(true)
    }

    const typeOfMessage = isStaleMate
        ? 'Stalemate!'
        : timeExpired
          ? 'Time Ends!'
          : 'Mate!'

    const winnedColor = turn === Colors.White ? Colors.Black : Colors.White

    const message = isStaleMate ? 'Draw!' : `${winnedColor} player wins`!

    const isOpponentWantsRestart = () =>
        Object.values(players).find(
            (player) => player.wantsRestart && !player.isCurrentUser
        )

    if (mated) playSoundWhenMated(turn, variant)

    if (waitingForAccept)
        return (
            <Waiting
                waitingForAccept={waitingForAccept}
                setWaitingForAccept={setWaitingForAccept}
            />
        )

    if (!isOpponentWantsRestart())
        return (
            <div
                className={`board__mated ${
                    mated || isStaleMate || timeExpired ? 'active' : 'inactive'
                }`}
            >
                <p>{typeOfMessage}</p>
                <p>{message}</p>
                <Button onClick={restart}>
                    {settings.offlineMode ? 'Restart' : 'Send rematch'}
                </Button>
            </div>
        )
}
