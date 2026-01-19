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
1. You must answer ONLY with "Yes" or "No"
2. Do not reveal the word or any letters directly
4. If the question cannot be answered with yes/no, respond with "Uncertain"

Your answer:`
}

/**
 * Prompt for explaining a word after the game ends
 */
export function getWordExplanationPrompt(word: string): string {
  return `The word is "${word}".

Format EXACTLY like this dictionary style:

(pronunciation) part of speech
Definition (1-2 sentences)
Origin (1-2 sentences)

"example sentence"

Example:
(ser-en-DIP-i-tee) noun
the occurrence of events by chance in a happy way
derived from the Greek word "serendip" meaning "good fortune"

"finding that cafe was pure serendipity"

Rules:
- pronunciation in parentheses, then part of speech
- short definition
- blank line
- example sentence in quotes
- No word title, no extra text
- Plain text only`
}
