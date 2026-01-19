import type { Difficulty } from '~/stores/game'

/**
 * Word lists organized by difficulty level
 * - Easy: Common 4-6 letter words
 * - Medium: 6-10 letter everyday words
 * - Arcane: Unusual, archaic, or rare words
 */
export const WORDS: Record<Difficulty, string[]> = {
  easy: [
    'apple', 'house', 'water', 'bread', 'chair',
    'table', 'clock', 'dream', 'earth', 'flame',
    'grape', 'happy', 'juice', 'knife', 'lemon',
    'money', 'night', 'ocean', 'paper', 'queen',
    'river', 'storm', 'tiger', 'umbrella', 'voice',
    'winter', 'yellow', 'zebra', 'brain', 'cloud',
    'dance', 'eagle', 'fairy', 'ghost', 'heart',
    'island', 'jungle', 'koala', 'light', 'magic',
    'noble', 'orange', 'piano', 'quiet', 'robot',
    'snake', 'train', 'unity', 'viola', 'whale',
  ],

  medium: [
    'adventure', 'beautiful', 'chocolate', 'dangerous', 'elephant',
    'fantastic', 'generator', 'happiness', 'important', 'jellyfish',
    'knowledge', 'landscape', 'mysterious', 'nightmare', 'orchestra',
    'paragraph', 'questions', 'radiation', 'satellite', 'telephone',
    'umbrella', 'vegetable', 'wonderful', 'xylophone', 'yesterday',
    'algorithm', 'butterfly', 'celebrate', 'departure', 'explosion',
    'frequency', 'glamorous', 'horseshoe', 'ignorance', 'jackrabbit',
    'kidnapper', 'luminance', 'machinery', 'nervously', 'operation',
    'paradise', 'quicksand', 'rebellion', 'spaceship', 'treachery',
    'uncertain', 'vibration', 'warehouse', 'yearnings', 'zealously',
  ],

  arcane: [
    'eldritch', 'sepulchre', 'phantasm', 'tenebrous', 'miasma',
    'ossuary', 'catafalque', 'threnody', 'susurrus', 'ichor',
    'nefarious', 'sanguine', 'ephemeral', 'somnolent', 'lugubrious',
    'crepuscular', 'vespertine', 'chthonic', 'seraphic', 'stygian',
    'penumbra', 'revenant', 'wraith', 'spectre', 'eidolon',
    'harbinger', 'maleficent', 'baleful', 'dolorous', 'mordant',
    'acrimony', 'umbrage', 'abyssal', 'fulgurant', 'fuliginous',
    'cimmerian', 'erebus', 'tartarean', 'phlegethon', 'acheron',
    'sempiternal', 'immemorial', 'aeonian', 'antediluvian', 'primordial',
    'necropolis', 'catacomb', 'mausoleum', 'cenotaph', 'sarcophagus',
  ],
}

/**
 * Difficulty metadata for UI
 */
export const DIFFICULTY_INFO: Record<Difficulty, { label: string; description: string; symbol: string }> = {
  easy: {
    label: 'Easy',
    description: 'Common words',
    symbol: '○',
  },
  medium: {
    label: 'Medium',
    description: 'Everyday vocabulary',
    symbol: '◐',
  },
  arcane: {
    label: 'Arcane',
    description: 'Ancient & obscure words',
    symbol: '◉',
  },
}
