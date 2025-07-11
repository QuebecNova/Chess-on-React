import React, { useState, useContext } from 'react'
import { boardContext } from 'src/3.widgets/ui/Board'
import socket from 'src/6.shared/api/socket'
import settings from 'src/6.shared/config/settings'
import sounds from 'src/6.shared/lib/helpers/misc/sounds'
import TimeRange from './TimeRange'

export default function ChooseTimerSettings() {
    const [rangeValue, setRangeValue] = useState('1')

    const board = useContext(boardContext)

    if (!settings.offlineMode) {
        socket.on('player-choosen-time', (choosenRange) => {
            board.playerWhite.timer = choosenRange
            board.playerBlack.timer = choosenRange
            board.setIsTimerSet(true)
            board.setSettingsReady(true)
            sounds.newGame.play()
        })
    }

    function setTimer() {
        const choosenRange = parseInt(rangeValue) * 60 * 1000
        board.playerWhite.timer = choosenRange
        board.playerBlack.timer = choosenRange
        board.setIsTimerSet(true)
        board.setSettingsReady(true)
        if (!settings.offlineMode) socket.emit('choosen-time', choosenRange)
        sounds.newGame.play()
    }

    return (
        <TimeRange
            setTimer={setTimer}
            rangeValue={rangeValue}
            setRangeValue={setRangeValue}
        />
    )
}
