import React, { useContext } from 'react'
import sounds from '../../services/misc/sounds'
import Player from '../../services/player'
import socket from '../../connection/socket'
import { boardContext } from '../Board'
import settings from '../../configs/settings'

type Props = {
    setIsSideSet : React.Dispatch<React.SetStateAction<boolean>>
}

let playerWhite = new Player('White', 60000, false, false)
let playerBlack = new Player('Black', 60000, false, false)

export default function DefineSide({ setIsSideSet } : Props) {

    const board = useContext(boardContext)

    if (!settings.offlineMode) {
        socket.on('player-choosen-color', color => {
            if (color === 'white') {
                playerBlack = new Player('Black', 60000, false, true)
            } else {
                playerWhite = new Player('White', 60000, false, true)
            }
            board.setVariant(color === 'white' ? 'black' : 'white')
            setIsSideSet(true)
            sounds.newGame.play()
        })
    }

    function setSide(color = 'white') : void {
        if (color === 'black') {
            board.setVariant(color)
            if (!settings.offlineMode) socket.emit('choosen-side', color)
            playerBlack = new Player('Black', 60000, false, true)
        } else {
            board.setVariant(color)
            if (!settings.offlineMode) socket.emit('choosen-side', color)
            playerWhite = new Player('White', 60000, false, true)
        }
        setIsSideSet(true)
        sounds.newGame.play()
    }

  return (
    <div className={`board__define-side`}>
        <p>Choose your side</p>
        <button className='custom-btn btn-5' onClick={() => setSide('white')}>
            <span>White</span>
        </button>
        <button className='custom-btn btn-5' onClick={() => setSide('black')}>
            <span>Black</span>
        </button>
    </div>
  )
}

export {playerWhite, playerBlack}