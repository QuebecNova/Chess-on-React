import React, { useState, useContext } from 'react'
import sounds from '../../services/misc/sounds'
import { boardContext } from '../Board'
import InputRange from './InputRange'
import socket from '../../connection/socket'

export default function ChooseTimerSettings() {

    const [rangeValue, setRangeValue] = useState('1')

    const board = useContext(boardContext)

    socket.on('player-choosen-time', choosenRange => {
      board.playerWhite.timer = choosenRange
      board.playerBlack.timer = choosenRange
      board.setIsTimerSet(true)
      board.setSettingsReady(true)
      sounds.newGame.play()
    })

    function setTimer() {
        const choosenRange = parseInt(rangeValue) * 60 * 1000
        board.playerWhite.timer = choosenRange
        board.playerBlack.timer = choosenRange
        board.setIsTimerSet(true)
        board.setSettingsReady(true)
        socket.emit('choosen-time', choosenRange)
        sounds.newGame.play()
    }

  return (
    <InputRange 
        setTimer={setTimer} 
        rangeValue={rangeValue} 
        setRangeValue={setRangeValue}
    />
  )
}