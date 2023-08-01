import React from 'react'
import RangeInput from '../UI/input/RangeInput'
import Button from './../UI/button/Button'

type Props = {
    rangeValue: string
    setRangeValue: React.Dispatch<React.SetStateAction<string>>
    setTimer: () => void
}

export default function InputRange({
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
