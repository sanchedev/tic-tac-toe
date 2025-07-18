import { createContext, use } from 'react'

interface GameContextType {
  currentPlayer: 'X' | 'O'
  players: [string, string]
  winner?: 'X' | 'O' | 'draw'
}

export const GameContext = createContext<GameContextType>({
  currentPlayer: 'X',
  players: ['', ''],
  winner: undefined,
})

export function useGame() {
  return use(GameContext)
}
