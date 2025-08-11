'use client'

import { Box, Center, Container } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { SocketProvider } from 'src/1.app/model/providers'
import { Header } from 'src/3.widgets/ui'
import {
    GameStoreProvider,
    UserStoreProvider,
} from 'src/4.features/model/providers'
import { queryClient } from 'src/6.shared/api'
import { Provider } from 'src/6.shared/ui'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <SocketProvider>
                <UserStoreProvider>
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
                </UserStoreProvider>
            </SocketProvider>
        </QueryClientProvider>
    )
}
