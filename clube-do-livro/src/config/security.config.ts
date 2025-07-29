// Comprehensive security configuration for the application

export const SECURITY_CONFIG = {
  // Password Policy
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{};\':"|,.<>/?',
    preventCommonPasswords: true,
    preventUserInfo: true, // Prevent using email/name in password
    historySize: 5, // Remember last 5 passwords
    expirationDays: 90, // Password expires after 90 days
    minStrengthScore: 4 // Minimum password strength score (0-5)
  },

  // Session Configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    idleTimeout: 30 * 60 * 1000, // 30 minutes of inactivity
    absoluteTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days absolute
    regenerateAfter: 60 * 60 * 1000, // Regenerate session ID every hour
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  },

  // Token Configuration
  tokens: {
    accessToken: {
      expiresIn: '15m', // Short-lived access tokens
      algorithm: 'HS256',
      issuer: 'clube-do-livro',
      audience: 'clube-do-livro-api'
    },
    refreshToken: {
      expiresIn: '7d',
      algorithm: 'HS256',
      rotateOnUse: true // Issue new refresh token on each use
    },
    resetToken: {
      expiresIn: '30m',
      oneTimeUse: true
    },
    verificationToken: {
      expiresIn: '24h',
      oneTimeUse: true
    }
  },

  // Rate Limiting
  rateLimiting: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
      standardHeaders: true,
      legacyHeaders: false
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5, // 5 auth attempts per window
      skipSuccessfulRequests: false
    },
    api: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 60 // 60 API calls per minute
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3 // 3 password reset attempts per hour
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.REACT_APP_CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400 // 24 hours
  },

  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.clubedolivro.com', 'wss://clubedolivro.com'],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    },
    reportUri: process.env.REACT_APP_CSP_REPORT_URI
  },

  // Security Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Input Validation
  validation: {
    email: {
      maxLength: 254,
      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    username: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_-]+$/
    },
    name: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
    },
    phone: {
      pattern: /^\+?[1-9]\d{1,14}$/
    }
  },

  // File Upload
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
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.mp3', '.mp4'],
    scanForViruses: true,
    sanitizeFilenames: true
  },

  // Audit & Logging
  audit: {
    logAuthAttempts: true,
    logPasswordChanges: true,
    logPrivilegedActions: true,
    logDataAccess: true,
    retentionDays: 90,
    sanitizeSensitiveData: true
  },

  // Account Security
  account: {
    lockoutThreshold: 5, // Lock after 5 failed attempts
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: {
      enabled: false, // Can be enabled in future
      methods: ['totp', 'sms', 'email']
    }
  },

  // API Security
  api: {
    requireHttps: process.env.NODE_ENV === 'production',
    apiKeyHeader: 'X-API-Key',
    signatureHeader: 'X-Signature',
    timestampTolerance: 5 * 60 * 1000, // 5 minutes
    replayProtection: true
  }
};

// Helper functions
export const getSecurityHeaders = (): Record<string, string> => {
  return SECURITY_CONFIG.headers;
};

export const getCSPString = (): string => {
  const directives = SECURITY_CONFIG.csp.directives;
  return Object.entries(directives)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey} ${Array.isArray(value) ? value.join(' ') : value}`;
    })
    .join('; ');
};

export const isPasswordValid = (password: string, email?: string, name?: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const config = SECURITY_CONFIG.password;

  if (password.length < config.minLength) {
    errors.push(`Senha deve ter pelo menos ${config.minLength} caracteres`);
  }

  if (password.length > config.maxLength) {
    errors.push(`Senha não pode ter mais de ${config.maxLength} caracteres`);
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter letras maiúsculas');
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter letras minúsculas');
  }

  if (config.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Senha deve conter números');
  }

  if (config.requireSpecialChars && !new RegExp(`[${config.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password)) {
    errors.push('Senha deve conter caracteres especiais');
  }

  if (config.preventUserInfo) {
    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
      errors.push('Senha não pode conter parte do email');
    }
    if (name && password.toLowerCase().includes(name.split(' ')[0].toLowerCase())) {
      errors.push('Senha não pode conter seu nome');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};