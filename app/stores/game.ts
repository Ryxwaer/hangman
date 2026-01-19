import { defineStore } from 'pinia'
import { WORDS } from '~/data/words'

export type Difficulty = 'easy' | 'medium' | 'arcane'
export type GameState = 'idle' | 'playing' | 'won' | 'lost'

interface GameStoreState {
  gameState: GameState
  difficulty: Difficulty | null
  currentWord: string
  guessedLetters: Set<string>
  wrongGuesses: number
  maxWrongGuesses: number
}

export const useGameStore = defineStore('game', {
  state: (): GameStoreState => ({
    gameState: 'idle',
    difficulty: null,
    currentWord: '',
    guessedLetters: new Set(),
    wrongGuesses: 0,
    maxWrongGuesses: 6,
  }),

  getters: {
    correctLetters: (state): Set<string> => {
      return new Set(state.currentWord.toUpperCase().split(''))
    },

    isWordComplete(): boolean {
      if (!this.currentWord) return false
      return this.currentWord
        .toUpperCase()
        .split('')
        .every((letter: string) => this.guessedLetters.has(letter))
    },

    remainingGuesses: (state): number => {
      return state.maxWrongGuesses - state.wrongGuesses
    },
  },

  actions: {
    startGame(difficulty: Difficulty) {
      this.difficulty = difficulty
      this.currentWord = this.getRandomWord(difficulty)
      this.guessedLetters = new Set()
      this.wrongGuesses = 0
      this.gameState = 'playing'
    },

    getRandomWord(difficulty: Difficulty): string {
      const wordList = WORDS[difficulty]
      const randomIndex = Math.floor(Math.random() * wordList.length)
      return wordList[randomIndex].toUpperCase()
    },

    guessLetter(letter: string) {
      const upperLetter = letter.toUpperCase()
      
      // Ignore if already guessed or game not active
      if (this.guessedLetters.has(upperLetter) || this.gameState !== 'playing') {
        return
      }

      // Add to guessed letters
      this.guessedLetters = new Set([...this.guessedLetters, upperLetter])

      // Check if correct
      if (!this.currentWord.includes(upperLetter)) {
        this.wrongGuesses++
        
        // Check for loss
        if (this.wrongGuesses >= this.maxWrongGuesses) {
          this.gameState = 'lost'
        }
      } else {
        // Check for win
        if (this.isWordComplete) {
          this.gameState = 'won'
        }
      }
    },

    resetGame() {
      this.gameState = 'idle'
      this.difficulty = null
      this.currentWord = ''
      this.guessedLetters = new Set()
      this.wrongGuesses = 0
    },
  },
})
