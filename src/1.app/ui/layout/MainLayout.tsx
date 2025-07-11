'use client'

import { SocketProvider } from 'src/1.app/model/SocketProvider'

export default function MainLayout({
    children,
    BACKEND_SOCKET_URL,
}: {
    children: React.ReactNode
    BACKEND_SOCKET_URL: string
}) {
    return (
        <SocketProvider BACKEND_SOCKET_URL={BACKEND_SOCKET_URL}>
            {children}
        </SocketProvider>
    )
}
