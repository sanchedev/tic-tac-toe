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
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { socket } from '@/lib/socket'

const createRoomSchema = z.object({
  firstPlayer: z.enum(['X', 'O', 'random']),
})

export default function CreateRoom() {
  const form = useForm<z.infer<typeof createRoomSchema>>({
    defaultValues: {
      firstPlayer: 'random',
    },
    resolver: zodResolver(createRoomSchema),
  })

  const onSubmit = (data: z.infer<typeof createRoomSchema>) => {
    socket.emit('create-room', data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Crear una sala</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              name='firstPlayer'
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>Elije tu símbolo</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) =>
                        form.setValue('firstPlayer', v as 'X')
                      }
                      value={form.watch('firstPlayer')}
                      defaultValue='X'>
                      <SelectTrigger className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='X'>X</SelectItem>
                        <SelectItem value='O'>O</SelectItem>
                        <SelectItem value='random'>Aleatorio</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type='submit' className='w-full'>
          Crear
        </Button>
      </form>
    </Form>
  )
}
