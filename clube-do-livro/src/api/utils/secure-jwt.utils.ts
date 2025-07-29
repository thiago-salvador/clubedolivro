import { API_CONFIG } from '../config';

// Secure JWT implementation using Web Crypto API
interface JWTPayload {
  [key: string]: any;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
  aud?: string;
  jti?: string;
}

// Convert string to ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert ArrayBuffer to base64url
function ab2b64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Convert base64url to ArrayBuffer
function b64url2ab(base64url: string): ArrayBuffer {
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(base64url.length + (4 - base64url.length % 4) % 4, '=');
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate cryptographic key from secret
async function getKey(secret: string, usage: 'sign' | 'verify'): Promise<CryptoKey> {
  const keyData = str2ab(secret);
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

// Generate secure random string
function generateSecureRandom(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return ab2b64url(array);
}

// Generate JWT with proper HMAC-SHA256
export async function generateSecureToken(payload: JWTPayload, expiresIn?: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseExpiration(expiresIn || API_CONFIG.security.jwtExpiresIn);
  
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp,
    iss: API_CONFIG.appName || 'clube-do-livro',
    jti: generateSecureRandom() // Unique token ID
  };
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = ab2b64url(str2ab(JSON.stringify(header)));
  const encodedPayload = ab2b64url(str2ab(JSON.stringify(fullPayload)));
  const message = `${encodedHeader}.${encodedPayload}`;
  
  // Sign with HMAC-SHA256
  const key = await getKey(API_CONFIG.security.jwtSecret, 'sign');
  const signature = await crypto.subtle.sign('HMAC', key, str2ab(message));
  const encodedSignature = ab2b64url(signature);
  
  return `${message}.${encodedSignature}`;
}

// Generate secure refresh token
export async function generateSecureRefreshToken(payload: JWTPayload): Promise<string> {
  const refreshPayload = {
    ...payload,
    type: 'refresh',
    jti: generateSecureRandom(32) // Longer ID for refresh tokens
  };
  
  // Use different secret for refresh tokens
  const tempSecret = API_CONFIG.security.jwtSecret;
  API_CONFIG.security.jwtSecret = API_CONFIG.security.refreshTokenSecret;
  
  const token = await generateSecureToken(refreshPayload, API_CONFIG.security.refreshTokenExpiresIn);
  
  // Restore original secret
  API_CONFIG.security.jwtSecret = tempSecret;
  
  return token;
}

// Verify JWT with proper HMAC-SHA256
export async function verifySecureToken(token: string, isRefreshToken?: boolean): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    
    // Verify signature
    const secret = isRefreshToken 
      ? API_CONFIG.security.refreshTokenSecret 
      : API_CONFIG.security.jwtSecret;
    
    const key = await getKey(secret, 'verify');
    const signature = b64url2ab(encodedSignature);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      str2ab(message)
    );
    
    if (!isValid) {
      return null;
    }
    
    // Decode and validate payload
    const payloadJson = new TextDecoder().decode(b64url2ab(encodedPayload));
    const payload = JSON.parse(payloadJson) as JWTPayload;
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    
    // Validate issuer
    if (payload.iss && payload.iss !== (API_CONFIG.appName || 'clube-do-livro')) {
      return null;
    }
    
    return payload;
    
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Decode token without verification (for client-side use only)
export function decodeSecureToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payloadJson = new TextDecoder().decode(b64url2ab(parts[1]));
    return JSON.parse(payloadJson);
    
  } catch (error) {
    return null;
  }
}

// Export verifyToken alias for compatibility
export const verifyToken = verifySecureToken;

// Parse expiration time
function parseExpiration(exp: string): number {
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 3600; // 1 hour default
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

// Fallback for environments without Web Crypto API
export const jwtUtils = (() => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return {
      generateToken: generateSecureToken,
      generateRefreshToken: generateSecureRefreshToken,
      verifyToken: verifySecureToken,
      decodeToken: decodeSecureToken
    };
  } else {
    console.warn('Web Crypto API not available, falling back to legacy JWT implementation');
    // Import the old implementation as fallback
    return {
      generateToken: async (payload: JWTPayload, expiresIn?: string) => {
        const { generateToken } = await import('./jwt.utils');
        return generateToken(payload, expiresIn);
      },
      generateRefreshToken: async (payload: JWTPayload) => {
        const { generateRefreshToken } = await import('./jwt.utils');
        return generateRefreshToken(payload);
      },
      verifyToken: async (token: string, isRefreshToken?: boolean) => {
        const { verifyToken } = await import('./jwt.utils');
        return verifyToken(token, isRefreshToken);
      },
      decodeToken: (token: string) => {
        const { decodeToken } = require('./jwt.utils');
        return decodeToken(token);
      }
    };
  }
})();