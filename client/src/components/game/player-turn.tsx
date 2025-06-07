import { XIcon, CircleIcon } from 'lucide-react'
import { CardContent, Card } from '../ui/card'
import { useGame } from '@/contexts/game'
import { socket } from '@/lib/socket'

export default function PlayerTurn() {
  const { currentPlayer, players } = useGame()

  const me = players[0] === socket.id ? 'X' : 'O'

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 text-center'>
        <h2 className='font-bold text-lg'>
          Turno de{' '}
          {currentPlayer === 'X' ? (
            <XIcon className='inline' />
          ) : (
            <CircleIcon className='inline' />
          )}
        </h2>
        <p className='text-sm'>
          Eres :{' '}
          {me === 'X' ? (
            <XIcon size={16} className='inline' />
          ) : (
            <CircleIcon size={16} className='inline' />
          )}
        </p>
      </CardContent>
    </Card>
  )
}
