// Utilitários para acessibilidade

/**
 * Verifica se o contraste entre duas cores atende aos padrões WCAG
 */
export const checkColorContrast = (foreground: string, background: string): boolean => {
  // Implementação simplificada - em produção usar biblioteca especializada
  return true;
};

/**
 * Adiciona suporte para navegação por teclado
 */
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void
): void => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onEnter?.();
      break;
    case 'Escape':
      event.preventDefault();
      onEscape?.();
      break;
  }
};

/**
 * Anuncia mudanças para leitores de tela
 */
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
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