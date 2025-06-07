import { useEffect, useState } from 'react'
import Game from './components/game'
import { socket } from './lib/socket'
import MainPage from './components/main-page'
import { GlobalContext } from './contexts/global'
import { toast } from 'sonner'

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

    const onMessage = (data: {
      title: string
      description: string
      type: 'error' | 'success'
    }) => {
      toast[data.type](data.title, {
        description: data.description,
        style: {
          background: data.type === 'error' ? '#fcc' : 'var(--card)',
          color: 'var(--card-foreground)',
          borderRadius: 'calc(var(--radius) + 4px)',
          boxShadow:
            'var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--shadow-sm)',
          borderStyle: 'var(--tw-border-style)',
          borderColor: 'var(--border)',
        },
      })
    }

    socket.on('join', onJoin)
    socket.on('leave', onLeave)
    socket.on('players', onPlayers)
    socket.on('message', onMessage)

    return () => {
      socket.off('join', onJoin)
      socket.off('leave', onLeave)
      socket.off('players', onPlayers)
      socket.off('message', onMessage)
    }
  }, [])

  if (!roomId) return <MainPage />

  return (
    <GlobalContext value={{ roomId }}>
      <Game players={players} />
    </GlobalContext>
  )
}
