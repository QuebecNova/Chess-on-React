'use client'

import { Card, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { notation } from 'src/5.entities/lib'
import { PlayedMove } from 'src/5.entities/model'
import { scrollToBottom } from 'src/6.shared/lib/helpers'
import { Button } from 'src/6.shared/ui'

//https://en.wikipedia.org/wiki/Algebraic_notation_(chess)

export default function PlayedMoves() {
    const playedMoves = useGameStore((state) => state.playedMoves)
    const lastPlayedMove = useRef<null | HTMLDivElement>(null)
    const [currentMove, setCurrentMove] = useState(playedMoves.length - 1)

    useEffect(() => {
        if (!lastPlayedMove.current) return
        scrollToBottom(lastPlayedMove.current)
        setCurrentMove(playedMoves.length - 1)
    }, [playedMoves.length])

    function onMoveClick(move: PlayedMove, index: number) {
        setCurrentMove(index)
    }

    return (
        <Card.Root backgroundColor="gray.800">
            <Card.Header>
                <Flex justifyContent="center" gap="2">
                    <Button>prev</Button>
                    <Button>next</Button>
                </Flex>
            </Card.Header>
            <Card.Body
                backgroundColor="gray.900"
                p="0"
                my="2"
                minH="40"
                maxH="40"
                overflow="auto"
            >
                {playedMoves.length ? (
                    <Grid templateColumns="1fr 1fr">
                        {playedMoves.map((move, index) => (
                            <GridItem ref={lastPlayedMove} key={index}>
                                <Button
                                    backgroundColor={
                                        currentMove === index
                                            ? 'gray.800'
                                            : undefined
                                    }
                                    onClick={() => onMoveClick(move, index)}
                                    variant="subtle"
                                    borderRadius="0"
                                    w="full"
                                >
                                    {notation.getAlgebraic(move, index)}
                                </Button>
                            </GridItem>
                        ))}
                    </Grid>
                ) : (
                    <Flex
                        h="full"
                        w="full"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text>Make a move to start</Text>
                    </Flex>
                )}
            </Card.Body>
            <Card.Footer>
                <Button>Takeback</Button>
                <Button>Draw</Button>
                <Button>Resign</Button>
            </Card.Footer>
        </Card.Root>
    )
}
