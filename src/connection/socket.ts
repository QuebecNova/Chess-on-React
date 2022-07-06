import { io } from "socket.io-client";

const BACKEND_URL = 'https://chess-backend-server.herokuapp.com/'
//const BACKEND_URL = 'http://localhost:3001'

const socket = io(BACKEND_URL)

socket.on('hi', (arg) => {
    console.log(arg)
})

export default socket