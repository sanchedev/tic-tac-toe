import { socket } from '@/lib/socket'
import Grid from './grid'
import PlayerTurn from './player-turn'
import { useEffect, useState } from 'react'
import { GameContext } from '@/contexts/game'
import Waiting from './waiting'
import { Button } from '../ui/button'
import { useGlobal } from '@/contexts/global'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { CircleIcon, XIcon } from 'lucide-react'

export default function Game({ players }: { players: string[] | null }) {
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | undefined>(
    undefined
  )
  const { roomId } = useGlobal()

  useEffect(() => {
    const onChangeTurn = (player: 'X' | 'O') => {
      setCurrentPlayer(player)
    }

    const onWinner = (player: 'X' | 'O' | 'draw' | undefined) => {
      setWinner(player)
    }

    socket.on('change-turn', onChangeTurn)
    socket.on('winner', onWinner)

    return () => {
      socket.off('change-turn', onChangeTurn)
      socket.off('winner', onWinner)
    }
  }, [])

  if (!players || players.length !== 2) return <Waiting />

  const me = players[0] === socket.id ? 'X' : 'O'

  return (
    <GameContext
      value={{ currentPlayer, players: players as [string, string], winner }}>
      <div className='w-full min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8 w-96'>
          {winner && (
            <AlertDialog open={winner === 'X' || winner === 'O'}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-2xl text-center'>
                    {winner === 'draw'
                      ? 'Empate'
                      : me === winner
                      ? '¡Ganaste!'
                      : 'Perdiste'}
                  </AlertDialogTitle>
                </AlertDialogHeader>
                {winner === 'draw' ? (
                  <p className='text-center'>Parecen haber empatado.</p>
                ) : (
                  <p className='text-center'>
                    El jugador{' '}
                    {winner === 'X' ? (
                      <XIcon className='inline' />
                    ) : (
                      <CircleIcon className='inline' />
                    )}{' '}
                    ha ganado
                  </p>
                )}
                <div className='grid sm:grid-cols-2 gap-4'>
                  <Button
                    className='w-full'
                    variant='destructive'
                    onClick={() => socket.emit('leave', roomId)}>
                    Salir
                  </Button>
                  <Button
                    className='w-full'
                    variant='outline'
                    onClick={() => socket.emit('reset', roomId)}>
                    Revancha
                  </Button>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <PlayerTurn />
          <Grid />
          <Button
            className='w-full'
            variant='destructive'
            onClick={() => socket.emit('leave', roomId)}>
            Salir
          </Button>
        </div>
      </div>
    </GameContext>
  )
}
