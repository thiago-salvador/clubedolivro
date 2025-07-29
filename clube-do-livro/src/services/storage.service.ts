// Legacy storage service - redirects to secure storage
// Maintained for backward compatibility
import { secureStorageService, migrateFromOldStorage } from './secure-storage.service';

// Migrate old data on load
if (typeof window !== 'undefined') {
  migrateFromOldStorage();
}

// Export the secure storage service with the old interface
export const storageService = {
  // Tokens
  setTokens(accessToken: string, refreshToken: string): void {
    console.warn('storageService is deprecated. Use secureStorageService instead.');
    secureStorageService.setTokens(accessToken, refreshToken);
  },

  getAccessToken(): string | null {
    return secureStorageService.getAccessToken();
  },

  getRefreshToken(): string | null {
    return secureStorageService.getRefreshToken();
  },

  clearTokens(): void {
    secureStorageService.clearTokens();
  },

  // User data
  setUserData(user: any): void {
    secureStorageService.setUserData(user);
  },

  getUserData(): any | null {
    return secureStorageService.getUserData();
  },

  clearUserData(): void {
    secureStorageService.clearUserData();
  },

  // Clear all
  clearAll(): void {
    secureStorageService.clearAll();
  }
};