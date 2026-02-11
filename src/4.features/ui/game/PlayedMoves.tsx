'use client'

import { Card, Flex, Grid, GridItem, IconButton, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { useGameStore } from 'src/4.features/model/providers'
import { useCurrentPlayer } from 'src/4.features/model/store'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { notation } from 'src/5.entities/lib'
import { PlayedMove } from 'src/5.entities/model'
import { scrollToBottom } from 'src/6.shared/lib/helpers'
import { EndCondition } from 'src/6.shared/model'
import { Button } from 'src/6.shared/ui'
export default function PlayedMoves() {
    const playedMoves = useGameStore((state) => state.playedMoves)
    const lastPlayedMove = useRef<null | HTMLDivElement>(null)
    const [currentMove, setCurrentMove] = useState(playedMoves.length - 1)
    const dispatch = useGameStore((state) => state.dispatch)
    const currentPlayer = useCurrentPlayer()
    const viewSquares = useGameStore((state) => state.viewSquares)

    useEffect(() => {
        if (!viewSquares) setCurrentMove(playedMoves.length - 1)
    }, [viewSquares])

    useEffect(() => {
        setCurrentMove(playedMoves.length - 1)
        if (!lastPlayedMove.current) return
        scrollToBottom(lastPlayedMove.current)
    }, [playedMoves.length])

    function onBack() {
        setCurrentMove(currentMove - 1)
        dispatch({
            type: GameActionTypes.VIEW_SQUARES,
            payload: { moveIndex: currentMove - 1 },
        })
    }

    function onForward() {
        setCurrentMove(currentMove + 1)
        dispatch({
            type: GameActionTypes.VIEW_SQUARES,
            payload: { moveIndex: currentMove + 1 },
        })
    }

    function onMoveClick(move: PlayedMove, index: number) {
        setCurrentMove(index)
        dispatch({
            type: GameActionTypes.VIEW_SQUARES,
            payload: { moveIndex: index },
        })
    }

    function onTakeback() {
        dispatch({
            type: GameActionTypes.TAKEBACK,
            payload: {
                color: currentPlayer.color,
            },
        })
    }
    function onDraw() {
        dispatch({
            type: GameActionTypes.END_STATE,
            payload: {
                condition: EndCondition.Draw,
                color: currentPlayer.color,
            },
        })
    }
    function onResign() {
        dispatch({
            type: GameActionTypes.END_STATE,
            payload: {
                condition: EndCondition.Resign,
                color: currentPlayer.color,
            },
        })
    }

    return (
        <Card.Root backgroundColor="gray.800" borderRadius={0} w="full">
            <Card.Header pt={0}>
                <Flex justifyContent="center" gap="2">
                    <IconButton
                        variant="subtle"
                        disabled={!playedMoves.length || currentMove === 0}
                        onClick={onBack}
                    >
                        <BsChevronLeft />
                    </IconButton>
                    <IconButton
                        variant="subtle"
                        disabled={
                            !playedMoves.length ||
                            playedMoves.length - 1 === currentMove
                        }
                        onClick={onForward}
                    >
                        <BsChevronRight />
                    </IconButton>
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
                                    {notation.getShortAlgebraic(move, index)}
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
            <Card.Footer pb={0} justifyContent="center" gap="2">
                <Button disabled={!playedMoves.length} onClick={onTakeback}>
                    Takeback
                </Button>
                <Button disabled={!playedMoves.length} onClick={onDraw}>
                    Draw
                </Button>
                <Button disabled={!playedMoves.length} onClick={onResign}>
                    Resign
                </Button>
            </Card.Footer>
        </Card.Root>
    )
}
