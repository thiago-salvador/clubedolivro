// Security headers and middleware for enhanced protection

export interface SecurityRequest {
  headers?: Record<string, string>;
  protocol?: string;
  hostname?: string;
  url?: string;
}

export interface SecurityResponse {
  setHeader?: (name: string, value: string) => void;
  headers?: Record<string, string>;
}

// Apply security headers
export const securityHeaders = (req: SecurityRequest, res: SecurityResponse): void => {
  if (!res.setHeader && !res.headers) return;
  
  const setHeader = (name: string, value: string) => {
    if (res.setHeader) {
      res.setHeader(name, value);
    } else if (res.headers) {
      res.headers[name] = value;
    }
  };
  
  // Prevent XSS attacks
  setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  setHeader('X-Frame-Options', 'DENY');
  
  // Referrer policy
  setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net", // Allow for React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.clubedolivro.com wss://clubedolivro.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ];
  
  setHeader('Content-Security-Policy', cspDirectives.join('; '));
  
  // Permissions Policy (formerly Feature Policy)
  const permissionsPolicy = [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()'
  ];
  
  setHeader('Permissions-Policy', permissionsPolicy.join(', '));
  
  // HSTS - Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
};

// HTTPS enforcement middleware
export const enforceHTTPS = (req: SecurityRequest, res: SecurityResponse): void => {
  if (process.env.NODE_ENV !== 'production') return;
  
  const isSecure = req.protocol === 'https' || 
                   req.headers?.['x-forwarded-proto'] === 'https';
  
  if (!isSecure && process.env.REACT_APP_FORCE_HTTPS === 'true') {
    const httpsUrl = `https://${req.hostname}${req.url}`;
    
    if (res.setHeader) {
      res.setHeader('Location', httpsUrl);
      res.setHeader('Status', '301');
    }
  }
};

// CSRF token generation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// CSRF validation middleware
export const validateCSRF = (req: SecurityRequest & { body?: any }): void => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.headers?.['method'] || '')) {
    return; // CSRF not required for safe methods
  }
  
  const token = req.headers?.['x-csrf-token'] || req.body?.csrfToken;
  const sessionToken = req.headers?.['x-session-csrf'];
  
  if (!token || !sessionToken || token !== sessionToken) {
    throw new Error('Invalid CSRF token');
  }
};

// Combined security middleware
export const securityMiddleware = (req: SecurityRequest & { body?: any }, res: SecurityResponse): void => {
  // Apply all security measures
  securityHeaders(req, res);
  enforceHTTPS(req, res);
  
  // CSRF validation for state-changing requests
  if (process.env.NODE_ENV === 'production') {
    try {
      validateCSRF(req);
    } catch (error) {
      console.error('CSRF validation failed:', error);
      throw error;
    }
  }
};