import React, { useContext, useState } from 'react'
import { AppContext } from 'src/2.pages/ui'
import ShareID from 'src/3.widgets/ui/ShareID'
import socket from 'src/6.shared/api/socket'
import settings from 'src/6.shared/config/settings'
import Button from 'src/6.shared/ui/button'
import Input from 'src/6.shared/ui/input/Input'
import { v4 as uuidv4 } from 'uuid'

const RoomID = uuidv4()

type Props = {
    setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateGame({ setOfflineMode }: Props) {
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
        socket.on('room-error', (msg) => {
            setError(msg)
            return
        })
        socket.emit('connect-to-game', inputValue)
    }

    socket.on('room-valid', () => {
        app.setInGame(true)
    })

    if (newRoomCreated) {
        return <ShareID roomID={RoomID} />
    }

    return (
        <div className="new-game__wrapper">
            <div className="create-game">
                <p>Create a new Game!</p>
                <Button className="create-game__button" onClick={displayID}>
                    New Game
                </Button>
            </div>
            <div className="join-game">
                <p>Join created game!</p>
                <Input
                    id="idInput"
                    label
                    labelText="Pass ID:"
                    placeholder="game id"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <span>{error}</span>
                <Button className="create-game__button-join" onClick={join}>
                    Join!
                </Button>
            </div>
            <div className="offline-game">
                <Button onClick={setOffline}>Offline-mode</Button>
            </div>
        </div>
    )
}
