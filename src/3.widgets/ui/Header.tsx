import { Container, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'

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
                    <Link href="https://www.github.com/QuebecNova">
                        by QuebecNova
                    </Link>
                </Flex>
            </Container>
        </header>
    )
}
