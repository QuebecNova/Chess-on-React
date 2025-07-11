import React, { useContext } from 'react'
import { boardContext } from 'src/3.widgets/ui/Board'
import socket from 'src/6.shared/api/socket'
import Button from 'src/6.shared/ui/button'

export default function AcceptRestart() {
    const board = useContext(boardContext)

    function accept() {
        board.setOpponentWantsRestart(false)
        board.restartGame()
        socket.emit('player-accepting-restart')
    }

    function reject() {
        socket.emit('player-rejecting-restart')
    }

    if (board.opponnentWantsRestart)
        return (
            <div className={`board__accept-restart`}>
                <p>Opponent wants a restart</p>
                <Button onClick={() => accept()}>Accept</Button>
                <Button onClick={() => reject()}>Reject</Button>
            </div>
        )
}
