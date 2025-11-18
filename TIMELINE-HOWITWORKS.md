# Documentação da Seção Timeline - How It Works

## Visão Geral
Seção de timeline vertical com animações sincronizadas no scroll, apresentando as 6 etapas da jornada de transformação da Digital Dog.

## Arquivo
`components/sections/HowItWorks.tsx`

---

## Estrutura Desktop

### Layout
- Grid de 3 colunas: `[números] | [timeline] | [conteúdo]`
- Espaçamento entre etapas: `space-y-24 lg:space-y-28`

### Coluna de Números (esquerda)
- Números grandes (01-06) alinhados à direita
- Classe: `text-4xl lg:text-5xl font-bold text-primary-blue/30 font-mono`
- Sem informação de timeframe (foi removida)

### Timeline Central (linha vertical)
- Linha fixa de fundo: `w-0.5 bg-primary-blue/20`
- Linha animada: preenchimento progressivo baseado em scroll
- Scroll tracking: `offset: ['start center', 'end center']`
- Progress mapping: `[0.1, 0.9] -> ['0%', '100%']`
- Bolinhas posicionadas com `pt-[52px]` para alinhar com títulos
- Animação das bolinhas:
  - `initial: { scale: 0.6, opacity: 0.2 }`
  - `whileInView: { scale: 1, opacity: 1 }`
  - Transição: spring animation (stiffness: 150, duration: 0.6s)
  - Efeito: aparecem apagadas e "acendem" com scale quando no viewport

### Coluna de Conteúdo (direita)
- Largura fixa: `500px`
- Estrutura: Título → Descrição
- Sem timeframe (removido)

---

## Estrutura Mobile

### Layout
- Linha vertical à esquerda absoluta (`left-0`)
- Conteúdo com padding left: `pl-8 md:pl-10`
- Espaçamento entre etapas: `space-y-16 md:space-y-20`

### Timeline Vertical
- Mesma lógica de linha de fundo + linha animada do desktop
- Linha sincronizada com scroll progress

### Bolinhas - POSICIONAMENTO CRÍTICO
```tsx
<div className="absolute -left-8 md:-left-10 top-[38px] md:top-[42px] z-10 overflow-visible" 
     style={{ width: '32px', height: '24px', marginLeft: '-12px' }}>
  <motion.div
    className="w-6 h-6 rounded-full bg-primary-blue absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    // ... animações
  />
</div>
```

**Explicação do posicionamento:**
- Container: `-left-8 md:-left-10` compensa o padding do conteúdo
- `marginLeft: '-12px'` centraliza na linha vertical de 0.5px
- Bolinha interna: `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` centraliza no container
- `overflow-visible` essencial para não cortar o glow/blur

### Animação das Bolinhas Mobile
```tsx
initial={{ opacity: 0.15 }}
whileInView={{ opacity: 1 }}
viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
transition={{ duration: 0.5, ease: "easeOut" }}
```

**Detalhes importantes:**
- Apenas animação de opacity (sem scale, diferente do desktop)
- `margin: "-30% 0px -30% 0px"` atrasa ativação para meio da tela
- Bolinha sempre renderizada (opacity 0.15) e "acende" para 1
- Glow aplicado via inline style (drop-shadow)

### Conteúdo
- Número da etapa (grande, cinza claro)
- Título (primary-blue, bold)
- Descrição
- Animação independente do conteúdo: `initial={{ opacity: 0, x: -30 }}`

---

## Scroll Tracking Configuration

```tsx
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start center', 'end center']
})

const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])
```

- Tracking começa/termina quando seção passa pelo centro do viewport
- Range [0.1, 0.9] suaviza início e fim da animação
- Linha acompanha o scroll de forma fluida

---

## Problemas Resolvidos Durante Desenvolvimento

### 1. Alinhamento das Bolinhas
- ❌ Problema: Bolinhas desalinhadas dos textos
- ✅ Solução: Usar `pt-[52px]` no desktop e `top-[38px]` no mobile

### 2. Centralização na Linha
- ❌ Problema: Bolinhas fora do centro da linha vertical
- ✅ Solução: Sistema de container wrapper + translate interno + marginLeft negativo

### 3. Animação das Bolinhas Mobile
- ❌ Problema: Animação conflitando com conteúdo, fade junto
- ✅ Solução: Separar motion.div da bolinha do motion.div do conteúdo

### 4. Timing de Ativação Mobile
- ❌ Problema: Bolinhas acendiam muito cedo ou tarde
- ✅ Solução: `viewport: { margin: "-30% 0px -30% 0px" }` para acender no meio da tela

### 5. Glow Cortado
- ❌ Problema: Drop-shadow ficando quadrado/cortado
- ✅ Solução: `overflow-visible` no container da bolinha

---

## Estrutura de Dados

```tsx
const stages = [
  {
    id: number,
    number: string, // '01', '02', etc
    title: string,
    timeframe: string, // NÃO EXIBIDO (removido da UI)
    description: string
  }
]
```

---

## CSS Classes Importantes

### Cores
- `bg-darker-blue` - background da seção
- `text-primary-blue` - títulos e linha
- `text-light-blue` - textos secundários
- `text-primary-blue/30` - números das etapas

### Effects
- `drop-shadow(0 0 8px rgba(0, 188, 212, 0.6))` - glow das bolinhas
- `blur-sm` - blur da linha de fundo

---

## Notas Técnicas

1. **Não mexer no posicionamento das bolinhas mobile** - O sistema de wrapper + translate + marginLeft é frágil mas funcional

2. **Desktop vs Mobile**: Desktop usa scale animation, mobile usa apenas opacity

3. **Viewport margins**: Ajustados especificamente para sincronizar com a linha de progresso

4. **Once: false**: Animações se repetem ao scrollar para cima/baixo

5. **Spring animation** (desktop): Cria efeito mais natural de "acender" a bolinha

---

## Como Modificar com Segurança

### Mudar quantidade de etapas
- Adicionar/remover items no array `stages`
- Animações se adaptam automaticamente

### Ajustar espaçamento
- Desktop: `space-y-24 lg:space-y-28`
- Mobile: `space-y-16 md:space-y-20`

### Alterar timing de ativação
- Mobile: ajustar `margin` no viewport
- Desktop: ajustar `pt-[52px]` nas bolinhas

### Mudar cores
- Linha: `bg-primary-blue`
- Bolinhas: `bg-primary-blue`
- Números: `text-primary-blue/30`

---

## Warnings

⚠️ **NÃO ALTERAR** sem testar em ambos desktop E mobile:
- Sistema de posicionamento das bolinhas mobile
- Valores de `marginLeft`, `translate-x`, `translate-y`
- Estrutura de wrapper das bolinhas

⚠️ **TESTAR SEMPRE**:
- Scroll completo da seção
- Ativação de todas as bolinhas
- Alinhamento visual da linha com as bolinhas
- Responsive breakpoints (mobile, tablet, desktop)
