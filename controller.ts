import { Socket } from 'socket.io'
import { Room } from './room.ts'

export const rooms: Map<string, Room> = new Map()

export function createRoom(
  socket: Socket,
  data: { firstPlayer: 'X' | 'O' | 'random' }
) {
  console.log(data)
  const room = new Room(data)
  rooms.set(room.id, room)
  joinRoom(socket, room.id)
}

export function joinRoom(socket: Socket, roomId: string) {
  console.log(`joining room ${roomId}`)
  if (!rooms.has(roomId)) {
    return
  }
  const room = rooms.get(roomId)!
  room.players.push(socket.id)
  socket.join(roomId)
  socket.emit('join', room.id)

  socket.to(room.id).emit('players', room.players)
  socket.emit('players', room.players)
  socket.to(room.id).emit('change-turn', room.currentTurn)
  socket.emit('change-turn', room.currentTurn)
}

export function leaveRoom(socket: Socket, roomId: string) {
  if (!rooms.has(roomId)) {
    return
  }
  const room = rooms.get(roomId)!
  const playerIndex = room.players.indexOf(socket.id)
  if (playerIndex === -1) {
    return
  }
  room.players.splice(playerIndex, 1)
  socket.leave(roomId)
  socket.emit('leave')
  console.log(`leaving room ${roomId}`)

  resetRoom(socket, room)

  if (room.players.length === 0) {
    rooms.delete(roomId)
    console.log(`room ${roomId} deleted`)
  }
}

export function place(socket: Socket, roomId: string, x: number, y: number) {
  if (!rooms.has(roomId)) {
    return
  }
  const room = rooms.get(roomId)!
  if (room.players.length !== 2) {
    return
  }
  const player = room.currentTurn === 'X' ? room.players[0] : room.players[1]

  const me = room.players.indexOf(socket.id) === 0 ? 'X' : 'O'

  if (player !== socket.id) {
    return
  }
  room.place(x, y)
  socket.to(roomId).emit('placed', { x, y }, me)
  socket.emit('placed', { x, y }, me)

  const winner = room.getWinner()
  if (winner) {
    socket.to(roomId).emit('winner', winner)
    socket.emit('winner', winner)
    return
  }

  socket.to(roomId).emit('change-turn', room.currentTurn)
  socket.emit('change-turn', room.currentTurn)
}

function resetRoom(socket: Socket, room: Room) {
  socket.to(room.id).emit('players', room.players)
  socket.emit('players', room.players)
  room.reset()
}

export function reset(socket: Socket, room: Room) {
  socket.to(room.id).emit('winner', undefined)
  socket.emit('winner', undefined)
  room.firstPlayer = room.firstPlayer === 'X' ? 'O' : 'X'
  socket.to(room.id).emit('change-turn', room.firstPlayer)
  socket.emit('change-turn', room.firstPlayer)
  socket.to(room.id).emit('reseted')
  socket.emit('reseted')
  resetRoom(socket, room)
}
