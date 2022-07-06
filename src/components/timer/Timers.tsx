import React, { useContext } from 'react'
import { boardContext } from '../Board'
import TimerDisplay from './TimerDisplay'

export default function Timer() {

  const board = useContext(boardContext)
  
  if (board.variant === 'white' || board.variant === 'notChoosen') { 
    return (
      <>
        <div className='board__timer black-top'>
            <TimerDisplay player={board.playerBlack}/>
        </div>
        <div className='board__timer white-bottom'>
            <TimerDisplay player={board.playerWhite}/>    
        </div>
      </>
    ) 
  } else {
    return (
      <>
        <div className='board__timer white-top'>
            <TimerDisplay player={board.playerWhite}/>    
        </div>
        <div className='board__timer black-bottom'>
            <TimerDisplay player={board.playerBlack}/>
        </div>
      </>
    ) 
  }
}