// Configuração da API
export const API_CONFIG = {
  version: 'v1',
  prefix: '/api/v1',
  
  // Configurações de segurança
  security: {
    jwtSecret: process.env.REACT_APP_JWT_SECRET || 'clube-do-livro-jwt-secret-2025',
    jwtExpiresIn: '7d',
    refreshTokenExpiresIn: '30d',
    bcryptRounds: 10
  },
  
  // Configurações de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requests por janela
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
  },
  
  // Configurações de CORS
  cors: {
    origin: process.env.REACT_APP_CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // Configurações de paginação
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  
  // Configurações de upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'audio/mpeg',
      'audio/mp3',
      'video/mp4'
    ]
  }
};

// Tipos para respostas padronizadas da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Helper para criar respostas padronizadas
export const createApiResponse = <T>(
  data: T,
  message?: string,
  metadata?: ApiResponse['metadata']
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  metadata
});

export const createApiError = (
  error: string,
  message: string,
  statusCode: number = 400,
  details?: any
): ApiError => ({
  success: false,
  error,
  message,
  statusCode,
  details
});