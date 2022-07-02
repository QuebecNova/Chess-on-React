import React, { useContext, useState } from 'react'
import { boardContext } from '../Board'
import ChooseTimerSettings from '../timer/ChooseTimerSettings'
import DefineSide from './DefineSide'

export default function StartingSettings() {

    const [isSideSet, setIsSideSet] = useState(false)

    const board = useContext(boardContext)

  if (!isSideSet) return (
    <DefineSide setIsSideSet={setIsSideSet}/>
  )

  if (isSideSet && !board.isTimerSet) return (
    <ChooseTimerSettings/>
  )
}