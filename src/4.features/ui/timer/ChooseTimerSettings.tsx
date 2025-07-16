'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import { GameActionTypes } from 'src/4.features/model/store/game'
import { socket } from 'src/6.shared/api'
import { settings } from 'src/6.shared/config'
import { Colors, sounds } from 'src/6.shared/model'
import { Button, RangeInput } from 'src/6.shared/ui'

export default function ChooseTimerSettings() {
    const [rangeValue, setRangeValue] = useState('1')

    const players = useGameStore((state) => state.players)
    const dispatch = useGameStore((state) => state.dispatch)

    function startGame(choosenRange: number) {
        players[Colors.White].timer = choosenRange
        players[Colors.Black].timer = choosenRange
        dispatch({
            type: GameActionTypes.IS_TIMER_SET,
            payload: { isTimerSet: true },
        })
        dispatch({
            type: GameActionTypes.SETTINGS_READY,
            payload: { isSettingsReady: true },
        })
        sounds.newGame.play()
    }

    useEffect(() => {
        if (!settings.offlineMode) {
            socket.on('player-choosen-time', (choosenRange) => {
                startGame(choosenRange)
                sounds.newGame.play()
            })
        }
        return () => {
            socket.removeListener('player-choosen-time')
        }
    }, [])

    function setTimer() {
        const choosenRange = parseInt(rangeValue) * 60 * 1000
        startGame(choosenRange)
        if (!settings.offlineMode) socket.emit('choosen-time', choosenRange)
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRangeValue(e.target.value)
    }

    return (
        <div className={`board__define-side active`}>
            <p>Set timer</p>
            <RangeInput
                type="range"
                label
                id="timerRange"
                labelText={`${rangeValue} minutes`}
                min={1}
                max={180}
                value={rangeValue}
                onChange={onChange}
            />
            <Button onClick={() => setTimer()}>Ok!</Button>
        </div>
    )
}
