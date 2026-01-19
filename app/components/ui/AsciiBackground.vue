<script setup lang="ts">
// ASCII Pentagram and occult symbols background

// Large ASCII pentagram made from characters
const PENTAGRAM = `
                                             ▲
                                            /█\\
                                           / █ \\
                                          /  █  \\
                                         /   █   \\
                                        /    █    \\
                                       /     █     \\
                                      /      █      \\
                                     /       █       \\
                                    /        █        \\
                                   /         █         \\
                                  /          █          \\
                                 /           █           \\
                                /            █            \\
                               /             █             \\
                              /              █              \\
                             /               █               \\
                            /                █                \\
           ════════════════/═════════════════█═════════════════\\════════════════
                           \\                                   /
                            \\                                 /
                             \\                               /
                              \\                             /
                               \\                           /
                                \\                         /
                                 \\                       /
                                  \\         ▼           /
                                   \\       /█\\         /
                                    \\     / █ \\       /
                                     \\   /  █  \\     /
                                      \\ /   █   \\   /
                                       X    █    \\ /
                                      / \\   █   / \\
                                     /   \\  █  /   \\
                                    /     \\ █ /     \\
                                   /       \\█/       \\
                                  ▼═════════█═════════▼
`

// Circular text for rune rings
const RUNES_OUTER = '᛫ᚠ᛫ᚢ᛫ᚦ᛫ᚨ᛫ᚱ᛫ᚲ᛫ᚷ᛫ᚹ᛫ᚺ᛫ᚾ᛫ᛁ᛫ᛃ᛫ᛇ᛫ᛈ᛫ᛉ᛫ᛊ᛫ᛏ᛫ᛒ᛫ᛖ᛫ᛗ᛫ᛚ᛫ᛜ᛫ᛞ᛫ᛟ᛫'

// Floating occult symbols
const OCCULT_SYMBOLS = ['☠', '†', '‡', '⛧', '✝', '☽', '☾', '◊', '∞', '⚰', '✞', '⁂', '※', '⌖', '◈', '⛤', '☥', '♱']

interface FloatingSymbol {
  id: number
  symbol: string
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
}

interface RuneChar {
  char: string
  angle: number
}

const floatingSymbols = ref<FloatingSymbol[]>([])

// Generate rune positions in a circle
const outerRunes = computed<RuneChar[]>(() => {
  const chars = RUNES_OUTER.split('')
  return chars.map((char, i) => ({
    char,
    angle: (360 / chars.length) * i,
  }))
})

const innerRunes = computed<RuneChar[]>(() => {
  const chars = RUNES_OUTER.split('').reverse()
  return chars.map((char, i) => ({
    char,
    angle: (360 / chars.length) * i,
  }))
})

function generateSymbols() {
  floatingSymbols.value = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    symbol: OCCULT_SYMBOLS[Math.floor(Math.random() * OCCULT_SYMBOLS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.8 + Math.random() * 1.5,
    delay: Math.random() * 15,
    duration: 20 + Math.random() * 30,
    opacity: 0.15 + Math.random() * 0.2,
  }))
}

onMounted(() => {
  generateSymbols()
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-radial" />

    <!-- Outer rotating rune circle -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="rune-ring rune-ring-outer">
        <span
          v-for="(rune, index) in outerRunes"
          :key="`outer-${index}`"
          class="rune-char"
          :style="{
            transform: `rotate(${rune.angle}deg) translateY(-42vmin) rotate(-${rune.angle}deg)`,
          }"
        >
          {{ rune.char }}
        </span>
      </div>
    </div>

    <!-- Inner rotating rune circle (opposite direction) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="rune-ring rune-ring-inner">
        <span
          v-for="(rune, index) in innerRunes"
          :key="`inner-${index}`"
          class="rune-char-inner"
          :style="{
            transform: `rotate(${rune.angle}deg) translateY(-32vmin) rotate(-${rune.angle}deg)`,
          }"
        >
          {{ rune.char }}
        </span>
      </div>
    </div>

    <!-- Central pentagram -->
    <div class="absolute inset-0 flex items-center justify-center">
      <pre class="pentagram select-none">{{ PENTAGRAM }}</pre>
    </div>

    <!-- Pulsing glow behind pentagram -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="pentagram-glow" />
    </div>

    <!-- Floating occult symbols -->
    <div
      v-for="sym in floatingSymbols"
      :key="sym.id"
      class="absolute select-none floating-symbol"
      :style="{
        left: `${sym.x}%`,
        top: `${sym.y}%`,
        fontSize: `${sym.size}rem`,
        animationDelay: `${sym.delay}s`,
        animationDuration: `${sym.duration}s`,
        opacity: sym.opacity,
        color: sym.id % 4 === 0 ? 'var(--color-crimson)' : 'var(--color-ash)',
      }"
    >
      {{ sym.symbol }}
    </div>

    <!-- Corner pentagrams -->
    <div class="absolute top-6 left-6 text-ash opacity-30 text-2xl select-none animate-pulse-slow">⛤</div>
    <div class="absolute top-6 right-6 text-ash opacity-30 text-2xl select-none animate-pulse-slow">⛤</div>
    <div class="absolute bottom-6 left-6 text-ash opacity-30 text-2xl select-none animate-pulse-slow">⛤</div>
    <div class="absolute bottom-6 right-6 text-ash opacity-30 text-2xl select-none animate-pulse-slow">⛤</div>

    <!-- Edge runes -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 text-ash opacity-20 text-sm tracking-[0.5em] select-none">
      ᛟ᛫ᚠᚢᚦᚨᚱᚲ᛫ᛟ
    </div>
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 text-ash opacity-20 text-sm tracking-[0.5em] select-none">
      ᛟ᛫ᚠᚢᚦᚨᚱᚲ᛫ᛟ
    </div>

    <!-- Scanline effect -->
    <div class="absolute inset-0 scanlines" />

    <!-- Fog/mist at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />

    <!-- Vignette -->
    <div class="absolute inset-0 vignette" />
  </div>
</template>

<style scoped>
.bg-gradient-radial {
  background: 
    radial-gradient(ellipse at center, rgba(139, 0, 0, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at center, var(--color-charcoal-light) 0%, var(--color-charcoal) 40%, var(--color-charcoal-dark) 100%);
}

/* Rune ring container */
.rune-ring {
  position: relative;
  width: 1px;
  height: 1px;
}

.rune-ring-outer {
  animation: rotateRunes 180s linear infinite;
}

.rune-ring-inner {
  animation: rotateRunesReverse 120s linear infinite;
}

.rune-char {
  position: absolute;
  font-size: 1.8rem;
  color: var(--color-bone-muted);
  opacity: 0.5;
  text-shadow: 0 0 15px var(--color-crimson);
}

.rune-char-inner {
  position: absolute;
  font-size: 1.3rem;
  color: var(--color-crimson);
  opacity: 0.4;
  text-shadow: 0 0 10px var(--color-crimson-dark);
}

@keyframes rotateRunes {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotateRunesReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Pentagram styling */
.pentagram {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.35rem, 1vw, 0.7rem);
  line-height: 1.1;
  color: var(--color-crimson);
  opacity: 0.6;
  animation: pentagramPulse 6s ease-in-out infinite;
  text-shadow: 0 0 40px var(--color-crimson), 0 0 80px var(--color-crimson-dark);
  white-space: pre;
}

@keyframes pentagramPulse {
  0%, 100% { 
    opacity: 0.25;
    text-shadow: 0 0 10px var(--color-crimson-dark);
  }
  50% { 
    opacity: 0.45;
    text-shadow: 0 0 30px var(--color-crimson), 0 0 60px var(--color-crimson-dark);
  }
}

/* Glow effect */
.pentagram-glow {
  width: 50vmin;
  height: 50vmin;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(139, 0, 0, 0.15) 0%, transparent 60%);
  animation: glowPulse 6s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes glowPulse {
  0%, 100% { 
    transform: scale(0.9);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.6;
  }
}

/* Floating symbols */
.floating-symbol {
  animation: floatOccult 25s ease-in-out infinite;
  text-shadow: 0 0 5px currentColor;
}

@keyframes floatOccult {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-50px) translateX(25px) rotate(15deg);
  }
  50% {
    transform: translateY(-25px) translateX(-20px) rotate(-10deg);
  }
  75% {
    transform: translateY(-70px) translateX(15px) rotate(8deg);
  }
}

/* CRT scanline effect */
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
  opacity: 0.4;
}

/* Vignette */
.vignette {
  background: radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,0.7) 100%);
}

/* Pulse animation for corners */
.animate-pulse-slow {
  animation: pulseSlow 4s ease-in-out infinite;
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}
</style>
