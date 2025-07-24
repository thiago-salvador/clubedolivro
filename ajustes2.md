# Ajustes do Site - Lista de Tasks

## Página 1: Header e Seção Hero

### User Story 1.1: Criar uma primeira impressão imersiva e uma navegação intuitiva

#### Tasks do Header:
[✓] Substituir texto "INÍCIO" por logo do clube (arredondado) no canto esquerdo
   **Solução implementada:** Substituí o botão "INÍCIO" por um logo circular com as iniciais "CL" (Clube do Livro) em dourado, posicionado no canto esquerdo. O logo mantém a funcionalidade de scroll suave ao topo quando clicado.
   **Arquivo alterado:** src/components/layout/Navigation.tsx
   **Backup criado:** Navigation.backup-antes-ajustes2.tsx
[✓] Substituir texto "LOGIN" por ícone de perfil no canto direito
   **Solução implementada:** Substituí o texto "LOGIN" por um ícone de usuário (User icon do lucide-react) dentro de um botão circular, mantendo a funcionalidade de navegação para /login.
   **Arquivo alterado:** src/components/layout/Navigation.tsx
[✓] Tornar header fixo (position: sticky) no topo com fundo sólido escuro e leve transparência
   **Solução implementada:** O header já estava com position: fixed. Ajustei a transparência do fundo para bg-black/95 quando em scroll, mantendo o efeito de backdrop-blur-sm.
   **Arquivo alterado:** src/components/layout/Navigation.tsx

#### Tasks da Seção Hero:
[✓] Implementar smooth scroll no botão "QUERO PARTICIPAR" para seção de inscrição
   **Solução implementada:** Adicionei ID "inscricao" na seção EnrollSection e criei função handleScrollToEnroll no Hero que faz scroll suave até a seção quando o botão é clicado.
   **Arquivos alterados:** src/components/layout/Hero.tsx, src/components/layout/EnrollSection.tsx
   **Backup criado:** Hero.backup-antes-ajustes2.tsx
[] Substituir imagem de fundo por nova imagem original alinhada com a marca
   **Status:** Aguardando nova imagem para substituição
[✓] Adicionar animação de zoom lento contínuo (Efeito Ken Burns) na imagem de fundo
   **Solução implementada:** A animação Ken Burns já estava implementada no CSS (index.css) e aplicada na imagem com a classe animate-ken-burns. A animação faz zoom de 1x para 1.1x em 30 segundos.
   **Arquivo verificado:** src/components/layout/Hero.tsx (linha 22)
[✓] Adicionar animação sutil de "pulso" no botão "QUERO PARTICIPAR"
   **Solução implementada:** A animação pulse-glow já estava implementada no CSS e aplicada no botão. Cria um efeito de brilho pulsante sutil.
   **Arquivo verificado:** src/components/layout/Hero.tsx (linha 42)

### User Story 1.2: Construir autoridade com prova social de marcas

#### Tasks da Logo Strip:
[✓] Adicionar seção "logo strip" abaixo do botão "QUERO PARTICIPAR" no final da Hero
   **Solução implementada:** Adicionei uma seção com texto "MENCIONADO EM" e 5 placeholders de logos abaixo do botão principal.
   **Arquivo alterado:** src/components/layout/Hero.tsx
[✓] Adicionar placeholders para 4-5 logos de marcas
   **Solução implementada:** Criei 5 placeholders com divs estilizadas para representar logos de marcas.
   **Arquivo alterado:** src/components/layout/Hero.tsx
[✓] Aplicar cor monocromática clara nos logos para consistência visual
   **Solução implementada:** Apliquei filtro grayscale nos logos para torná-los monocromáticos.
   **Arquivo alterado:** src/components/layout/Hero.tsx
[✓] Implementar transição suave para cor original no hover de cada logo
   **Solução implementada:** No hover, removo o filtro grayscale e aumento a opacidade do fundo, criando transição suave.
   **Arquivo alterado:** src/components/layout/Hero.tsx
   **CORREÇÃO APLICADA:** Reposicionei a logo strip para o canto inferior direito com design mais delicado - 3 logos pequenos e redondos ao invés de 5 retangulares grandes

## Página 2: Seção "O que é o Clube do livro?"

### User Story 1.3: Garantir uma leitura de conteúdo confortável e envolvente

#### Tasks de Tipografia e Legibilidade:
[✓] Substituir a fonte do corpo de texto na coluna da direita por "Crimson Pro"
   **Solução implementada:** Importei a fonte Crimson Pro do Google Fonts e apliquei nos parágrafos da coluna direita.
   **Arquivo alterado:** src/components/layout/AboutSection.css
   **Backup criado:** AboutSection.backup-antes-ajustes2.css
[✓] Ajustar o espaçamento entre linhas (line-height) do parágrafo para 1.7
   **Solução implementada:** Alterei o line-height de 2 para 1.7 para melhorar a legibilidade.
   **Arquivo alterado:** src/components/layout/AboutSection.css
[✓] Aplicar textura de fundo sutil (padrão de papel ou ruído) ao fundo claro da seção
   **Solução implementada:** Adicionei uma textura SVG sutil de padrão geométrico com opacidade baixa (0.03) para criar profundidade tátil.
   **Arquivo alterado:** src/components/layout/AboutSection.css
   **REVERTIDO:** A pedido do usuário, removi a textura de fundo, mantendo apenas o fundo sólido #F5F5DC

## Página 3: Seção "O que te espera"

### User Story 1.4: Apresentar os benefícios de forma interativa e visualmente rica

#### Tasks de Redesign da Seção:
[✓] Redesenhar a seção como uma grade de cards inspirada na referência visual
   **Solução implementada:** Transformei a lista de benefícios em uma grade de cards com layout responsívo (1 coluna mobile, 2 tablet, 3 desktop).
   **Arquivo alterado:** src/components/layout/BenefitsSection.tsx
   **Backup criado:** BenefitsSection.backup-antes-ajustes2.tsx
[✓] Adicionar ícone personalizado para cada card de benefício
   **Solução implementada:** Cada card já possui um ícone personalizado (MoonIcon, VideoIcon, etc.) dentro de um círculo com fundo dourado.
   **Arquivo alterado:** src/components/layout/BenefitsSection.tsx
[✓] Tornar cada card clicável
   **Solução implementada:** Adicionei onClick handler em cada card com cursor pointer e efeitos hover (scale, shadow, border).
   **Arquivo alterado:** src/components/layout/BenefitsSection.tsx

#### Tasks de Interatividade:
[✓] Criar modal (pop-up) com animação suave para abrir ao clicar em cada card
   **Solução implementada:** Implementei modal com backdrop blur, animação de fade-in, botão de fechar e descrição completa do benefício.
   **Arquivo alterado:** src/components/layout/BenefitsSection.tsx
[✓] Adicionar conteúdo detalhado sobre cada benefício dentro dos modais
   **Solução implementada:** Cada benefício agora tem title, shortText e fullDescription. O modal exibe a descrição completa.
   **Arquivo alterado:** src/components/layout/BenefitsSection.tsx

#### Tasks de Efeitos Visuais:
[✓] Adicionar efeito de parallax leve na imagem de fundo da seção
   **Solução implementada:** O efeito parallax já estava implementado com backgroundAttachment: 'fixed'.
   **Arquivo verificado:** src/components/layout/BenefitsSection.tsx (linha 95)
[✓] Implementar smooth scroll no botão "QUERO PARTICIPAR" para área de vendas
   **Solução implementada:** Adicionei função handleScrollToEnroll que faz scroll suave para a seção de inscrição.
   **Arquivo alterado:** src/components/layout/BenefitsSection.tsx

## Página 4: Seção "Mais que um clube, UMA COMUNIDADE!"

### User Story 1.5: Demonstrar o valor da comunidade com um preview da plataforma

#### Tasks de Layout:
[✓] Implementar layout de duas colunas com fundo claro
   **Solução implementada:** O layout de duas colunas já estava implementado com grid e fundo #F5F5DC.
   **Arquivo verificado:** src/components/layout/CommunitySection.tsx
[✓] Posicionar mockup da área logada na coluna direita
   **Solução implementada:** O mockup já estava posicionado na coluna direita com imagem alunaAreaPreview.
   **Arquivo verificado:** src/components/layout/CommunitySection.tsx
[✓] Fazer mockup sobrepor levemente a coluna de texto da esquerda
   **Solução implementada:** Adicionei margem negativa lg:-ml-12 para criar sobreposição no desktop.
   **Arquivo alterado:** src/components/layout/CommunitySection.tsx

#### Tasks de Interatividade:
[✓] Adicionar ícone de "Play" (▶️) sobre o mockup
   **Solução implementada:** Adicionei overlay com botão Play centralizado usando lucide-react.
   **Arquivo alterado:** src/components/layout/CommunitySection.tsx
[✓] Adicionar texto "Veja a comunidade por dentro" junto ao ícone de Play
   **Solução implementada:** Texto adicionado abaixo do ícone de play com fonte sans-serif.
   **Arquivo alterado:** src/components/layout/CommunitySection.tsx
[✓] Criar modal com vídeo de demonstração que abre ao clicar no ícone
   **Solução implementada:** Implementei modal com fundo escuro, botão fechar e placeholder para vídeo.
   **Arquivo alterado:** src/components/layout/CommunitySection.tsx
   **Backup criado:** CommunitySection.backup-antes-ajustes2.tsx
[✓] Implementar smooth scroll no botão "QUERO FAZER PARTE" para seção de inscrição
   **Solução implementada:** Adicionei função handleScrollToEnroll que faz scroll suave para #inscricao.
   **Arquivo alterado:** src/components/layout/CommunitySection.tsx

## Página 5: Seção "Sobre a Manu"

### User Story 1.6: Gerar conexão e autoridade através da história da especialista

#### Tasks de Layout e Visual:
[✓] Aplicar tema de fundo escuro na seção
   **Solução implementada:** O tema escuro já estava aplicado com backgroundColor: '#2C2C2C'.
   **Arquivo verificado:** src/components/layout/AboutManuSection.tsx
[✓] Remover foto da Manu e adicionar placeholder gráfico sutil para ilustração futura
   **Solução implementada:** Substituí a imagem por um placeholder com ícone e texto "Ilustração em breve".
   **Arquivo alterado:** src/components/layout/AboutManuSection.tsx
   **Backup criado:** AboutManuSection.backup-antes-ajustes2.tsx

#### Tasks de Conteúdo:
[✓] Adicionar novo bloco de texto com título "Por que ler esse livro junto com outras mulheres?"
   **Solução implementada:** Adicionei o bloco com título e conteúdo em formato de citação.
   **Arquivo alterado:** src/components/layout/AboutManuSection.tsx
[✓] Estilizar novo bloco como citação (blockquote) para diferenciá-lo da biografia principal
   **Solução implementada:** Usei blockquote com borda dourada à esquerda, texto em itálico e assinatura.
   **Arquivo alterado:** src/components/layout/AboutManuSection.tsx
[✓] Aplicar estilo que confira tom mais pessoal ao blockquote
   **Solução implementada:** Texto em primeira pessoa com aspas, itálico e assinatura "- Manu Xavier".
   **Arquivo alterado:** src/components/layout/AboutManuSection.tsx

## Página 6: Seção "Inscreva-se no Clube"

### User Story 1.7: Proporcionar um processo de inscrição claro, simples e focado

#### Tasks de Redesign:
[✓] Redesenhar seção para apresentar uma única oferta de inscrição
   **Solução implementada:** Criei um card único centralizado com max-width de 2xl, removendo o grid de 3 colunas.
   **Arquivo alterado:** src/components/layout/EnrollSection.tsx
   **Backup criado:** EnrollSection.backup-antes-ajustes2-p6.tsx
[✓] Eliminar cards comparativos de planos
   **Solução implementada:** Removi os cards "Clube sem Livros" e "Lista de Benefícios", mantendo apenas a oferta única.
   **Arquivo alterado:** src/components/layout/EnrollSection.tsx

#### Tasks de Conteúdo:
[✓] Exibir lista de benefícios do plano único com todos os 9 itens especificados:
   **Solução implementada:** Organizei os 9 benefícios em 2 colunas dentro do card principal com checkmarks.
   **Arquivo alterado:** src/components/layout/EnrollSection.tsx

#### Tasks de Interatividade:
[✓] Estilizar botão de contato do WhatsApp com maior destaque
   **Solução implementada:** Botão verde com ícone WhatsApp SVG, sombra, hover effects e tamanho maior.
   **Arquivo alterado:** src/components/layout/EnrollSection.tsx
[✓] Adicionar ícone e cor da marca WhatsApp ao botão
   **Solução implementada:** Ícone SVG oficial do WhatsApp e cor verde característica (#22c55e).
   **Arquivo alterado:** src/components/layout/EnrollSection.tsx
[✓] Implementar área de checkout com formulário de pagamento
   **Solução implementada:** O formulário de checkout já estava implementado com validações e máscaras.
   **Arquivo verificado:** src/components/layout/EnrollSection.tsx
[✓] Adicionar efeito acordeão suave para revelar checkout ao clicar em "Garanta sua vaga"
   **Solução implementada:** Já implementado com transição suave, max-height e opacity. Seta gira 180° quando aberto.
   **Arquivo verificado:** src/components/layout/EnrollSection.tsx
[✓] Garantir que checkout apareça na mesma página sem redirecionamento
   **Solução implementada:** Checkout expande abaixo do card principal sem redirecionamento.
   **Arquivo verificado:** src/components/layout/EnrollSection.tsx

## Página 7: Seção de Depoimentos

### User Story 1.8: Construir confiança através de prova social autêntica e dinâmica

#### Tasks de Layout:
[✓] Implementar seção de depoimentos como carrossel horizontal (slider) interativo
   **Solução implementada:** O carrossel já estava implementado com auto-play, botões de navegação e indicadores.
   **Arquivo verificado:** src/components/layout/TestimonialsSection.tsx
   **Backup criado:** TestimonialsSection.backup-antes-ajustes2.tsx
[✓] Aplicar tema de fundo escuro na seção
   **Solução implementada:** Já estava aplicado com backgroundColor: '#2C2C2C'.
   **Arquivo verificado:** src/components/layout/TestimonialsSection.tsx
[✓] Aplicar textos e elementos de UI em cor clara para contraste
   **Solução implementada:** Textos em #F5F5DC para bom contraste com fundo escuro.
   **Arquivo verificado:** src/components/layout/TestimonialsSection.tsx

#### Tasks de Design dos Cards:
[✓] Criar mockup estilizado de "print" de depoimento para cada card
   **Solução implementada:** Cards simulam mensagens do WhatsApp com header, avatar, nome e conteúdo.
   **Arquivo alterado:** src/components/layout/TestimonialsSection.tsx
[✓] Simular aparência de mensagem ou post real nos cards
   **Solução implementada:** Design com bolha de mensagem, horário e reações.
   **Arquivo alterado:** src/components/layout/TestimonialsSection.tsx
[✓] Remover fotos e substituir por mockups de prints
   **Solução implementada:** Fotos substituídas por avatares com iniciais em círculos coloridos.
   **Arquivo alterado:** src/components/layout/TestimonialsSection.tsx

#### Tasks de Interatividade:
[✓] Adicionar microinteração de hover nos cards
   **Solução implementada:** Cards com scale no hover (1.03 e 1.02) e transições suaves.
   **Arquivo verificado:** src/components/layout/TestimonialsSection.tsx
[✓] Implementar indicador visual de interatividade no hover
   **Solução implementada:** Transform scale e mudança de opacidade nos botões.
   **Arquivo verificado:** src/components/layout/TestimonialsSection.tsx

## Página 8: Footer

### Sem alterações necessárias - Segue igual

## Página 9: Ajustes na Seção "Sobre a Manu"

### Tasks de Remoção e Substituição:
[✓] Remover o bloco "Quem É Manuela Xavier"
   **Solução implementada:** Comentei o import e uso do ManuPresentationSection no App.tsx.
   **Arquivos alterados:** src/App.tsx
   **Backup criado:** ManuPresentationSection.backup-antes-ajustes2.tsx
[✓] Trocar a imagem da Manuela pela nova imagem: '/Users/thiagosalvador/Documents/Manuela/CDL/20250227_174744880_iOS.jpg'
   **Solução implementada:** Copiei a nova imagem para assets e atualizei AboutManuSection para usá-la.
   **Arquivo alterado:** src/components/layout/AboutManuSection.tsx
   **Nova imagem:** src/assets/images/manuela-xavier-new.jpg

## Página 10: Seção "Dúvidas Frequentes"

### User Story 1.10: Sanar dúvidas finais de forma rápida e intuitiva

#### Tasks de Layout:
[✓] Centralizar bloco de conteúdo na seção
   **Solução implementada:** Mudei de grid 2 colunas para layout centralizado com max-w-3xl e título centralizado.
   **Arquivo alterado:** src/components/layout/FAQSection.tsx
   **Backup criado:** FAQSection.backup-antes-ajustes2.tsx
[✓] Manter texto interno alinhado à esquerda
   **Solução implementada:** O texto das perguntas e respostas permanece alinhado à esquerda com text-left.
   **Arquivo verificado:** src/components/layout/FAQSection.tsx

#### Tasks de Interatividade:
[✓] Implementar lista de perguntas como componente "acordeão" interativo
   **Solução implementada:** O acordeão já estava implementado com toggleItem e animações.
   **Arquivo verificado:** src/components/layout/FAQSection.tsx
[✓] Adicionar animação suave ao revelar resposta ao clicar em pergunta
   **Solução implementada:** Já implementado com transição de max-height e duration-500.
   **Arquivo verificado:** src/components/layout/FAQSection.tsx

#### Tasks de Padronização Visual:
[✓] Padronizar botão de contato do WhatsApp com mesmo estilo visual dos outros botões de suporte
   **Solução implementada:** Botão verde com ícone SVG do WhatsApp, igual aos outros botões WhatsApp do site.
   **Arquivo alterado:** src/components/layout/FAQSection.tsx