import { defineEventHandler, readBody, createError } from 'h3'

interface AskAiRequest {
  word: string
  question: string
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
  error?: {
    message: string
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Gemini API key not configured',
    })
  }

  const body = await readBody<AskAiRequest>(event)

  if (!body.word || !body.question) {
    throw createError({
      statusCode: 400,
      message: 'Missing word or question',
    })
  }

  const prompt = `You are playing a word-guessing game (Hangman). The secret word is "${body.word}".

The player asks: "${body.question}"

IMPORTANT RULES:
1. You must answer ONLY with "Yes" or "No"
2. Do not reveal the word or any letters directly
3. Be helpful but cryptic
4. If the question cannot be answered with yes/no, respond with "I can only answer yes or no questions."

Your answer:`

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 50,
          },
        }),
      }
    )

    const data: GeminiResponse = await response.json()

    if (data.error) {
      throw createError({
        statusCode: 500,
        message: data.error.message,
      })
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Unknown'

    return { answer }
  } catch (error: any) {
    console.error('Gemini API error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get AI response',
    })
  }
})
