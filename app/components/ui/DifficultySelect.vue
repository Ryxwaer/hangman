<script setup lang="ts">
import { DIFFICULTY_INFO } from '~/data/words'
import type { Difficulty } from '~/stores/game'

interface Emits {
  (e: 'select', difficulty: Difficulty): void
}

const emit = defineEmits<Emits>()

const difficulties: Difficulty[] = ['easy', 'medium', 'arcane']

function selectDifficulty(difficulty: Difficulty) {
  emit('select', difficulty)
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 animate-fade-in">
    <p class="text-bone-muted text-lg tracking-wide">Choose your fate...</p>
    
    <div class="flex flex-col md:flex-row gap-4">
      <button
        v-for="diff in difficulties"
        :key="diff"
        class="group relative px-8 py-6 min-w-[200px] border border-bone/20 bg-charcoal-light hover:bg-ash-dark transition-all duration-300 hover:border-bone/40"
        @click="selectDifficulty(diff)"
      >
        <!-- Symbol -->
        <span class="block text-3xl mb-2 transition-transform group-hover:scale-110">
          {{ DIFFICULTY_INFO[diff].symbol }}
        </span>
        
        <!-- Label -->
        <span class="block text-xl font-bold text-bone tracking-wider">
          {{ DIFFICULTY_INFO[diff].label }}
        </span>
        
        <!-- Description -->
        <span class="block text-sm text-bone-muted mt-1">
          {{ DIFFICULTY_INFO[diff].description }}
        </span>
        
        <!-- Hover glow effect for Arcane -->
        <div
          v-if="diff === 'arcane'"
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style="box-shadow: inset 0 0 20px rgba(139, 0, 0, 0.3);"
        />
      </button>
    </div>
  </div>
</template>
