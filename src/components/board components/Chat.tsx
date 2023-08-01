import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import settings from '../../configs/settings'
import socket from '../../services/socket'
import scrollToBottom from '../../helpers/misc/scrollToBottom'
import Input from './../UI/input/Input'
const src = require('../../assets/images/sendButton.png')

export default function Chat() {
    const [inputValue, setInputValue] = useState<string>('')
    const [messages, setMessages] = useState<Array<string>>([])

    const msgRef = useRef()
    useEffect(() => {
        if (!msgRef.current) return
        scrollToBottom(msgRef.current)
    }, [messages.length])

    if (settings.offlineMode) return

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    function sendMessage(): void {
        socket.emit('send-message', inputValue)
        const yourMsg = 'You: ' + inputValue
        setMessages([...messages, yourMsg])
        setInputValue('')
    }

    function displayMessages(): JSX.Element[] {
        const messagesArr = []
        messages.forEach((msg) => {
            messagesArr.push(
                <p key={uuidv4()} ref={msgRef}>
                    {msg}
                </p>
            )
        })
        return messagesArr
    }

    socket.on('new-message', (msg) => {
        const opponentMsg = 'Opponent: ' + msg
        setMessages([...messages, opponentMsg])
    })

    return (
        <div className="board__chat-wrapper">
            <div className="board__chat-header">
                <p>Chat</p>
            </div>
            <div className="board__chat-content">{displayMessages()}</div>
            <div className="board__chat-input-wrapper">
                <Input
                    id="chatInput"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <img src={src} onClick={sendMessage} alt="Send button" />
            </div>
        </div>
    )
}
