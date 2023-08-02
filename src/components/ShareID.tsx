import React, { useContext } from 'react'
import socket from '../services/socket'
import { AppContext } from '../pages'

type Props = {
    roomID: string
}

export default function ShareID({ roomID }: Props) {
    const app = useContext(AppContext)

    socket.on('player-joined', (msg) => {
        console.log(msg)
        app.setInGame(true)
    })

    return (
        <div className="shareID__wrapper">
            <p>{roomID}</p>
            <p>Copy this ID and share it to your friend!</p>
        </div>
    )
}
