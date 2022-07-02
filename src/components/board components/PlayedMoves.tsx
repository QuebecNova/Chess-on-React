import React, { useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
    playedMoves: string[]
}

export default function PlayedMoves({playedMoves}: Props) {

    const lastPlayedMove = useRef<null | HTMLDivElement>()
    const orderedMoves = []

    useEffect(() => {
        if (!lastPlayedMove.current) return
        scrollToBottom(lastPlayedMove.current)
    }, [playedMoves.length])
    
    function displayPlayedMoves() : string[] {
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
    <div className='board__played-moves'>
        <h2>Played Moves</h2>
        {displayPlayedMoves()}
    </div>
  )
}

function scrollToBottom(lastPlayedMove : HTMLDivElement | null) : void {
    if (!lastPlayedMove) return
    lastPlayedMove.scrollIntoView(false)
}