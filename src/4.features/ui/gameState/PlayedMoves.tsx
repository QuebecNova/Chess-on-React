import { useEffect, useRef } from 'react'
import scrollToBottom from 'src/6.shared/lib/helpers/misc/scrollToBottom'
import { v4 as uuidv4 } from 'uuid'

type Props = {
    playedMoves: string[]
}

export default function PlayedMoves({ playedMoves }: Props) {
    const lastPlayedMove = useRef<null | HTMLDivElement>(null)
    const orderedMoves = []

    useEffect(() => {
        if (!lastPlayedMove.current) return
        scrollToBottom(lastPlayedMove.current)
    }, [playedMoves.length])

    function displayPlayedMoves(): string[] {
        if (!playedMoves.length) return

        playedMoves.forEach((move, index) => {
            const moveText = `${index}.${move}`
            orderedMoves.push(
                <p ref={lastPlayedMove} key={uuidv4()}>
                    {moveText}
                </p>
            )
        })

        return orderedMoves
    }

    return (
        <div className="board__played-moves">
            <div className="board__played-moves-header">
                <p>Played Moves</p>
            </div>
            <div className="board__played-moves-content">
                {displayPlayedMoves()}
            </div>
        </div>
    )
}
