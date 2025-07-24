import { API_CONFIG } from '../config';

// Simulação de criptografia para desenvolvimento
// Em produção, usar bcrypt ou argon2

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  // Simular delay de hashing
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulação de hash
  // Em produção, usar bcrypt.hash
  const salt = generateSalt();
  const hashed = simpleHash(password + salt);
  
  return `$2b$${API_CONFIG.security.bcryptRounds}$${salt}$${hashed}`;
}

// Comparar senha com hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // Simular delay de comparação
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    // Extrair salt do hash
    const parts = hash.split('$');
    if (parts.length < 5) {
      return false;
    }
    
    const salt = parts[3];
    const storedHash = parts[4];
    
    // Gerar hash da senha fornecida com o mesmo salt
    const inputHash = simpleHash(password + salt);
    
    return inputHash === storedHash;
    
  } catch (error) {
    return false;
  }
}

// Gerar salt aleatório
export function generateSalt(length: number = 22): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
  let salt = '';
  
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return salt;
}

// Gerar token aleatório
export function generateRandomToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}

// Criptografar dados (simulado)
export function encrypt(data: string, key?: string): string {
  // Simulação de criptografia
  // Em produção, usar crypto.createCipher
  const actualKey = key || API_CONFIG.security.jwtSecret;
  return btoa(data + '::' + actualKey);
}

// Descriptografar dados (simulado)
export function decrypt(encrypted: string, key?: string): string | null {
  try {
    // Simulação de descriptografia
    // Em produção, usar crypto.createDecipher
    const actualKey = key || API_CONFIG.security.jwtSecret;
    const decrypted = atob(encrypted);
    const parts = decrypted.split('::');
    
    if (parts.length === 2 && parts[1] === actualKey) {
      return parts[0];
    }
    
    return null;
    
  } catch (error) {
    return null;
  }
}

// Hash simples (NÃO usar em produção)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Converter para hexadecimal
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// Validar força da senha
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  // Comprimento mínimo
  if (password.length < 6) {
    feedback.push('Senha deve ter pelo menos 6 caracteres');
  } else if (password.length >= 8) {
    score += 1;
  }
  if (password.length >= 12) {
    score += 1;
  }
  
  // Letras maiúsculas
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione letras maiúsculas');
  }
  
  // Letras minúsculas
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione letras minúsculas');
  }
  
  // Números
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione números');
  }
  
  // Caracteres especiais
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Adicione caracteres especiais');
  }
  
  return {
    valid: password.length >= 6 && score >= 3,
    score: Math.min(score, 5),
    feedback
  };
}