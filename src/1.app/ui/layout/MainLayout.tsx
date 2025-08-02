'use client'

import { Box, Center, Container } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { SocketProvider, UserStoreProvider } from 'src/1.app/model/providers'
import { Header } from 'src/3.widgets/ui'
import { GameStoreProvider } from 'src/4.features/model/providers'
import { Provider } from 'src/6.shared/ui'

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
                <GameStoreProvider>
                    <Provider>
                        <ThemeProvider>
                            <Box h="dvh">
                                <Header />
                                <Container pt="6" pb="4">
                                    <Center>{children}</Center>
                                </Container>
                            </Box>
                        </ThemeProvider>
                    </Provider>
                </GameStoreProvider>
            </SocketProvider>
        </UserStoreProvider>
    )
}
