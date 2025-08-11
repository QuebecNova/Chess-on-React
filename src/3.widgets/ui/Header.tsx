import { Container, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { Profile } from 'src/4.features/ui'

export default function Header() {
    return (
        <header>
            <Container>
                <Flex
                    w="full"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text as={'h1'}>
                        <Link href="/">HAMCHESS</Link>
                    </Text>
                    <Profile />
                </Flex>
            </Container>
        </header>
    )
}
