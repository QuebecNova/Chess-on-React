'use client'

import { Box, Text } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { playSoundOnEnd } from 'src/4.features/lib/helpers'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { BoardState, Colors } from 'src/6.shared/model'
import Button from 'src/6.shared/ui/button'
import { capitalize } from './../../../6.shared/lib/helpers/misc/capitalize'
import Waiting from './Waiting'

export default function EndMessage(): ReactElement {
    const dispatch = useGameStore((state) => state.dispatch)
    const turn = useGameStore((state) => state.turn)
    const variant = useGameStore((state) => state.variant)
    const players = useGameStore((state) => state.players)
    const boardState = useGameStore((state) => state.boardState)

    const [waitingForAccept, setWaitingForAccept] = useState(false)

    function restart() {
        if (settings.offlineMode) {
            dispatch({
                type: GameActionTypes.RESTART_GAME,
            })
            return
        }
        socket.emit('restart-game')
        setWaitingForAccept(true)
    }
    const isStaleMate = boardState === BoardState.Stalemate
    const isCheckmated = boardState === BoardState.Checkmate
    const isTimeExpired = boardState === BoardState.TimeExpired
    const typeOfMessage = isStaleMate
        ? 'Stalemate!'
        : isTimeExpired
          ? 'Time Ends!'
          : 'Mate!'

    const winnedColor = turn === Colors.White ? Colors.Black : Colors.White

    const message = isStaleMate
        ? 'Draw!'
        : `${capitalize(winnedColor)} player wins`!

    const isOpponentWantsRestart = () =>
        Object.values(players).find(
            (player) => player.wantsRestart && !player.isCurrentUser
        )

    if (isCheckmated || isTimeExpired || isStaleMate)
        playSoundOnEnd(turn, variant)

    if (waitingForAccept)
        return (
            <Waiting
                waitingForAccept={waitingForAccept}
                setWaitingForAccept={setWaitingForAccept}
            />
        )

    if (!isOpponentWantsRestart())
        return (
            <Box
                className={`board__mated ${
                    isCheckmated || isStaleMate || isTimeExpired
                        ? 'active'
                        : 'inactive'
                }`}
            >
                <Text>{typeOfMessage}</Text>
                <Text>{message}</Text>
                <Button mt={2} onClick={restart}>
                    {settings.offlineMode ? 'Restart' : 'Send rematch'}
                </Button>
            </Box>
        )
}
