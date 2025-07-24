# 📚 Documentação de Componentes - Clube do Livro

## 🎨 Componentes Criados

### 1. Navigation
**Arquivo**: `src/components/layout/Navigation.tsx`

**Descrição**: Header fixo responsivo com transições baseadas em scroll.

**Props**: Nenhuma

**Features**:
- Transição de transparente para fundo escuro ao fazer scroll
- Responsivo com breakpoints para mobile/tablet/desktop
- Botão CTA com destaque visual

**Uso**:
```tsx
<Navigation />
```

### 2. BenefitIcons
**Arquivo**: `src/components/layout/BenefitIcons.tsx`

**Descrição**: Conjunto de 7 ícones SVG customizados para a seção de benefícios.

**Ícones disponíveis**:
- `MoonIcon` - Mergulho profundo
- `VideoIcon` - Vídeo aulas
- `PenIcon` - Exercícios terapêuticos
- `MusicIcon` - Músicas
- `ChatIcon` - Encontros online
- `CommunityIcon` - Comunidade
- `GiftIcon` - Área de descontos

**Props**:
- `className?: string` - Classes CSS customizadas

**Uso**:
```tsx
<MoonIcon className="w-8 h-8 text-dourado" />
```

### 3. ScrollAnimation
**Arquivo**: `src/components/layout/ScrollAnimation.tsx`

**Descrição**: Wrapper para adicionar animações de entrada baseadas em scroll.

**Props**:
- `children: React.ReactNode` - Conteúdo a ser animado
- `animation?: 'fade-up' | 'slide-left' | 'slide-right'` - Tipo de animação
- `delay?: number` - Delay em ms antes da animação
- `className?: string` - Classes CSS adicionais

**Uso**:
```tsx
<ScrollAnimation animation="fade-up" delay={200}>
  <div>Conteúdo animado</div>
</ScrollAnimation>
```

## 🛠️ Utilitários

### performance-utils.ts
**Funções**:
- `debounce()` - Limita chamadas de função
- `throttle()` - Limita execução de função
- `prefersReducedMotion()` - Verifica preferência de movimento
- `optimizeAnimation()` - Otimiza performance de animações
- `enableGPUAcceleration()` - Ativa aceleração GPU

### accessibility-utils.ts
**Funções**:
- `checkColorContrast()` - Verifica contraste WCAG
- `handleKeyboardNavigation()` - Suporte para teclado
- `announceToScreenReader()` - Anúncios para leitores de tela
- `generateAriaId()` - Gera IDs únicos para ARIA

## 🎨 Classes CSS Customizadas

### Sistema de Espaçamento (8px grid)
- `.space-8` até `.space-96` - Padding baseado em múltiplos de 8px

### Animações
- `.animate-ken-burns` - Efeito zoom sutil (30s)
- `.animate-pulse-glow` - Brilho pulsante (10s)
- `.animate-fade-in-up` - Fade com movimento para cima
- `.animate-slide-in-left` - Slide da esquerda
- `.animate-slide-in-right` - Slide da direita

### Texturas
- `.texture-paper` - Textura de papel sutil no fundo

## 🔧 Modificações em Componentes Existentes

### Hero.tsx
- Adicionado efeito Ken Burns na imagem
- Animação pulse-glow no botão principal
- Padding ajustado para header fixo

### BenefitsSection.tsx
- Ícones SVG customizados
- Efeito parallax no background
- Performance otimizada com throttle

### TestimonialsSection.tsx
- Transformado em carrossel horizontal
- Auto-play configurável
- Responsivo (3 → 2 → 1 cards)

### EnrollSection.tsx
- Card principal destacado
- Animação suave do acordeão
- Sinais de confiança (logos de pagamento)

### CommunitySection.tsx
- Título com gradiente dourado
- Sombras realistas melhoradas
- Efeito de elevação no hover

## 📱 Responsividade

### Breakpoints (Tailwind)
- `sm`: 640px+
- `md`: 768px+  
- `lg`: 1024px+
- `xl`: 1280px+

### Adaptações Mobile
- Navigation: Texto reduzido, espaçamentos menores
- Testimonials: 1 card por vez
- Enrollment: Cards empilhados verticalmente

## ♿ Acessibilidade

### Features Implementadas
- Suporte para `prefers-reduced-motion`
- ARIA labels em seções importantes
- Navegação por teclado em componentes interativos
- Contraste adequado em textos
- Fallbacks para animações não suportadas

## 🚀 Performance

### Otimizações
- Throttle em eventos de scroll (60fps)
- Lazy loading preparado para imagens
- Will-change aplicado durante animações
- Event listeners com `passive: true`
- GPU acceleration em transforms