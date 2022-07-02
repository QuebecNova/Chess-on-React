import React, { ReactElement, useContext } from 'react'
import { playSoundWhenMated } from '../../services/misc/sounds'
import { boardContext } from '../Board';

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
    
    const typeOfMessage = isStaleMate ? 'Stalemate!' : board.timeExpired ? 'Time Ends!' : 'Mate!'

    const winnedColor = board.turn === 'White' ? 'Black' : 'White'
    
    const message = isStaleMate ? 'Draw!' : `${winnedColor} player wins`!
    
    if (mated) playSoundWhenMated(board.turn, board.variant)

  return (
    <div className={`board__mated ${mated || isStaleMate || board.timeExpired ? 'active' : 'inactive'}`}>
        <p>{typeOfMessage}</p> 
        <p>{message}</p>
        <button className="custom-btn btn-5" onClick={() => restartGame()}>
            <span>New game</span>
        </button>
    </div>
  )
}