'use client'

import { Show, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useUserStore } from 'src/4.features/model/providers'

export default function Profile() {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated)
    const username = useUserStore((state) => state.username)
    const email = useUserStore((state) => state.email)
    return (
        <Show
            when={isAuthenticated}
            fallback={<Link href="/auth">Sign in</Link>}
        >
            <Text>{username || email}</Text>
        </Show>
    )
}
