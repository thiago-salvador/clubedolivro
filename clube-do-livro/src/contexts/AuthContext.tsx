import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = storageService.getAccessToken();
        
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        // Validar token
        const result = await authService.validateAccessToken(accessToken);
        
        if (result.valid && result.user) {
          // Adicionar badges e outras informações do usuário
          const fullUser: User = {
            ...result.user,
            badges: [
              {
                id: '1',
                name: 'Leitora Assídua',
                icon: '🏆',
                description: 'Participou de 80%+ encontros',
                earnedDate: new Date('2023-12-01')
              }
            ],
            joinedDate: new Date('2024-01-01'),
            previousParticipations: []
          };
          
          setUser(fullUser);
          storageService.setUserData(fullUser);
        } else {
          // Token inválido, tentar renovar
          const refreshToken = storageService.getRefreshToken();
          
          if (refreshToken) {
            try {
              const tokens = await authService.refreshToken(refreshToken);
              storageService.setTokens(tokens.accessToken, tokens.refreshToken);
              
              // Tentar novamente com o novo token
              const retryResult = await authService.validateAccessToken(tokens.accessToken);
              
              if (retryResult.valid && retryResult.user) {
                const fullUser: User = {
                  ...retryResult.user,
                  badges: [],
                  joinedDate: new Date(),
                  previousParticipations: []
                };
                
                setUser(fullUser);
                storageService.setUserData(fullUser);
              }
            } catch (error) {
              // Falha ao renovar, limpar tudo
              storageService.clearAll();
            }
          } else {
            storageService.clearAll();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        storageService.clearAll();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // Salvar tokens
      storageService.setTokens(response.accessToken, response.refreshToken);
      
      // Criar usuário completo
      const fullUser: User = {
        ...response.user,
        badges: [
          {
            id: '1',
            name: 'Boas-vindas',
            icon: '🎉',
            description: 'Primeira vez no clube',
            earnedDate: new Date()
          }
        ],
        joinedDate: new Date(),
        previousParticipations: []
      };
      
      setUser(fullUser);
      storageService.setUserData(fullUser);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      
      // Salvar tokens
      storageService.setTokens(response.accessToken, response.refreshToken);
      
      // Criar usuário completo
      const fullUser: User = {
        ...response.user,
        badges: [
          {
            id: '1',
            name: 'Nova Integrante',
            icon: '🌟',
            description: 'Bem-vinda ao clube!',
            earnedDate: new Date()
          }
        ],
        joinedDate: new Date(),
        previousParticipations: []
      };
      
      setUser(fullUser);
      storageService.setUserData(fullUser);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta');
    }
  };

  const logout = async () => {
    try {
      const accessToken = storageService.getAccessToken();
      const refreshToken = storageService.getRefreshToken();
      
      if (accessToken && refreshToken) {
        await authService.logout(accessToken, refreshToken);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar estado local independente do resultado
      setUser(null);
      storageService.clearAll();
    }
  };

  const requestPasswordReset = async (email: string) => {
    return await authService.requestPasswordReset({ email });
  };

  const resetPassword = async (token: string, password: string) => {
    await authService.resetPassword({ token, password });
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    requestPasswordReset,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};