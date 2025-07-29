// Utilitários para acessibilidade

/**
 * Converte cor hex para RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calcula luminosidade relativa (WCAG)
 */
const getRelativeLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Verifica se o contraste entre duas cores atende aos padrões WCAG
 */
export const checkColorContrast = (
  foreground: string, 
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): {
  ratio: number;
  passes: boolean;
  recommendation?: string;
} => {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) {
    return { ratio: 0, passes: false, recommendation: 'Invalid color format' };
  }
  
  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const requiredRatio = level === 'AA' ? 4.5 : 7;
  const passes = ratio >= requiredRatio;
  
  return {
    ratio: parseFloat(ratio.toFixed(2)),
    passes,
    recommendation: !passes ? `Increase contrast to at least ${requiredRatio}:1` : undefined
  };
};

/**
 * Adiciona suporte para navegação por teclado
 */
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
    onSpace?: () => void;
  }
): void => {
  const { key, shiftKey } = event;
  
  switch (key) {
    case 'Enter':
      if (handlers.onEnter) {
        event.preventDefault();
        handlers.onEnter();
      }
      break;
    case ' ':
      if (handlers.onSpace) {
        event.preventDefault();
        handlers.onSpace();
      }
      break;
    case 'Escape':
      if (handlers.onEscape) {
        event.preventDefault();
        handlers.onEscape();
      }
      break;
    case 'ArrowUp':
      if (handlers.onArrowUp) {
        event.preventDefault();
        handlers.onArrowUp();
      }
      break;
    case 'ArrowDown':
      if (handlers.onArrowDown) {
        event.preventDefault();
        handlers.onArrowDown();
      }
      break;
    case 'ArrowLeft':
      if (handlers.onArrowLeft) {
        event.preventDefault();
        handlers.onArrowLeft();
      }
      break;
    case 'ArrowRight':
      if (handlers.onArrowRight) {
        event.preventDefault();
        handlers.onArrowRight();
      }
      break;
    case 'Tab':
      if (handlers.onTab) {
        handlers.onTab();
      }
      break;
  }
};

/**
 * Anuncia mudanças para leitores de tela
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Gera ID único para elementos ARIA
 */
export const generateAriaId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Trap focus dentro de um elemento (para modais, etc)
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  firstFocusableElement?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Gerencia foco para elementos interativos
 */
export const manageFocus = {
  save: (): HTMLElement | null => {
    return document.activeElement as HTMLElement;
  },
  
  restore: (element: HTMLElement | null): void => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
};

/**
 * Adiciona descrições acessíveis para ícones
 */
export const getIconAriaLabel = (iconType: string): string => {
  const labels: Record<string, string> = {
    'close': 'Fechar',
    'menu': 'Menu',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'sort': 'Ordenar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'back': 'Voltar',
    'forward': 'Avançar',
    'refresh': 'Atualizar',
    'download': 'Baixar',
    'upload': 'Enviar',
    'share': 'Compartilhar',
    'favorite': 'Favoritar',
    'settings': 'Configurações',
    'help': 'Ajuda',
    'info': 'Informações',
    'warning': 'Aviso',
    'error': 'Erro',
    'success': 'Sucesso'
  };
  
  return labels[iconType] || iconType;
};

/**
 * Verifica se o usuário está usando leitor de tela
 */
export const isScreenReaderActive = (): boolean => {
  // Esta é uma heurística, não há forma 100% confiável
  return document.body.getAttribute('aria-hidden') === 'true' ||
         window.navigator.userAgent.includes('NVDA') ||
         window.navigator.userAgent.includes('JAWS');
};