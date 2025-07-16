'use client'

import { useState } from 'react'
import { useGameStore } from 'src/4.features/model/providers'
import ChooseTimerSettings from '../timer/ChooseTimerSettings'
import DefineSide from './DefineSide'

export default function StartingSettings() {
    const [isSideSet, setIsSideSet] = useState(false)
    const isTimerSet = useGameStore((state) => state.isTimerSet)

    if (!isSideSet) return <DefineSide setIsSideSet={setIsSideSet} />

    if (isSideSet && !isTimerSet) return <ChooseTimerSettings />
}
