import { io } from "socket.io-client";

const BACKEND_URL = 'https://chess-backend-server.herokuapp.com/'

const socket = io(BACKEND_URL)

socket.on('hi', (arg) => {
    console.log(arg)
})

export default socket