<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { useTypewriter } from '~/composables/useTypewriter'

const gameStore = useGameStore()
const isOpen = ref(false)
const question = ref('')
const isLoading = ref(false)
const error = ref('')
const historyContainer = ref<HTMLElement | null>(null)

interface QAPair {
  question: string
  answer: string
}

const history = ref<QAPair[]>([])

// Typewriter for latest answer
const { displayedText: typedAnswer, isTyping, type: typeAnswer, reset: resetTypewriter } = useTypewriter(25)
const typingForIndex = ref<number | null>(null)

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
watch(typedAnswer, scrollToBottom)

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
    
    // Start typewriter for the new answer
    typingForIndex.value = history.value.length - 1
    typeAnswer(response.answer)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to get answer'
    console.error('AI Error:', err)
  } finally {
    isLoading.value = false
  }
}

function togglePanel() {
  isOpen.value = !isOpen.value
}

// Get displayed answer - typewriter for latest, full text for others
function getAnswer(index: number): string {
  if (typingForIndex.value === index) {
    return typedAnswer.value
  }
  return history.value[index]?.answer || ''
}

function isTypingAnswer(index: number): boolean {
  return typingForIndex.value === index && isTyping.value
}

// Reset history when game restarts
watch(() => gameStore.gameState, (state) => {
  if (state === 'idle') {
    history.value = []
    resetTypewriter()
    typingForIndex.value = null
  }
})
</script>

<template>
  <div class="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex">
    <!-- Toggle Tab -->
    <button
      class="h-24 w-8 bg-ash border border-r-0 border-bone/20 flex items-center justify-center text-bone hover:bg-ash-light transition-colors rounded-l"
      :class="{ 'bg-ash-light': isOpen }"
      @click="togglePanel"
      title="Ask AI for help"
    >
      <span class="transform -rotate-90 whitespace-nowrap text-sm tracking-wider">
        {{ isOpen ? '✕ CLOSE' : '? AI HELP' }}
      </span>
    </button>
    
    <!-- Panel -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="w-72 md:w-80 h-96 bg-charcoal-light border border-bone/20 flex flex-col shadow-2xl"
      >
        <!-- Header -->
        <div class="p-3 border-b border-bone/10">
          <h3 class="text-bone font-bold tracking-wide">AI Oracle</h3>
          <p class="text-bone-muted text-xs">Ask any yes/no question about the word</p>
        </div>
        
        <!-- History -->
        <div ref="historyContainer" class="flex-1 overflow-y-auto p-3 space-y-3">
          <div
            v-for="(qa, index) in history"
            :key="index"
            class="text-sm"
          >
            <p class="text-bone-muted motion-preset-fade motion-duration-300">
              <span class="text-bone">Q:</span> {{ qa.question }}
            </p>
            <p class="text-moss font-bold mt-1">
              <span class="text-bone">A:</span> 
              {{ getAnswer(index) }}<span v-if="isTypingAnswer(index)" class="inline-block w-1.5 h-3 bg-moss ml-0.5 animate-pulse" />
            </p>
          </div>
          
          <!-- Loading state -->
          <div v-if="isLoading" class="text-bone-muted text-sm animate-pulse">
            Consulting the spirits...
          </div>
          
          <!-- Error -->
          <div v-if="error" class="text-crimson text-sm motion-preset-shake">
            {{ error }}
          </div>
          
          <!-- Empty state -->
          <div v-if="!history.length && !isLoading" class="text-ash text-sm text-center py-8">
            <p>No questions asked yet.</p>
            <p class="text-xs mt-2">Try: "Does it contain the letter E?"</p>
          </div>
        </div>
        
        <!-- Input -->
        <form class="p-3 border-t border-bone/10" @submit.prevent="askQuestion">
          <div class="flex gap-2">
            <input
              v-model="question"
              type="text"
              placeholder="Ask a yes/no question..."
              class="flex-1 bg-charcoal border border-bone/20 px-3 py-2 text-bone text-sm placeholder-ash focus:outline-none focus:border-bone/40"
              :disabled="isLoading"
            >
            <button
              type="submit"
              class="px-4 py-2 bg-ash hover:bg-ash-light text-bone text-sm font-bold transition-colors disabled:opacity-50"
              :disabled="isLoading || !question.trim()"
            >
              ASK
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
