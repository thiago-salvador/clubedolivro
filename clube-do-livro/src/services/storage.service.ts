// Serviço de armazenamento seguro para tokens
// Em produção, considere usar cookies httpOnly para maior segurança

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'clube_livro_access_token',
  REFRESH_TOKEN: 'clube_livro_refresh_token',
  USER_DATA: 'clube_livro_user_data'
};

export const storageService = {
  // Tokens
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // User data
  setUserData(user: any): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  getUserData(): any | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  clearUserData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Clear all
  clearAll(): void {
    this.clearTokens();
    this.clearUserData();
  }
};