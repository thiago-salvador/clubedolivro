import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // Tema atualmente aplicado (resolve 'auto')
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app_theme');
    return (savedTheme as Theme) || 'light';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Detectar preferência do sistema
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Aplicar tema ao documento
  const applyTheme = useCallback((themeToApply: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (themeToApply === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setActualTheme(themeToApply);
  }, []);

  // Resolver tema baseado na configuração
  const resolveTheme = useCallback((themeConfig: Theme): 'light' | 'dark' => {
    if (themeConfig === 'auto') {
      return getSystemTheme();
    }
    return themeConfig;
  }, [getSystemTheme]);

  // Efeito para aplicar tema quando mudar
  useEffect(() => {
    const resolvedTheme = resolveTheme(theme);
    applyTheme(resolvedTheme);
    
    // Salvar no localStorage
    localStorage.setItem('app_theme', theme);
  }, [theme, resolveTheme, applyTheme]);

  // Listener para mudanças na preferência do sistema (modo auto)
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const systemTheme = e.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme, applyTheme]);

  // Aplicar tema inicial
  useEffect(() => {
    const resolvedTheme = resolveTheme(theme);
    applyTheme(resolvedTheme);
  }, [resolveTheme, theme, applyTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    actualTheme,
    setTheme: handleSetTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};