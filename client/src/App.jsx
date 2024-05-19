import { useEffect, useState, useMemo } from 'react'
import { io } from 'socket.io-client'
import { Button, Container, TextField, Typography, Stack } from '@mui/material'
const App = () => {
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [recivedMessages, setRecivedMessages] = useState([])
  const [socketID, setSocketID] = useState('')
  const [roomName, setRoomName] = useState('')

  const socket = useMemo(() => io('http://localhost:3000'), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message) return
    else if (message && !room) {
      socket.emit('message', message)
      setMessage('')
    } else if (message && room) {
      socket.emit('message', { message, room })
      setMessage('')
      setRoom('')
    }
  }

  const joinRoomHandler = (e) => {
    e.preventDefault()
    if (!roomName) return
    socket.emit('join-room', roomName)
    setRoomName('')
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to the server ${socket.id}`)
      setSocketID(socket.id)
    })

    socket.on('welcome', (msg) => {
      console.log(msg)
    })

    socket.on('joined', (msg) => {
      console.log(msg)
    })

    socket.on('left', (msg) => {
      console.log(msg)
    })

    socket.on('recivedmessage', (msg) => {
      setRecivedMessages((prev) => [...prev, msg])
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth='sm'>
      <h3>Join Room</h3>
      <form onSubmit={joinRoomHandler}>
        <TextField
          id='outlined-basic'
          label='Enter your Room Name'
          fullWidth
          variant='outlined'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button type='submit' variant='contained' color='primary' fullWidth>
          Join
        </Button>
      </form>
      <Typography variant='h2' component='div' gutterBottom>
        {socketID}
      </Typography>
      <Stack>
        {recivedMessages.map((msg, index) => (
          <Typography key={index} variant='h5' component='div' gutterBottom>
            {`${index + 1} ${msg}`}
          </Typography>
        ))}
      </Stack>

      <form onSubmit={handleSubmit}>
        <TextField
          id='outlined-basic'
          label='Enter your message'
          fullWidth
          variant='outlined'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id='outlined-basic'
          label='Enter your room'
          fullWidth
          variant='outlined'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type='submit' variant='contained' color='primary' fullWidth>
          Send
        </Button>
      </form>
    </Container>
  )
}

export default App
