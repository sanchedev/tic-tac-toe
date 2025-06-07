import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import CreateRoom from './create-room'
import JoinRoom from './join-room'
import { useState } from 'react'

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('create')

  return (
    <div className='min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8'>
      <main className='flex flex-col w-full sm:w-96'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='gap-8'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='create'>Crear</TabsTrigger>
            <TabsTrigger value='join'>Unirse</TabsTrigger>
          </TabsList>
          <TabsContent value='create'>
            <CreateRoom />
          </TabsContent>
          <TabsContent value='join'>
            <JoinRoom />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
