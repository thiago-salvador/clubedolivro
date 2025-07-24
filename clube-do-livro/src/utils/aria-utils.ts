/**
 * Utilitários para implementar aria-labels e melhorar acessibilidade
 * Seguindo as diretrizes WCAG 2.1 e boas práticas de acessibilidade
 */

// Tipos de aria-labels comuns
export const ariaLabels = {
  // Navegação
  navigation: {
    mainMenu: 'Menu principal',
    userMenu: 'Menu do usuário',
    breadcrumb: 'Navegação estrutural',
    pagination: 'Paginação',
    skipToContent: 'Pular para o conteúdo principal',
    backToTop: 'Voltar ao topo',
  },
  
  // Botões de ação
  buttons: {
    close: 'Fechar',
    open: 'Abrir',
    submit: 'Enviar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    save: 'Salvar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    more: 'Mais opções',
    share: 'Compartilhar',
    favorite: 'Favoritar',
    unfavorite: 'Remover dos favoritos',
    like: 'Curtir',
    unlike: 'Descurtir',
    play: 'Reproduzir',
    pause: 'Pausar',
    next: 'Próximo',
    previous: 'Anterior',
    expand: 'Expandir',
    collapse: 'Recolher',
    menu: 'Abrir menu',
    settings: 'Configurações',
    profile: 'Perfil',
    logout: 'Sair',
    login: 'Entrar',
  },
  
  // Formulários
  forms: {
    required: 'Campo obrigatório',
    optional: 'Campo opcional',
    error: 'Erro no campo',
    success: 'Campo válido',
    passwordToggle: 'Mostrar/ocultar senha',
    clearField: 'Limpar campo',
    selectFile: 'Selecionar arquivo',
    removeFile: 'Remover arquivo',
  },
  
  // Conteúdo
  content: {
    loading: 'Carregando...',
    noResults: 'Nenhum resultado encontrado',
    error: 'Erro ao carregar conteúdo',
    newContent: 'Novo conteúdo disponível',
    updated: 'Conteúdo atualizado',
    external: 'Link externo (abre em nova aba)',
    download: 'Download',
    video: 'Vídeo',
    audio: 'Áudio',
    image: 'Imagem',
    document: 'Documento',
  },
  
  // Estados
  states: {
    expanded: 'Expandido',
    collapsed: 'Recolhido',
    selected: 'Selecionado',
    notSelected: 'Não selecionado',
    checked: 'Marcado',
    unchecked: 'Desmarcado',
    active: 'Ativo',
    inactive: 'Inativo',
    muted: 'Silenciado',
    unmuted: 'Com som',
  },
};

// Função para gerar aria-label dinâmico
export function getAriaLabel(
  type: keyof typeof ariaLabels,
  key: string,
  context?: string
): string {
  const label = ariaLabels[type]?.[key as keyof typeof ariaLabels[typeof type]];
  
  if (!label) {
    console.warn(`Aria label não encontrado: ${type}.${key}`);
    return key;
  }
  
  return context ? `${label} - ${context}` : label;
}

// Função para gerar aria-label para contadores
export function getCountAriaLabel(count: number, singular: string, plural: string): string {
  if (count === 0) return `Nenhum ${singular}`;
  if (count === 1) return `1 ${singular}`;
  return `${count} ${plural}`;
}

// Função para gerar aria-label para progresso
export function getProgressAriaLabel(current: number, total: number, label: string): string {
  const percentage = Math.round((current / total) * 100);
  return `${label}: ${current} de ${total} (${percentage}%)`;
}

// Função para gerar aria-label para tempo
export function getTimeAriaLabel(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Componente helper para aria-live regions
export const ariaLiveRegions = {
  polite: 'aria-live="polite" aria-atomic="true"',
  assertive: 'aria-live="assertive" aria-atomic="true"',
  status: 'role="status" aria-live="polite"',
  alert: 'role="alert" aria-live="assertive"',
};

// Atributos aria comuns para diferentes tipos de elementos
export const ariaAttributes = {
  // Modais
  modal: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title',
    'aria-describedby': 'modal-description',
  },
  
  // Menus
  menu: {
    role: 'menu',
    'aria-orientation': 'vertical',
  },
  
  menuItem: {
    role: 'menuitem',
    tabIndex: -1,
  },
  
  // Tabs
  tabList: {
    role: 'tablist',
    'aria-orientation': 'horizontal',
  },
  
  tab: (isSelected: boolean) => ({
    role: 'tab',
    'aria-selected': isSelected,
    tabIndex: isSelected ? 0 : -1,
  }),
  
  tabPanel: (tabId: string) => ({
    role: 'tabpanel',
    'aria-labelledby': tabId,
    tabIndex: 0,
  }),
  
  // Navegação
  navigation: {
    role: 'navigation',
  },
  
  // Busca
  search: {
    role: 'search',
  },
  
  // Formulários
  form: {
    role: 'form',
  },
  
  // Listas
  list: {
    role: 'list',
  },
  
  listItem: {
    role: 'listitem',
  },
  
  // Regiões
  main: {
    role: 'main',
  },
  
  complementary: {
    role: 'complementary',
  },
  
  contentinfo: {
    role: 'contentinfo',
  },
};

// Função para adicionar aria-labels a ícones
export function getIconAriaLabel(iconName: string, action?: string): string {
  const iconLabels: Record<string, string> = {
    // Ícones de navegação
    home: 'Início',
    back: 'Voltar',
    forward: 'Avançar',
    up: 'Subir',
    down: 'Descer',
    left: 'Esquerda',
    right: 'Direita',
    
    // Ícones de ação
    add: 'Adicionar',
    remove: 'Remover',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    refresh: 'Atualizar',
    
    // Ícones de mídia
    play: 'Reproduzir',
    pause: 'Pausar',
    stop: 'Parar',
    volume: 'Volume',
    fullscreen: 'Tela cheia',
    
    // Ícones sociais
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    whatsapp: 'WhatsApp',
    
    // Outros ícones
    calendar: 'Calendário',
    clock: 'Relógio',
    location: 'Localização',
    phone: 'Telefone',
    email: 'E-mail',
    user: 'Usuário',
    settings: 'Configurações',
    help: 'Ajuda',
    info: 'Informações',
    warning: 'Aviso',
    error: 'Erro',
    success: 'Sucesso',
  };
  
  const label = iconLabels[iconName.toLowerCase()] || iconName;
  return action ? `${action} ${label}` : label;
}

// Hook personalizado para gerenciar focus trap
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  // Implementação seria adicionada aqui
  // Por enquanto, apenas um placeholder
  return {
    firstFocusableElement: null,
    lastFocusableElement: null,
  };
}

// Função para anunciar mudanças para leitores de tela
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}