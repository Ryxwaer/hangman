<script setup lang="ts">
// ASCII Pentagram and occult symbols background

// Large ASCII pentagram made from characters
const PENTAGRAM = `
                                        .
                                       /|\\
                                      / | \\
                                     /  |  \\
                                    /   |   \\
                                   /    |    \\
                                  /     |     \\
                                 /      |      \\
                                /       |       \\
                               /        |        \\
                              /         |         \\
                             /          |          \\
                            /           |           \\
                           /            |            \\
                          /             |             \\
                         /              |              \\
                        /               |               \\
                       /                |                \\
                      /                 |                 \\
                     /                  |                  \\
          __________/___________________+___________________\\__________
                    \\                                      /
                     \\                                    /
                      \\                                  /
                       \\                                /
                        \\                              /
                         \\                            /
                          \\                          /
                           \\                        /
                            \\          .           /
                             \\        /|\\         /
                              \\      / | \\       /
                               \\    /  |  \\     /
                                \\  /   |   \\   /
                                 \\/    |    \\ /
                                  \\    |    //
                                   \\   |   //
                                    \\  |  //
                                     \\ | //
                                      \\|//
                                       V
`

// Outer circle runes
const RUNES = '᛫ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ᛫'

// Floating occult symbols
const OCCULT_SYMBOLS = ['☠', '†', '‡', '⛧', '✝', '☽', '☾', '◊', '∞', '⚰', '✞', '⁂', '※', '⌖', '◈']

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

const floatingSymbols = ref<FloatingSymbol[]>([])
const runeRotation = ref(0)

function generateSymbols() {
  floatingSymbols.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    symbol: OCCULT_SYMBOLS[Math.floor(Math.random() * OCCULT_SYMBOLS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.6 + Math.random() * 1.2,
    delay: Math.random() * 15,
    duration: 20 + Math.random() * 30,
    opacity: 0.1 + Math.random() * 0.15,
  }))
}

onMounted(() => {
  generateSymbols()
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-radial from-charcoal-light via-charcoal to-charcoal-dark" />

    <!-- Outer rotating rune circle -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div 
        class="rune-circle text-ash select-none"
        style="font-size: 1.2rem; letter-spacing: 0.8em;"
      >
        {{ RUNES }}{{ RUNES }}
      </div>
    </div>

    <!-- Inner rotating rune circle (opposite direction) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div 
        class="rune-circle-reverse text-ash-dark select-none"
        style="font-size: 0.9rem; letter-spacing: 0.6em;"
      >
        {{ RUNES }}
      </div>
    </div>

    <!-- Central pentagram -->
    <div class="absolute inset-0 flex items-center justify-center">
      <pre 
        class="pentagram text-crimson-dark select-none leading-none"
        style="font-size: clamp(0.15rem, 0.5vw, 0.35rem); opacity: 0.25;"
      >{{ PENTAGRAM }}</pre>
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
        color: sym.id % 3 === 0 ? 'var(--color-crimson-dark)' : 'var(--color-ash)',
      }"
    >
      {{ sym.symbol }}
    </div>

    <!-- Corner decorations -->
    <div class="absolute top-4 left-4 text-ash opacity-20 text-xs font-mono select-none">
      <pre>╔══════╗
║ ⛧  ⛧ ║
║  ☠   ║
╚══════╝</pre>
    </div>
    <div class="absolute top-4 right-4 text-ash opacity-20 text-xs font-mono select-none">
      <pre>╔══════╗
║ ⛧  ⛧ ║
║  ☠   ║
╚══════╝</pre>
    </div>
    <div class="absolute bottom-4 left-4 text-ash opacity-20 text-xs font-mono select-none">
      <pre>╚══════╝
║  ☠   ║
║ ⛧  ⛧ ║
╔══════╗</pre>
    </div>
    <div class="absolute bottom-4 right-4 text-ash opacity-20 text-xs font-mono select-none">
      <pre>╚══════╝
║  ☠   ║
║ ⛧  ⛧ ║
╔══════╗</pre>
    </div>

    <!-- Scanline effect -->
    <div class="absolute inset-0 scanlines" />

    <!-- Fog/mist at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

    <!-- Vignette -->
    <div 
      class="absolute inset-0"
      style="background: radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%);"
    />
  </div>
</template>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(ellipse at center, var(--color-charcoal-light) 0%, var(--color-charcoal) 50%, var(--color-charcoal-dark) 100%);
}

/* Rotating rune circles */
.rune-circle {
  position: absolute;
  width: 80vmin;
  height: 80vmin;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotateRunes 120s linear infinite;
  opacity: 0.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.rune-circle-reverse {
  position: absolute;
  width: 60vmin;
  height: 60vmin;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotateRunesReverse 90s linear infinite;
  opacity: 0.1;
  white-space: nowrap;
  overflow: hidden;
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
  animation: pentagramPulse 8s ease-in-out infinite;
}

@keyframes pentagramPulse {
  0%, 100% { 
    opacity: 0.2;
    filter: blur(0px);
  }
  50% { 
    opacity: 0.35;
    filter: blur(0.5px);
  }
}

/* Glow effect */
.pentagram-glow {
  width: 40vmin;
  height: 40vmin;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(139, 0, 0, 0.1) 0%, transparent 70%);
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.5;
  }
}

/* Floating symbols */
.floating-symbol {
  animation: floatOccult 25s ease-in-out infinite;
}

@keyframes floatOccult {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-40px) translateX(20px) rotate(10deg);
  }
  50% {
    transform: translateY(-20px) translateX(-15px) rotate(-5deg);
  }
  75% {
    transform: translateY(-60px) translateX(10px) rotate(5deg);
  }
}

/* CRT scanline effect */
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  opacity: 0.3;
}
</style>
