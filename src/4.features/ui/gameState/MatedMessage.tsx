import React, { ReactElement, useContext, useState } from 'react'
import Waiting from './Waiting'
import settings from 'src/6.shared/config/settings'
import socket from 'src/6.shared/api/socket'
import { playSoundWhenMated } from 'src/6.shared/lib/helpers/misc/sounds'
import Button from 'src/6.shared/ui/button'
import { boardContext } from 'src/3.widgets/ui/Board'

type MatedMessageProps = {
    restartGame: () => void
    mated: boolean
    isStaleMate: boolean
}

export default function MatedMessage(props: MatedMessageProps): ReactElement {
    const { restartGame, mated, isStaleMate } = props

    const board = useContext(boardContext)

    const [waitingForAccept, setWaitingForAccept] = useState(false)

    function restart() {
        if (settings.offlineMode) {
            restartGame()
            return
        }
        socket.emit('restart-game')
        setWaitingForAccept(true)
    }

    const typeOfMessage = isStaleMate
        ? 'Stalemate!'
        : board.timeExpired
        ? 'Time Ends!'
        : 'Mate!'

    const winnedColor = board.turn === 'White' ? 'Black' : 'White'

    const message = isStaleMate ? 'Draw!' : `${winnedColor} player wins`!

    if (mated) playSoundWhenMated(board.turn, board.variant)

    if (waitingForAccept)
        return (
            <Waiting
                waitingForAccept={waitingForAccept}
                restartGame={restartGame}
                setWaitingForAccept={setWaitingForAccept}
            />
        )

    if (!board.opponnentWantsRestart)
        return (
            <div
                className={`board__mated ${
                    mated || isStaleMate || board.timeExpired
                        ? 'active'
                        : 'inactive'
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
