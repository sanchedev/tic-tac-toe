import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { socket } from '@/lib/socket'

const joinRoomSchema = z.object({
  roomId: z.string().length(6, 'Código inválido').trim(),
})

export default function JoinRoom() {
  const form = useForm<z.infer<typeof joinRoomSchema>>({
    defaultValues: {
      roomId: '',
    },
    resolver: zodResolver(joinRoomSchema),
  })

  const onSubmit = (data: z.infer<typeof joinRoomSchema>) => {
    socket.emit('join-room', data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Unirse a una sala</CardTitle>
          </CardHeader>
          <CardContent className='space-y-8'>
            <FormField
              name='roomId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de la sala</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='XXX000' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type='submit' className='w-full'>
          Unirse
        </Button>
      </form>
    </Form>
  )
}
