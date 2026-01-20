/**
 * AI Prompts for the Hangman game
 * Centralized prompt management for Gemini API interactions
 */

/**
 * Prompt for answering yes/no questions about the secret word during gameplay
 */
export function getQuestionPrompt(word: string, question: string): string {
  return `You are playing a word-guessing game (Hangman). The secret word is "${word}".

The player asks: "${question}"

IMPORTANT RULES:
1. Answer ONLY with the equivalent of "Yes", "No", or "Uncertain" in the SAME LANGUAGE as the question
2. Do not reveal the word or any letters directly
3. Examples: English→Yes/No, Spanish→Sí/No, German→Ja/Nein, French→Oui/Non, etc.

Your answer:`
}

/**
 * Prompt for explaining a word after the game ends
 */
export function getWordExplanationPrompt(word: string): string {
  return `The the word "${word}" in a dictionary style:
(pronunciation) part-of-speech
Definition in 1-2 sentences
Origin/etymology in 1 sentence
Example sentence in quotes

<example>
(ser-en-DIP-i-tee) noun
The occurrence of events by chance in a happy way.
From "Serendip", old name for Sri Lanka, coined by Horace Walpole in 1754.

"Finding that cafe was pure serendipity"
</example>

Now explain the word "${word}" in the same format (plaintext only):
`
}
