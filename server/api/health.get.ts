import { defineEventHandler } from 'h3'

/**
 * Health check endpoint for container orchestration
 */
export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
})
