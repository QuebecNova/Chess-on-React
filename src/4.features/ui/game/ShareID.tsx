import { useContext, useEffect } from 'react'
import { AppContext } from 'src/2.pages/ui'
import { socket } from 'src/6.shared/api'

type Props = {
    roomID: string
}

export default function ShareID({ roomID }: Props) {
    const app = useContext(AppContext)

    useEffect(() => {
        socket.on('player-joined', (msg) => {
            console.log(msg)
            app.setInGame(true)
        })

        return () => {
            socket.removeListener('player-joined')
        }
    }, [])

    return (
        <div className="shareID__wrapper">
            <p>{roomID}</p>
            <p>Copy this ID and share it to your friend!</p>
        </div>
    )
}
