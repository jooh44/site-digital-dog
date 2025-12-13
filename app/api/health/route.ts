import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'skipped (static mode)',
    },
    { status: 200 }
  )
}
