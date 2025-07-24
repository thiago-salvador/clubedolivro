// API Mock Server para desenvolvimento
// Em produção, isso seria substituído por um servidor Express/Fastify real

import { API_CONFIG, ApiResponse, createApiResponse, createApiError } from './config';
import { authController } from './controllers/auth.controller';
import { studentController } from './controllers/student.controller';
import { courseController } from './controllers/course.controller';
import { tagController } from './controllers/tag.controller';
import { notificationController } from './controllers/notification.controller';
import { authMiddleware } from './middleware/auth.middleware';
import { validateRequest } from './middleware/validation.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

// Tipo para definir rotas da API
interface ApiRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: (params?: any, body?: any, headers?: any) => Promise<ApiResponse>;
  middleware?: Array<(req: any) => Promise<void>>;
  public?: boolean;
}

// Definição de todas as rotas da API
const routes: ApiRoute[] = [
  // Auth routes (públicas)
  {
    method: 'POST',
    path: '/auth/login',
    handler: authController.login,
    public: true
  },
  {
    method: 'POST',
    path: '/auth/register',
    handler: authController.register,
    public: true
  },
  {
    method: 'POST',
    path: '/auth/refresh',
    handler: authController.refreshToken,
    public: true
  },
  {
    method: 'POST',
    path: '/auth/forgot-password',
    handler: authController.forgotPassword,
    public: true
  },
  {
    method: 'POST',
    path: '/auth/reset-password',
    handler: authController.resetPassword,
    public: true
  },
  
  // Student routes (protegidas)
  {
    method: 'GET',
    path: '/students',
    handler: studentController.getAll,
    middleware: [authMiddleware]
  },
  {
    method: 'GET',
    path: '/students/:id',
    handler: studentController.getById,
    middleware: [authMiddleware]
  },
  {
    method: 'POST',
    path: '/students',
    handler: studentController.create,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'PUT',
    path: '/students/:id',
    handler: studentController.update,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'DELETE',
    path: '/students/:id',
    handler: studentController.delete,
    middleware: [authMiddleware]
  },
  {
    method: 'POST',
    path: '/students/:id/tags',
    handler: studentController.addTag,
    middleware: [authMiddleware]
  },
  {
    method: 'DELETE',
    path: '/students/:id/tags/:tagId',
    handler: studentController.removeTag,
    middleware: [authMiddleware]
  },
  
  // Course routes (protegidas)
  {
    method: 'GET',
    path: '/courses',
    handler: courseController.getAll,
    middleware: [authMiddleware]
  },
  {
    method: 'GET',
    path: '/courses/:id',
    handler: courseController.getById,
    middleware: [authMiddleware]
  },
  {
    method: 'POST',
    path: '/courses',
    handler: courseController.create,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'PUT',
    path: '/courses/:id',
    handler: courseController.update,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'DELETE',
    path: '/courses/:id',
    handler: courseController.delete,
    middleware: [authMiddleware]
  },
  {
    method: 'POST',
    path: '/courses/:id/clone',
    handler: courseController.clone,
    middleware: [authMiddleware]
  },
  
  // Tag routes (protegidas)
  {
    method: 'GET',
    path: '/tags',
    handler: tagController.getAll,
    middleware: [authMiddleware]
  },
  {
    method: 'GET',
    path: '/tags/:id',
    handler: tagController.getById,
    middleware: [authMiddleware]
  },
  {
    method: 'POST',
    path: '/tags',
    handler: tagController.create,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'PUT',
    path: '/tags/:id',
    handler: tagController.update,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'DELETE',
    path: '/tags/:id',
    handler: tagController.delete,
    middleware: [authMiddleware]
  },
  
  // Notification routes (protegidas)
  {
    method: 'GET',
    path: '/notifications',
    handler: notificationController.getAll,
    middleware: [authMiddleware]
  },
  {
    method: 'POST',
    path: '/notifications/send',
    handler: notificationController.send,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'POST',
    path: '/notifications/schedule',
    handler: notificationController.schedule,
    middleware: [authMiddleware, validateRequest]
  },
  {
    method: 'DELETE',
    path: '/notifications/:id',
    handler: notificationController.cancel,
    middleware: [authMiddleware]
  },
  
  // Webhook routes (públicas mas com validação)
  {
    method: 'POST',
    path: '/webhooks/hotmart',
    handler: async (params, body, headers) => {
      // Simulação de webhook do Hotmart
      console.log('Webhook Hotmart recebido:', body);
      return createApiResponse({ received: true }, 'Webhook processado');
    },
    public: true
  }
];

// Classe para simular uma API no frontend
class MockApiServer {
  private routes: Map<string, ApiRoute> = new Map();
  private requestCount: Map<string, number> = new Map();
  
  constructor() {
    // Registrar todas as rotas
    routes.forEach(route => {
      const key = `${route.method}:${API_CONFIG.prefix}${route.path}`;
      this.routes.set(key, route);
    });
  }
  
  // Simular uma requisição HTTP
  async request(
    method: string,
    path: string,
    options?: {
      params?: any;
      body?: any;
      headers?: any;
    }
  ): Promise<ApiResponse> {
    const fullPath = `${API_CONFIG.prefix}${path}`;
    const routeKey = `${method}:${fullPath}`;
    
    // Verificar rate limiting
    const clientIp = 'mock-client-ip';
    const requestKey = `${clientIp}:${Date.now() / API_CONFIG.rateLimit.windowMs | 0}`;
    const requestCount = this.requestCount.get(requestKey) || 0;
    
    if (requestCount >= API_CONFIG.rateLimit.max) {
      return createApiError(
        'RATE_LIMIT_EXCEEDED',
        API_CONFIG.rateLimit.message,
        429
      );
    }
    
    this.requestCount.set(requestKey, requestCount + 1);
    
    // Encontrar rota correspondente
    let route: ApiRoute | undefined;
    let params: any = {};
    
    // Busca exata primeiro
    route = this.routes.get(routeKey);
    
    // Se não encontrar, buscar rotas com parâmetros
    if (!route) {
      const entries = Array.from(this.routes.entries());
      for (const [key, r] of entries) {
        if (key.startsWith(`${method}:`)) {
          const routePath = key.substring(method.length + 1);
          const match = this.matchRoute(fullPath, routePath);
          if (match) {
            route = r;
            params = match.params;
            break;
          }
        }
      }
    }
    
    if (!route) {
      return createApiError('NOT_FOUND', 'Rota não encontrada', 404);
    }
    
    try {
      // Verificar autenticação se não for rota pública
      if (!route.public && options?.headers?.Authorization) {
        const token = options.headers.Authorization.replace('Bearer ', '');
        // Validar token (simulado)
        if (!this.validateToken(token)) {
          return createApiError('UNAUTHORIZED', 'Token inválido', 401);
        }
      } else if (!route.public) {
        return createApiError('UNAUTHORIZED', 'Autenticação necessária', 401);
      }
      
      // Executar middlewares
      if (route.middleware) {
        for (const middleware of route.middleware) {
          try {
            await middleware({ ...options, params });
          } catch (error: any) {
            return createApiError(
              'MIDDLEWARE_ERROR',
              error.message || 'Erro no middleware',
              400
            );
          }
        }
      }
      
      // Executar handler
      const result = await route.handler(params, options?.body, options?.headers);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      return result;
      
    } catch (error: any) {
      console.error('Erro na API:', error);
      return createApiError(
        'INTERNAL_ERROR',
        error.message || 'Erro interno do servidor',
        500
      );
    }
  }
  
  // Função auxiliar para fazer match de rotas com parâmetros
  private matchRoute(actualPath: string, routePath: string): { params: any } | null {
    const actualParts = actualPath.split('/');
    const routeParts = routePath.split('/');
    
    if (actualParts.length !== routeParts.length) {
      return null;
    }
    
    const params: any = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].substring(1);
        params[paramName] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }
    
    return { params };
  }
  
  // Validar token JWT (simulado)
  private validateToken(token: string): boolean {
    // Em produção, isso seria uma validação real de JWT
    // Por enquanto, apenas verificar se o token existe e tem formato válido
    return !!(token && token.length > 20 && token.includes('.'));
  }
  
  // Métodos de conveniência
  get(path: string, options?: any) {
    return this.request('GET', path, options);
  }
  
  post(path: string, body?: any, options?: any) {
    return this.request('POST', path, { ...options, body });
  }
  
  put(path: string, body?: any, options?: any) {
    return this.request('PUT', path, { ...options, body });
  }
  
  delete(path: string, options?: any) {
    return this.request('DELETE', path, options);
  }
  
  patch(path: string, body?: any, options?: any) {
    return this.request('PATCH', path, { ...options, body });
  }
}

// Exportar instância única da API
export const api = new MockApiServer();

// Exportar tipos e configurações
export * from './config';
export type { ApiRoute };