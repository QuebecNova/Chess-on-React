import { io } from 'socket.io-client'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://backend'
export const socket = io(BASE_URL)

socket.on('hi', (arg) => {
    console.log(arg)
})
