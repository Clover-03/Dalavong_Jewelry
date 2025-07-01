import { PrismaClient } from '@prisma/client'

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient
}

let prisma: PrismaClient;

// check to use this existing instance, so we don't repeatedly create new instances
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }
  prisma = globalThis.prisma
}

export default prisma; 