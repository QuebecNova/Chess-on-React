import { useMemo, useState } from 'react'
import { keyableSquares } from '../types/keyable'
import { isMated } from '../helpers/board/checkAndMateHandler'
import { stopAllTimers } from '../helpers/updatePlayerTime'
import {
    playerWhite,
    playerBlack,
} from '../components/board components/DefineSide'

export function useMated(
    squares: keyableSquares,
    turn: string
): [boolean, boolean] {
    const [isStaleMate, setStaleMate] = useState(false)

    const mated: boolean = useMemo(() => {
        const matedOrStaleMated = isMated(squares, turn)

        if (matedOrStaleMated) stopAllTimers([playerWhite, playerBlack])

        if (typeof matedOrStaleMated === 'string') {
            setStaleMate(true)
        } else {
            return matedOrStaleMated
        }
    }, [squares, turn])

    return [mated, isStaleMate]
}
