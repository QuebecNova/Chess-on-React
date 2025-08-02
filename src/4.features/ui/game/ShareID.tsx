import { Box, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { socket } from 'src/6.shared/api'

type Props = {
    roomID: string
}

export default function ShareID({ roomID }: Props) {
    useEffect(() => {
        socket.on('player-joined', (msg) => {
            console.log(msg)
            // app.setInGame(true)
        })

        return () => {
            socket.removeListener('player-joined')
        }
    }, [])

    return (
        <Box>
            <Text>{roomID}</Text>
            <Text>Copy this ID and share it to your friend</Text>
        </Box>
    )
}
