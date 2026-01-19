<script setup lang="ts">
interface Props {
  guessedLetters: Set<string>
  correctLetters: string[]
}

interface Emits {
  (e: 'guess', letter: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Keyboard layout
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const correctSet = computed(() => new Set(props.correctLetters.map(l => l.toUpperCase())))

function getKeyState(letter: string): 'unused' | 'correct' | 'wrong' {
  if (!props.guessedLetters.has(letter)) return 'unused'
  return correctSet.value.has(letter) ? 'correct' : 'wrong'
}

function handleKeyClick(letter: string) {
  if (props.guessedLetters.has(letter)) return
  emit('guess', letter)
}

// Physical keyboard support
function handleKeyDown(event: KeyboardEvent) {
  // Ignore if user is typing in an input field
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return
  }
  
  const key = event.key.toUpperCase()
  if (/^[A-Z]$/.test(key) && !props.guessedLetters.has(key)) {
    emit('guess', key)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div
      v-for="(row, rowIndex) in KEYBOARD_ROWS"
      :key="rowIndex"
      class="flex gap-1 md:gap-2"
    >
      <button
        v-for="letter in row"
        :key="letter"
        class="w-8 h-10 md:w-12 md:h-14 flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-150 border"
        :class="{
          'bg-ash hover:bg-ash-light border-bone/20 text-bone cursor-pointer': getKeyState(letter) === 'unused',
          'bg-moss/30 border-moss text-moss cursor-not-allowed': getKeyState(letter) === 'correct',
          'bg-crimson/30 border-crimson text-crimson cursor-not-allowed': getKeyState(letter) === 'wrong',
        }"
        :disabled="guessedLetters.has(letter)"
        @click="handleKeyClick(letter)"
      >
        {{ letter }}
      </button>
    </div>
    
    <!-- Hint text -->
    <p class="text-bone-muted text-sm mt-2">
      Click or type a letter
    </p>
  </div>
</template>
