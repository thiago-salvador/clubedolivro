import { API_CONFIG } from '../config';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    firstRequest?: number;
  };
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Enhanced rate limit store with automatic cleanup
class RateLimitManager {
  private store: RateLimitStore = {};
  private cleanupInterval: any;

  constructor() {
    // Automatic cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - API_CONFIG.rateLimit.windowMs * 2;
    
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < cutoff) {
        delete this.store[key];
      }
    });
  }

  public getStore(): RateLimitStore {
    return this.store;
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Global rate limit manager
const rateLimitManager = new RateLimitManager();
const rateLimitStore = rateLimitManager.getStore();

export const rateLimiter = async (req: any): Promise<void> => {
  // Identificar cliente (em produção seria pelo IP real)
  const clientId = req.headers?.['X-Forwarded-For'] || 
                  req.headers?.['X-Real-IP'] || 
                  'default-client';
  
  const now = Date.now();
  const windowStart = Math.floor(now / API_CONFIG.rateLimit.windowMs) * API_CONFIG.rateLimit.windowMs;
  const key = `${clientId}:${windowStart}`;
  
  // Limpar entradas antigas
  cleanupOldEntries();
  
  // Verificar limite
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: windowStart + API_CONFIG.rateLimit.windowMs
    };
  } else {
    rateLimitStore[key].count++;
    
    if (rateLimitStore[key].count > API_CONFIG.rateLimit.max) {
      const retryAfter = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);
      throw new Error(`${API_CONFIG.rateLimit.message} Tente novamente em ${retryAfter} segundos.`);
    }
  }
};

// Limpar entradas antigas do store
function cleanupOldEntries() {
  const now = Date.now();
  const cutoff = now - API_CONFIG.rateLimit.windowMs * 2; // Manter 2 janelas
  
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < cutoff) {
      delete rateLimitStore[key];
    }
  }
}

// Rate limiter específico para endpoints
export function createRateLimiter(options: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: any) => string;
}) {
  const config = {
    windowMs: options.windowMs || API_CONFIG.rateLimit.windowMs,
    max: options.max || API_CONFIG.rateLimit.max,
    message: options.message || API_CONFIG.rateLimit.message,
    keyGenerator: options.keyGenerator || ((req: any) => {
      return req.headers?.['X-Forwarded-For'] || 
             req.headers?.['X-Real-IP'] || 
             'default-client';
    })
  };
  
  const store: RateLimitStore = {};
  
  return async (req: any): Promise<void> => {
    const clientId = config.keyGenerator(req);
    const now = Date.now();
    const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
    const key = `${clientId}:${windowStart}`;
    
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: windowStart + config.windowMs
      };
    } else {
      store[key].count++;
      
      if (store[key].count > config.max) {
        const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
        throw new Error(`${config.message} Tente novamente em ${retryAfter} segundos.`);
      }
    }
  };
}

// Rate limiters específicos para diferentes endpoints
export const strictRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // 10 requests
  message: 'Muitas tentativas. Por favor, aguarde antes de tentar novamente.'
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  keyGenerator: (req) => {
    // Para auth, usar email + IP
    const email = req.body?.email || 'unknown';
    const ip = req.headers?.['X-Forwarded-For'] || 'default';
    return `auth:${email}:${ip}`;
  }
});