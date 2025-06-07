import { Server } from 'socket.io'
import { Application } from 'oak'
import {
  createRoom,
  joinRoom,
  leaveRoom,
  place,
  reset,
  rooms,
} from './controller.ts'

const app = new Application()

app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/public`,
    index: 'index.html',
  })
})

const io = new Server()

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`)
  socket.join(socket.id)

  socket.on('create-room', (data) => {
    createRoom(socket, data)
  })

  socket.on('join-room', (roomId) => {
    joinRoom(socket, roomId.roomId)
  })

  socket.on('leave', (roomId) => {
    leaveRoom(socket, roomId)
  })

  socket.on('place', ({ x, y }) => {
    const roomId = [...rooms.values()].find((room) =>
      room.players.includes(socket.id)
    )?.id
    if (!roomId) {
      return
    }
    place(socket, roomId, x, y)
  })

  socket.on('reset', (roomId) => {
    const room = rooms.get(roomId)
    if (!room) {
      return
    }
    reset(socket, room)
  })

  socket.on('disconnect', (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
    socket.leave(socket.id)
    const roomId = [...rooms.values()].find((room) =>
      room.players.includes(socket.id)
    )?.id
    if (!roomId) {
      return
    }
    leaveRoom(socket, roomId)
  })
})

const handler = io.handler(async (req) => {
  return (await app.handle(req)) || new Response(null, { status: 404 })
})

Deno.serve({
  handler,
  port: 3000,
})
