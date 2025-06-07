import { useGame } from '@/contexts/game'
import { socket } from '@/lib/socket'
import { cn } from '@/lib/utils'
import { CircleIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GridCell({ x, y }: { x: number; y: number }) {
  const [state, setState] = useState<'empty' | 'X' | 'O'>('empty')
  const { currentPlayer, players, winner } = useGame()

  useEffect(() => {
    const onPlaced = (
      position: { x: number; y: number },
      symbol: 'X' | 'O'
    ) => {
      if (position.x === x && position.y === y) {
        setState(symbol)
      }
    }
    const onReseted = () => {
      setState('empty')
    }

    socket.on('placed', onPlaced)
    socket.on('reseted', onReseted)

    return () => {
      socket.off('placed', onPlaced)
      socket.off('reseted', onReseted)
    }
  }, [x, y])

  const player = currentPlayer === 'X' ? players[0] : players[1]

  return (
    <div
      className={cn(
        'flex justify-center items-center w-full h-full',
        state === 'empty' && player === socket.id
          ? 'border-2 border-border/40 rounded-xl cursor-pointer'
          : ''
      )}
      onClick={() => {
        console.log(winner)
        if (winner) return
        if (state === 'empty' && player === socket.id) {
          socket.emit('place', { x, y })
        }
      }}>
      {state === 'empty' ? null : state === 'X' ? (
        <XIcon size={48} />
      ) : (
        <CircleIcon size={48} />
      )}
    </div>
  )
}
