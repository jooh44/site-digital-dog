// Transforma os arquivos de um item de registry shadcn em arquivos prontos pro Sandpack.
// O nó do problema é o alias `@/` (raiz do projeto) — o bundler do Sandpack não lê
// tsconfig paths, então reescrevemos `@/x` pro caminho relativo a partir de cada arquivo.

interface RegistryFile {
  path: string;
  content?: string;
  type?: string;
}

export interface SandboxResult {
  ok: boolean;
  reason?: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
  entry: string;
}

const CN_UTILS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const INDEX_HTML = `<!DOCTYPE html>
<html class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { darkMode: "class" }</script>
    <style>
      html,body,#root{height:100%;margin:0}
      body{background:#0a0d14;color:#fff;font-family:ui-sans-serif,system-ui,sans-serif;
        display:flex;align-items:center;justify-content:center;overflow:hidden}
      #root{display:flex;align-items:center;justify-content:center;padding:24px;width:100%}
    </style>
  </head>
  <body><div id="root"></div></body>
</html>
`;

// Shims pra imports de Next.js (Sandpack é React puro, não tem next/*).
const NEXT_LINK_SHIM = `import * as React from "react";
export default function Link({ href = "#", children, ...rest }: any) {
  return <a href={typeof href === "string" ? href : "#"} {...rest}>{children}</a>;
}
`;
const NEXT_IMAGE_SHIM = `import * as React from "react";
export default function Image({ src, alt = "", fill, priority, loader, quality, placeholder, blurDataURL, ...rest }: any) {
  const s = typeof src === "string" ? src : (src && src.src) || "";
  const fillStyle = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : undefined;
  return <img src={s} alt={alt} style={{ ...(fillStyle || {}), ...(rest.style || {}) }} {...rest} />;
}
`;

function dirname(p: string) {
  const i = p.lastIndexOf('/');
  return i <= 0 ? '/' : p.slice(0, i);
}

function stripExt(p: string) {
  return p.replace(/\.(tsx|ts|jsx|js)$/, '');
}

/** Caminho relativo de `from` (diretório absoluto) até `to` (arquivo absoluto). */
function relativeFromDir(fromDir: string, to: string) {
  const a = fromDir.split('/').filter(Boolean);
  const b = to.split('/').filter(Boolean);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const up = a.slice(i).map(() => '..');
  const down = b.slice(i);
  const rel = [...up, ...down].join('/');
  return rel.startsWith('.') ? rel : './' + rel;
}

/** Reescreve imports `@/...` num arquivo localizado em `fileDir`. */
function rewriteAliases(content: string, fileDir: string) {
  return content.replace(/(['"])@\/([^'"]+)\1/g, (_m, q, sub) => {
    const rel = relativeFromDir(fileDir, '/' + sub);
    return `${q}${rel}${q}`;
  });
}

/** Detecta o nome e o tipo de export do componente principal. */
function detectExport(content: string): { kind: 'default' | 'named'; name: string } | null {
  // export default (function/class nomeada, ou expressão anônima)
  if (/export\s+default(?!\s+\{)/.test(content)) {
    const m = content.match(/export\s+default\s+(?:async\s+)?(?:function|class)\s+([A-Za-z0-9_]+)/);
    return { kind: 'default', name: m?.[1] ?? 'Component' };
  }
  // export function Foo / export const Foo = ...
  const fn = content.match(/export\s+(?:async\s+)?function\s+([A-Z][A-Za-z0-9_]*)/);
  if (fn) return { kind: 'named', name: fn[1] };
  const cst = content.match(/export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*[:=]/);
  if (cst) return { kind: 'named', name: cst[1] };
  // bloco de re-export: export { Foo, Bar as Baz } [from '...']
  const block = content.match(/export\s*\{([^}]+)\}/);
  if (block) {
    const names = block[1]
      .split(',')
      .map((s) => s.trim().split(/\s+as\s+/).pop()?.trim())
      .filter((n): n is string => !!n && n !== 'default');
    const comp = names.find((n) => /^[A-Z]/.test(n));
    if (comp) return { kind: 'named', name: comp };
  }
  return null;
}

function parseDep(entry: string): [string, string] {
  // "@react-three/fiber@^8.0.0" -> ["@react-three/fiber","^8.0.0"]; "lucide-react" -> ["lucide-react","latest"]
  const at = entry.lastIndexOf('@');
  if (at > 0) return [entry.slice(0, at), entry.slice(at + 1)];
  return [entry, 'latest'];
}

export function buildSandbox(
  itemName: string,
  files: RegistryFile[],
  rawDependencies: string[],
): SandboxResult {
  const dependencies: Record<string, string> = {};
  for (const d of rawDependencies) {
    const [name, ver] = parseDep(d);
    dependencies[name] = ver;
  }

  const sandboxFiles: Record<string, string> = {};
  let usesCn = false;
  let usesNext = false;

  for (const f of files) {
    if (!f.content) continue;
    const dir = dirname(f.path);
    let content = rewriteAliases(f.content, dir);
    // Redireciona next/link e next/image pros shims locais.
    content = content.replace(/(['"])next\/(link|image)\1/g, (_m, q, mod) => {
      usesNext = true;
      return `${q}${relativeFromDir(dir, '/next/' + mod)}${q}`;
    });
    if (/lib\/utils/.test(f.content)) usesCn = true;
    sandboxFiles[f.path] = content;
  }

  // Componente principal: o registry:component cujo basename casa com o nome do item, senão o 1º.
  const components = files.filter((f) => f.content && /\.(tsx|jsx)$/.test(f.path));
  const main =
    components.find((f) => stripExt(f.path).toLowerCase().endsWith(itemName.toLowerCase())) ||
    components.find((f) => f.type === 'registry:component') ||
    components[0];

  if (!main || !main.content) {
    return { ok: false, reason: 'sem arquivo de componente renderizável', files: {}, dependencies: {}, entry: '/App.tsx' };
  }

  const exp = detectExport(main.content);
  if (!exp) {
    return { ok: false, reason: 'não detectei o export do componente', files: {}, dependencies: {}, entry: '/App.tsx' };
  }

  if (usesCn) {
    sandboxFiles['/lib/utils.ts'] = CN_UTILS;
    dependencies['clsx'] = 'latest';
    dependencies['tailwind-merge'] = 'latest';
  }

  if (usesNext) {
    sandboxFiles['/next/link.tsx'] = NEXT_LINK_SHIM;
    sandboxFiles['/next/image.tsx'] = NEXT_IMAGE_SHIM;
  }

  const importPath = './' + stripExt(main.path).replace(/^\//, '');
  const importLine =
    exp.kind === 'default'
      ? `import Cmp from "${importPath}";`
      : `import { ${exp.name} as Cmp } from "${importPath}";`;

  // Passa children só se o componente realmente renderiza `{children}` ou acessa
  // `children.algo` (ex.: Slot lê children.type). Assim NÃO forçamos children em
  // componentes baseados em <input> (void element) que quebrariam.
  const allContent = files.map((f) => f.content || '').join('\n');
  const passChildren = /\{\s*children\s*\}|children\.[a-zA-Z]/.test(allContent);
  const cmpJsx = passChildren
    ? '<Cmp text={SAMPLE}><span>{SAMPLE}</span></Cmp>'
    : '<Cmp text={SAMPLE} />';

  // Palco + Stage (error boundary). children/text passados conforme a heurística
  // acima. Se ainda assim o componente quebrar (precisa de props de dados como
  // items/images), o boundary mostra uma mensagem apontando pro "editar ao vivo".
  // Tailwind é injetado via Play CDN (o Sandpack ignora o index.html do template).
  sandboxFiles['/App.tsx'] = `import { useEffect } from "react";
import * as React from "react";
${importLine}

const SAMPLE = "Preview do componente";

class Stage extends React.Component<{}, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", maxWidth: 380, lineHeight: 1.5 }}>
          Este componente precisa de props específicas (ex.: <code>items</code>, <code>images</code>, <code>value</code>).
          <br />Clique em <strong>✎ editar ao vivo</strong> e passe os dados no App.tsx.
        </div>
      );
    }
    return ${cmpJsx};
  }
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    Object.assign(document.body.style, { background: "#0a0d14", color: "#fff", margin: "0" });
    if (!document.getElementById("tw-cdn")) {
      const s = document.createElement("script");
      s.id = "tw-cdn";
      s.src = "https://cdn.tailwindcss.com";
      s.onload = () => { (window as any).tailwind && ((window as any).tailwind.config = { darkMode: "class" }); };
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box" }}>
      <Stage />
    </div>
  );
}
`;
  // Entry próprio com createRoot — compatível com React 18 e 19, e independente
  // da API que o index.tsx do template usa (que pode ser o ReactDOM.render legado).
  sandboxFiles['/index.tsx'] = `import { createRoot } from "react-dom/client";
import App from "./App";
const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
`;
  sandboxFiles['/public/index.html'] = INDEX_HTML;

  // React 19: libs modernas (ex.: @react-three/fiber v9) exigem; o createRoot
  // acima garante o mount. motion/gsap funcionam igual em 18 e 19.
  dependencies['react'] = '^19.0.0';
  dependencies['react-dom'] = '^19.0.0';

  return { ok: true, files: sandboxFiles, dependencies, entry: '/index.tsx' };
}
