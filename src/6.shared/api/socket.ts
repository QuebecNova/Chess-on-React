import { io } from 'socket.io-client'

//change devMode to true if you need local server
const devMode = true

const BACKEND_URL = devMode
    ? 'http://localhost:3002'
    : 'https://chess-backend-server.herokuapp.com/'

const socket = io(BACKEND_URL)

socket.on('hi', (arg) => {
    console.log(arg)
})

export default socket
