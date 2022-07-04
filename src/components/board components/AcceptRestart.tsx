import React, { useContext } from 'react'
import socket from '../../connection/socket'
import { boardContext } from '../Board'

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

  if (board.opponnentWantsRestart) return (
    <div className={`board__accept-restart`}>
        <p>Opponent wants a restart</p>
        <button className='custom-btn btn-5' onClick={() => accept()}>
            <span>Accept</span>
        </button>
        <button className='custom-btn btn-5' onClick={() => reject()}>
            <span>Reject</span>
        </button>
    </div>
  )
}