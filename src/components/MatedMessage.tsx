import React, { ReactElement } from 'react'

type MatedMessageProps = {
    turn: string;
    restartGame: Function;
    mated: boolean;
}

export default function MatedMessage({turn, restartGame, mated}: MatedMessageProps) : ReactElement {
  return (
    <div className={`board__mated ${mated ? 'active' : 'inactive'}`}>
        <p>Mate!</p>
        <p>{turn === 'White' ? 'Black' : 'White'} player wins!</p>
        <button className="custom-btn btn-5" onClick={() => restartGame()}><span>New game</span></button>
    </div>
  )
}