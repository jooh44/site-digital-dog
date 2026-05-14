import { NextResponse } from 'next/server'
import { openLeadEngineDatabase } from '@/lib/outbound/leadEngineStore'

export const dynamic = 'force-dynamic'

type ActionPayload = {
  organizationId: string
  action: 'approve' | 'ignore' | 'reset'
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.OUTBOUND_DASHBOARD_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = (await request.json()) as ActionPayload

  if (!body.organizationId || !body.action) {
    return NextResponse.json({ error: 'Missing organizationId or action' }, { status: 400 })
  }

  const db = openLeadEngineDatabase()
  const now = new Date().toISOString()

  try {
    switch (body.action) {
      case 'approve': {
        db.prepare(`
          UPDATE organizations
          SET status = 'ready_for_review', updated_at = ?
          WHERE id = ? AND status IN ('needs_manual_review', 'raw')
        `).run(now, body.organizationId)
        break
      }
      case 'ignore': {
        db.prepare(`
          UPDATE organizations
          SET status = 'ignored_non_icp', updated_at = ?
          WHERE id = ? AND status != 'ignored_non_icp'
        `).run(now, body.organizationId)
        break
      }
      case 'reset': {
        db.prepare(`
          UPDATE organizations
          SET status = 'raw', updated_at = ?
          WHERE id = ?
        `).run(now, body.organizationId)
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, organizationId: body.organizationId, action: body.action })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
