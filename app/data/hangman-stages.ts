/**
 * ASCII art stages for the hangman figure
 * Stage 0: Empty gallows
 * Stage 1: Head
 * Stage 2: Body
 * Stage 3: Left arm
 * Stage 4: Right arm
 * Stage 5: Left leg
 * Stage 6: Right leg (game over)
 */
export const HANGMAN_STAGES: string[] = [
  // Stage 0 - Empty gallows
  `
  ╔═══════╗
  ║       ║
  ║       
  ║       
  ║       
  ║       
══╩══════════`,

  // Stage 1 - Head
  `
  ╔═══════╗
  ║       ║
  ║       O
  ║       
  ║       
  ║       
══╩══════════`,

  // Stage 2 - Body
  `
  ╔═══════╗
  ║       ║
  ║       O
  ║       │
  ║       │
  ║       
══╩══════════`,

  // Stage 3 - Left arm
  `
  ╔═══════╗
  ║       ║
  ║       O
  ║      ╱│
  ║       │
  ║       
══╩══════════`,

  // Stage 4 - Right arm
  `
  ╔═══════╗
  ║       ║
  ║       O
  ║      ╱│╲
  ║       │
  ║       
══╩══════════`,

  // Stage 5 - Left leg
  `
  ╔═══════╗
  ║       ║
  ║       O
  ║      ╱│╲
  ║       │
  ║      ╱ 
══╩══════════`,

  // Stage 6 - Right leg (dead)
  `
  ╔═══════╗
  ║       ║
  ║       O
  ║      ╱│╲
  ║       │
  ║      ╱ ╲
══╩══════════`,
]

/**
 * Victory ASCII art
 */
export const HANGMAN_VICTORY = `
  ╔═══════╗
  ║        
  ║       \\O/
  ║        │
  ║        │
  ║       / \\
══╩══════════`

/**
 * Game over ASCII art (hanged figure with X eyes)
 */
export const HANGMAN_DEAD = `
  ╔═══════╗
  ║       ║
  ║       X
  ║      ╱│╲
  ║       │
  ║      ╱ ╲
══╩══════════`
