export class Room {
  public id: string
  public players: string[] = []
  public board: string[]
  public firstPlayer: 'X' | 'O'

  constructor({ firstPlayer }: { firstPlayer: 'X' | 'O' | 'random' }) {
    this.id = generateId()
    this.firstPlayer =
      firstPlayer === 'random'
        ? (['X', 'O'] as const)[Math.floor(Math.random() * 2)]
        : firstPlayer
    this.currentTurn = this.firstPlayer
    this.board = Array(9).fill('')
  }

  public getWinner(): string | null {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a]
      }
    }

    if (this.board.filter((cell) => cell).length === 0) {
      return null
    }

    return null
  }

  reset() {
    this.board = Array(9).fill('')
    this.currentTurn = this.firstPlayer
  }

  currentTurn: 'X' | 'O'
  place(x: number, y: number) {
    const index = x + y * 3
    if (this.board[index]) {
      return
    }
    this.board[index] = this.currentTurn
    this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X'
  }
}

function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'

  const randomLetter = () => letters[Math.floor(Math.random() * letters.length)]
  const randomDigit = () => digits[Math.floor(Math.random() * digits.length)]

  const id =
    randomLetter() +
    randomLetter() +
    randomLetter() +
    randomDigit() +
    randomDigit() +
    randomDigit()

  return id
}
