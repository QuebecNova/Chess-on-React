import React, { useState, useContext } from 'react'
import sounds from '../../services/misc/sounds'
import { boardContext } from '../Board'
import InputRange from './InputRange'

export default function ChooseTimerSettings() {

    const [rangeValue, setRangeValue] = useState('1')

    const board = useContext(boardContext)

    function setTimer() {
        const choosenRange = parseInt(rangeValue) * 60 * 1000
        board.setIsTimerSet(true)
        board.setSettingsReady(true)
        board.playerWhite.timer = choosenRange
        board.playerBlack.timer = choosenRange
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