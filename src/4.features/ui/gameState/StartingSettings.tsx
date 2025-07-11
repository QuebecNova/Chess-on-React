import React, { useContext, useState } from 'react'
import DefineSide from './DefineSide'
import { boardContext } from 'src/3.widgets/ui/Board'
import ChooseTimerSettings from 'src/5.entities/ui/timer/ChooseTimerSettings'

export default function StartingSettings() {
    const [isSideSet, setIsSideSet] = useState(false)

    const board = useContext(boardContext)

    if (!isSideSet) return <DefineSide setIsSideSet={setIsSideSet} />

    if (isSideSet && !board.isTimerSet) return <ChooseTimerSettings />
}
