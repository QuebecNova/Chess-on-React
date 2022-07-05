import React, { ReactElement, useContext, useState } from 'react'
import socket from '../../connection/socket';
import { playSoundWhenMated } from '../../services/misc/sounds'
import { boardContext } from '../Board';
import Waiting from './Waiting';

type MatedMessageProps = {
    restartGame: Function;
    mated: boolean;
    isStaleMate: boolean;
}

export default function MatedMessage(props: MatedMessageProps) : ReactElement {

    const {
      restartGame, 
      mated, 
      isStaleMate,
    } = props
  
    const board = useContext(boardContext)
    
    const [waitingForAccept, setWaitingForAccept] = useState(false)
    
    function restart() {
      socket.emit('restart-game')
      setWaitingForAccept(true)
    }
    
    if (waitingForAccept) return (
      <Waiting 
        waitingForAccept={waitingForAccept} 
        restartGame={restartGame} 
        setWaitingForAccept={setWaitingForAccept}
      />
    )
    const typeOfMessage = isStaleMate ? 'Stalemate!' : board.timeExpired ? 'Time Ends!' : 'Mate!'

    const winnedColor = board.turn === 'White' ? 'Black' : 'White'
    
    const message = isStaleMate ? 'Draw!' : `${winnedColor} player wins`!
    
    if (mated) playSoundWhenMated(board.turn, board.variant)

  if (!board.opponnentWantsRestart) return (
    <div className={`board__mated ${mated || isStaleMate || board.timeExpired ? 'active' : 'inactive'}`}>
        <p>{typeOfMessage}</p> 
        <p>{message}</p>
        <button className="custom-btn btn-5" onClick={restart}>
            <span>Send rematch</span>
        </button>
    </div>
  )
}