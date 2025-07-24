/**
 * Utilitários para melhorar contraste de cores e acessibilidade
 * WCAG 2.1 Guidelines:
 * - Normal text: minimum 4.5:1
 * - Large text (18pt+ or 14pt+ bold): minimum 3:1
 * - Non-text elements: minimum 3:1
 */

// Cores do tema com contraste melhorado
export const accessibleColors = {
  // Cores principais - ajustadas para melhor contraste
  terracota: {
    light: '#f87171', // Para fundos claros
    DEFAULT: '#dc2626', // Contraste melhorado
    dark: '#991b1b', // Para fundos escuros
  },
  laranja: {
    light: '#fb923c',
    DEFAULT: '#ea580c', // Contraste melhorado
    dark: '#c2410c',
  },
  amarelo: {
    light: '#fbbf24',
    DEFAULT: '#d97706', // Contraste melhorado  
    dark: '#92400e',
  },
  marrom: {
    light: '#92400e',
    DEFAULT: '#78350f',
    dark: '#451a03',
  },
  
  // Cores de texto - garantindo contraste WCAG AA
  text: {
    primary: '#1f2937', // gray-800 - 12.63:1 em branco
    secondary: '#4b5563', // gray-600 - 7.04:1 em branco
    muted: '#6b7280', // gray-500 - 4.95:1 em branco
    onDark: '#f9fafb', // gray-50 - contraste alto em fundos escuros
  },
  
  // Cores de fundo
  background: {
    white: '#ffffff',
    light: '#fef3c7', // amarelo-100
    medium: '#fed7aa', // laranja-100
    dark: '#1f2937', // gray-800
  },
  
  // Estados
  states: {
    success: '#059669', // green-600 - bom contraste
    error: '#dc2626', // red-600 - bom contraste
    warning: '#d97706', // amber-600 - bom contraste
    info: '#2563eb', // blue-600 - bom contraste
  }
};

// Classes CSS para aplicar automaticamente
export const contrastClasses = {
  // Texto em fundos claros
  textOnLight: 'text-gray-800',
  textSecondaryOnLight: 'text-gray-600',
  textMutedOnLight: 'text-gray-500',
  
  // Texto em fundos escuros
  textOnDark: 'text-gray-50',
  textSecondaryOnDark: 'text-gray-200',
  textMutedOnDark: 'text-gray-300',
  
  // Links acessíveis
  linkOnLight: 'text-terracota hover:text-marrom-escuro underline',
  linkOnDark: 'text-yellow-300 hover:text-yellow-200 underline',
  
  // Botões com contraste garantido
  buttonPrimary: 'bg-terracota text-white hover:bg-marrom-escuro focus:ring-2 focus:ring-offset-2 focus:ring-terracota',
  buttonSecondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
  buttonOutline: 'border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-offset-2 focus:ring-gray-700',
  
  // Estados de foco visíveis
  focusRing: 'focus:ring-2 focus:ring-offset-2 focus:ring-terracota focus:outline-none',
  focusVisible: 'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracota',
};

// Função para calcular contraste entre duas cores
export function calculateContrast(color1: string, color2: string): number {
  // Converte hex para RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  // Calcula luminância relativa
  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);
  
  // Calcula ratio de contraste
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Converte hex para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calcula luminância relativa
function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Verifica se o contraste atende WCAG AA
export function meetsWCAGAA(contrast: number, isLargeText: boolean = false): boolean {
  return isLargeText ? contrast >= 3 : contrast >= 4.5;
}

// Verifica se o contraste atende WCAG AAA
export function meetsWCAGAAA(contrast: number, isLargeText: boolean = false): boolean {
  return isLargeText ? contrast >= 4.5 : contrast >= 7;
}

// Retorna a cor de texto apropriada para um fundo
export function getTextColorForBackground(backgroundColor: string): string {
  const whiteContrast = calculateContrast(backgroundColor, '#ffffff');
  const blackContrast = calculateContrast(backgroundColor, '#1f2937');
  
  return blackContrast > whiteContrast ? accessibleColors.text.primary : accessibleColors.text.onDark;
}

// Melhora automaticamente o contraste de uma cor
export function improveContrast(foreground: string, background: string, targetRatio: number = 4.5): string {
  const currentContrast = calculateContrast(foreground, background);
  
  if (currentContrast >= targetRatio) {
    return foreground;
  }
  
  // Se precisa melhorar, tenta escurecer ou clarear a cor
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return foreground;
  
  const bgLuminance = relativeLuminance(bg);
  const needsDarker = bgLuminance > 0.5;
  
  // Ajusta a cor incrementalmente até atingir o contraste desejado
  let adjustedColor = foreground;
  let step = needsDarker ? -5 : 5;
  
  for (let i = 0; i < 50; i++) {
    const adjusted = {
      r: Math.max(0, Math.min(255, fg.r + (step * i))),
      g: Math.max(0, Math.min(255, fg.g + (step * i))),
      b: Math.max(0, Math.min(255, fg.b + (step * i)))
    };
    
    adjustedColor = `#${componentToHex(adjusted.r)}${componentToHex(adjusted.g)}${componentToHex(adjusted.b)}`;
    
    if (calculateContrast(adjustedColor, background) >= targetRatio) {
      break;
    }
  }
  
  return adjustedColor;
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

// Classes utilitárias prontas para uso
export const a11yClasses = {
  // Skip links
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-gray-900 px-4 py-2 rounded-md z-50',
  
  // Screen reader only
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
  
  // Focus indicators
  focusWithin: 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-terracota',
  
  // High contrast mode
  highContrast: 'contrast-more:border-2 contrast-more:border-gray-900',
};