'use client'

import { useState, useCallback } from 'react'
import { KanbanBoard, type KanbanStageId } from './kanban-board'

type LeadData = {
  id: string
  canonicalName: string
  city: string | null
  emailStatus: string | null
  instagramUrl: string | null
  primaryEmail: string | null
  primaryWhatsapp: string | null
  sourceConfidence: number
  status: string
  websiteDomain: string | null
  websiteUrl: string | null
}

type KanbanInteractiveProps = {
  initialLeads: LeadData[]
}

const COLUMN_DEFS: Array<{ id: KanbanStageId; label: string; tone: string; icon: string }> = [
  { id: 'capture', label: 'Captação', tone: 'zinc', icon: '🔍' },
  { id: 'enrichment', label: 'Enriquecer', tone: 'amber', icon: '⚡' },
  { id: 'instagram', label: 'Instagram', tone: 'fuchsia', icon: '📸' },
  { id: 'ready', label: 'Prontos', tone: 'sky', icon: '✉️' },
  { id: 'scheduled', label: 'Agendados', tone: 'sky', icon: '⏰' },
  { id: 'sent', label: 'Enviados', tone: 'emerald', icon: '✓' },
  { id: 'responded', label: 'Resposta', tone: 'violet', icon: '💬' },
  { id: 'review', label: 'Revisão', tone: 'rose', icon: '⚠️' },
]

// Maps stage transitions to API actions
const STAGE_TO_ACTION: Partial<Record<KanbanStageId, 'approve' | 'ignore' | 'reset'>> = {
  ready: 'approve',
  review: 'reset',
}

function resolveStage(lead: LeadData): KanbanStageId {
  const emailStatus = (lead.emailStatus ?? '').toLowerCase()
  const failureStates = ['failed', 'bounced', 'complained']
  const activeStates = ['sent', 'queued', 'delivery_delayed', 'delivered', 'opened', 'clicked']

  if (emailStatus === 'responded' || lead.status === 'responded') return 'responded'
  if (failureStates.includes(emailStatus)) return 'review'
  if (emailStatus === 'scheduled') return 'scheduled'
  if (activeStates.includes(emailStatus)) return 'sent'

  // Instagram pipeline: has Instagram but no email/whatsapp yet
  if (lead.instagramUrl && !lead.primaryEmail && !lead.primaryWhatsapp) return 'instagram'

  if (lead.status === 'needs_manual_review') return 'review'
  if (lead.primaryEmail) return 'ready'
  if (lead.websiteUrl && !lead.primaryEmail) return 'enrichment'
  return 'capture'
}

export function KanbanInteractive({ initialLeads }: KanbanInteractiveProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleMoveLead = useCallback(async (leadId: string, _fromStage: KanbanStageId, toStage: KanbanStageId) => {
    const action = STAGE_TO_ACTION[toStage]

    if (toStage === 'capture') {
      // Ignore = move to capture means "reset to raw"
      await callAction(leadId, 'reset')
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'raw' } : l))
      showToast('Lead resetado para captura')
      return
    }

    if (action === 'ignore') {
      await callAction(leadId, 'ignore')
      setLeads(prev => prev.filter(l => l.id !== leadId))
      showToast('Lead ignorado')
      return
    }

    if (action === 'approve' || toStage === 'ready') {
      await callAction(leadId, 'approve')
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'ready_for_review' } : l))
      showToast('Lead aprovado → pronto')
      return
    }

    if (toStage === 'review') {
      await callAction(leadId, 'reset')
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'needs_manual_review' } : l))
      showToast('Lead movido para revisão')
      return
    }

    showToast('Movimento não suportado (automático)')
  }, [showToast])

  const columns = COLUMN_DEFS.map(def => ({
    ...def,
    leads: leads.filter(l => resolveStage(l) === def.id),
  }))

  return (
    <div className="relative">
      {toast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 rounded-full border border-emerald-400/30 bg-emerald-950/90 px-4 py-2 text-xs text-emerald-200 shadow-lg animate-in fade-in duration-200">
          {toast}
        </div>
      )}
      <KanbanBoard columns={columns} onMoveLead={handleMoveLead} />
    </div>
  )
}

async function callAction(organizationId: string, action: 'approve' | 'ignore' | 'reset') {
  try {
    await fetch('/api/ops/leads/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, action }),
    })
  } catch {
    // Silently fail — optimistic UI already updated
  }
}
