// Simulação de um serviço de autenticação real
// Este arquivo pode ser facilmente substituído por chamadas de API reais

import { User, UserRole } from '../types';

// Helper function to convert string to UserRole
const stringToUserRole = (role: string): UserRole => {
  switch (role) {
    case 'super_admin':
      return UserRole.SUPER_ADMIN;
    case 'admin':
      return UserRole.ADMIN;
    case 'aluna':
      return UserRole.ALUNA;
    default:
      return UserRole.ALUNA;
  }
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  cpf: string;
  phone: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface ResetPasswordData {
  email: string;
}

interface NewPasswordData {
  token: string;
  password: string;
}

// In production, this would be replaced by a real database
// For development, we'll use an in-memory store with hashed passwords
const USERS_DB: any[] = [];

// Initialize with development users only in non-production environments
if (process.env.NODE_ENV === 'development') {
  // These are only for development - in production, users register or are imported from database
  console.warn('Running in development mode with mock users');
  
  // Add demo user for development
  USERS_DB.push({
    id: '1',
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    password: 'senha123', // In production this would be hashed
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Silva&background=E07A5F&color=fff',
    role: 'aluna'
  });
}

// Tokens armazenados (em produção, seria no servidor)
const TOKENS_DB: Record<string, { userId: string; expiresAt: number }> = {};
const REFRESH_TOKENS_DB: Record<string, { userId: string; expiresAt: number }> = {};
const RESET_TOKENS_DB: Record<string, { email: string; expiresAt: number }> = {};

// Gerar token JWT simulado
const generateToken = (userId: string, type: 'access' | 'refresh' | 'reset' = 'access'): string => {
  const token = `${type}_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresIn = type === 'access' ? 3600000 : // 1 hora
                    type === 'refresh' ? 604800000 : // 7 dias
                    1800000; // 30 minutos para reset
  
  if (type === 'access') {
    TOKENS_DB[token] = { userId, expiresAt: Date.now() + expiresIn };
  } else if (type === 'refresh') {
    REFRESH_TOKENS_DB[token] = { userId, expiresAt: Date.now() + expiresIn };
  }
  
  return token;
};

// Validar token
const validateToken = (token: string, type: 'access' | 'refresh' = 'access'): { valid: boolean; userId?: string } => {
  const db = type === 'access' ? TOKENS_DB : REFRESH_TOKENS_DB;
  const tokenData = db[token];
  
  if (!tokenData) {
    return { valid: false };
  }
  
  if (tokenData.expiresAt < Date.now()) {
    delete db[token];
    return { valid: false };
  }
  
  return { valid: true, userId: tokenData.userId };
};

// Delay simulado para parecer uma chamada de API real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000); // Simula latência de rede
    
    const user = USERS_DB.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }
    
    // Import crypto utils dynamically to avoid circular dependency
    const { comparePassword } = await import('../api/utils/crypto.utils');
    
    // In production, passwords should be hashed
    const isValidPassword = process.env.NODE_ENV === 'development' 
      ? user.password === credentials.password 
      : await comparePassword(credentials.password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos');
    }
    
    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1500);
    
    // Verificar se email já existe
    if (USERS_DB.find(u => u.email === data.email)) {
      throw new Error('Este email já está cadastrado');
    }
    
    // Import crypto utils dynamically
    const { hashPassword } = await import('../api/utils/crypto.utils');
    
    // Hash the password before storing
    const hashedPassword = process.env.NODE_ENV === 'development' 
      ? data.password 
      : await hashPassword(data.password);
    
    // Criar novo usuário
    const newUser = {
      id: String(Date.now()),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      cpf: data.cpf,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=E07A5F&color=fff`,
      role: 'aluna' // Por padrão, novos usuários são alunas
    };
    
    USERS_DB.push(newUser);
    
    const accessToken = generateToken(newUser.id, 'access');
    const refreshToken = generateToken(newUser.id, 'refresh');
    
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role
      },
      accessToken,
      refreshToken
    };
  },

  // Renovar token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    await delay(500);
    
    const validation = validateToken(refreshToken, 'refresh');
    
    if (!validation.valid || !validation.userId) {
      throw new Error('Refresh token inválido ou expirado');
    }
    
    // Invalidar o refresh token antigo
    delete REFRESH_TOKENS_DB[refreshToken];
    
    // Gerar novos tokens
    const newAccessToken = generateToken(validation.userId, 'access');
    const newRefreshToken = generateToken(validation.userId, 'refresh');
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  },

  // Logout
  async logout(accessToken: string, refreshToken: string): Promise<void> {
    await delay(300);
    
    // Remover tokens
    delete TOKENS_DB[accessToken];
    delete REFRESH_TOKENS_DB[refreshToken];
  },

  // Validar token de acesso
  async validateAccessToken(token: string): Promise<{ valid: boolean; user?: any }> {
    await delay(200);
    
    const validation = validateToken(token, 'access');
    
    if (!validation.valid || !validation.userId) {
      return { valid: false };
    }
    
    const user = USERS_DB.find(u => u.id === validation.userId);
    
    if (!user) {
      return { valid: false };
    }
    
    return {
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    };
  },

  // Solicitar reset de senha
  async requestPasswordReset(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    await delay(1000);
    
    const user = USERS_DB.find(u => u.email === data.email);
    
    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return {
        success: true,
        message: 'Se este email estiver cadastrado, você receberá as instruções de recuperação.'
      };
    }
    
    // Gerar token de reset
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    RESET_TOKENS_DB[resetToken] = {
      email: user.email,
      expiresAt: Date.now() + 1800000 // 30 minutos
    };
    
    // Importar dinamicamente para evitar dependência circular
    try {
      const { emailService } = await import('./email.service');
      await emailService.sendPasswordReset(user.email, user.name, resetToken);
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
    }
    
    return {
      success: true,
      message: 'Se este email estiver cadastrado, você receberá as instruções de recuperação.'
    };
  },

  // Resetar senha com token
  async resetPassword(data: NewPasswordData): Promise<{ success: boolean }> {
    await delay(1000);
    
    const tokenData = RESET_TOKENS_DB[data.token];
    
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      throw new Error('Token inválido ou expirado');
    }
    
    const user = USERS_DB.find(u => u.email === tokenData.email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Import crypto utils dynamically
    const { hashPassword } = await import('../api/utils/crypto.utils');
    
    // Hash the new password before storing
    const hashedPassword = process.env.NODE_ENV === 'development' 
      ? data.password 
      : await hashPassword(data.password);
    
    // Atualizar senha
    user.password = hashedPassword;
    
    // Invalidar token
    delete RESET_TOKENS_DB[data.token];
    
    return { success: true };
  },

  // Get user by email (for webhook integration)
  getUserByEmail(email: string): User | null {
    const dbUser = USERS_DB.find(u => u.email === email);
    if (!dbUser) return null;

    // Convert from DB format to User interface
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar,
      role: stringToUserRole(dbUser.role),
      badges: [],
      joinedDate: new Date('2024-01-01'), // Default date for existing users
      previousParticipations: []
    };
  }
};