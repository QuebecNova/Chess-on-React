import { useContext } from 'react'
import { AppContext } from 'src/2.pages/ui'
import socket from 'src/6.shared/api/socket'

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
