import { useContext } from 'react'
import Timer from 'src/4.features/ui/timer/TimerDisplay'
import { Colors } from 'src/6.shared/model/constants/board'
import { boardContext } from './Board'

export default function Timers() {
    const board = useContext(boardContext)

    if (board.variant === Colors.White || board.variant === 'notChoosen') {
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
