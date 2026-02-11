import { useEffect } from 'react'
import { socket } from 'src/6.shared/api'

export function useSocket<T>(event: string, onMessage: (data: T) => void) {
    useEffect(() => {
        socket.on(event, onMessage)

        return () => {
            socket.removeListener(event)
        }
    }, [event, onMessage])
}
