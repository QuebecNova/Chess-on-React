'use client'

import { SocketProvider, UserStoreProvider } from 'src/1.app/model/providers'

export default function MainLayout({
    children,
    BACKEND_SOCKET_URL,
}: {
    children: React.ReactNode
    BACKEND_SOCKET_URL: string
}) {
    return (
        <UserStoreProvider>
            <SocketProvider BACKEND_SOCKET_URL={BACKEND_SOCKET_URL}>
                {children}
            </SocketProvider>
        </UserStoreProvider>
    )
}
