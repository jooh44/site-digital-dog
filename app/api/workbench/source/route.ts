import { NextResponse } from 'next/server';

// Proxy server-side pro JSON de um item de registry shadcn.
// Existe pra contornar CORS (os registries não mandam Access-Control-Allow-Origin)
// e manter o catalog.json enxuto — o source é buscado só quando o usuário abre o item.

const ALLOWED_HOSTS = new Set(['reactbits.dev', 'kokonutui.com', 'ui.unlumen.com']);

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: 'host not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: { accept: 'application/json' },
      next: { revalidate: 60 * 60 * 24 }, // cache 24h
    });
    if (upstream.status === 401 || upstream.status === 403) {
      // Componente pago/gated (ex.: unlumen PRO) — sem source público.
      return NextResponse.json({ locked: true }, { status: 200 });
    }
    if (!upstream.ok) {
      return NextResponse.json({ error: `upstream ${upstream.status}` }, { status: 502 });
    }
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
  }
}
