import { useEffect } from 'react'
import { getParsedTime } from 'src/6.shared/lib/helpers'
import { sounds } from 'src/6.shared/model'
import DateTimeDisplay from './DateTimeDisplay'

type CounterProps = {
    timer: number
}

export default function ShowCounter({ timer }: CounterProps) {
    const [hours, minutes, seconds] = getParsedTime(timer)

    const secondsLow = timer / 1000 < 30

    useEffect(() => {
        if (secondsLow) sounds.timeExpiring.play()
    }, [secondsLow])

    if (hours > 0)
        return (
            <div className="counter">
                <DateTimeDisplay value={hours} type={'H'} />
                <p>:</p>
                <DateTimeDisplay value={minutes} type={'M'} />
                <p>:</p>
                <DateTimeDisplay value={seconds} type={'S'} />
            </div>
        )

    const timeExpired = timer <= 0

    if (!timeExpired)
        return (
            <div className={`counter ${secondsLow ? 'lowTime' : ''}`}>
                <DateTimeDisplay value={minutes} type={'M'} />
                <p>:</p>
                <DateTimeDisplay value={seconds} type={'S'} />
            </div>
        )

    if (timeExpired)
        return (
            <div className="counter expired">
                <p>Expired</p>
            </div>
        )
}
