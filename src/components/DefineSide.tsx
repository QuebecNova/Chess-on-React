import React, { useState } from 'react'
import sounds from '../services/misc/sounds'

type Props = {
    setVariant: React.Dispatch<React.SetStateAction<string>>
}

export default function DefineSide({ setVariant }: Props) {    

    const [active, setActive] = useState<boolean>(true)

    function setSide(color = 'white') : void {
        if (color === 'black') {
            setVariant('black')
        } else {
            setVariant('white')
        }

        sounds.newGame.play()
        setActive(false)
    }

  return (
    <div className={`board__define-side ${active ? 'active' : 'inactive'}`}>
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