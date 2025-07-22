'use client'

import { Grid, GridItem } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo } from 'react'
import { playPlacedPieceSound } from 'src/4.features/lib/helpers'
import { useGameStore } from 'src/4.features/model/providers'
import { useCurrentPlayer } from 'src/4.features/model/store'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Board } from 'src/4.features/ui'
import { notation, Stockfish } from 'src/5.entities/lib'
import { SideMenu } from './SideMenu'

export default function ComputerGame({ disabled }: { disabled: boolean }) {
    const fen = useGameStore((state) => state.fen)
    const turn = useGameStore((state) => state.turn)
    const squares = useGameStore((state) => state.squares)
    const playedMoves = useGameStore((state) => state.playedMoves)
    const computerDifficulty = useGameStore((state) => state.computerDifficulty)
    const currentPlayer = useCurrentPlayer()
    const dispatch = useGameStore((state) => state.dispatch)

    const stockfish = useMemo(() => new Stockfish(), [])

    const makeStockfishMove = useCallback(() => {
        stockfish.evaluatePosition(fen, computerDifficulty)
        const unsubscribe = stockfish.onMessage((msg) => {
            const bestMove = msg.bestMove
            if (bestMove) {
                if (bestMove === '(none)') return
                const parsedMove = notation.parseLongAlgebraic(
                    squares,
                    playedMoves,
                    bestMove
                )
                dispatch({
                    type: GameActionTypes.NEW_MOVE,
                    payload: parsedMove,
                })
                playPlacedPieceSound(parsedMove.isCapture)
                unsubscribe()
            }
        })
    }, [stockfish, fen])

    useEffect(() => {
        let timeout = null
        if (turn === currentPlayer?.color) return

        timeout = setTimeout(() => {
            makeStockfishMove()
        }, 200)

        return () => {
            clearTimeout(timeout)
        }
    }, [turn, currentPlayer])

    return (
        <Grid templateColumns="repeat(3, 1fr)">
            <GridItem />
            <GridItem>
                <Board disabled={disabled} />
            </GridItem>
            <GridItem>
                <SideMenu />
            </GridItem>
        </Grid>
    )
}
