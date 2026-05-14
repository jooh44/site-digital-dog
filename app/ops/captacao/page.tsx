import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWebsiteIssueLabel } from '@/lib/outbound/domainQuality'
import { getLeadEngineDashboardData, type LeadEngineDashboardData } from '@/lib/outbound/dashboard'
import { resolveLeadOfficeName } from '@/lib/outbound/emailCampaign'
import { LeadQuickActions, BulkAutoClassifyButton } from './lead-quick-actions'
import { KanbanInteractive } from './kanban-interactive'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Painel de Captação',
  robots: { index: false, follow: false },
}

type LeadItem = LeadEngineDashboardData['leadsReady'][number]
type KanbanTone = 'zinc' | 'amber' | 'sky' | 'emerald' | 'violet' | 'rose'

const AUTO_REFRESH_MS = 30_000

export default function CaptacaoDashboardPage({
  searchParams,
}: {
  searchParams?: { page?: string; perPage?: string }
}) {
  if (process.env.NODE_ENV === 'production' && process.env.OUTBOUND_DASHBOARD_ENABLED !== 'true') notFound()

  const data = getLeadEngineDashboardData()
  const { funnel, todayQuota, bottlenecks, workers, gemini, resendSync } = data

  const leadsForAction = [...data.leadsReady].sort((a, b) => {
    if (a.responded !== b.responded) return a.responded - b.responded
    const aNum = a.primaryWhatsapp || a.primaryPhone ? 1 : 0
    const bNum = b.primaryWhatsapp || b.primaryPhone ? 1 : 0
    if (aNum !== bNum) return bNum - aNum
    return b.sourceConfidence - a.sourceConfidence
  })
  const latestCycle = data.latestCycle
  const blockedLeadCount = leadsForAction.filter(l =>
    l.status === 'needs_manual_review' || l.status === 'raw' || (!l.websiteUrl && !l.primaryEmail)
  ).length

  const perPage = [10, 25, 50, 100].includes(Number(searchParams?.perPage)) ? Number(searchParams?.perPage) : 25
  const totalPages = Math.max(1, Math.ceil(leadsForAction.length / perPage))
  const currentPage = Math.min(Math.max(1, Number(searchParams?.page) || 1), totalPages)
  const pageStart = (currentPage - 1) * perPage
  const pagedLeads = leadsForAction.slice(pageStart, pageStart + perPage)

  const quotaPercent = Math.min(100, Math.round((todayQuota.sent / todayQuota.target) * 100))
  const autoRefreshSeconds = Math.round(AUTO_REFRESH_MS / 1000)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.07),_transparent_26%),#08080a] px-4 py-6 text-zinc-100 md:px-6">
      <script dangerouslySetInnerHTML={{ __html: `setTimeout(()=>location.reload(),${AUTO_REFRESH_MS});` }} />
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5">

        {/* ═══ HEADER ═══ */}
        <header className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white">Captação</h1>
              <div className="flex gap-2">
                <SummaryChip label="pool" value={String(funnel.freshEmails)} tone="sky" />
                <SummaryChip label="agendados" value={String(funnel.scheduled)} tone="emerald" />
                <SummaryChip label="gargalos" value={String(blockedLeadCount)} tone="amber" />
                <SummaryChip label="respostas" value={String(funnel.responded)} tone="violet" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {workers.map(w => (
                <span key={w.name} title={w.detail} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium ${w.healthy ? 'border-emerald-500/30 bg-emerald-500/8 text-emerald-300' : 'border-rose-500/30 bg-rose-500/8 text-rose-300'}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${w.healthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {w.name}
                  {w.minutesSinceLastRun !== null && <span className="font-mono text-white/30">{w.minutesSinceLastRun}m</span>}
                </span>
              ))}
              <span className="rounded-full border border-white/8 px-2.5 py-1.5 text-[11px] text-zinc-500">
                refresh {autoRefreshSeconds}s
              </span>
            </div>
          </div>
        </header>

        {/* ═══ ROW 1: QUOTA + LAST CYCLE ═══ */}
        <section className="grid gap-4 lg:grid-cols-[340px,1fr]">

          {/* Today Quota */}
          <Panel title="Meta do dia" sub={`${todayQuota.sent} enviados · ${todayQuota.scheduled} agendados · meta ${todayQuota.target}`}>
            <div className="relative mx-auto my-4 flex h-32 w-32 items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#grad)" strokeWidth="3" strokeDasharray={`${quotaPercent} ${100 - quotaPercent}`} strokeLinecap="round" />
                <defs><linearGradient id="grad"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#34d399" /></linearGradient></defs>
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-white">{quotaPercent}%</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
              {todayQuota.slots.map(s => {
                const total = s.sent + s.scheduled + s.failed
                const hasSent = s.sent > 0
                const hasScheduled = s.scheduled > 0
                const borderClass = hasSent ? 'border-emerald-500/30 bg-emerald-500/8' : hasScheduled ? 'border-sky-500/30 bg-sky-500/8' : 'border-white/6 bg-white/[0.02]'
                return (
                  <div key={s.time} className={`rounded-lg border px-2 py-2.5 ${borderClass}`}>
                    <div className="text-sm font-bold text-white">{s.time}</div>
                    <div className="mt-1.5 space-y-0.5">
                      {s.sent > 0 && <div className="text-emerald-300">✓ {s.sent} enviados</div>}
                      {s.scheduled > 0 && <div className="text-sky-300">⏳ {s.scheduled} agendados</div>}
                      {s.failed > 0 && <div className="text-rose-300">✗ {s.failed} falhos</div>}
                      {total === 0 && <div className="text-zinc-600">vazio</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <OperationalCyclePanel cycle={latestCycle} />
        </section>

        {/* ═══ ROW 2: GEMINI + BOTTLENECKS + CAMPAIGNS ═══ */}
        <section className="grid gap-4 lg:grid-cols-3">

          {/* Gemini Enricher */}
          <Panel title="Gemini Enricher" sub={`${gemini.emailsFound} emails encontrados em ${gemini.totalRuns} runs`}>
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Encontrados" value={String(gemini.emailsFound)} tone="emerald" />
              <Metric label="Pendentes" value={String(gemini.pending)} tone="amber" />
              <Metric label="Taxa" value={gemini.totalRuns > 0 ? `${Math.round((gemini.emailsFound / gemini.totalRuns) * 100)}%` : '—'} tone="sky" />
            </div>
            {gemini.recentFinds.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Últimos achados</div>
                {gemini.recentFinds.slice(0, 5).map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2 text-xs">
                    <span className="truncate text-zinc-300 mr-2">{f.orgName}</span>
                    <span className="shrink-0 font-mono text-emerald-300">{f.email}</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Bottlenecks */}
          <Panel title="Gargalos" sub="Onde o funil está travando">
            <div className="space-y-2">
              <BottleneckRow label="Sem site" value={bottlenecks.noSite} total={funnel.captured} tone="rose" />
              <BottleneckRow label="Site sem email" value={bottlenecks.siteNoEmail} total={funnel.captured} tone="amber" />
              <BottleneckRow label="Site suspeito" value={bottlenecks.suspectSite} total={funnel.captured} tone="orange" />
              <BottleneckRow label="Revisão manual" value={bottlenecks.needsManualReview} total={funnel.captured} tone="zinc" />
              <BottleneckRow label="Fora do ICP" value={bottlenecks.outsideIcp} total={funnel.captured + bottlenecks.outsideIcp} tone="zinc" />
            </div>
            {bottlenecks.needsManualReview > 10 && (
              <div className="mt-3 pt-3 border-t border-white/8">
                <BulkAutoClassifyButton />
              </div>
            )}
          </Panel>

          {/* Campaigns */}
          <Panel title="Campanhas" sub="Estado das ondas de envio">
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {data.campaigns.length === 0 ? (
                <Empty text="Nenhuma campanha registrada." />
              ) : (
                data.campaigns.map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-zinc-100">{c.name}</div>
                      <div className="text-[11px] text-zinc-500">{fmtDate(c.plannedStartAt)} · {c.scheduledJobs} agendados · {c.sentSignals} enviados</div>
                    </div>
                    <StatusPill status={c.status} />
                  </div>
                ))
              )}
            </div>
          </Panel>
        </section>

        {/* ═══ ROW 3: KANBAN INTERATIVO ═══ */}
        <Panel
          title="Pipeline"
          sub="Arraste cards entre colunas para mover leads. Inclui pipeline de Instagram."
        >
          <KanbanInteractive initialLeads={leadsForAction.map(l => ({
            id: l.id,
            canonicalName: l.canonicalName,
            city: l.city,
            emailStatus: l.emailStatus,
            instagramUrl: l.instagramUrl,
            primaryEmail: l.primaryEmail,
            primaryWhatsapp: l.primaryWhatsapp,
            sourceConfidence: l.sourceConfidence,
            status: l.status,
            websiteDomain: l.websiteDomain,
            websiteUrl: l.websiteUrl,
          }))} />
        </Panel>

        {/* ═══ ROW 4: LEADS TABLE ═══ */}
        <Panel title="Fila detalhada" sub={`${leadsForAction.length} leads capturados`}>
          {leadsForAction.length === 0 ? <Empty text="Sem leads." /> : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  {pageStart + 1}–{Math.min(pageStart + perPage, leadsForAction.length)} de {leadsForAction.length}
                </span>
              <div className="flex gap-1">
                  {[10, 25, 50, 100].map(s => (
                    <Link key={s} href={`/ops/captacao?page=1&perPage=${s}`}
                      className={`rounded-full border px-2.5 py-1 text-xs ${s === perPage ? 'border-sky-400/40 bg-sky-400/10 text-sky-200' : 'border-white/10 text-zinc-400 hover:border-white/20'}`}>{s}</Link>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="hidden rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 xl:grid xl:grid-cols-[minmax(0,1.45fr)_minmax(220px,1fr)_minmax(210px,0.95fr)_minmax(120px,0.48fr)_minmax(230px,0.92fr)] xl:gap-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Escritório</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Contato</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Pipeline</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Texto</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Ações</div>
                </div>
                <div className="space-y-2">
                  {pagedLeads.map(lead => <LeadRow key={lead.id} lead={lead} />)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Página {currentPage}/{totalPages}</span>
                <div className="flex gap-1">
                  {currentPage > 1 && <Link href={`/ops/captacao?page=${currentPage - 1}&perPage=${perPage}`} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">←</Link>}
                  {currentPage < totalPages && <Link href={`/ops/captacao?page=${currentPage + 1}&perPage=${perPage}`} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">→</Link>}
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </main>
  )
}

// ─── Components ───

function LeadRow({ lead }: { lead: LeadItem }) {
  const name = getLeadDisplayName(lead)
  const num = lead.primaryWhatsapp ?? lead.primaryPhone
  const msg = buildMsg(lead)
  const waLink = num ? buildWaLink(num) : null
  const latestTouch = lead.latestEmailScheduledAt ? fmtDate(lead.latestEmailScheduledAt) : null

  return (
    <article className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] px-4 py-4 transition-colors duration-200 hover:border-white/14 hover:bg-white/[0.03]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(220px,1fr)_minmax(210px,0.95fr)_minmax(120px,0.48fr)_minmax(230px,0.92fr)] xl:items-start">
        <div className="min-w-0">
          <div className="text-base font-medium leading-snug text-zinc-100">{name}</div>
          <div className="mt-1 text-xs text-zinc-500">{[lead.city, lead.websiteDomain].filter(Boolean).join(' · ') || '—'}</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {lead.status === 'needs_manual_review' ? <Badge label="suspeito" tone="zinc" /> : null}
            {lead.primaryEmail ? <Badge label="email ok" tone="emerald" /> : null}
            {num ? <Badge label="telefone" tone="zinc" /> : null}
            {lead.websiteUrl ? <Badge label="site" tone="zinc" /> : null}
            {lead.responded ? <Badge label="respondeu" tone="emerald" /> : null}
            {lead.instagramUrl ? <Badge label="ig" tone="zinc" /> : null}
          </div>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="break-all text-zinc-200">{lead.primaryEmail ?? '—'}</div>
          <div className="text-zinc-400">{num ?? '—'}</div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <StatusPill status={lead.status} />
            {lead.emailStatus && lead.emailStatus !== 'sem-email' && <StatusPill status={lead.emailStatus} />}
          </div>
          <div className="text-sm text-zinc-300">{lead.latestEmailCampaignName ?? 'sem campanha ainda'}</div>
          <div className="text-xs text-zinc-500">{latestTouch ? `último toque ${latestTouch}` : 'sem toque agendado'}</div>
        </div>
        <div>
          <details className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
            <summary className="cursor-pointer text-xs text-zinc-400">ver texto</summary>
            <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-zinc-300">{msg}</pre>
          </details>
        </div>
        <div className="flex flex-col gap-2 xl:items-start">
          <LeadQuickActions email={lead.primaryEmail} instagramUrl={lead.instagramUrl} message={msg} organizationId={lead.id} phone={lead.primaryPhone} whatsapp={lead.primaryWhatsapp} />
          <div className="flex flex-wrap gap-1.5">
            {lead.websiteUrl && <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center rounded-full border border-white/10 px-3 text-[11px] text-zinc-300 hover:border-white/20">Site</a>}
            {waLink && <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center rounded-full border border-white/10 px-3 text-[11px] text-zinc-300 hover:border-white/20">WhatsApp</a>}
          </div>
        </div>
      </div>
    </article>
  )
}

function Panel({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] p-5 shadow-[0_14px_60px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="max-w-xl text-right text-xs leading-5 text-zinc-500">{sub}</p>
      </div>
      {children}
    </section>
  )
}

function SummaryChip({ label, value, tone }: { label: string; value: string; tone: KanbanTone }) {
  const tones: Record<KanbanTone, string> = {
    zinc: 'border-white/10 bg-white/[0.04] text-zinc-200',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    sky: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    violet: 'border-violet-400/20 bg-violet-400/10 text-violet-100',
    rose: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
  }

  return (
    <div className={`rounded-2xl border px-3 py-2 ${tones[tone]}`}>
      <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">{value}</div>
    </div>
  )
}

function OperationalCyclePanel({ cycle }: { cycle: LeadEngineDashboardData['latestCycle'] }) {
  if (!cycle) {
    return (
      <Panel title="Último ciclo" sub="Sem snapshot recente do motor">
        <Empty text="O resumo estruturado do auto-capture ainda não foi gerado." />
      </Panel>
    )
  }

  return (
    <Panel
      title="Último ciclo"
      sub={`${fmtDate(cycle.startedAt)} → ${fmtDate(cycle.finishedAt)} · ${formatDuration(cycle.durationSeconds)}`}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid grid-cols-2 gap-2">
          <Metric
            label="Web direto"
            value={String(cycle.directWebDiscovery.addedOrUpdated)}
            tone={cycle.directWebDiscovery.addedOrUpdated > 0 ? 'emerald' : cycle.directWebDiscovery.error ? 'rose' : 'zinc'}
          />
          <Metric
            label="Site oficial"
            value={`${cycle.officialSite.enriched}/${cycle.officialSite.candidates}`}
            tone={cycle.officialSite.enriched > 0 ? 'emerald' : cycle.officialSite.failures > 0 ? 'rose' : 'zinc'}
          />
          <Metric
            label="Web search"
            value={`${cycle.webSearch.matched}/${cycle.webSearch.candidates}`}
            tone={cycle.webSearch.matched > 0 ? 'emerald' : cycle.webSearch.reason === 'no_seed' ? 'zinc' : 'amber'}
          />
          <Metric
            label="Prontos"
            value={formatSignedNumber(cycle.countsDelta.ready)}
            tone={cycle.countsDelta.ready > 0 ? 'emerald' : cycle.countsDelta.ready < 0 ? 'rose' : 'zinc'}
          />
        </div>
        <div className="space-y-2">
          <CycleStatusRow
            label="Descoberta OAB"
            value={formatCycleReason(cycle.discovery.reason)}
            detail={cycle.discovery.pauseDiscovery ? 'pausada por backpressure' : `${cycle.discovery.addedOrganizations} novas organizações no ciclo`}
            tone={cycle.discovery.pauseDiscovery ? 'amber' : cycle.discovery.addedOrganizations > 0 ? 'emerald' : 'zinc'}
          />
          <CycleStatusRow
            label="SERP direta"
            value={`${cycle.directWebDiscovery.addedOrUpdated} atualizados`}
            detail={cycle.directWebDiscovery.error ?? `${cycle.directWebDiscovery.candidates} candidatos processados`}
            tone={cycle.directWebDiscovery.error ? 'rose' : cycle.directWebDiscovery.addedOrUpdated > 0 ? 'emerald' : 'zinc'}
          />
          <CycleStatusRow
            label="Site oficial"
            value={`${cycle.officialSite.enriched} enriquecidos · ${cycle.officialSite.failures} falhas`}
            detail={`${cycle.officialSite.candidates} seeds nesta passada`}
            tone={cycle.officialSite.failures > 0 ? 'rose' : cycle.officialSite.enriched > 0 ? 'emerald' : 'zinc'}
          />
          <CycleStatusRow
            label="Fallbacks"
            value={`web ${formatCycleReason(cycle.webSearch.reason)} · codex ${formatCycleReason(cycle.codexFallback.reason)}`}
            detail={`${cycle.webSearch.candidates} seeds web · ${cycle.codexFallback.matched} matches codex · ${cycle.codexFallback.weeklyCredits.toFixed(2)} créditos/semana`}
            tone={cycle.webSearch.reason === 'no_seed' && cycle.codexFallback.reason === 'no_seed' ? 'zinc' : 'amber'}
          />
          <CycleStatusRow
            label="Saída líquida"
            value={`prontos ${formatSignedNumber(cycle.countsDelta.ready)} · revisão ${formatSignedNumber(cycle.countsDelta.manual)}`}
            detail={`emails ${formatSignedNumber(cycle.countsDelta.withEmail)} · instagram ${formatSignedNumber(cycle.countsDelta.withInstagram)} · limpezas ${cycle.cleanup.downgraded}`}
            tone={cycle.countsDelta.ready > 0 || cycle.countsDelta.manual < 0 ? 'emerald' : cycle.cleanup.downgraded > 0 ? 'amber' : 'zinc'}
          />
        </div>
      </div>
    </Panel>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-400/20 bg-emerald-400/8 text-emerald-200',
    amber: 'border-amber-400/20 bg-amber-400/8 text-amber-200',
    rose: 'border-rose-400/20 bg-rose-400/8 text-rose-200',
    sky: 'border-sky-400/20 bg-sky-400/8 text-sky-200',
    zinc: 'border-white/8 bg-white/[0.03] text-zinc-100',
  }
  return (
    <div className={`rounded-xl border px-3 py-3 text-center ${colors[tone] ?? colors.zinc}`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">{label}</div>
    </div>
  )
}

function CycleStatusRow({
  detail,
  label,
  tone,
  value,
}: {
  detail: string
  label: string
  tone: 'amber' | 'emerald' | 'rose' | 'zinc'
  value: string
}) {
  const colors: Record<'amber' | 'emerald' | 'rose' | 'zinc', string> = {
    amber: 'border-amber-400/20 bg-amber-400/[0.06]',
    emerald: 'border-emerald-400/20 bg-emerald-400/[0.06]',
    rose: 'border-rose-400/20 bg-rose-400/[0.06]',
    zinc: 'border-white/8 bg-white/[0.03]',
  }

  return (
    <div className={`rounded-2xl border px-3 py-3 ${colors[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-zinc-100">{label}</div>
          <div className="mt-1 text-xs text-zinc-500">{detail}</div>
        </div>
        <div className="shrink-0 text-right text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  )
}

function BottleneckRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const barColors: Record<string, string> = {
    rose: 'bg-rose-400', amber: 'bg-amber-400', orange: 'bg-orange-400', zinc: 'bg-zinc-500',
  }
  return (
    <div>
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="font-mono">{value} <span className="text-zinc-600">({pct}%)</span></span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/6">
        <div className={`h-1.5 rounded-full ${barColors[tone] ?? 'bg-zinc-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase()
  const tone = s.includes('deliver') || s.includes('open') || s.includes('click')
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
    : s.includes('schedule')
    ? 'border-sky-400/30 bg-sky-400/10 text-sky-300'
    : s.includes('fail') || s.includes('bounce') || s.includes('complain')
    ? 'border-rose-400/30 bg-rose-400/10 text-rose-300'
    : 'border-zinc-700 bg-zinc-800/50 text-zinc-300'
  const map: Record<string, string> = {
    bounced: 'rejeitado', clicked: 'clicado', delivered: 'entregue', draft: 'rascunho',
    failed: 'falhou', needs_manual_review: 'suspeito', ready_for_review: 'pronto',
    scheduled: 'agendado', sent: 'enviado', waiting_for_batch: 'aguardando',
    needs_attention: 'atenção', raw: 'sem enriquecer', ignored_non_icp: 'fora ICP',
  }
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] ${tone}`}>{map[status] ?? status.replace(/_/g, ' ')}</span>
}

function Badge({ label, tone }: { label: string; tone: 'emerald' | 'zinc' }) {
  const c = tone === 'emerald' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-white/8 bg-white/[0.04] text-zinc-300'
  return <span className={`rounded-full border px-2 py-0.5 text-[10px] ${c}`}>{label}</span>
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-white/8 px-4 py-5 text-sm text-zinc-500">{text}</div>
}

// ─── Helpers ───

function buildMsg(lead: LeadItem) {
  const name = getLeadDisplayName(lead)
  const city = lead.city ? ` em ${lead.city}` : ''
  const domain = lead.websiteDomain ? ` e vi o site ${lead.websiteDomain}` : ''
  const touch = lead.emailStatus && lead.emailStatus !== 'sem-email'
    ? 'Te mandei um email rapido e passei por aqui para nao se perder no meio da rotina.'
    : 'Passei por aqui porque identifiquei uma oportunidade clara na estrutura digital do escritorio.'
  return [
    'Oi, tudo bem? Aqui e o Johny, da Digital Dog.',
    touch,
    `Analisei a presenca digital do ${name}${city}${domain} e separei algumas observacoes objetivas sobre captacao, busca local e conversao.`,
    'Se fizer sentido, eu te mando um diagnostico curto por aqui antes de qualquer proposta.',
  ].join('\n\n')
}

function fmtDate(v: string | null) {
  if (!v) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(v))
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return 'duracao indisponivel'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`
}

function formatSignedNumber(value: number) {
  if (value > 0) return `+${value}`
  return String(value)
}

function formatCycleReason(reason: string | null) {
  const labels: Record<string, string> = {
    completed: 'ok',
    no_fast_track: 'sem fast-track',
    no_prefix_left: 'sem prefixos',
    no_seed: 'sem seed',
    target_reached: 'meta atingida',
  }

  if (!reason) return 'sem status'
  return labels[reason] ?? reason.replace(/_/g, ' ')
}

function buildWaLink(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  // Ensure 55 country code
  const full = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${full}`
}

function getLeadDisplayName(lead: LeadItem) {
  const resolved = resolveLeadOfficeName({
    canonicalName: lead.canonicalName,
    officeName: lead.officeName,
    officialSiteTitle: null,
  })

  if (resolved) {
    return resolved
  }

  if (lead.websiteDomain) {
    return humanizeDomainLabel(lead.websiteDomain)
  }

  return 'Lead sem nome confiável'
}

function humanizeDomainLabel(domain: string) {
  const base = domain
    .replace(/^www\./i, '')
    .replace(/\.(com|net|org|adv|emp)\.br$/i, '')
    .replace(/\.(com|net|org|io|co|app)$/i, '')
    .replace(/[._-]+/g, ' ')
    .trim()

  if (!base) {
    return domain
  }

  return base
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

