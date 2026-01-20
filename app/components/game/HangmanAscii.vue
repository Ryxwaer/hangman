<script setup lang="ts">
import { HANGMAN_STAGES, HANGMAN_VICTORY, HANGMAN_DEAD } from '~/data/hangman-stages'
import { useGameStore } from '~/stores/game'

interface Props {
  stage: number
}

const props = defineProps<Props>()
const gameStore = useGameStore()

// Shake animation on wrong guess
const isShaking = ref(false)

watch(() => gameStore.wrongGuesses, (newVal, oldVal) => {
  if (newVal > oldVal && gameStore.gameState === 'playing') {
    isShaking.value = true
    // Remove class after animation completes (500ms default for motion-preset-shake)
    setTimeout(() => {
      isShaking.value = false
    }, 500)
  }
})

const displayArt = computed(() => {
  if (gameStore.gameState === 'won') {
    return HANGMAN_VICTORY
  }
  if (gameStore.gameState === 'lost') {
    return HANGMAN_DEAD
  }
  return HANGMAN_STAGES[Math.min(props.stage, HANGMAN_STAGES.length - 1)]
})

const artClass = computed(() => {
  if (gameStore.gameState === 'won') return 'text-success'
  if (gameStore.gameState === 'lost') return 'text-danger glow-danger'
  if (props.stage >= 4) return 'text-warning'
  return 'text-foreground'
})
</script>

<template>
  <div class="relative">
    <pre 
      class="ascii-art-lg transition-colors duration-300 select-none"
      :class="[artClass, { 'motion-preset-shake': isShaking }]"
    >{{ displayArt }}</pre>
    
    <!-- Danger indicator -->
    <div 
      v-if="stage >= 4 && gameStore.gameState === 'playing'"
      class="absolute -top-2 -right-2 text-danger animate-pulse-slow"
    >
      ⚠
    </div>
  </div>
</template>
