<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { useTypewriter } from '~/composables/useTypewriter'

const gameStore = useGameStore()
const { gameState, currentWord, wrongGuesses, guessedLetters, maxWrongGuesses } = storeToRefs(gameStore)

// Word explanation state
const wordExplanation = ref('')
const isLoadingExplanation = ref(false)
const explanationError = ref('')

// Typewriter for explanation
const { displayedText, isTyping, type: typeText, reset: resetTypewriter } = useTypewriter(15)

async function explainWord() {
  if (isLoadingExplanation.value || wordExplanation.value) return
  
  isLoadingExplanation.value = true
  explanationError.value = ''
  
  try {
    const response = await $fetch('/api/explain-word', {
      method: 'POST',
      body: { word: currentWord.value },
    })
    wordExplanation.value = response.explanation
    typeText(response.explanation)
  } catch (err: any) {
    explanationError.value = err.data?.message || 'Failed to get explanation'
    console.error('Explanation error:', err)
  } finally {
    isLoadingExplanation.value = false
  }
}

// Reset explanation when game resets
watch(gameState, (state) => {
  if (state === 'idle') {
    wordExplanation.value = ''
    explanationError.value = ''
    resetTypewriter()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <!-- Title -->
    <h1 
      class="text-4xl md:text-6xl font-bold text-foreground mb-8 tracking-wider"
      :class="{ 'glow-danger': gameState === 'lost' }"
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
        <div v-if="gameState === 'won'" class="text-success text-2xl font-bold motion-preset-confetti motion-duration-700">
          ✓ VICTORY - You survived!
        </div>
        <div v-else-if="gameState === 'lost'" class="text-danger text-2xl font-bold motion-preset-shake glow-danger">
          ✗ HANGED - The word was: {{ currentWord }}
        </div>

        <!-- Keyboard (only during active play) -->
        <GameKeyboard 
          v-if="gameState === 'playing'"
          :guessed-letters="guessedLetters"
          :correct-letters="currentWord.split('')"
          @guess="gameStore.guessLetter"
        />

        <!-- Game End Actions -->
        <div v-if="gameState === 'won' || gameState === 'lost'" class="flex flex-col items-center gap-4">
          <!-- Word Explanation Section -->
          <div class="w-full max-w-lg">
            <!-- Explain Button - Cryptic monochromatic style -->
            <button
              v-if="!wordExplanation && !isLoadingExplanation"
              class="group w-full px-6 py-3 bg-background border border-foreground/5 hover:border-foreground/20 text-subtle hover:text-muted text-xs tracking-[0.3em] uppercase transition-all duration-500 motion-preset-fade"
              @click="explainWord"
            >
              <span class="opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                [ REVEAL KNOWLEDGE ]
              </span>
            </button>
            
            <!-- Loading State -->
            <div v-if="isLoadingExplanation" class="text-subtle text-xs tracking-widest text-center py-4 animate-pulse">
              ··· channeling the void ···
            </div>
            
            <!-- Error State -->
            <div v-if="explanationError" class="text-danger text-sm text-center py-2 motion-preset-shake">
              {{ explanationError }}
            </div>
            
            <!-- Explanation Display with Typewriter -->
            <p 
              v-if="wordExplanation" 
              class="mt-3 p-5 bg-background border border-foreground/5 text-muted text-sm leading-relaxed whitespace-pre-line"
            >{{ displayedText }}<span v-if="isTyping" class="inline-block w-1.5 h-4 bg-muted ml-0.5 animate-pulse" /></p>
          </div>

          <!-- Play Again Button -->
          <button
            class="mt-2 px-8 py-3 bg-accent hover:bg-accent-hover text-foreground font-bold tracking-wider transition-colors border border-foreground/20 motion-preset-fade motion-delay-300"
            @click="gameStore.resetGame"
          >
            PLAY AGAIN
          </button>
        </div>
      </template>
    </div>

    <!-- AI Side Panel -->
    <UiAiSidePanel v-if="gameState === 'playing'" />
  </div>
</template>
