<script setup lang="ts">
// ASCII symbols for the animated background
const SYMBOLS = ['†', '‡', '☠', '⚰', '✝', '◊', '∴', '∵', '⌖', '※']

interface FloatingSymbol {
  id: number
  symbol: string
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

const symbols = ref<FloatingSymbol[]>([])

function generateSymbols() {
  const count = 30
  symbols.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 25,
  }))
}

onMounted(() => {
  generateSymbols()
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal to-charcoal-dark opacity-90" />
    
    <!-- Floating symbols -->
    <div
      v-for="sym in symbols"
      :key="sym.id"
      class="absolute text-ash opacity-20 select-none animate-float"
      :style="{
        left: `${sym.x}%`,
        top: `${sym.y}%`,
        fontSize: `${sym.size}rem`,
        animationDelay: `${sym.delay}s`,
        animationDuration: `${sym.duration}s`,
      }"
    >
      {{ sym.symbol }}
    </div>
    
    <!-- Fog effect at bottom -->
    <div 
      class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal-dark/50 to-transparent"
    />
    
    <!-- Subtle vignette -->
    <div 
      class="absolute inset-0"
      style="background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%);"
    />
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.15;
  }
  25% {
    transform: translateY(-30px) translateX(15px) rotate(5deg);
    opacity: 0.25;
  }
  50% {
    transform: translateY(-15px) translateX(-10px) rotate(-3deg);
    opacity: 0.15;
  }
  75% {
    transform: translateY(-45px) translateX(8px) rotate(2deg);
    opacity: 0.2;
  }
}

.animate-float {
  animation: float var(--duration, 20s) ease-in-out infinite;
}
</style>
