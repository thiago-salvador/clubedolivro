import { API_CONFIG } from '../config';
import { authService } from '../../services/auth.service';

export interface AuthRequest {
  headers?: {
    Authorization?: string;
  };
  user?: any;
}

export const authMiddleware = async (req: AuthRequest): Promise<void> => {
  try {
    // Validate Authorization header
    const authHeader = req.headers?.Authorization;
    
    if (!authHeader || typeof authHeader !== 'string') {
      throw new Error('Token não fornecido');
    }
    
    // Extract and validate Bearer token format
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!bearerMatch || !bearerMatch[1]) {
      throw new Error('Formato de token inválido. Use: Bearer <token>');
    }
    
    const token = bearerMatch[1];
    
    // Validate token structure
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      throw new Error('Token mal formatado');
    }
    
    try {
      // Use secure JWT verification
      const { verifyToken } = await import('../utils/secure-jwt.utils');
      const payload = await verifyToken(token);
      
      if (!payload) {
        throw new Error('Token inválido ou expirado');
      }
      
      // Sanitize payload to prevent injection
      const sanitizedEmail = payload.email ? String(payload.email).trim().toLowerCase() : null;
      
      if (!sanitizedEmail || !sanitizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Email inválido no token');
      }
      
      // Get user from service
      const user = authService.getUserByEmail(sanitizedEmail);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      // Add user to request with sanitized data
      req.user = {
        ...user,
        email: sanitizedEmail,
        // Remove sensitive data
        password: undefined
      };
      
    } catch (verifyError: any) {
      // Log error securely (without sensitive data)
      console.error('Auth verification failed:', {
        error: verifyError.message,
        timestamp: new Date().toISOString()
      });
      
      throw new Error('Falha na autenticação');
    }
    
  } catch (error: any) {
    // Sanitize error messages to prevent information leakage
    const sanitizedError = error.message
      .replace(/[\n\r]/g, '')
      .substring(0, 100);
    
    throw new Error(sanitizedError || 'Erro de autenticação');
  }
};

// Middleware para verificar roles específicas com validação adequada
export const requireRole = (roles: string[]) => {
  // Validate roles array
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new Error('Roles inválidas para middleware');
  }
  
  const validRoles = ['aluna', 'admin', 'super_admin'];
  const sanitizedRoles = roles.filter(role => 
    typeof role === 'string' && validRoles.includes(role)
  );
  
  if (sanitizedRoles.length === 0) {
    throw new Error('Nenhuma role válida especificada');
  }
  
  return async (req: AuthRequest): Promise<void> => {
    try {
      // Primeiro executar o authMiddleware
      await authMiddleware(req);
      
      if (!req.user || typeof req.user.role !== 'string') {
        throw new Error('Usuário não autenticado corretamente');
      }
      
      const userRole = String(req.user.role).toLowerCase().trim();
      
      if (!sanitizedRoles.includes(userRole)) {
        // Log unauthorized access attempt
        console.warn('Unauthorized access attempt:', {
          userId: req.user.id,
          userRole,
          requiredRoles: sanitizedRoles,
          timestamp: new Date().toISOString()
        });
        
        throw new Error('Permissão negada');
      }
    } catch (error: any) {
      // Don't reveal specific role requirements in error
      throw new Error('Acesso não autorizado');
    }
  };
};

// Middleware para verificar se é admin
export const requireAdmin = requireRole(['admin', 'super_admin']);

// Middleware para verificar se é super admin
export const requireSuperAdmin = requireRole(['super_admin']);