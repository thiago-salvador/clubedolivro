import { API_CONFIG } from '../config';
import { authService } from '../../services/auth.service';

export interface AuthRequest {
  headers?: {
    Authorization?: string;
  };
  user?: any;
}

export const authMiddleware = async (req: AuthRequest): Promise<void> => {
  const authHeader = req.headers?.Authorization;
  
  if (!authHeader) {
    throw new Error('Token não fornecido');
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Token inválido');
  }
  
  try {
    // Em produção, isso seria uma validação real de JWT
    // Por enquanto, vamos simular validando o formato e buscando o usuário
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token mal formatado');
    }
    
    // Decodificar payload (simulado)
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar expiração
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error('Token expirado');
    }
    
    // Buscar usuário
    const user = payload.email ? authService.getUserByEmail(payload.email) : null;
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Adicionar usuário à requisição
    req.user = user;
    
  } catch (error: any) {
    throw new Error(error.message || 'Token inválido');
  }
};

// Middleware para verificar roles específicas
export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest): Promise<void> => {
    // Primeiro executar o authMiddleware
    await authMiddleware(req);
    
    if (!req.user) {
      throw new Error('Usuário não autenticado');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new Error('Permissão negada');
    }
  };
};

// Middleware para verificar se é admin
export const requireAdmin = requireRole(['admin', 'super_admin']);

// Middleware para verificar se é super admin
export const requireSuperAdmin = requireRole(['super_admin']);