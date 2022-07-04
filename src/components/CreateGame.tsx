import React, { useContext, useState } from 'react'
import socket from '../connection/socket'
import ShareID from './ShareID'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from '../App'

const ID = uuidv4()

export default function CreateGame() {

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')
    const app = useContext(AppContext)

    const [newRoomCreated, setNewRoomCreated] = useState(false)

    function displayID() {
        socket.emit('new-game-ID', socket.id, ID)
        setNewRoomCreated(true)
    }

    function join() {
        socket.on('room-is-full', msg => {
            setError(msg)
            return
        })
        socket.emit('connect-to-game', inputValue)
        app.setInGame(true)
    }
    
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
    </div>
  )
}