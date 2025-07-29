// Secure storage service with encryption and security best practices
import { API_CONFIG } from '../api/config';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'clube_livro_access_token',
  REFRESH_TOKEN: 'clube_livro_refresh_token',
  USER_DATA: 'clube_livro_user_data',
  CSRF_TOKEN: 'clube_livro_csrf_token'
};

// Simple encryption for localStorage (better than plaintext)
// In production, consider using Web Crypto API
function encrypt(text: string): string {
  try {
    const key = API_CONFIG.security.encryptionKey;
    // Simple XOR encryption for demo - use proper encryption in production
    return btoa(text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join(''));
  } catch {
    return text;
  }
}

function decrypt(encrypted: string): string {
  try {
    const key = API_CONFIG.security.encryptionKey;
    const text = atob(encrypted);
    return text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  } catch {
    return encrypted;
  }
}

// Check if we should use secure storage
function isSecureContext(): boolean {
  return window.isSecureContext || window.location.protocol === 'https:';
}

export const secureStorageService = {
  // Tokens with encryption
  setTokens(accessToken: string, refreshToken: string): void {
    if (!isSecureContext() && process.env.NODE_ENV === 'production') {
      console.error('Warning: Storing tokens in non-secure context');
    }
    
    // Store encrypted tokens
    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, encrypt(accessToken));
    // Refresh token in localStorage for persistence, but encrypted
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, encrypt(refreshToken));
    
    // Set token expiry
    const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7 days
    sessionStorage.setItem(`${STORAGE_KEYS.ACCESS_TOKEN}_expiry`, expiryTime.toString());
  },

  getAccessToken(): string | null {
    const encrypted = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = sessionStorage.getItem(`${STORAGE_KEYS.ACCESS_TOKEN}_expiry`);
    
    if (!encrypted || !expiry) return null;
    
    // Check if token expired
    if (new Date().getTime() > parseInt(expiry)) {
      this.clearTokens();
      return null;
    }
    
    return decrypt(encrypted);
  },

  getRefreshToken(): string | null {
    const encrypted = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return encrypted ? decrypt(encrypted) : null;
  },

  clearTokens(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(`${STORAGE_KEYS.ACCESS_TOKEN}_expiry`);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // User data with encryption
  setUserData(user: any): void {
    const encrypted = encrypt(JSON.stringify(user));
    sessionStorage.setItem(STORAGE_KEYS.USER_DATA, encrypted);
  },

  getUserData(): any | null {
    const encrypted = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!encrypted) return null;
    
    try {
      return JSON.parse(decrypt(encrypted));
    } catch {
      return null;
    }
  },

  clearUserData(): void {
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // CSRF Token
  setCSRFToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token);
  },

  getCSRFToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
  },

  // Clear all
  clearAll(): void {
    this.clearTokens();
    this.clearUserData();
    sessionStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
  },

  // Security check
  isStorageSecure(): boolean {
    return isSecureContext();
  }
};

// Migrate from old storage service
export function migrateFromOldStorage(): void {
  const oldKeys = ['clube_livro_access_token', 'clube_livro_refresh_token', 'clube_livro_user_data'];
  
  oldKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      // Clear old unencrypted data
      localStorage.removeItem(key);
    }
  });
}