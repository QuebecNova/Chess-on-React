'use client'

import { useGameStore } from 'src/4.features/model/providers'
import { Timer } from 'src/4.features/ui'
import { Colors } from 'src/6.shared/model'

export default function Timers() {
    const variant = useGameStore((state) => state.variant)
    const players = useGameStore((state) => state.players)

    if (variant === Colors.White || !variant) {
        return (
            <>
                <div className="board__timer black-top">
                    <Timer player={players[Colors.Black]} />
                </div>
                <div className="board__timer white-bottom">
                    <Timer player={players[Colors.White]} />
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="board__timer white-top">
                    <Timer player={players[Colors.White]} />
                </div>
                <div className="board__timer black-bottom">
                    <Timer player={players[Colors.Black]} />
                </div>
            </>
        )
    }
}
