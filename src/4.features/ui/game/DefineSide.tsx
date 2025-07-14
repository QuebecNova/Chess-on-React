'use client'

import React from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Player } from 'src/5.entities/model'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { Colors, sounds } from 'src/6.shared/model'
import Button from 'src/6.shared/ui/button'

type Props = {
    setIsSideSet: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DefineSide({ setIsSideSet }: Props) {
    const players = useGameStore((state) => state.players)
    const dispatch = useGameStore((state) => state.dispatch)

    function changePlayer(color: Colors) {
        dispatch({
            type: GameActionTypes.PLAYER,
            payload: {
                color: Colors.Black,
                player: new Player(Colors.Black, true, false),
            },
        })
    }

    if (!settings.offlineMode) {
        socket.on('player-choosen-color', (color: Colors) => {
            if (color === Colors.White) {
                changePlayer(Colors.Black)
                players[Colors.Black] = new Player(Colors.Black, false, true)
            } else {
                changePlayer(Colors.White)
                players[Colors.White] = new Player(Colors.White, false, true)
            }
            dispatch({
                type: GameActionTypes.VARIANT,
                payload: {
                    variant:
                        color === Colors.White ? Colors.Black : Colors.White,
                },
            })
            setIsSideSet(true)
            sounds.newGame.play()
        })
    }

    function setSide(color = Colors.White): void {
        if (color === Colors.Black) {
            changePlayer(Colors.Black)
        } else {
            changePlayer(Colors.White)
        }

        if (!settings.offlineMode) socket.emit('choosen-side', color)

        dispatch({
            type: GameActionTypes.VARIANT,
            payload: {
                variant: color,
            },
        })

        setIsSideSet(true)
        sounds.newGame.play()
    }

    return (
        <div className={`board__define-side`}>
            <p>Choose your side</p>
            <Button onClick={() => setSide(Colors.White)}>White</Button>
            <Button onClick={() => setSide(Colors.Black)}>Black</Button>
        </div>
    )
}
