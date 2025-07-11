import React from 'react'
import Button from 'src/6.shared/ui/button'
import RangeInput from 'src/6.shared/ui/rangeInput.tsx/RangeInput'

type Props = {
    rangeValue: string
    setRangeValue: React.Dispatch<React.SetStateAction<string>>
    setTimer: () => void
}

export default function TimeRange({
    rangeValue,
    setRangeValue,
    setTimer,
}: Props) {
    function handleChangeValue(e: React.ChangeEvent<HTMLInputElement>) {
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
                onChange={handleChangeValue}
            />
            <Button onClick={() => setTimer()}>Ok!</Button>
        </div>
    )
}
