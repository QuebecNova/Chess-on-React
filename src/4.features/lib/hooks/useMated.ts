'use client'

import { useMemo, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { KeyableSquares } from 'src/5.entities/model'
import { Colors } from 'src/6.shared/model'
import { isMated, stopAllTimers } from '../helpers'

export function useMated(
    squares: KeyableSquares,
    turn: string
): [boolean, boolean] {
    const [isStaleMate, setStaleMate] = useState(false)
    const players = useGameStore((state) => state.players)
    const mated: boolean = useMemo(() => {
        const matedOrStaleMated = isMated(squares, turn)

        if (matedOrStaleMated)
            stopAllTimers([players[Colors.White], players[Colors.Black]])

        if (typeof matedOrStaleMated === 'string') {
            setStaleMate(true)
        } else {
            return matedOrStaleMated
        }
    }, [squares, turn])

    return [mated, isStaleMate]
}
