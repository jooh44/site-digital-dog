'use client'

import { useState } from 'react'

type LeadQuickActionsProps = {
  email?: string | null
  instagramUrl?: string | null
  message: string
  organizationId: string
  phone?: string | null
  whatsapp?: string | null
}

type CopyState = 'email' | 'message' | 'phone' | 'whatsapp' | null
type ActionState = 'idle' | 'loading' | 'done' | 'error'

export function LeadQuickActions({ email, instagramUrl, message, organizationId, phone, whatsapp }: LeadQuickActionsProps) {
  const [copied, setCopied] = useState<CopyState>(null)
  const [actionState, setActionState] = useState<ActionState>('idle')
  const [hidden, setHidden] = useState(false)

  async function handleCopy(value: string, state: CopyState) {
    const didCopy = await copyToClipboard(value)
    if (!didCopy) return
    setCopied(state)
    window.setTimeout(() => {
      setCopied((current) => (current === state ? null : current))
    }, 1800)
  }

  async function handleAction(action: 'approve' | 'ignore' | 'reset') {
    setActionState('loading')
    try {
      const res = await fetch('/api/ops/leads/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId, action }),
      })
      if (!res.ok) throw new Error('Failed')
      setActionState('done')
      if (action === 'ignore') setHidden(true)
    } catch {
      setActionState('error')
      window.setTimeout(() => setActionState('idle'), 2000)
    }
  }

  if (hidden) {
    return <div className="text-xs text-zinc-500 italic">Removido</div>
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Copy actions */}
      <div className="flex flex-wrap items-center gap-1.5">
        {email && (
          <ActionButton
            active={copied === 'email'}
            label={copied === 'email' ? '✓ Email' : 'Email'}
            onClick={() => handleCopy(email, 'email')}
            tone="neutral"
          />
        )}
        {whatsapp && (
          <ActionButton
            active={copied === 'whatsapp'}
            label={copied === 'whatsapp' ? '✓ WhatsApp' : 'WhatsApp'}
            onClick={() => handleCopy(whatsapp, 'whatsapp')}
            tone="success"
          />
        )}
        {!whatsapp && phone && (
          <ActionButton
            active={copied === 'phone'}
            label={copied === 'phone' ? '✓ Tel' : 'Tel'}
            onClick={() => handleCopy(phone, 'phone')}
            tone="neutral"
          />
        )}
        <ActionButton
          active={copied === 'message'}
          label={copied === 'message' ? '✓ Msg' : 'Msg'}
          onClick={() => handleCopy(message, 'message')}
          tone="primary"
        />
      </div>

      {/* Status actions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <ActionButton
          active={actionState === 'done'}
          disabled={actionState === 'loading'}
          label={actionState === 'done' ? '✓ Aprovado' : 'Aprovar'}
          onClick={() => handleAction('approve')}
          tone="approve"
        />
        <ActionButton
          active={false}
          disabled={actionState === 'loading'}
          label="Ignorar"
          onClick={() => handleAction('ignore')}
          tone="danger"
        />
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-2.5 py-1.5 text-[11px] font-medium text-fuchsia-200 hover:border-fuchsia-300/40 hover:bg-fuchsia-400/18 transition"
          >
            IG
          </a>
        )}
      </div>
    </div>
  )
}

export function BulkAutoClassifyButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ promoted: number; ignored: number } | null>(null)

  async function handleClick() {
    setState('loading')
    try {
      const res = await fetch('/api/ops/leads/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto_classify' }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setResult({ promoted: data.promoted, ignored: data.ignored })
      setState('done')
    } catch {
      setState('error')
      window.setTimeout(() => setState('idle'), 3000)
    }
  }

  if (state === 'done' && result) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-200">
        ✓ {result.promoted} aprovados, {result.ignored} ignorados — recarregue para ver
      </div>
    )
  }

  return (
    <button
      className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-medium text-amber-100 hover:border-amber-300/40 hover:bg-amber-400/18 transition disabled:opacity-50"
      disabled={state === 'loading'}
      onClick={handleClick}
      type="button"
    >
      {state === 'loading' ? 'Classificando...' : state === 'error' ? 'Erro — tente de novo' : 'Auto-classificar pendentes'}
    </button>
  )
}

function ActionButton({
  active,
  disabled,
  label,
  onClick,
  tone,
}: {
  active: boolean
  disabled?: boolean
  label: string
  onClick: () => void
  tone: 'neutral' | 'primary' | 'success' | 'approve' | 'danger'
}) {
  const toneClass = {
    neutral: 'border-white/10 bg-white/[0.04] text-zinc-200 hover:border-white/20 hover:bg-white/[0.08]',
    primary: 'border-amber-400/25 bg-amber-400/12 text-amber-100 hover:border-amber-300/40 hover:bg-amber-400/18',
    success: 'border-emerald-400/25 bg-emerald-400/12 text-emerald-100 hover:border-emerald-300/40 hover:bg-emerald-400/18',
    approve: 'border-sky-400/25 bg-sky-400/12 text-sky-100 hover:border-sky-300/40 hover:bg-sky-400/18',
    danger: 'border-rose-400/25 bg-rose-400/12 text-rose-200 hover:border-rose-300/40 hover:bg-rose-400/18',
  }[tone]

  const activeClass = active
    ? 'border-emerald-300/50 bg-emerald-400/18 text-emerald-100'
    : toneClass

  return (
    <button
      className={`rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition ${activeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

async function copyToClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return true
  }
  if (typeof document === 'undefined') return false
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const didCopy = document.execCommand('copy')
  document.body.removeChild(textarea)
  return didCopy
}
