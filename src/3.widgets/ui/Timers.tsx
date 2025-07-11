import React, { useContext } from 'react'
import { boardContext } from './Board'
import Timer from 'src/4.features/ui/timer/TimerDisplay'

export default function Timers() {
    const board = useContext(boardContext)

    if (board.variant === 'white' || board.variant === 'notChoosen') {
        return (
            <>
                <div className="board__timer black-top">
                    <Timer player={board.playerBlack} />
                </div>
                <div className="board__timer white-bottom">
                    <Timer player={board.playerWhite} />
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="board__timer white-top">
                    <Timer player={board.playerWhite} />
                </div>
                <div className="board__timer black-bottom">
                    <Timer player={board.playerBlack} />
                </div>
            </>
        )
    }
}
