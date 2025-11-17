/**
 * Test script to verify Prisma Client connection
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import { prisma } from '../lib/prisma'

async function testConnection() {
  try {
    console.log('Testing Prisma Client connection...')
    
    // Test 1: Raw query to check connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Test 2: Check if tables exist (PostgreSQL)
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `
    console.log('✅ Tables found:', tables.map(t => t.tablename))
    
    // Test 3: Verify Contact model structure
    const contactCount = await prisma.contact.count()
    console.log(`✅ Contact model accessible (count: ${contactCount})`)
    
    // Test 4: Verify Newsletter model structure
    const newsletterCount = await prisma.newsletter.count()
    console.log(`✅ Newsletter model accessible (count: ${newsletterCount})`)
    
    console.log('\n✅ All database tests passed!')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

