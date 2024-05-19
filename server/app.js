import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log('User Connected', socket.id)
  socket.emit('welcome', `Welcome to Socker Server`)
  socket.broadcast.emit('joined', `${socket.id} has joined the Socker Server`)
  socket.on('disconnect', () => {
    console.log(`${socket.id} has left the Socker Server`)
    socket.broadcast.emit('left', `${socket.id} has left the Socker Server`)
  })

  socket.on('message', (data) => {
    if (typeof data === 'string') {
      console.log('Message: ', data)
      io.emit('recivedmessage', data)
    } else {
      console.log('Message: ', data.message, 'Room: ', data.room)
      io.to(data.room).emit('recivedmessage', data.message)
    }
  })

  socket.on('join-room', (room) => {
    socket.join(room)
  })
})

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
