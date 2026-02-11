'use client'

import { Card, Container, Tabs } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUserStore } from 'src/4.features/model/providers'
import { SignIn, SignUp } from 'src/4.features/ui'
export default function LoginPage() {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated])

    return (
        <Container maxW="lg">
            <Card.Root
                bgGradient="to-b"
                gradientFrom="gray.700"
                gradientTo="gray.800"
            >
                <Card.Body>
                    <Tabs.Root defaultValue="signin" fitted>
                        <Tabs.List>
                            <Tabs.Trigger value="signin">Sign in</Tabs.Trigger>
                            <Tabs.Trigger value="signup">Sign up</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="signin">
                            <SignIn />
                        </Tabs.Content>
                        <Tabs.Content value="signup">
                            <SignUp />
                        </Tabs.Content>
                    </Tabs.Root>
                </Card.Body>
            </Card.Root>
        </Container>
    )
}
