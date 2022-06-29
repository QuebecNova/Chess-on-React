import React, { ReactElement } from 'react'

type MatedMessageProps = {
    turn: string;
    restartGame: Function;
    mated: boolean;
    isStaleMate: boolean;
}

export default function MatedMessage({ turn, restartGame, mated, isStaleMate }: MatedMessageProps) : ReactElement {

    const mateMessage = isStaleMate ? 'Stalemate!' : 'Mate!'
    const message = isStaleMate ? 'Draw!' : `${turn === 'White' ? 'Black' : 'White'} player wins`!

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