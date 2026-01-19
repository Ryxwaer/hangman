<script setup lang="ts">
import { HANGMAN_STAGES, HANGMAN_VICTORY, HANGMAN_DEAD } from '~/data/hangman-stages'
import { useGameStore } from '~/stores/game'

interface Props {
  stage: number
}

const props = defineProps<Props>()
const gameStore = useGameStore()

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
  if (gameStore.gameState === 'won') return 'text-moss'
  if (gameStore.gameState === 'lost') return 'text-crimson glow-crimson'
  if (props.stage >= 4) return 'text-crimson-light'
  return 'text-bone'
})
</script>

<template>
  <div class="relative">
    <pre 
      class="ascii-art-lg transition-colors duration-300 select-none"
      :class="artClass"
    >{{ displayArt }}</pre>
    
    <!-- Danger indicator -->
    <div 
      v-if="stage >= 4 && gameStore.gameState === 'playing'"
      class="absolute -top-2 -right-2 text-crimson animate-pulse-slow"
    >
      ⚠
    </div>
  </div>
</template>
