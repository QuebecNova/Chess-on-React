'use client'

import { Field, SegmentGroup } from '@chakra-ui/react'
import { useState } from 'react'
import { OnSettingsChange } from 'src/4.features/model'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { Player } from 'src/5.entities/model'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { Colors, sounds } from 'src/6.shared/model'

export default function DefineSide({
    onSettingsChange,
}: {
    onSettingsChange: OnSettingsChange
}) {
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

    function onChange(e: SegmentGroup.ValueChangeDetails) {
        const value: 'random' | Colors = e.value as 'random' | Colors
        setVariant(value)
        let finalVariant: Colors
        if (value === 'random') {
            finalVariant = Math.random() > 0.5 ? Colors.White : Colors.Black
        } else {
            finalVariant = value
        }

        onSettingsChange({ variant: finalVariant })
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
