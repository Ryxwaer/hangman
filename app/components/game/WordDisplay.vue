<script setup lang="ts">
interface Props {
  word: string
  guessedLetters: Set<string>
  reveal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  reveal: false,
})

const letters = computed(() => {
  return props.word.split('').map((letter, index) => {
    const isGuessed = props.guessedLetters.has(letter.toUpperCase())
    const isRevealed = props.reveal && !isGuessed
    
    return {
      char: letter,
      isGuessed,
      isRevealed,
      index,
    }
  })
})
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2 md:gap-4">
    <div
      v-for="letter in letters"
      :key="letter.index"
      class="w-8 h-12 md:w-12 md:h-16 flex items-center justify-center border-b-4 transition-all duration-200"
      :class="[
        letter.isGuessed 
          ? 'border-moss text-bone' 
          : letter.isRevealed 
            ? 'border-crimson text-crimson' 
            : 'border-ash text-transparent',
      ]"
    >
      <span 
        class="text-2xl md:text-4xl font-bold"
        :class="{ 
          'animate-fade-in': letter.isGuessed,
          'animate-pulse': letter.isRevealed,
        }"
      >
        {{ letter.isGuessed || letter.isRevealed ? letter.char : '_' }}
      </span>
    </div>
  </div>
</template>
