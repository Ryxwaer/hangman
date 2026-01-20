import { defineEventHandler, readBody, createError, setResponseHeader } from 'h3'
import { getWordExplanationPrompt } from '../utils/prompts'

interface ExplainWordRequest {
  word: string
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

  const body = await readBody<ExplainWordRequest>(event)

  if (!body.word) {
    throw createError({
      statusCode: 400,
      message: 'Missing word',
    })
  }

  const prompt = getWordExplanationPrompt(body.word)

  // Set headers for Server-Sent Events
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent?alt=sse',
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
            temperature: 0.5,
            maxOutputTokens: 1000,
          },
        }),
      }
    )

    // Handle rate limit errors
    if (response.status === 429) {
      throw createError({
        statusCode: 429,
        message: 'The spirits are exhausted... Please wait a moment.',
      })
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        message: errorData.error?.message || 'API request failed',
      })
    }

    // Stream the response
    const reader = response.body?.getReader()
    if (!reader) {
      throw createError({
        statusCode: 500,
        message: 'No response body',
      })
    }

    const decoder = new TextDecoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            // Parse SSE data from Gemini
            const lines = chunk.split('\n')
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6)
                if (jsonStr.trim()) {
                  try {
                    const data = JSON.parse(jsonStr)
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
                    if (text) {
                      // Send as SSE format
                      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`))
                    }
                  } catch {
                    // Skip malformed JSON
                  }
                }
              }
            }
          }
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return stream
  } catch (error: any) {
    console.error('Gemini API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get explanation',
    })
  }
})
