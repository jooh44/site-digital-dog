import { NextResponse } from 'next/server'
import { openLeadEngineDatabase } from '@/lib/outbound/leadEngineStore'

export const dynamic = 'force-dynamic'

type BulkActionPayload = {
  action: 'auto_classify'
  dryRun?: boolean
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.OUTBOUND_DASHBOARD_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = (await request.json()) as BulkActionPayload
  const db = openLeadEngineDatabase()
  const now = new Date().toISOString()

  if (body.action === 'auto_classify') {
    // Auto-promote: has email + confidence >= 0.85 → ready_for_review
    const promoteCandidates = db.prepare(`
      SELECT id, canonical_name FROM organizations
      WHERE status = 'needs_manual_review'
        AND primary_email IS NOT NULL AND primary_email != ''
        AND source_confidence >= 0.85
    `).all() as Array<{ id: string; canonical_name: string }>

    // Auto-ignore: no email, no site, no instagram → ignored_non_icp
    const ignoreCandidates = db.prepare(`
      SELECT id, canonical_name FROM organizations
      WHERE status = 'needs_manual_review'
        AND (primary_email IS NULL OR primary_email = '')
        AND (website_url IS NULL OR website_url = '')
        AND (instagram_url IS NULL OR instagram_url = '')
    `).all() as Array<{ id: string; canonical_name: string }>

    if (body.dryRun) {
      return NextResponse.json({
        dryRun: true,
        wouldPromote: promoteCandidates.length,
        wouldIgnore: ignoreCandidates.length,
        promotePreview: promoteCandidates.slice(0, 5).map(r => r.canonical_name),
        ignorePreview: ignoreCandidates.slice(0, 5).map(r => r.canonical_name),
      })
    }

    let promoted = 0
    let ignored = 0

    if (promoteCandidates.length > 0) {
      const ids = promoteCandidates.map(r => r.id)
      const placeholders = ids.map(() => '?').join(',')
      db.prepare(`
        UPDATE organizations SET status = 'ready_for_review', updated_at = ?
        WHERE id IN (${placeholders})
      `).run(now, ...ids)
      promoted = promoteCandidates.length
    }

    if (ignoreCandidates.length > 0) {
      const ids = ignoreCandidates.map(r => r.id)
      const placeholders = ids.map(() => '?').join(',')
      db.prepare(`
        UPDATE organizations SET status = 'ignored_non_icp', updated_at = ?
        WHERE id IN (${placeholders})
      `).run(now, ...ids)
      ignored = ignoreCandidates.length
    }

    return NextResponse.json({
      ok: true,
      promoted,
      ignored,
      remaining: db.prepare(`SELECT COUNT(*) as c FROM organizations WHERE status = 'needs_manual_review'`).get() as { c: number },
    })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
