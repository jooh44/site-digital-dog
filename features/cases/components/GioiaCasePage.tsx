'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function CaseLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1 w-1 rounded-full" style={{ background: dark ? '#5E0001' : '#d1af66' }} />
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: dark ? 'rgba(41,35,31,0.45)' : 'rgba(255,255,255,0.22)' }}
      >
        {children}
      </span>
    </div>
  )
}

function PlaceholderFrame({
  title,
  note,
  tone = 'light',
  ratio = 'video',
}: {
  title: string
  note: string
  tone?: 'light' | 'dark'
  ratio?: 'video' | 'portrait'
}) {
  const isLight = tone === 'light'
  const ratioClass = ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/9]'

  return (
    <div
      className={`relative overflow-hidden border ${ratioClass}`}
      style={{
        borderColor: isLight ? 'rgba(94,0,1,0.12)' : 'rgba(255,255,255,0.12)',
        background: isLight
          ? 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(232,223,212,0.8))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      }}
    >
      <div
        className="absolute inset-6 border border-dashed"
        style={{ borderColor: isLight ? 'rgba(94,0,1,0.18)' : 'rgba(255,255,255,0.18)' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: isLight ? 'rgba(94,0,1,0.5)' : 'rgba(255,255,255,0.34)' }}
        >
          Placeholder
        </div>
        <div
          className="mt-4 text-[clamp(1.4rem,2.4vw,2.2rem)] font-heading font-extrabold tracking-[-0.04em]"
          style={{ color: isLight ? '#1f1a17' : 'rgba(255,255,255,0.92)' }}
        >
          {title}
        </div>
        <p
          className="mt-4 max-w-[34ch] text-sm leading-[1.8]"
          style={{ color: isLight ? 'rgba(41,35,31,0.58)' : 'rgba(255,255,255,0.5)' }}
        >
          {note}
        </p>
      </div>
    </div>
  )
}

function EditorialText({
  title,
  children,
  serifClassName,
}: {
  title: string
  children: React.ReactNode
  serifClassName: string
}) {
  return (
    <div className="max-w-[720px]">
      <h2
        className={`text-[clamp(2rem,3.6vw,3.8rem)] leading-[0.96] tracking-[-0.05em] text-[#1c1714] ${serifClassName}`}
      >
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-[1rem] leading-[1.95] text-[#4a433d]">{children}</div>
    </div>
  )
}

export function GioiaCasePage({ serifClassName }: { serifClassName: string }) {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('[data-case-intro]', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
      })

      gsap.utils.toArray<HTMLElement>('[data-case-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef} className="min-h-screen bg-[#0a0a0a] text-white">
      <section
        className="border-b border-white/[0.07] px-8 pb-20 pt-24 lg:px-14 lg:pb-24 lg:pt-10 xl:px-20"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(209,175,102,0.07), transparent 28%), radial-gradient(circle at 76% 10%, rgba(94,0,1,0.18), transparent 30%), #0a0a0a',
        }}
      >
        <div className="mx-auto max-w-[1560px]">
          <div className="hidden items-center justify-between border-b border-white/[0.07] pb-7 lg:flex">
            <Link href="/" className="text-sm font-medium text-white/62 transition-colors hover:text-white">
              Digital Dog
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/#portfolio" className="text-sm font-medium text-white/52 transition-colors hover:text-white">
                Voltar ao portfolio
              </Link>
              <Link
                href="/#diagnostico"
                className="inline-flex items-center gap-2 border border-[#00bcd4] px-4 py-2 text-sm font-medium text-[#00bcd4] transition-colors hover:bg-[#00bcd4] hover:text-[#0a0a0a]"
              >
                Solicitar diagnostico
              </Link>
            </div>
          </div>

          <div className="grid gap-12 pt-4 lg:grid-cols-[0.66fr_1.34fr] lg:items-end lg:pt-16">
            <div>
              <div data-case-intro>
                <CaseLabel>Portfolio / Template de Case</CaseLabel>
              </div>

              <h1
                data-case-intro
                className={`mt-8 max-w-[10ch] text-[clamp(3.6rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em] text-white/[0.95] ${serifClassName}`}
              >
                Gioia
              </h1>

              <p data-case-intro className="mt-6 max-w-[42ch] text-[1rem] leading-[1.9] text-white/58">
                Template editorial para um case mais Behance-like: narrativa limpa, muito respiro, imagens grandes em
                1920x1080 e placeholders claros para voce plugar os assets finais direto do Figma.
              </p>

              <div data-case-intro className="mt-10 flex flex-wrap gap-3">
                {['Imagem de abertura', 'Simbolo', 'Mockups', 'Sistema visual', 'Lancamento'].map((item) => (
                  <span
                    key={item}
                    className="border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/42"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div data-case-intro>
              <PlaceholderFrame
                title="Adicionar imagem de abertura"
                note="Frame hero principal em 1920x1080. Ideal para o melhor mockup ou composicao de impacto do case."
                tone="dark"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f2ece2] px-8 py-20 text-[#1c1714] lg:px-14 lg:py-28 xl:px-20">
        <div className="mx-auto max-w-[1560px] space-y-24">
          <div data-case-reveal className="space-y-10">
            <div className="max-w-[760px]">
              <CaseLabel dark>Desafio</CaseLabel>
              <h2
                className={`mt-6 text-[clamp(2rem,3.8vw,3.9rem)] leading-[0.96] tracking-[-0.05em] text-[#1c1714] ${serifClassName}`}
              >
                Escreva o problema com calma. Sem cards. Sem pressa.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-[1.95] text-[#4a433d]">
                <p>
                  Este bloco agora precisa absorver a abertura contextual do projeto. Em vez de espalhar a tese em
                  varios blocos, concentre o raciocinio em dois ou tres paragrafos fortes, explicando o momento da
                  marca, o que precisava mudar e qual tensao guiou a direcao criativa.
                </p>
                <p>
                  A imagem entra como prova logo abaixo, em largura grande. A estrutura precisa deixar o texto respirar
                  e a fotografia ou mockup sustentar a pagina com presença.
                </p>
              </div>
            </div>

            <PlaceholderFrame
              title="Adicionar imagem do desafio"
              note="Frame 1920x1080 para comparativo visual, composicao conceitual ou principal evidência do problema."
            />
          </div>

          <div data-case-reveal className="grid gap-14 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
            <EditorialText title="O simbolo" serifClassName={serifClassName}>
              <p>
                Esta secao existe apenas para explicar o simbolo. Aqui vale falar sobre construcao, sintese, geometria,
                assinatura e qualquer leitura que ajude a mostrar por que o monograma sustenta a personalidade da
                marca.
              </p>
              <p>
                O ideal e tratar esse trecho como uma leitura interpretativa do elemento, nao como um manual tecnico.
                Pode ser um texto mais curto, mas ele precisa deixar claro por que o simbolo importa dentro do sistema.
              </p>
            </EditorialText>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <PlaceholderFrame
                  title="Adicionar simbolo principal"
                  note="Versao isolada do simbolo ou monograma em destaque."
                  ratio="portrait"
                />
                <PlaceholderFrame
                  title="Adicionar construcao do simbolo"
                  note="Grid, estudo geometrico, reducoes ou variacoes do simbolo."
                  ratio="portrait"
                />
              </div>
              <PlaceholderFrame
                title="Adicionar aplicacao do simbolo"
                note="Frame 1920x1080 mostrando o simbolo em uso para sustentar a explicacao."
              />
            </div>
          </div>

          <div data-case-reveal className="grid gap-14 xl:grid-cols-[1.12fr_0.88fr] xl:items-start">
            <div className="space-y-6">
              <PlaceholderFrame
                title="Adicionar board de direcao"
                note="Frame 1920x1080 com paleta, tipografia, referencias ou composicao da linha criativa."
              />
              <PlaceholderFrame
                title="Adicionar board do sistema visual"
                note="Outro frame largo para detalhar cor, serif, grids, assinatura visual ou elementos secundários."
              />
            </div>

            <EditorialText title="Direcao criativa" serifClassName={serifClassName}>
              <p>
                Aqui voce explica o criterio da forma. Pode falar sobre sobriedade, paleta, tipografia, monograma,
                ritmo visual e por que a marca ganhou determinada leitura.
              </p>
              <p>
                O objetivo nao e ensinar branding. E mostrar que houve criterio. Mantem o texto em prosa, sem cara de
                checklist de IA, como se fosse uma descricao bem editada de Behance.
              </p>
            </EditorialText>
          </div>

          <div data-case-reveal className="space-y-10">
            <div className="max-w-[760px]">
              <CaseLabel dark>Aplicacoes</CaseLabel>
              <h2
                className={`mt-6 text-[clamp(2rem,3.8vw,3.9rem)] leading-[0.96] tracking-[-0.05em] text-[#1c1714] ${serifClassName}`}
              >
                Mockups grandes. Menos miniaturas. Mais presenca.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-[1.95] text-[#4a433d]">
                <p>
                  Esta secao foi pensada para receber assets grandes em 1920x1080, com leitura premium e sem poluicao.
                  Voce pode substituir estes placeholders por mockups exportados do Figma e manter o mesmo ritmo.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <PlaceholderFrame
                title="Adicionar mockup 01"
                note="Exemplo: fachada, papelaria, pasta ou principal aplicacao premium."
              />
              <PlaceholderFrame
                title="Adicionar mockup 02"
                note="Segundo asset largo para continuidade visual."
              />
              <PlaceholderFrame
                title="Adicionar mockup 03"
                note="Terceiro asset largo, mantendo coerencia na sequencia."
              />
            </div>
          </div>

          <div data-case-reveal className="grid gap-14 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
            <EditorialText title="Presenca digital" serifClassName={serifClassName}>
              <p>
                Aqui entra a ponte entre identidade e site. Em vez de um bloco cheio de elementos, pense em dois ou
                tres paragrafos explicando como a marca foi aplicada no ambiente digital e como isso sustenta a
                percepcao institucional.
              </p>
              <p>
                Idealmente, use um screenshot desktop e outro mobile em 1920x1080, ou um mockup compositado que mostre
                a marca em uso no site.
              </p>
            </EditorialText>

            <div className="space-y-6">
              <PlaceholderFrame
                title="Adicionar screenshot desktop"
                note="Capture do site em 1920x1080 com composicao limpa."
              />
              <PlaceholderFrame
                title="Adicionar screenshot mobile"
                note="Pode ser screenshot, mockup ou composicao do site responsivo."
              />
            </div>
          </div>

          <div data-case-reveal className="space-y-10">
            <div className="max-w-[760px]">
              <CaseLabel dark>Lancamento</CaseLabel>
              <h2
                className={`mt-6 text-[clamp(2rem,3.8vw,3.9rem)] leading-[0.96] tracking-[-0.05em] text-[#1c1714] ${serifClassName}`}
              >
                Espaco para social, capa, carrossel e pecas da nova fase.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-[1.95] text-[#4a433d]">
                <p>
                  Use este trecho para mostrar que o projeto nao terminou no logo. O ideal aqui e plugar pecas do
                  lancamento, capinha, avatar, carrossel ou qualquer material que comprove continuidade real.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <PlaceholderFrame
                title="Adicionar composicao do lancamento"
                note="Frame 1920x1080 com capas, avatar, carrossel ou toolkit."
              />
              <PlaceholderFrame
                title="Adicionar detalhe do lancamento"
                note="Outro frame largo com recorte de pecas ou prova de desdobramento."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] px-8 py-20 lg:px-14 lg:py-24 xl:px-20">
        <div className="mx-auto max-w-[1560px]">
          <div data-case-reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <CaseLabel>Fechamento</CaseLabel>
              <h2 className="mt-6 max-w-[12ch] text-[clamp(2.4rem,4.4vw,4.8rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.05em] text-white/[0.95]">
                Encerramento limpo e comercial.
              </h2>
              <p className="mt-5 max-w-[40ch] text-[1rem] leading-[1.9] text-white/58">
                Aqui fecha o raciocinio do case e volta para a proposta da Digital Dog. Sem excesso de cards, sem
                dashboard fake, sem grade pesada.
              </p>
            </div>

            <div className="space-y-8">
              <PlaceholderFrame
                title="Adicionar imagem final do case"
                note="Frame de fechamento em 1920x1080 para consolidar a ultima impressao da pagina."
                tone="dark"
              />

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#diagnostico"
                  className="inline-flex min-h-[46px] items-center gap-2.5 bg-[linear-gradient(135deg,#5E0001,#8b1617)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-[1px]"
                >
                  Quero estruturar minha marca
                </Link>
                <Link
                  href="/#portfolio"
                  className="inline-flex min-h-[46px] items-center gap-2.5 border border-white/[0.1] px-6 py-3 text-sm font-semibold text-white/72 transition-colors hover:border-white/[0.18] hover:text-white"
                >
                  Voltar ao portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
