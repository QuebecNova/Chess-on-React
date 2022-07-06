import React, { useEffect, useRef, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import socket from '../../connection/socket'
import scrollToBottom from '../../services/misc/scrollToBottom'
const src = require('../../assets/images/sendButton.png')

export default function Chat() {

    const [inputValue, setInputValue] = useState <string>('')
    const [messages, setMessages] = useState <Array<string>>([])

    const msgRef = useRef()

    useEffect(() => {
        if (!msgRef.current) return
        scrollToBottom(msgRef.current)
    }, [messages.length])

    function handleKeyDown(e : React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            console.log(inputValue)
        }
    }

    function sendMessage() : void {
        socket.emit('send-message', inputValue)
        const yourMsg = 'You: ' + inputValue 
        setMessages([...messages, yourMsg])
    }

    function displayMessages() : JSX.Element[] {
        const messagesArr = []
        messages.forEach(msg => {
            messagesArr.push(
                <p key={uuidv4()} ref={msgRef} >{msg}</p>
            )
        })
        return messagesArr
    }

    socket.on('new-message', (msg) => {
        const opponentMsg = 'Opponent: ' + msg 
        setMessages([...messages, opponentMsg])
    })

  return (
    <div className='board__chat-wrapper'>
        <div className='board__chat-header'>
            <p>Chat</p>
        </div>
        <div className='board__chat-content'>
            {displayMessages()}
        </div>
        <div className='board__chat-input-wrapper'>
            <label htmlFor='idInput'></label>
            <input 
                id='idInput'
                type='text' 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <img src={src} onClick={sendMessage} alt='Send button'/>
        </div>
    </div>
  )
}