import { DebateChannel } from '../types/admin.types';

export interface ModerationResult {
  isApproved: boolean;
  blockedWords: string[];
  reason?: string;
}

export interface ModerationConfig {
  globalBannedWords: string[];
  maxMessageLength: number;
  checkLinks: boolean;
  blockExternalLinks: boolean;
}

class ModerationService {
  private static instance: ModerationService;
  private globalBannedWords: string[] = [];
  private defaultConfig: ModerationConfig = {
    globalBannedWords: [
      // Palavras ofensivas genéricas (adicionar conforme necessário)
      'spam', 'scam', 'phishing'
    ],
    maxMessageLength: 5000,
    checkLinks: true,
    blockExternalLinks: false
  };

  private constructor() {
    this.loadGlobalBannedWords();
  }

  static getInstance(): ModerationService {
    if (!ModerationService.instance) {
      ModerationService.instance = new ModerationService();
    }
    return ModerationService.instance;
  }

  private loadGlobalBannedWords(): void {
    const stored = localStorage.getItem('moderation_global_banned_words');
    if (stored) {
      this.globalBannedWords = JSON.parse(stored);
    } else {
      this.globalBannedWords = this.defaultConfig.globalBannedWords;
    }
  }

  private saveGlobalBannedWords(): void {
    localStorage.setItem('moderation_global_banned_words', JSON.stringify(this.globalBannedWords));
  }

  // Gerenciamento de palavras banidas globais
  getGlobalBannedWords(): string[] {
    return [...this.globalBannedWords];
  }

  addGlobalBannedWord(word: string): void {
    const normalized = word.toLowerCase().trim();
    if (normalized && !this.globalBannedWords.includes(normalized)) {
      this.globalBannedWords.push(normalized);
      this.saveGlobalBannedWords();
    }
  }

  removeGlobalBannedWord(word: string): void {
    const normalized = word.toLowerCase().trim();
    this.globalBannedWords = this.globalBannedWords.filter(w => w !== normalized);
    this.saveGlobalBannedWords();
  }

  updateGlobalBannedWords(words: string[]): void {
    this.globalBannedWords = words.map(w => w.toLowerCase().trim()).filter(w => w);
    this.saveGlobalBannedWords();
  }

  // Moderação de conteúdo
  moderateMessage(content: string, channel: DebateChannel): ModerationResult {
    const normalizedContent = content.toLowerCase();
    const blockedWords: string[] = [];

    // Verificar palavras banidas globais
    for (const word of this.globalBannedWords) {
      if (this.containsWord(normalizedContent, word)) {
        blockedWords.push(word);
      }
    }

    // Verificar palavras banidas do canal
    if (channel.bannedWords) {
      for (const word of channel.bannedWords) {
        const normalized = word.toLowerCase().trim();
        if (normalized && this.containsWord(normalizedContent, normalized)) {
          blockedWords.push(word);
        }
      }
    }

    // Verificar comprimento da mensagem
    if (content.length > this.defaultConfig.maxMessageLength) {
      return {
        isApproved: false,
        blockedWords: [],
        reason: `Mensagem muito longa (máximo ${this.defaultConfig.maxMessageLength} caracteres)`
      };
    }

    // Verificar links externos se configurado
    if (this.defaultConfig.checkLinks && this.containsExternalLinks(content)) {
      if (this.defaultConfig.blockExternalLinks) {
        return {
          isApproved: false,
          blockedWords: [],
          reason: 'Links externos não são permitidos'
        };
      }
    }

    // Se o canal requer moderação e há palavras bloqueadas
    if (channel.requireModeration && blockedWords.length > 0) {
      return {
        isApproved: false,
        blockedWords,
        reason: 'Mensagem contém palavras proibidas'
      };
    }

    return {
      isApproved: true,
      blockedWords
    };
  }

  // Verificar se o conteúdo contém uma palavra específica
  private containsWord(content: string, word: string): boolean {
    // Usar regex para verificar palavra completa (não parte de outra palavra)
    const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'i');
    return regex.test(content);
  }

  // Escapar caracteres especiais para regex
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Verificar se contém links externos
  private containsExternalLinks(content: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = content.match(urlRegex);
    
    if (!matches) return false;

    // Permitir links internos (do próprio domínio)
    const allowedDomains = ['localhost', 'clubedolivronodiva.com.br'];
    
    return matches.some(url => {
      try {
        const urlObj = new URL(url);
        return !allowedDomains.some(domain => urlObj.hostname.includes(domain));
      } catch {
        return false;
      }
    });
  }

  // Filtrar mensagem removendo palavras proibidas
  filterMessage(content: string, channel: DebateChannel): string {
    let filtered = content;
    
    // Remover palavras banidas globais
    for (const word of this.globalBannedWords) {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
      filtered = filtered.replace(regex, '***');
    }

    // Remover palavras banidas do canal
    if (channel.bannedWords) {
      for (const word of channel.bannedWords) {
        const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
        filtered = filtered.replace(regex, '***');
      }
    }

    return filtered;
  }

  // Estatísticas de moderação
  getModerationStats(): {
    totalBannedWords: number;
    lastUpdated: Date;
  } {
    return {
      totalBannedWords: this.globalBannedWords.length,
      lastUpdated: new Date()
    };
  }
}

export const moderationService = ModerationService.getInstance();