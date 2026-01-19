<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const { gameState, currentWord, wrongGuesses, guessedLetters, maxWrongGuesses } = storeToRefs(gameStore)
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <!-- Title -->
    <h1 
      class="text-4xl md:text-6xl font-bold text-bone mb-8 tracking-wider"
      :class="{ 'glow-crimson': gameState === 'lost' }"
    >
      HANGMAN
    </h1>

    <!-- Game Area -->
    <div class="w-full max-w-4xl flex flex-col items-center gap-8">
      <!-- Difficulty Selection (before game starts) -->
      <UiDifficultySelect 
        v-if="gameState === 'idle'"
        @select="gameStore.startGame"
      />

      <!-- Active Game -->
      <template v-else>
        <!-- Hangman ASCII Art -->
        <GameHangmanAscii :stage="wrongGuesses" />

        <!-- Word Display -->
        <GameWordDisplay 
          :word="currentWord"
          :guessed-letters="guessedLetters"
          :reveal="gameState === 'lost'"
        />

        <!-- Game Status Message -->
        <div v-if="gameState === 'won'" class="text-moss text-2xl font-bold animate-fade-in">
          ✓ VICTORY - You survived!
        </div>
        <div v-else-if="gameState === 'lost'" class="text-crimson text-2xl font-bold animate-fade-in glow-crimson">
          ✗ HANGED - The word was: {{ currentWord }}
        </div>

        <!-- Keyboard (only during active play) -->
        <GameKeyboard 
          v-if="gameState === 'playing'"
          :guessed-letters="guessedLetters"
          :correct-letters="currentWord.split('')"
          @guess="gameStore.guessLetter"
        />

        <!-- Play Again Button -->
        <button
          v-if="gameState === 'won' || gameState === 'lost'"
          class="mt-4 px-8 py-3 bg-ash hover:bg-ash-light text-bone font-bold tracking-wider transition-colors border border-bone/20"
          @click="gameStore.resetGame"
        >
          PLAY AGAIN
        </button>
      </template>
    </div>

    <!-- AI Side Panel -->
    <UiAiSidePanel v-if="gameState === 'playing'" />
  </div>
</template>
