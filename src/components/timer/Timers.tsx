import React, { useContext } from 'react'
import { boardContext } from '../Board'
import TimerDisplay from './TimerDisplay'

export default function Timer() {

  const board = useContext(boardContext)
  
  if (board.variant === 'white' || board.variant === 'notChoosen') { 
    return (
      <div className='board__both-timers'>
        <div className='board__timer black'>
            <TimerDisplay player={board.playerBlack}/>
        </div>
        <div className='board__timer white'>
            <TimerDisplay player={board.playerWhite}/>    
        </div>
      </div>
    ) 
  } else {
    return (
      <div className='board__both-timers'>
        <div className='board__timer white'>
            <TimerDisplay player={board.playerWhite}/>    
        </div>
        <div className='board__timer black'>
            <TimerDisplay player={board.playerBlack}/>
        </div>
      </div>
    ) 
  }
}