import React, { useContext, useState } from 'react'
import socket from '../connection/socket'
import ShareID from './ShareID'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from '../App'

const ID = uuidv4()

type Props = {
    setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateGame({setOfflineMode} : Props) {

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    const app = useContext(AppContext)

    const [newRoomCreated, setNewRoomCreated] = useState(false)

    function setOffline() {
        app.setInGame(true)
        setOfflineMode(true)
    }

    function displayID() {
        socket.emit('new-game-ID', ID)
        setNewRoomCreated(true)
    }

    async function join() {
        socket.on('room-error', msg => {
            setError(msg)
            return
        })
        socket.emit('connect-to-game', inputValue)
    }

    socket.on('room-valid', () => {
        app.setInGame(true)
    })
    
  if (newRoomCreated) {
    return <ShareID roomID={ID}/>
  }
  
  return (
    <div className='new-game__wrapper'>
        <div className='create-game'>
            <p>Create a new Game!</p>
            <button className='custom-btn btn-5 create-game__button' onClick={displayID}>
                <span>New Game</span>
            </button>
        </div>
        <div className='join-game'>
            <p>Join created game!</p>
            <label htmlFor='idInput'>Pass ID:</label>
            <input 
                id='idInput'
                type='text' 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
            /><span>{error}</span>
            <button className='custom-btn btn-5 create-game__button-join' onClick={join}>
                <span>Join!</span>
            </button>
        </div>
        <div className='offline-game'>
            <button className='custom-btn btn-5' onClick={setOffline}>
                <span>Offline-mode</span>
            </button>
        </div>
    </div>
  )
}