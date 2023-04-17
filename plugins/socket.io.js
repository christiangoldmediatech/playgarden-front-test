import io from 'socket.io-client'
const socket = io(process.env.apiBaseUrl, { transports: ['websocket'] })
export default socket
