import { Container, Flex } from '@chakra-ui/react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer>
            <Container>
                <Flex
                    w="full"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Link href="https://www.github.com/QuebecNova">
                        by QuebecNova
                    </Link>
                </Flex>
            </Container>
        </footer>
    )
}
