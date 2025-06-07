import { createContext, use } from 'react'

interface GlobalContextType {
  roomId?: string
}

export const GlobalContext = createContext<GlobalContextType>({
  roomId: undefined,
})

export function useGlobal() {
  return use(GlobalContext)
}
