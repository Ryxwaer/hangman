import { defineEventHandler, readBody, createError } from 'h3'
import { getQuestionPrompt } from '../utils/prompts'

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

  const prompt = getQuestionPrompt(body.word, body.question)

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
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

    // Handle rate limit errors
    if (response.status === 429 || (data.error?.message && data.error.message.includes('quota'))) {
      throw createError({
        statusCode: 429,
        message: 'The spirits are exhausted... Please wait a minute before asking again.',
      })
    }

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
    
    // Re-throw if it's already a proper error
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get AI response',
    })
  }
})
