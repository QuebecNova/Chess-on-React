import React from 'react'
import socket from '../../connection/socket'

type Props = {
    waitingForAccept: boolean
    setWaitingForAccept: React.Dispatch<React.SetStateAction<boolean>>
    restartGame: Function
}

let once = false

export default function Waiting({waitingForAccept, setWaitingForAccept, restartGame}: Props) {

    socket.on('player-accepted-restart', () => {
        if (once) return
        once = true
        setWaitingForAccept(false)
        restartGame()
    })

  if (waitingForAccept) return (
    <div className={`board__mated`}> 
        <p>Waiting for accept...</p>
    </div>
  )
}