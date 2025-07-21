'use client'

import { Field, SegmentGroup } from '@chakra-ui/react'
import { useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Player } from 'src/5.entities/model'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { Colors, sounds } from 'src/6.shared/model'

export default function DefineSide() {
    const players = useGameStore((state) => state.players)
    const dispatch = useGameStore((state) => state.dispatch)
    const [variant, setVariant] = useState<Colors | 'random'>(Colors.White)

    function changePlayer(color: Colors) {
        dispatch({
            type: GameActionTypes.PLAYER,
            payload: {
                color,
                player: new Player(color, true, false),
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
            sounds.newGame.play()
        })
    }

    function setSide(color: Colors = Colors.White): void {
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

        sounds.newGame.play()
    }

    function onChange(e: { value: Colors | 'random' }) {
        setVariant(e.value)
        let finalVariant: Colors
        if (e.value === 'random') {
            finalVariant = Math.random() > 0.5 ? Colors.White : Colors.Black
        } else {
            finalVariant = e.value
        }

        dispatch({
            type: GameActionTypes.VARIANT,
            payload: { variant: finalVariant },
        })
    }

    return (
        <Field.Root w="fit-content">
            <SegmentGroup.Root onValueChange={onChange} value={variant}>
                <SegmentGroup.Indicator />
                <SegmentGroup.Items
                    items={[
                        { label: 'White', value: Colors.White },
                        { label: 'Random', value: 'random' },
                        { label: 'Black', value: Colors.Black },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    )
}
