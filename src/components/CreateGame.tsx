import React, { useContext, useState } from 'react'
import socket from '../connection/socket'
import ShareID from './ShareID'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from '../App'
import settings from '../configs/settings'
import Button from './UI/button/Button'
import Input from './UI/input/Input'

const RoomID = uuidv4()

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
        settings.offlineMode = true
    }

    function displayID() {
        socket.emit('new-game-ID', RoomID)
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
    return <ShareID roomID={RoomID}/>
  }
  
  return (
    <div className='new-game__wrapper'>
        <div className='create-game'>
            <p>Create a new Game!</p>
            <Button className='create-game__button' onClick={displayID}>
                New Game
            </Button>
        </div>
        <div className='join-game'>
            <p>Join created game!</p>
            <Input
                id='idInput'
                label
                labelText='Pass ID:'
                placeholder='game id'
                type='text'
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
            />
            <span>{error}</span>
            <Button className='create-game__button-join' onClick={join}>
                Join!
            </Button>
        </div>
        <div className='offline-game'>
            <Button onClick={setOffline}>
                Offline-mode
            </Button>
        </div>
    </div>
  )
}