import { API_CONFIG } from '../config';

// Simulação de JWT para desenvolvimento
// Em produção, usar uma biblioteca real como jsonwebtoken

interface JWTPayload {
  [key: string]: any;
  iat?: number;
  exp?: number;
}

// Gerar token JWT simulado
export function generateToken(payload: JWTPayload, expiresIn?: string): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseExpiration(expiresIn || API_CONFIG.security.jwtExpiresIn);
  
  const fullPayload = {
    ...payload,
    iat: now,
    exp
  };
  
  // Simular estrutura JWT: header.payload.signature
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(fullPayload));
  const signature = btoa(generateSignature(header + '.' + payloadStr));
  
  return `${header}.${payloadStr}.${signature}`;
}

// Gerar refresh token
export function generateRefreshToken(payload: JWTPayload): string {
  return generateToken(payload, API_CONFIG.security.refreshTokenExpiresIn);
}

// Verificar token JWT
export function verifyToken(token: string, isRefreshToken?: boolean): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const [header, payload, signature] = parts;
    
    // Verificar assinatura (simulado)
    const expectedSignature = btoa(generateSignature(header + '.' + payload));
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decodificar payload
    const decoded = JSON.parse(atob(payload)) as JWTPayload;
    
    // Verificar expiração
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return null;
    }
    
    return decoded;
    
  } catch (error) {
    return null;
  }
}

// Decodificar token sem verificar
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    return JSON.parse(atob(parts[1]));
    
  } catch (error) {
    return null;
  }
}

// Renovar token
export function refreshAccessToken(refreshToken: string): string | null {
  const decoded = verifyToken(refreshToken, true);
  if (!decoded) {
    return null;
  }
  
  // Gerar novo token com mesmo payload (exceto iat e exp)
  const { iat, exp, ...payload } = decoded;
  return generateToken(payload);
}

// Helpers
function parseExpiration(exp: string): number {
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 3600; // 1 hora por padrão
  }
  
  const [, value, unit] = match;
  const num = parseInt(value);
  
  switch (unit) {
    case 's': return num;
    case 'm': return num * 60;
    case 'h': return num * 3600;
    case 'd': return num * 86400;
    default: return 3600;
  }
}

function generateSignature(data: string): string {
  // Simulação de assinatura
  // Em produção, usar crypto.createHmac com secret real
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}