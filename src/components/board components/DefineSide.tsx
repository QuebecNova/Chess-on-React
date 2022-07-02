import React, { useContext } from 'react'
import sounds from '../../services/misc/sounds'
import { boardContext } from '../Board'

type Props = {
    setIsSideSet : React.Dispatch<React.SetStateAction<boolean>>
}

export default function DefineSide({ setIsSideSet } : Props) {

    const board = useContext(boardContext)

    function setSide(color = 'white') : void {
        if (color === 'black') {
            board.setVariant('black')
        } else {
            board.setVariant('white')
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