'use client'

import { Slider as ChakraSlider, Flex, Show } from '@chakra-ui/react'
import { useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { ValueOf } from 'src/6.shared/model'
import { Slider } from 'src/6.shared/ui'
import Select from 'src/6.shared/ui/select'

const TimeControl = {
    STANDARD: 'standard',
    UNLIMITED: 'unlimited',
} as const
type TimeControl = ValueOf<typeof TimeControl>

export default function ChooseTimerSettings() {
    const [timeControl, setTimeControl] = useState<string[]>([
        TimeControl.STANDARD,
    ])
    const increment = useGameStore((state) => state.increment)
    const initTimer = useGameStore((state) => state.initTimer)
    const dispatch = useGameStore((state) => state.dispatch)

    function setTimer(value?: number) {
        const choosenRange =
            timeControl[0] === TimeControl.UNLIMITED
                ? Infinity
                : value * 60 * 1000
        dispatch({
            type: GameActionTypes.TIMERS,
            payload: {
                timer: choosenRange,
            },
        })
        if (!settings.offlineMode) socket.emit('choosen-time', choosenRange)
    }

    function onMinutesValueChange(
        value: number | ChakraSlider.ValueChangeDetails
    ) {
        if (typeof value === 'number') {
            setTimer(value)
        } else {
            console.error(value)
        }
    }

    function onIncrementValueChange(
        value: number | ChakraSlider.ValueChangeDetails
    ) {
        if (typeof value === 'number') {
            dispatch({
                type: GameActionTypes.INCREMENT,
                payload: {
                    increment: value,
                },
            })
        } else {
            console.error(value)
        }
    }

    function onTimeControlChange({ value }: { value: string[] }) {
        setTimeControl(value)
        setTimer()
    }

    return (
        <Flex flexDirection="column" gap="3">
            <Select
                defaultValue={timeControl}
                value={timeControl}
                onValueChange={onTimeControlChange}
                label="Time control"
                items={[
                    { label: 'Standard', value: TimeControl.STANDARD },
                    { label: 'Unlimited', value: TimeControl.UNLIMITED },
                ]}
            />
            <Show when={timeControl[0] === TimeControl.STANDARD}>
                <Slider
                    label="Minutes per side"
                    marks={[
                        { value: 0.5, label: '0.5' },
                        { value: 90, label: '90' },
                        { value: 180, label: '180' },
                    ]}
                    min={0.5}
                    max={180}
                    step={0.5}
                    initialvalue={initTimer / 1000 / 60}
                    onValueChangeEnd={(value) => onMinutesValueChange(value)}
                />
                <Slider
                    label="Increment in seconds"
                    marks={[
                        { value: 0, label: '0' },
                        { value: 90, label: '90' },
                        { value: 180, label: '180' },
                    ]}
                    min={0}
                    max={180}
                    step={1}
                    initialvalue={increment}
                    onValueChangeEnd={(value) => onIncrementValueChange(value)}
                />
            </Show>
        </Flex>
    )
}
