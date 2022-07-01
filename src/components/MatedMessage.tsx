import React, { ReactElement } from 'react'
import { playSoundWhenMated } from '../services/misc/sounds'

type MatedMessageProps = {
    turn: string;
    restartGame: Function;
    mated: boolean;
    isStaleMate: boolean;
    variant: string;
}

export default function MatedMessage({ turn, restartGame, mated, isStaleMate, variant }: MatedMessageProps) : ReactElement {

    const mateMessage = isStaleMate ? 'Stalemate!' : 'Mate!'
    const message = isStaleMate ? 'Draw!' : `${turn === 'White' ? 'Black' : 'White'} player wins`!

    if (mated) playSoundWhenMated(turn, variant)

  return (
    <div className={`board__mated ${mated || isStaleMate ? 'active' : 'inactive'}`}>
        <p>{mateMessage}</p>
        <p>{message}</p>
        <button className="custom-btn btn-5" onClick={() => restartGame()}>
            <span>New game</span>
        </button>
    </div>
  )
}