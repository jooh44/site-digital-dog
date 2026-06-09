'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import catalogJson from './catalog.json';

const LiveSandbox = dynamic(() => import('./LiveSandbox'), {
  ssr: false,
  loading: () => <div className="text-xs text-[#6b7280] py-12 text-center">montando sandbox…</div>,
});
import {
  SOURCES,
  REFERENCE_SOURCES,
  type Catalog,
  type CatalogItem,
} from './_lib/sources';

const catalog = catalogJson as Catalog;

const CATEGORIES = [
  'all', 'text', 'background', 'card', 'button', 'cursor',
  'nav', 'scroll', 'animation', 'image', 'input', 'loader', 'other',
] as const;

const SAVED_KEY = 'workbench:saved';

interface RegistryFile {
  path: string;
  content?: string;
  type?: string;
}
interface RegistryItem {
  name?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  locked?: boolean;
}

function sourceLabel(id: string) {
  return SOURCES[id]?.label ?? id;
}
function sourceAccent(id: string) {
  return SOURCES[id]?.accent ?? '#6b7280';
}

export default function WorkbenchClient() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [activeSource, setActiveSource] = useState<string>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [openItem, setOpenItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.items
      .filter((it) => {
        if (activeSource !== 'all' && it.source !== activeSource) return false;
        if (cat !== 'all' && it.category !== cat) return false;
        if (savedOnly && !saved.has(it.id)) return false;
        if (liveOnly && !it.live) return false;
        if (q) {
          const hay = `${it.title} ${it.description} ${it.name} ${it.source}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      // renderáveis ao vivo primeiro, depois alfabético
      .sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0) || a.title.localeCompare(b.title));
  }, [query, cat, activeSource, savedOnly, liveOnly, saved]);

  const sourceCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const it of catalog.items) m[it.source] = (m[it.source] ?? 0) + 1;
    return m;
  }, []);

  return (
    <main className="min-h-screen bg-[#03050a] text-white">
      <header className="border-b border-[#1e2330] bg-[#0a0d14]/90 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
              <h1 className="text-base font-semibold tracking-tight">Workbench · Discover</h1>
              <span className="text-xs text-[#6b7280]">{catalog.total} componentes · {catalog.sources.length} registries</span>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="buscar componente, lib, palavra-chave…"
              className="flex-1 min-w-[240px] max-w-md bg-[#11141d] border border-[#1e2330] rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-[#4b5563] focus:outline-none focus:border-[#00bcd4]/50"
            />
          </div>

          {/* Source + saved filters */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <FilterPill active={activeSource === 'all'} onClick={() => setActiveSource('all')}>
              todas as fontes
            </FilterPill>
            {catalog.sources.map((s) => (
              <FilterPill key={s} active={activeSource === s} onClick={() => setActiveSource(s)}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: sourceAccent(s) }} />
                {sourceLabel(s)} <span className="text-[#4b5563]">{sourceCounts[s]}</span>
              </FilterPill>
            ))}
            <FilterPill active={liveOnly} onClick={() => setLiveOnly((v) => !v)}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              só preview ao vivo
            </FilterPill>
            <FilterPill active={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
              ★ salvos <span className="text-[#4b5563]">{saved.size}</span>
            </FilterPill>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                  cat === c
                    ? 'bg-[#00bcd4]/15 text-[#00bcd4]'
                    : 'text-[#6b7280] hover:text-white'
                }`}
              >
                {c === 'all' ? 'tudo' : c}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-xs text-[#6b7280] mb-4">{visible.length} resultado{visible.length === 1 ? '' : 's'}</div>

        {visible.length === 0 ? (
          <div className="text-center py-24 text-[#6b7280] text-sm">nada nessa combinação de filtros.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visible.map((it) => (
              <ComponentCard
                key={it.id}
                item={it}
                saved={saved.has(it.id)}
                onToggleSave={() => toggleSaved(it.id)}
                onOpen={() => setOpenItem(it)}
              />
            ))}
          </div>
        )}

        {/* Reference-only sources */}
        <div className="mt-12 pt-8 border-t border-[#1e2330]">
          <div className="text-[10px] uppercase tracking-widest text-[#6b7280] mb-3">
            referência · sem registry enumerável (abrir no site)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {REFERENCE_SOURCES.map((s) => (
              <a
                key={s.id}
                href={s.site}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-[#1e2330] bg-[#0a0d14] px-4 py-3.5 hover:border-[#00bcd4]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.accent }} />
                  <span className="text-sm font-medium text-white">{s.label}</span>
                </div>
                <div className="text-[11px] text-[#6b7280] mt-1 group-hover:text-[#9ca3af]">
                  {s.site.replace('https://', '')} ↗
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {openItem && <CodeDrawer item={openItem} onClose={() => setOpenItem(null)} />}
    </main>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? 'bg-[#00bcd4]/10 text-[#00bcd4] border-[#00bcd4]/30'
          : 'text-[#9ca3af] border-[#252830] hover:text-white hover:border-[#3a3f4b]'
      }`}
    >
      {children}
    </button>
  );
}

function ComponentCard({
  item,
  saved,
  onToggleSave,
  onOpen,
}: {
  item: CatalogItem;
  saved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="group flex flex-col rounded-xl border border-[#1e2330] bg-[#0a0d14] overflow-hidden hover:border-[#00bcd4]/30 transition-colors">
      <div className="px-4 pt-3.5 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-white leading-tight">{item.title}</h2>
          <button
            onClick={onToggleSave}
            aria-label={saved ? 'remover dos salvos' : 'salvar'}
            className={`shrink-0 text-sm leading-none transition-colors ${
              saved ? 'text-[#00bcd4]' : 'text-[#3a3f4b] hover:text-[#9ca3af]'
            }`}
          >
            {saved ? '★' : '☆'}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ color: sourceAccent(item.source), background: `${sourceAccent(item.source)}1a` }}
          >
            {sourceLabel(item.source)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#6b7280]">{item.category}</span>
          {item.live && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ao vivo
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-[#9ca3af] mt-2 leading-relaxed line-clamp-3">{item.description}</p>
        )}
        {item.dependencies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.dependencies.slice(0, 4).map((d) => (
              <span key={d} className="text-[9px] font-mono text-[#6b7280] border border-[#252830] rounded px-1 py-0.5">
                {d.replace(/@\^?[\d.]+$/, '')}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center border-t border-[#1e2330] text-xs">
        <button
          onClick={onOpen}
          className="flex-1 px-3 py-2.5 text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-colors text-left font-medium"
        >
          ver código →
        </button>
        <a
          href={SOURCES[item.source]?.site}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2.5 text-[#6b7280] hover:text-white border-l border-[#1e2330] transition-colors"
        >
          site ↗
        </a>
      </div>
    </article>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-mono px-3 py-2 -mb-px border-b-2 transition-colors ${
        active ? 'text-[#00bcd4] border-[#00bcd4]' : 'text-[#6b7280] border-transparent hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function CopyButton({ text, label = 'copiar' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        } catch {
          /* ignore */
        }
      }}
      className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-[#252830] text-[#9ca3af] hover:text-white hover:border-[#00bcd4]/40 transition-colors"
    >
      {done ? '✓ copiado' : label}
    </button>
  );
}

function CodeDrawer({ item, onClose }: { item: CatalogItem; onClose: () => void }) {
  const [data, setData] = useState<RegistryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canPreview = item.registryDependencies.length === 0;
  const [view, setView] = useState<'preview' | 'code'>(canPreview ? 'preview' : 'code');
  const cli = SOURCES[item.source]?.cli?.replace('{name}', item.name);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(null);
    fetch(`/api/workbench/source?url=${encodeURIComponent(item.itemUrl)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => alive && setData(j))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [item.itemUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#0a0d14] border border-[#1e2330] rounded-xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#0a0d14]/95 backdrop-blur border-b border-[#1e2330] px-5 py-3.5 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">{item.title}</h2>
              <span
                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ color: sourceAccent(item.source), background: `${sourceAccent(item.source)}1a` }}
              >
                {sourceLabel(item.source)}
              </span>
            </div>
            {item.description && <p className="text-xs text-[#9ca3af] mt-1 max-w-md">{item.description}</p>}
          </div>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="px-5 py-3 space-y-3">
          {/* Tabs Preview / Código */}
          <div className="flex items-center gap-1 border-b border-[#1e2330]">
            <TabButton active={view === 'preview'} onClick={() => setView('preview')}>
              ● preview ao vivo
            </TabButton>
            <TabButton active={view === 'code'} onClick={() => setView('code')}>
              {'</>'} código
            </TabButton>
          </div>

          {error && (
            <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded p-3">
              falha ao buscar source: {error}
            </div>
          )}
          {!data && !error && <div className="text-xs text-[#6b7280] py-8 text-center">carregando source…</div>}

          {data?.locked && (
            <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              Componente PRO (pago) — o source é bloqueado pela fonte. Veja no{' '}
              <a href={SOURCES[item.source]?.site} target="_blank" rel="noreferrer" className="underline">
                site oficial
              </a>
              .
            </div>
          )}

          {data && !data.locked && view === 'preview' &&
            (canPreview ? (
              <LiveSandbox name={item.name} files={data.files ?? []} dependencies={item.dependencies} />
            ) : (
              <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                Este componente depende de {item.registryDependencies.length} primitivo(s) shadcn (
                {item.registryDependencies.join(', ')}) que não vêm no pacote. Render ao vivo ainda não suportado —
                veja o <strong>código</strong> e instale via CLI.
              </div>
            ))}

          {data && !data.locked && view === 'code' && (
            <div className="space-y-3">
              {cli && (
                <div className="rounded-lg border border-[#1e2330] bg-[#060810] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-[#6b7280]">instalar via cli</span>
                    <CopyButton text={cli} />
                  </div>
                  <code className="text-xs text-[#00bcd4] font-mono break-all">{cli}</code>
                </div>
              )}
              {(item.dependencies.length > 0 || item.registryDependencies.length > 0) && (
                <div className="flex flex-wrap gap-1.5">
                  {item.dependencies.map((d) => (
                    <span key={d} className="text-[10px] font-mono text-[#9ca3af] border border-[#252830] rounded px-1.5 py-0.5">
                      npm: {d}
                    </span>
                  ))}
                  {item.registryDependencies.map((d) => (
                    <span key={d} className="text-[10px] font-mono text-[#a78bfa] border border-[#252830] rounded px-1.5 py-0.5">
                      reg: {d}
                    </span>
                  ))}
                </div>
              )}
              {data.files?.map((f) => (
                <div key={f.path} className="rounded-lg border border-[#1e2330] overflow-hidden">
                  <div className="flex items-center justify-between bg-[#060810] px-3 py-2 border-b border-[#1e2330]">
                    <span className="text-[11px] font-mono text-[#9ca3af] truncate">{f.path}</span>
                    {f.content && <CopyButton text={f.content} />}
                  </div>
                  <pre className="text-[11px] leading-relaxed text-[#cbd5e1] font-mono p-3 overflow-x-auto max-h-[420px] overflow-y-auto">
                    {f.content ?? '— sem conteúdo —'}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
