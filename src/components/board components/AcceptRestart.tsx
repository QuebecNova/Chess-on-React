import React, { useContext } from 'react'
import socket from '../../services/socket'
import { boardContext } from '../Board'
import Button from './../UI/button/Button'

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
