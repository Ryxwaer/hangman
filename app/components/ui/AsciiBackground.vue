<script setup lang="ts">
// System Bleed Glitch Style Background - Inspired by The Glitch Mob

// ASCII Pentagram with extended corruption characters
const PENTAGRAM_CORE = `
                                              ▲
                                             ╱█╲
                                            ╱ █ ╲
                                           ╱  █  ╲
                                          ╱   █   ╲
                                         ╱    █    ╲
                                        ╱     █     ╲
                                       ╱      █      ╲
                                      ╱       █       ╲
                                     ╱        █        ╲
                                    ╱         █         ╲
                                   ╱          █          ╲
                                  ╱           █           ╲
                                 ╱            █            ╲
                                ╱             █             ╲
                               ╱              █              ╲
                              ╱               █               ╲
          ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬╱▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬█▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬╲▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                             ╲                                 ╱
                              ╲                               ╱
                               ╲                             ╱
                                ╲                           ╱
                                 ╲                         ╱
                                  ╲                       ╱
                                   ╲         ▼           ╱
                                    ╲       ╱█╲         ╱
                                     ╲     ╱ █ ╲       ╱
                                      ╲   ╱  █  ╲     ╱
                                       ╲ ╱   █   ╲   ╱
                                        ╳    █    ╲ ╱
                                       ╱ ╲   █   ╱ ╲
                                      ╱   ╲  █  ╱   ╲
                                     ╱     ╲ █ ╱     ╲
                                    ╱       ╲█╱       ╲
                                   ▼▬▬▬▬▬▬▬▬▬█▬▬▬▬▬▬▬▬▬▼`

// Glitch characters for bleeding effect
const GLITCH_CHARS = '█▓▒░╳╱╲▲▼◆◇○●◎⊕⊗⌀∅∆∇≡≢⋮⋯⋰⋱'
const BLEED_CHARS = '01█▓▒░!@#$%^&*<>{}[]|\\/'
const RUNES = '᛫ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'

interface GlitchSlice {
  id: number
  top: number
  height: number
  offset: number
  delay: number
}

interface BleedingChar {
  id: number
  char: string
  x: number
  y: number
  speed: number
  opacity: number
  size: number
}

interface FloatingRune {
  id: number
  char: string
  x: number
  y: number
  delay: number
  duration: number
}

const glitchSlices = ref<GlitchSlice[]>([])
const bleedingChars = ref<BleedingChar[]>([])
const floatingRunes = ref<FloatingRune[]>([])
const glitchActive = ref(false)

// Generate random glitch slices
function generateSlices() {
  glitchSlices.value = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    height: 0.5 + Math.random() * 2,
    offset: (Math.random() - 0.5) * 20,
    delay: Math.random() * 5,
  }))
}

// Generate bleeding/falling characters
function generateBleedingChars() {
  bleedingChars.value = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    char: BLEED_CHARS[Math.floor(Math.random() * BLEED_CHARS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    speed: 10 + Math.random() * 30,
    opacity: 0.1 + Math.random() * 0.3,
    size: 0.6 + Math.random() * 1,
  }))
}

// Generate floating runes around the pentagram
function generateRunes() {
  const runeChars = RUNES.split('')
  floatingRunes.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    char: runeChars[Math.floor(Math.random() * runeChars.length)],
    x: 20 + Math.random() * 60, // Keep near center
    y: 20 + Math.random() * 60,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 20,
  }))
}

// Trigger intense glitch periodically
function triggerGlitch() {
  glitchActive.value = true
  setTimeout(() => {
    glitchActive.value = false
  }, 150)
}

onMounted(() => {
  generateSlices()
  generateBleedingChars()
  generateRunes()
  
  // Random intense glitch every 3-8 seconds
  setInterval(() => {
    if (Math.random() > 0.5) {
      triggerGlitch()
    }
  }, 3000 + Math.random() * 5000)
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-charcoal">
    <!-- Base noise texture -->
    <div class="noise-layer" />

    <!-- Chromatic aberration layers - RGB split -->
    <div class="pentagram-container">
      <!-- Red channel (offset left) -->
      <pre 
        class="pentagram-layer pentagram-red"
        :class="{ 'glitch-intense': glitchActive }"
      >{{ PENTAGRAM_CORE }}</pre>
      
      <!-- Blue channel (offset right) -->
      <pre 
        class="pentagram-layer pentagram-blue"
        :class="{ 'glitch-intense': glitchActive }"
      >{{ PENTAGRAM_CORE }}</pre>
      
      <!-- Main pentagram (white/bone) -->
      <pre 
        class="pentagram-layer pentagram-main"
        :class="{ 'glitch-intense': glitchActive }"
      >{{ PENTAGRAM_CORE }}</pre>
    </div>

    <!-- Horizontal glitch slices -->
    <div
      v-for="slice in glitchSlices"
      :key="slice.id"
      class="glitch-slice"
      :style="{
        top: `${slice.top}%`,
        height: `${slice.height}%`,
        animationDelay: `${slice.delay}s`,
        '--slice-offset': `${slice.offset}px`,
      }"
    />

    <!-- Bleeding/falling characters (Matrix-like) -->
    <div
      v-for="char in bleedingChars"
      :key="char.id"
      class="bleeding-char"
      :style="{
        left: `${char.x}%`,
        top: `${char.y}%`,
        fontSize: `${char.size}rem`,
        opacity: char.opacity,
        animationDuration: `${char.speed}s`,
      }"
    >
      {{ char.char }}
    </div>

    <!-- Floating runes around pentagram -->
    <div
      v-for="rune in floatingRunes"
      :key="rune.id"
      class="floating-rune"
      :style="{
        left: `${rune.x}%`,
        top: `${rune.y}%`,
        animationDelay: `${rune.delay}s`,
        animationDuration: `${rune.duration}s`,
      }"
    >
      {{ rune.char }}
    </div>

    <!-- Scanlines overlay -->
    <div class="scanlines" />

    <!-- Vignette with chromatic edge -->
    <div class="vignette" />
    <div class="chromatic-vignette" />

    <!-- Occasional flash/flicker -->
    <div class="flicker-overlay" :class="{ active: glitchActive }" />

    <!-- Corner corruption markers -->
    <div class="corner-glitch top-0 left-0">▓▒░</div>
    <div class="corner-glitch top-0 right-0">░▒▓</div>
    <div class="corner-glitch bottom-0 left-0">░▒▓</div>
    <div class="corner-glitch bottom-0 right-0">▓▒░</div>

    <!-- Edge runes -->
    <div class="edge-runes top-2 left-1/2 -translate-x-1/2">
      ᛟ▓ᚠᚢᚦᚨᚱᚲ▓ᛟ
    </div>
    <div class="edge-runes bottom-2 left-1/2 -translate-x-1/2">
      ᛟ▒ᚷᚹᚺᚾᛁᛃ▒ᛟ
    </div>
  </div>
</template>

<style scoped>
/* Base noise texture */
.noise-layer {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
  animation: noiseShift 0.5s steps(5) infinite;
}

@keyframes noiseShift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, 2px); }
}

/* Pentagram container */
.pentagram-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pentagram-layer {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.25rem, 0.7vw, 0.5rem);
  line-height: 1;
  white-space: pre;
  animation: pentagramPulse 4s ease-in-out infinite;
}

/* RGB Chromatic Aberration */
.pentagram-red {
  color: #ff0040;
  opacity: 0.4;
  transform: translate(-3px, 0);
  mix-blend-mode: screen;
  animation: rgbShiftRed 8s ease-in-out infinite;
}

.pentagram-blue {
  color: #00d4ff;
  opacity: 0.4;
  transform: translate(3px, 0);
  mix-blend-mode: screen;
  animation: rgbShiftBlue 8s ease-in-out infinite;
}

.pentagram-main {
  color: var(--color-crimson);
  opacity: 0.7;
  text-shadow: 
    0 0 20px var(--color-crimson),
    0 0 40px var(--color-crimson-dark),
    0 0 80px rgba(139, 0, 0, 0.5);
}

@keyframes rgbShiftRed {
  0%, 100% { transform: translate(-2px, 0); opacity: 0.3; }
  25% { transform: translate(-4px, 1px); opacity: 0.5; }
  50% { transform: translate(-2px, -1px); opacity: 0.3; }
  75% { transform: translate(-5px, 0); opacity: 0.4; }
}

@keyframes rgbShiftBlue {
  0%, 100% { transform: translate(2px, 0); opacity: 0.3; }
  25% { transform: translate(4px, -1px); opacity: 0.4; }
  50% { transform: translate(3px, 1px); opacity: 0.5; }
  75% { transform: translate(2px, 0); opacity: 0.3; }
}

@keyframes pentagramPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

/* Intense glitch effect */
.glitch-intense {
  animation: glitchShake 0.1s steps(2) infinite !important;
}

@keyframes glitchShake {
  0% { transform: translate(0, 0) skewX(0deg); }
  25% { transform: translate(-5px, 2px) skewX(2deg); }
  50% { transform: translate(5px, -2px) skewX(-2deg); }
  75% { transform: translate(-3px, 1px) skewX(1deg); }
  100% { transform: translate(3px, -1px) skewX(-1deg); }
}

/* Horizontal glitch slices */
.glitch-slice {
  position: absolute;
  left: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 0, 64, 0.1) 20%,
    rgba(0, 212, 255, 0.1) 40%,
    transparent 60%,
    rgba(255, 0, 64, 0.05) 80%,
    transparent 100%
  );
  animation: sliceGlitch 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes sliceGlitch {
  0%, 90%, 100% { 
    transform: translateX(0) scaleY(1);
    opacity: 0;
  }
  92% {
    transform: translateX(var(--slice-offset)) scaleY(1.5);
    opacity: 1;
  }
  95% {
    transform: translateX(calc(var(--slice-offset) * -0.5)) scaleY(0.8);
    opacity: 0.7;
  }
  97% {
    transform: translateX(var(--slice-offset)) scaleY(1.2);
    opacity: 0.5;
  }
}

/* Bleeding/falling characters */
.bleeding-char {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-crimson-dark);
  text-shadow: 0 0 5px var(--color-crimson);
  animation: bleedFall linear infinite;
  pointer-events: none;
}

@keyframes bleedFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.2);
  }
  90% {
    opacity: var(--opacity, 0.2);
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

/* Floating runes */
.floating-rune {
  position: absolute;
  font-size: 1.2rem;
  color: var(--color-ash);
  opacity: 0.3;
  text-shadow: 0 0 10px var(--color-crimson-dark);
  animation: runeFloat ease-in-out infinite;
  pointer-events: none;
}

@keyframes runeFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.2;
  }
  25% {
    transform: translate(10px, -20px) rotate(5deg);
    opacity: 0.4;
  }
  50% {
    transform: translate(-5px, -10px) rotate(-3deg);
    opacity: 0.3;
  }
  75% {
    transform: translate(15px, -30px) rotate(8deg);
    opacity: 0.35;
  }
}

/* Scanlines */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
  animation: scanlineFlicker 0.05s steps(2) infinite;
}

@keyframes scanlineFlicker {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.35; }
}

/* Vignette */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
}

/* Chromatic vignette edge */
.chromatic-vignette {
  position: absolute;
  inset: 0;
  box-shadow: 
    inset 0 0 100px rgba(255, 0, 64, 0.1),
    inset 0 0 200px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

/* Flicker overlay */
.flicker-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 0, 64, 0);
  transition: background 0.05s;
  pointer-events: none;
}

.flicker-overlay.active {
  background: rgba(255, 0, 64, 0.1);
}

/* Corner glitch markers */
.corner-glitch {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--color-ash);
  opacity: 0.3;
  padding: 8px;
  animation: cornerPulse 3s ease-in-out infinite;
}

@keyframes cornerPulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; color: var(--color-crimson-dark); }
}

/* Edge runes */
.edge-runes {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--color-ash);
  opacity: 0.25;
  letter-spacing: 0.3em;
  animation: edgeFlicker 5s ease-in-out infinite;
}

@keyframes edgeFlicker {
  0%, 100% { opacity: 0.2; }
  30% { opacity: 0.3; }
  35% { opacity: 0.1; }
  40% { opacity: 0.35; }
  70% { opacity: 0.25; }
}
</style>
