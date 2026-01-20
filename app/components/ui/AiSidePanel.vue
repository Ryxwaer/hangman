<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const isOpen = ref(false)
const question = ref('')
const isLoading = ref(false)
const error = ref('')
const historyContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

interface QAPair {
  question: string
  answer: string
}

const history = ref<QAPair[]>([])

// Auto-scroll to bottom when history changes
function scrollToBottom() {
  nextTick(() => {
    if (historyContainer.value) {
      historyContainer.value.scrollTop = historyContainer.value.scrollHeight
    }
  })
}

watch(history, scrollToBottom, { deep: true })
watch(isLoading, scrollToBottom)

async function askQuestion() {
  if (!question.value.trim() || isLoading.value) return
  
  const currentQuestion = question.value.trim()
  question.value = ''
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/ask-ai', {
      method: 'POST',
      body: {
        word: gameStore.currentWord,
        question: currentQuestion,
      },
    })
    
    history.value.push({
      question: currentQuestion,
      answer: response.answer,
    })
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to get answer'
    console.error('AI Error (full):', JSON.stringify(err, null, 2))
    console.error('AI Error (original):', err)
  } finally {
    isLoading.value = false
  }
}

function togglePanel() {
  isOpen.value = !isOpen.value
}

// Auto-focus input when panel opens
watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

// Reset history when game restarts
watch(() => gameStore.gameState, (state) => {
  if (state === 'idle') {
    history.value = []
  }
})
</script>

<template>
  <div 
    class="fixed z-50 flex transition-[right] duration-300 ease-out top-4 md:top-1/2 md:-translate-y-1/2"
    :class="isOpen ? 'right-0' : '-right-64 md:-right-80'"
  >
    <!-- Toggle Tab -->
    <button
      class="h-16 md:h-24 w-7 md:w-8 bg-accent border border-r-0 border-foreground/20 flex items-center justify-center text-foreground hover:bg-accent-hover transition-colors rounded-l shrink-0"
      :class="{ 'bg-accent-hover': isOpen }"
      @click="togglePanel"
      title="Ask AI for help"
    >
      <span class="transform -rotate-90 whitespace-nowrap text-xs md:text-sm tracking-wider">
        {{ isOpen ? '✕' : '? Oracle' }}
      </span>
    </button>
    
    <!-- Panel -->
    <div
      class="w-64 md:w-80 h-72 md:h-96 bg-surface border border-l-0 border-foreground/20 flex flex-col shadow-2xl"
    >
      <!-- Header -->
      <div class="p-3 border-b border-foreground/10">
        <h3 class="text-foreground font-bold tracking-wide">Oracle</h3>
        <p class="text-muted text-xs">Ask any yes/no question about the word</p>
      </div>
      
      <!-- History -->
      <div ref="historyContainer" class="flex-1 overflow-y-auto p-3 space-y-3">
        <div
          v-for="(qa, index) in history"
          :key="index"
          class="text-sm"
        >
          <p class="text-muted motion-preset-fade motion-duration-300">
            <span class="text-foreground">Q:</span> {{ qa.question }}
          </p>
          <p class="text-success font-bold mt-1 motion-preset-typewriter-[20] motion-duration-500">
            <span class="text-foreground">A:</span> {{ qa.answer }}
          </p>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="text-muted text-sm animate-pulse">
          Consulting the spirits...
        </div>
        
        <!-- Error -->
        <div v-if="error" class="text-danger text-sm motion-preset-shake">
          {{ error }}
        </div>
        
        <!-- Empty state -->
        <div v-if="!history.length && !isLoading" class="text-accent text-sm text-center py-8">
          <p>No questions asked yet.</p>
          <p class="text-xs mt-2">Try: "Is it an object?"</p>
        </div>
      </div>
      
      <!-- Input -->
      <form class="p-2 md:p-3 border-t border-foreground/10" @submit.prevent="askQuestion">
        <div class="flex gap-1 md:gap-2">
          <input
            ref="inputRef"
            v-model="question"
            type="text"
            placeholder="Yes/no question..."
            class="flex-1 min-w-0 bg-background border border-foreground/20 px-2 md:px-3 py-2 text-foreground text-base md:text-sm placeholder-accent focus:outline-none focus:border-foreground/40"
            :disabled="isLoading"
          >
          <button
            type="submit"
            class="px-3 md:px-4 py-2 bg-accent hover:bg-accent-hover text-foreground text-sm font-bold transition-colors disabled:opacity-50 shrink-0"
            :disabled="isLoading || !question.trim()"
          >
            ASK
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
