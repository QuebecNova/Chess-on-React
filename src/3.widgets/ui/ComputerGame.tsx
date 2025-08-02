'use client'

import { Grid, GridItem } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { useCurrentPlayer } from 'src/4.features/model/store'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Board } from 'src/4.features/ui'
import {
    Fen,
    notation,
    Stockfish,
    StockfishDifficultyLevels,
} from 'src/5.entities/lib'
import { SideMenu } from './SideMenu'

export default function ComputerGame({ disabled }: { disabled: boolean }) {
    const fen = useGameStore((state) => state.fen)
    const turn = useGameStore((state) => state.turn)
    const squares = useGameStore((state) => state.squares)
    const playedMoves = useGameStore((state) => state.playedMoves)
    const computerDifficulty = useGameStore((state) => state.computerDifficulty)
    const currentPlayer = useCurrentPlayer()
    const [isReady, setIsReady] = useState(false)
    const dispatch = useGameStore((state) => state.dispatch)

    const stockfish = useMemo(() => new Stockfish(), [])

    useEffect(() => {
        if (isReady) return
        const unsubscribe = stockfish.onReady((msg) => {
            setIsReady(true)
            unsubscribe()
        })
        return unsubscribe
    }, [stockfish])

    const makeStockfishMove = useCallback(() => {
        stockfish.evaluatePosition(
            fen,
            StockfishDifficultyLevels[computerDifficulty]
        )
        const unsubscribe = stockfish.onMessage((msg) => {
            const bestMove = msg.bestMove
            if (bestMove) {
                unsubscribe()
                if (bestMove === '(none)') return
                if (fen !== new Fen(squares, playedMoves, turn).fen) return
                const parsedMove = notation.parseLongAlgebraic(
                    squares,
                    playedMoves,
                    bestMove
                )
                dispatch({
                    type: GameActionTypes.NEW_MOVE,
                    payload: parsedMove,
                })
            }
        })
    }, [stockfish, fen])

    useEffect(() => {
        let timeout = null
        if (turn === currentPlayer?.color) return

        timeout = setTimeout(() => {
            makeStockfishMove()
        }, 2000)

        return () => {
            clearTimeout(timeout)
        }
    }, [squares])

    useEffect(() => {
        return () => {
            stockfish.stop()
            stockfish.quit()
        }
    }, [])

    return (
        <Grid templateColumns="repeat(3, 1fr)">
            <GridItem />
            <GridItem>
                <Board disabled={disabled} loading={!isReady} />
            </GridItem>
            <GridItem>
                <SideMenu />
            </GridItem>
        </Grid>
    )
}
