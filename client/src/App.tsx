import { useEffect, useState } from 'react'
import Game from './components/game'
import { socket } from './lib/socket'
import MainPage from './components/main-page'
import { GlobalContext } from './contexts/global'

export default function App() {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [players, setPlayers] = useState<string[] | null>(null)

  useEffect(() => {
    const onJoin = (id: string) => {
      setRoomId(id)
    }

    const onLeave = () => {
      setRoomId(null)
      console.log('leave')
    }

    const onPlayers = (players: [string, string]) => {
      console.log('players', players)
      setPlayers(players)
    }

    socket.on('join', onJoin)
    socket.on('leave', onLeave)
    socket.on('players', onPlayers)

    return () => {
      socket.off('join', onJoin)
      socket.off('leave', onLeave)
      socket.off('players', onPlayers)
    }
  }, [])

  if (!roomId) return <MainPage />

  return (
    <GlobalContext value={{ roomId }}>
      <Game players={players} />
    </GlobalContext>
  )
}
