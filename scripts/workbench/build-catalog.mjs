// Gera app/workbench/catalog.json a partir dos registries shadcn das fontes.
// Uso: node scripts/workbench/build-catalog.mjs
// Leve por design: só metadados. O source de cada item é buscado on-demand
// pelo route handler /api/workbench/source (evita CORS e mantém o JSON enxuto).

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../../app/workbench/catalog.json');

/** Fontes com registry shadcn enumerável. */
const SOURCES = [
  {
    id: 'reactbits',
    registry: 'https://reactbits.dev/r/registry.json',
    itemBase: 'https://reactbits.dev/r/',
    // reactbits publica 4 variantes por componente (JS/TS x CSS/TW).
    // Pra web design, TS + Tailwind é a mais útil — filtramos só essa.
    onlyTsTw: true,
  },
  {
    id: 'kokonut',
    registry: 'https://kokonutui.com/r/registry.json',
    itemBase: 'https://kokonutui.com/r/',
  },
  {
    id: 'unlumen',
    registry: 'https://ui.unlumen.com/r/registry.json',
    itemBase: 'https://ui.unlumen.com/r/',
  },
];

const CATEGORY_RULES = [
  ['text', /\b(text|type|scramble|shuffle|decrypt|gradient text|shiny|word|letter|typewriter|marquee)\b/i],
  ['background', /\b(background|backdrop|grid|dots|beams|aurora|gradient|mesh|particles|noise|grain|waves|orb)\b/i],
  ['button', /\b(button|cta|magnetic|ripple)\b/i],
  ['card', /\b(card|tilt|spotlight|glow|pin|3d)\b/i],
  ['cursor', /\b(cursor|pointer|follow)\b/i],
  ['nav', /\b(nav|menu|dock|sidebar|header|tabs|breadcrumb)\b/i],
  ['loader', /\b(loader|spinner|skeleton|progress|loading)\b/i],
  ['scroll', /\b(scroll|reveal|parallax|sticky|marquee|infinite)\b/i],
  ['image', /\b(image|gallery|carousel|lens|zoom|pixel)\b/i],
  ['input', /\b(input|form|prompt|textarea|search|otp|select)\b/i],
  ['animation', /\b(animat|motion|spring|stagger|morph|transition|fade|flip)\b/i],
];

function classify(title, description) {
  const hay = `${title} ${description || ''}`;
  for (const [cat, re] of CATEGORY_RULES) if (re.test(hay)) return cat;
  return 'other';
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`não-JSON em ${url}: ${text.slice(0, 80)}`);
  }
}

function normalizeName(raw, onlyTsTw) {
  // reactbits: "AnimatedContent-TS-TW" -> "AnimatedContent"
  if (onlyTsTw) return raw.replace(/-TS-TW$/, '');
  return raw;
}

async function buildSource(src) {
  const reg = await fetchJson(src.registry);
  const items = reg.items || reg;
  const out = [];
  for (const it of items) {
    if (!it?.name || it.name === 'index') continue;
    if (it.type && !/component|block|ui/.test(it.type)) continue;
    if (src.onlyTsTw && !/-TS-TW$/.test(it.name)) continue;
    // Pula componentes pagos (ex.: unlumen PRO) — source bloqueado (401), sem
    // valor num tool de estudo/cópia. Marcados por meta.premium / files vazio.
    if (it.meta?.premium || (Array.isArray(it.files) && it.files.length === 0)) continue;

    const display = normalizeName(it.name, src.onlyTsTw);
    const title = it.title || display;
    const registryDependencies = it.registryDependencies || [];
    out.push({
      id: `${src.id}:${it.name}`,
      source: src.id,
      name: it.name,
      title,
      description: it.description || '',
      category: classify(title, it.description),
      dependencies: it.dependencies || [],
      registryDependencies,
      // Renderizável ao vivo se não depende de primitivos shadcn externos.
      live: registryDependencies.length === 0,
      itemUrl: `${src.itemBase}${it.name}.json`,
    });
  }
  return out;
}

async function main() {
  const all = [];
  const summary = [];
  for (const src of SOURCES) {
    try {
      const items = await buildSource(src);
      all.push(...items);
      summary.push(`${src.id}: ${items.length}`);
      console.log(`✓ ${src.id}: ${items.length} itens`);
    } catch (err) {
      summary.push(`${src.id}: ERRO`);
      console.error(`✗ ${src.id}: ${err.message}`);
    }
  }

  all.sort((a, b) => a.title.localeCompare(b.title));
  const catalog = {
    generatedAt: new Date().toISOString(),
    total: all.length,
    sources: SOURCES.map((s) => s.id),
    items: all,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(catalog, null, 0));
  console.log(`\n→ ${all.length} componentes → ${OUT}\n   (${summary.join(' · ')})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
