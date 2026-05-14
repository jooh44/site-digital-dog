# VetOS — Auditoria de Segurança e Qualidade Técnica

**Data:** 2026-03-27
**Repositório auditado:** `JayPernet/vet-os` (branch `main`)
**Método:** Análise estática completa — auth, RBAC, multi-tenant, AI integration, infra

---

## Resumo Executivo

O VetOS demonstra **arquitetura de nível sênior**: feature-based architecture limpa, RBAC com permission matrix granular, multi-tenant com `org_id`, integração de IA com quota management, e stack moderno (Next.js 16, Supabase, Vercel AI SDK, Zod). A capacidade técnica está comprovada.

Porém, a auditoria identificou **3 vulnerabilidades críticas**, **5 altas** e **4 médias** que precisam ser corrigidas antes de qualquer deploy em produção — especialmente considerando que o sistema lida com dados médicos protegidos pela LGPD.

**Nenhuma das vulnerabilidades é arquitetural.** São falhas de implementação corrigíveis sem refatoração estrutural.

---

## Vulnerabilidades Críticas (Acesso total ao sistema por atacante)

### CRIT-01: Secret hardcoded no código-fonte

**Arquivo:** `supabase/functions/vetos_process_medical_transcription/index.ts`, linha 11

```typescript
const INTERNAL_SECRET = "vetos_storage_secret_transcribe_2026";
```

**Impacto:** Essa string está commitada no repositório. Qualquer pessoa com acesso ao repo (ou que encontre em um vazamento) pode chamar a Edge Function diretamente. A função usa `SERVICE_ROLE_KEY` (linha 37-39), que **bypassa RLS completamente** — ou seja, acesso total de leitura e escrita em todo o banco de dados.

**Correção:**
```typescript
// ANTES (vulnerável)
const INTERNAL_SECRET = "vetos_storage_secret_transcribe_2026";

// DEPOIS (seguro)
const INTERNAL_SECRET = Deno.env.get("VETOS_INTERNAL_SECRET");
if (!INTERNAL_SECRET) throw new Error("VETOS_INTERNAL_SECRET not configured");
```
- Mover o secret para as variáveis de ambiente do Supabase
- **Rotacionar o secret imediatamente** — o valor atual está exposto no histórico do Git

---

### CRIT-02: Super-admin org-actions sem NENHUM check de autenticação

**Arquivo:** `features/super-admin/actions/org-actions.ts`

As funções `createOrganizationAction`, `updateOrganizationStatusAction`, `removeOrganizationAction` e `updateOrganizationDataAction` usam `supabaseAdmin` (service role key, bypassa RLS) mas **nunca verificam quem está chamando**.

```typescript
// Linha 52 — nenhum check de auth
export async function createOrganizationAction(data: CreateOrgPayload) {
    // Usa supabaseAdmin diretamente — qualquer pessoa que chame este server action
    // pode criar organizações, criar usuários, configurar planos
```

Server actions do Next.js são expostos como endpoints POST. **Qualquer usuário autenticado** — até um TUTOR — pode invocar essas funções via `fetch()` direto. Isso permite:
- Criar organizações com contas admin
- Suspender ou deletar qualquer clínica
- Modificar dados de qualquer organização

**Correção:** Adicionar auth + role check em TODAS as org-actions:
```typescript
export async function createOrganizationAction(data: CreateOrgPayload) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Não autenticado' };

    const { data: profile } = await supabaseAdmin
        .from('vetos_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'Acesso negado' };
    }

    // ... resto da lógica
}
```

---

### CRIT-03: Fallback de auth impersona o primeiro usuário do banco

**Arquivo:** `app/lib/actions.ts`, linhas 215-218 e 267-276

```typescript
// Fallback Auth Logic
let vetId = session?.user?.id;
if (!vetId) {
    const fallbackUser = await prisma.user.findFirst();
    if (fallbackUser) vetId = fallbackUser.id;
    else throw new Error("Nenhum usuário encontrado no sistema.");
}
```

E o helper:
```typescript
async function getActiveVetId() {
    const session = await auth();
    if (session?.user?.id) return session.user.id;
    // Fallback: Get first user (to allow dev testing without strict auth)
    const fallbackUser = await prisma.user.findFirst();
```

Se a autenticação falhar por qualquer motivo, o código **pega o primeiro usuário do banco** e cria prontuários médicos em nome dessa pessoa. Mesmo rotulado como "dev mode", esse código está em arquivos que vão para produção.

**Impacto:** Criação de prontuários médicos não autenticados atribuídos a usuários aleatórios. Falsificação de registro médico.

**Correção:** Remover o fallback completamente. Se não autenticou, rejeitar.
```typescript
async function getActiveVetId() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Autenticação obrigatória para esta ação.");
    }
    return session.user.id;
}
```

---

## Vulnerabilidades Altas

### HIGH-01: Senha padrão hardcoded `123456`

**Arquivo:** `app/lib/actions.ts`, linha 73

```typescript
const hashedPassword = await bcrypt.hash('123456', 10); // Default password
```

Todo tutor criado por esse código ganha a senha `123456`. Trivialmente adivinhável.

**Correção:** Exigir que o admin defina a senha durante a criação, ou gerar senha aleatória e enviar por email/WhatsApp.

---

### HIGH-02: 6+ server actions sem check de autenticação

Múltiplas server actions nunca chamam `supabase.auth.getUser()`:

| Arquivo | Função | Risco |
|---------|--------|-------|
| `features/pets/actions/pet-actions.ts` | `deletePet()`, `updatePet()` | Qualquer um deleta/edita pets por ID |
| `features/pets/actions/pet-vet-actions.ts` | `assignVetToPet()`, `unassignVetFromPet()` | Manipulação de atribuições vet-pet |
| `features/vaccines/actions/vaccine-actions.ts` | `deleteVaccine()` | Deletar registros de vacinação |
| `features/services/actions/service-actions.ts` | `deleteService()`, `updateService()` | Manipulação de serviços |

Essas actions usam o client Supabase do usuário, então RLS oferece *alguma* proteção — mas **somente se** as políticas RLS estiverem corretamente configuradas nas tabelas `vetos_*` (não verificável pelo repo, já que as migrations não estão versionadas).

**Correção:** Adicionar auth check no início de cada action:
```typescript
export async function deletePet(petId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Não autenticado' };

    // + verificar role se necessário (ex: TUTOR não pode deletar pet de outro tutor)
    // ... resto da lógica
}
```

---

### HIGH-03: `/api/chat` sem autenticação

**Arquivo:** `app/api/chat/route.ts`

```typescript
export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();
        // Nenhum check de auth — qualquer pessoa pode POST aqui
```

O endpoint aceita mensagens arbitrárias e executa queries no banco via tool calls (`getPatientHistory`, `searchPatients`, `getConsultationQueue`). Sem autenticação, qualquer pessoa pode extrair dados de pacientes via IA.

**Correção:**
```typescript
export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    // ... resto da lógica
}
```

---

### HIGH-04: `getSession()` em vez de `getUser()` para decisões de segurança

**Arquivo:** `features/crm/hooks/use-leads.ts`, linhas 46 e 226

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

A documentação do Supabase [avisa explicitamente](https://supabase.com/docs/reference/javascript/auth-getsession) que `getSession()` lê do localStorage e **NÃO valida a sessão com o servidor**. Para decisões de segurança (como determinar `org_id` para isolamento de dados), deve-se usar `getUser()`.

---

### HIGH-05: Webhook URLs do N8N expostos no client bundle

**Arquivo:** `.env.example`, linha 24 + `features/copilot/components/assistente-view.tsx`, linha 84

```
NEXT_PUBLIC_N8N_WHATSAPP_WEBHOOK="https://your-n8n-instance/webhook/your-webhook-id"
```

URLs com prefixo `NEXT_PUBLIC_` são incluídas no JavaScript do cliente. Qualquer pessoa pode extrair essas URLs do bundle e chamar os webhooks diretamente — enviando mensagens pelo WhatsApp do sistema ou interagindo com o copilot sem autenticação.

**Correção:** Proxy via API route do Next.js:
```typescript
// app/api/webhook/whatsapp/route.ts
export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const response = await fetch(process.env.N8N_WHATSAPP_WEBHOOK!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return new Response(await response.text(), { status: response.status });
}
```

---

## Vulnerabilidades Médias

### MED-01: CORS wildcard nas Edge Functions

**Arquivo:** `supabase/functions/vetos_process_medical_transcription/index.ts`, linha 7

```typescript
"Access-Control-Allow-Origin": "*",
```

Qualquer site pode fazer requests cross-origin para as Edge Functions. Combinado com o secret hardcoded (CRIT-01), significa acesso total de qualquer domínio.

**Correção:** Restringir ao domínio da aplicação:
```typescript
"Access-Control-Allow-Origin": "https://vet-os.vercel.app",
```

---

### MED-02: `ignoreBuildErrors: true` no next.config

**Arquivo:** `next.config.mjs`, linha 30

```javascript
typescript: {
    ignoreBuildErrors: true,
},
```

Isso **anula completamente o TypeScript**. Erros de tipo são ignorados silenciosamente no build. Bugs que o compilador pegaria passam direto para produção.

**Correção:** Remover essa flag e corrigir todos os erros de TypeScript. Imports mortos de Prisma (em `app/lib/actions.ts`, `app/actions/upload.ts`, `features/pets/actions/fetch-pets.ts`) vão aparecer — remover.

---

### MED-03: Sem `middleware.ts`

O projeto **não tem `middleware.ts`**. Esse é o padrão do Next.js para proteção de rotas no edge — antes da página começar a carregar.

Sem middleware, a proteção depende de:
- Check de `getUser()` no layout do dashboard (funciona, mas roda depois do page load iniciar)
- Checks individuais em server actions (que são inconsistentes, como visto acima)

**Correção:** Criar `middleware.ts` na raiz:
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const supabase = createServerClient(/* config */);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Super-admin route protection
    if (request.nextUrl.pathname.startsWith('/super-admin')) {
        // Verificar role aqui ou no layout
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/super-admin/:path*'],
};
```

---

### MED-04: Body size de 50MB sem rate limiting

**Arquivo:** `next.config.mjs`, linha 8

```javascript
serverActions: {
    bodySizeLimit: '50mb',
},
```

Permite uploads de 50MB por qualquer server action. Sem rate limiting, um atacante pode esgotar storage rapidamente (DoS).

**Correção:** Manter o limite se necessário para áudio de consultas, mas adicionar rate limiting (via middleware ou Vercel Edge Config).

---

## Observações Adicionais

### Auth dual (NextAuth + Supabase Auth)

O projeto tem **dois sistemas de auth** coexistindo:

1. **Supabase Auth** — o layer real (login, cookies, RLS)
2. **NextAuth v5 beta** (`next-auth@5.0.0-beta.25`) — configurado mas vestigial

Em `auth.ts`, o Credentials provider retorna `null` sempre. O login real acontece via `supabase.auth.signInWithPassword()` no `LoginForm.tsx`. O NextAuth não faz nada efetivo além de existir.

**Recomendação:** Remover NextAuth completamente para eliminar confusão e reduzir superfície de ataque. Ou migrar 100% para ele — mas não manter os dois.

### Schema não versionado

Apenas 1 migration existe no repo (`20260301110000_ai_chat_n8n_tables.sql`). As tabelas `vetos_*` foram aparentemente criadas direto no dashboard do Supabase.

**Risco:** Schema não reproduzível. Se precisar recriar o banco, não tem como. Se outro dev entrar no projeto, não sabe a estrutura.

**Recomendação:** Exportar todas as migrations do Supabase e versionar no repositório.

### Zero testes automatizados

Nenhum arquivo de teste foi encontrado no projeto.

**Recomendação mínima:** Testes de integração para:
- Fluxos de autenticação (login, logout, session expiry)
- Isolamento multi-tenant (clinic A não vê dados da clinic B)
- RBAC (TUTOR não acessa funções de ADMIN)

---

## Pontos Fortes (O que está bem feito)

1. **Feature-Based Architecture** — organização limpa com 20+ features separadas
2. **RBAC** — permission matrix com `can()` function, `PermissionGuard` e `RoleGuard`
3. **Multi-tenant** — `org_id` filtrado consistentemente na maioria das actions
4. **AI quota management** — limites por plano com reset mensal
5. **Staff management** — safeguards (não pode demote a si mesmo, secretary não promove para admin)
6. **Organization lifecycle** — status check (ACTIVE/SUSPENDED/INACTIVE) bloqueia acesso
7. **Zod validation** — presente em login e schemas de formulários
8. **Service role key** — corretamente fora de `NEXT_PUBLIC_`
9. **Documentação** — `.context/` com briefing, PRD, design system, user stories
10. **Dashboard layout auth gate** — `supabase.auth.getUser()` com redirect para não-autenticados

---

## Checklist de Correção (Ordem de prioridade)

- [ ] **CRIT-01** — Mover secret da Edge Function para env var + rotacionar valor
- [ ] **CRIT-02** — Adicionar auth + SUPER_ADMIN check em todas as org-actions
- [ ] **CRIT-03** — Remover fallback de auth em `app/lib/actions.ts`
- [ ] **HIGH-01** — Remover senha hardcoded `123456`
- [ ] **HIGH-02** — Adicionar auth check nas 6+ server actions sem proteção
- [ ] **HIGH-03** — Adicionar autenticação no `/api/chat`
- [ ] **HIGH-04** — Trocar `getSession()` por `getUser()` em `use-leads.ts`
- [ ] **HIGH-05** — Mover webhook URLs do N8N para server-side (proxy via API route)
- [ ] **MED-01** — Restringir CORS nas Edge Functions
- [ ] **MED-02** — Remover `ignoreBuildErrors: true` e corrigir erros de TS
- [ ] **MED-03** — Criar `middleware.ts` para proteção de rotas no edge
- [ ] **MED-04** — Adicionar rate limiting para uploads
- [ ] Exportar e versionar todas as migrations do Supabase
- [ ] Remover imports mortos de Prisma
- [ ] Decidir: manter NextAuth ou remover (recomendado: remover)
- [ ] Adicionar testes de integração para auth, multi-tenant e RBAC

---

*Relatório gerado via análise estática do código-fonte. Não substitui pentest em ambiente de produção.*
