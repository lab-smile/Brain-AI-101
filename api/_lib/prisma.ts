import { PrismaClient } from '@prisma/client'

declare global {
  var __brainAiPrisma__: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  console.error(
    '[brain-ai-101] DATABASE_URL is not set. ' +
    'API routes that require the database will return 503. ' +
    'Set DATABASE_URL in your Vercel environment variables or .env.local file.'
  )
}

export const prisma =
  globalThis.__brainAiPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__brainAiPrisma__ = prisma
}
