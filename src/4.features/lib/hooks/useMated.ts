import { useMemo, useState } from 'react'
import { playerBlack, playerWhite } from 'src/4.features/ui/gameState/DefineSide'
import { stopAllTimers } from 'src/6.shared/lib/helpers/updatePlayerTime'
import { isMated } from 'src/6.shared/lib/helpers/board/checkAndMateHandler'
import { KeyableSquares } from 'src/5.entities/model/Keyable'

export function useMated(
    squares: KeyableSquares,
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
