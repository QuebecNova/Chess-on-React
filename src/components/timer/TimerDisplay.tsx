import React, { useContext, useEffect, useState } from 'react'
import getReturnValues from '../../services/getReturnValues'
import sounds from '../../services/misc/sounds'
import Player from '../../services/player'
import { boardContext } from '../Board'
import DateTimeDisplay from './DateTimeDisplay'
import TimerExpired from './TimerExpired'

type CounterProps = {
    player : Player
}

const ShowCounter = ({player} : CounterProps) => {

    const [hours, minutes, seconds] = getReturnValues(player.timer)
    
    const secondsLow = player.timer / 1000 < 30

    useEffect(() => {
        if (secondsLow) sounds.timeExpiring.play()
    }, [secondsLow])

    if (hours > 0) return (
        <div className='counter'>
            <DateTimeDisplay value={hours} type={'H'} />
            <p>:</p>
            <DateTimeDisplay value={minutes} type={'M'} />
            <p>:</p>
            <DateTimeDisplay value={seconds} type={'S'} />
        </div>
    )
    
    const timeExpired = player.timer <= 0

    if (!timeExpired) return (
        <div className={`counter ${secondsLow ? 'lowTime' : ''}`}>
            <DateTimeDisplay value={minutes} type={'M'} />
            <p>:</p>
            <DateTimeDisplay value={seconds} type={'S'} />
        </div>
    )

    if (timeExpired) return (
        <TimerExpired/>
    )
}

type TimerProps = {
    player : Player
}

export default function Timer({ player } : TimerProps) {

    const [countDown, setCountDown] = useState(player.timer)

    const board = useContext(boardContext)
    
    useEffect(() => {
        if (player.timer) setCountDown(player.timer)
        if (player.timer <= 0) {
            board.setTimeExpired(true)
            return
        }
        if (!player.isPlaying) return
        let sec = 0
        const interval = setInterval(() => {
            sec += 1
            const removedTime = countDown - sec * 1000
            player.timer = removedTime
            setCountDown(removedTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [countDown, player, player.timer, player.isPlaying, board])

    return (
        <>
        <p>{player.color} time:</p>
        <ShowCounter 
            player={player}
        />
        </>
    )
}
