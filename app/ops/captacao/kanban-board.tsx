'use client'

import { useState, useCallback } from 'react'

export type KanbanStageId =
  | 'capture'
  | 'enrichment'
  | 'instagram'
  | 'ready'
  | 'scheduled'
  | 'sent'
  | 'responded'
  | 'review'

type KanbanLead = {
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

type KanbanColumnDef = {
  id: KanbanStageId
  label: string
  tone: string
  icon: string
}

type KanbanBoardProps = {
  columns: Array<KanbanColumnDef & { leads: KanbanLead[] }>
  onMoveLead: (leadId: string, fromStage: KanbanStageId, toStage: KanbanStageId) => void
}

const TONE_CLASSES: Record<string, { col: string; badge: string; dropzone: string }> = {
  zinc: {
    col: 'border-zinc-700/50 bg-zinc-900/40',
    badge: 'bg-zinc-700/60 text-zinc-300',
    dropzone: 'border-zinc-500/50 bg-zinc-800/50',
  },
  amber: {
    col: 'border-amber-500/20 bg-amber-950/20',
    badge: 'bg-amber-500/15 text-amber-300',
    dropzone: 'border-amber-400/50 bg-amber-900/30',
  },
  fuchsia: {
    col: 'border-fuchsia-500/20 bg-fuchsia-950/20',
    badge: 'bg-fuchsia-500/15 text-fuchsia-300',
    dropzone: 'border-fuchsia-400/50 bg-fuchsia-900/30',
  },
  sky: {
    col: 'border-sky-500/20 bg-sky-950/20',
    badge: 'bg-sky-500/15 text-sky-300',
    dropzone: 'border-sky-400/50 bg-sky-900/30',
  },
  emerald: {
    col: 'border-emerald-500/20 bg-emerald-950/20',
    badge: 'bg-emerald-500/15 text-emerald-300',
    dropzone: 'border-emerald-400/50 bg-emerald-900/30',
  },
  violet: {
    col: 'border-violet-500/20 bg-violet-950/20',
    badge: 'bg-violet-500/15 text-violet-300',
    dropzone: 'border-violet-400/50 bg-violet-900/30',
  },
  rose: {
    col: 'border-rose-500/20 bg-rose-950/20',
    badge: 'bg-rose-500/15 text-rose-300',
    dropzone: 'border-rose-400/50 bg-rose-900/30',
  },
}

export function KanbanBoard({ columns, onMoveLead }: KanbanBoardProps) {
  const [draggedLead, setDraggedLead] = useState<{ id: string; fromStage: KanbanStageId } | null>(null)
  const [dropTarget, setDropTarget] = useState<KanbanStageId | null>(null)

  const handleDragStart = useCallback((leadId: string, fromStage: KanbanStageId) => {
    setDraggedLead({ id: leadId, fromStage })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, stageId: KanbanStageId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget(stageId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDropTarget(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, toStage: KanbanStageId) => {
    e.preventDefault()
    setDropTarget(null)
    if (draggedLead && draggedLead.fromStage !== toStage) {
      onMoveLead(draggedLead.id, draggedLead.fromStage, toStage)
    }
    setDraggedLead(null)
  }, [draggedLead, onMoveLead])

  const handleDragEnd = useCallback(() => {
    setDraggedLead(null)
    setDropTarget(null)
  }, [])

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {columns.map((col) => {
        const tone = TONE_CLASSES[col.tone] ?? TONE_CLASSES.zinc
        const isDropping = dropTarget === col.id && draggedLead?.fromStage !== col.id

        return (
          <div
            key={col.id}
            className={`flex w-[220px] min-w-[220px] flex-col rounded-2xl border p-3 transition-all duration-150 ${isDropping ? tone.dropzone : tone.col}`}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{col.icon}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">{col.label}</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}>
                {col.leads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: '400px' }}>
              {col.leads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/8 px-3 py-6 text-center text-[11px] text-zinc-600">
                  Vazio
                </div>
              ) : (
                col.leads.slice(0, 15).map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    stageId={col.id}
                    isDragging={draggedLead?.id === lead.id}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
              {col.leads.length > 15 && (
                <div className="rounded-lg border border-dashed border-white/6 px-2 py-2 text-center text-[10px] text-zinc-500">
                  +{col.leads.length - 15} mais
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({
  isDragging,
  lead,
  onDragEnd,
  onDragStart,
  stageId,
}: {
  isDragging: boolean
  lead: KanbanLead
  onDragEnd: () => void
  onDragStart: (leadId: string, fromStage: KanbanStageId) => void
  stageId: KanbanStageId
}) {
  return (
    <div
      className={`cursor-grab rounded-xl border border-white/8 bg-black/30 px-2.5 py-2 transition-all duration-150 hover:border-white/16 active:cursor-grabbing ${isDragging ? 'opacity-40 scale-95' : ''}`}
      draggable
      onDragEnd={onDragEnd}
      onDragStart={() => onDragStart(lead.id, stageId)}
    >
      <div className="text-[12px] font-medium leading-tight text-zinc-200 line-clamp-2">
        {lead.canonicalName}
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {lead.city && (
          <span className="text-[10px] text-zinc-500">{lead.city}</span>
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {lead.primaryEmail && <MicroBadge label="email" tone="emerald" />}
        {lead.primaryWhatsapp && <MicroBadge label="wa" tone="emerald" />}
        {lead.instagramUrl && <MicroBadge label="ig" tone="fuchsia" />}
        {lead.websiteUrl && !lead.primaryEmail && <MicroBadge label="site" tone="zinc" />}
      </div>
    </div>
  )
}

function MicroBadge({ label, tone }: { label: string; tone: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-400',
    fuchsia: 'bg-fuchsia-500/15 text-fuchsia-400',
    zinc: 'bg-zinc-700/40 text-zinc-400',
  }
  return (
    <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${colors[tone] ?? colors.zinc}`}>
      {label}
    </span>
  )
}
