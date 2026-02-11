'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { socket as socketInstance } from 'src/6.shared/api'

interface SocketContextType {
    socket: Socket | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        setSocket(socketInstance)
        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = (): Socket | null => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context.socket
}
