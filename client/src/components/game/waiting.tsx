import { useGlobal } from '@/contexts/global'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CopyIcon } from 'lucide-react'
import { socket } from '@/lib/socket'

export default function Waiting() {
  const { roomId } = useGlobal()

  return (
    <div className='w-full min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8'>
      <main className='flex flex-col gap-8 w-96'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl text-center'>
              Esperando tu oponente
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Label className='text-center'>Código de la sala</Label>
              <div className='flex w-full max-w-sm items-center gap-2'>
                <Input value={roomId} disabled readOnly />
                <Button
                  size='icon'
                  variant='outline'
                  onClick={() => {
                    navigator.clipboard.writeText(roomId ?? '')
                  }}>
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <Button
              className='w-full'
              variant='destructive'
              onClick={() => socket.emit('leave', roomId)}>
              Salir
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
