import React from 'react'

type Props = {
    turn: string;
    restartGame: undefined;
    mated: boolean;
}

export default function MatedMessage({turn, restartGame, mated}: Props) {
  return (
    <div className={`board__mated ${mated ? 'active' : 'inactive'}`}>
        <p>Mate!</p>
        <p>{turn === 'White' ? 'Black' : 'White'} player wins!</p>
        <button className="custom-btn btn-5" onClick={restartGame}><span>New game</span></button>
    </div>
  )
}