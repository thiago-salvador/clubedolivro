// Serviço para rastrear e gerenciar o progresso de leitura da aluna

export interface ReadingProgress {
  userId: string;
  lastChapter: number;
  lastContent: 'video' | 'musica' | 'exercicio' | 'encontros' | 'overview';
  lastAccessTime: Date;
  completedChapters: number[];
  completedContent: {
    [chapterId: string]: {
      video?: boolean;
      musica?: boolean;
      exercicio?: boolean;
      encontros?: boolean;
    }
  };
}

class ReadingProgressService {
  private readonly STORAGE_KEY = 'user_reading_progress';

  // Salvar progresso de leitura
  saveProgress(progress: Partial<ReadingProgress>): void {
    try {
      const currentProgress = this.getProgress();
      const updatedProgress: ReadingProgress = {
        ...currentProgress,
        ...progress,
        lastAccessTime: new Date()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProgress));
      console.log('Progresso de leitura salvo:', updatedProgress);
    } catch (error) {
      console.error('Erro ao salvar progresso de leitura:', error);
    }
  }

  // Recuperar progresso atual
  getProgress(): ReadingProgress {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastAccessTime: new Date(parsed.lastAccessTime)
        };
      }
    } catch (error) {
      console.error('Erro ao recuperar progresso de leitura:', error);
    }

    // Progresso padrão para novos usuários
    return {
      userId: 'current_user',
      lastChapter: 1,
      lastContent: 'overview',
      lastAccessTime: new Date(),
      completedChapters: [],
      completedContent: {}
    };
  }

  // Marcar capítulo como acessado
  markChapterAccessed(chapterId: number, contentType: ReadingProgress['lastContent']): void {
    this.saveProgress({
      lastChapter: chapterId,
      lastContent: contentType
    });
  }

  // Marcar conteúdo como completado
  markContentCompleted(chapterId: number, contentType: 'video' | 'musica' | 'exercicio' | 'encontros'): void {
    const progress = this.getProgress();
    
    if (!progress.completedContent[chapterId.toString()]) {
      progress.completedContent[chapterId.toString()] = {};
    }
    
    progress.completedContent[chapterId.toString()][contentType] = true;
    
    // Se todos os conteúdos do capítulo foram completados, marcar capítulo como completo
    const chapterContent = progress.completedContent[chapterId.toString()];
    const allContentCompleted = chapterContent.video && chapterContent.musica && 
                               chapterContent.exercicio && chapterContent.encontros;
    
    if (allContentCompleted && !progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId);
    }

    this.saveProgress(progress);
  }

  // Verificar se conteúdo foi completado
  isContentCompleted(chapterId: number, contentType: 'video' | 'musica' | 'exercicio' | 'encontros'): boolean {
    const progress = this.getProgress();
    return progress.completedContent[chapterId.toString()]?.[contentType] || false;
  }

  // Verificar se capítulo foi completado
  isChapterCompleted(chapterId: number): boolean {
    const progress = this.getProgress();
    return progress.completedChapters.includes(chapterId);
  }

  // Obter último local acessado (para botão "Continuar de onde parou")
  getLastLocation(): { chapterId: number; contentType: ReadingProgress['lastContent']; path: string } {
    const progress = this.getProgress();
    const path = this.buildPath(progress.lastChapter, progress.lastContent);
    
    return {
      chapterId: progress.lastChapter,
      contentType: progress.lastContent,
      path
    };
  }

  // Construir path para navegação
  private buildPath(chapterId: number, contentType: ReadingProgress['lastContent']): string {
    const basePath = `/aluna/aulas/capitulo/${chapterId}`;
    
    switch (contentType) {
      case 'overview':
        return basePath;
      case 'video':
      case 'musica':
      case 'exercicio':
      case 'encontros':
        return `${basePath}/${contentType}`;
      default:
        return basePath;
    }
  }

  // Obter estatísticas de progresso
  getProgressStats(): {
    totalChapters: number;
    completedChapters: number;
    currentChapter: number;
    progressPercentage: number;
    lastAccess: Date;
  } {
    const progress = this.getProgress();
    const totalChapters = 5; // Total de capítulos do livro
    
    return {
      totalChapters,
      completedChapters: progress.completedChapters.length,
      currentChapter: progress.lastChapter,
      progressPercentage: (progress.completedChapters.length / totalChapters) * 100,
      lastAccess: progress.lastAccessTime
    };
  }

  // Resetar progresso (para testes ou reiniciar)
  resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Exportar progresso (para backup)
  exportProgress(): string {
    const progress = this.getProgress();
    return JSON.stringify(progress, null, 2);
  }

  // Importar progresso (para restaurar backup)
  importProgress(progressData: string): boolean {
    try {
      const progress = JSON.parse(progressData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Erro ao importar progresso:', error);
      return false;
    }
  }
}

// Instância singleton
export const readingProgressService = new ReadingProgressService();

// Hook personalizado para usar no React
export const useReadingProgress = () => {
  const getProgress = () => readingProgressService.getProgress();
  const saveProgress = (progress: Partial<ReadingProgress>) => readingProgressService.saveProgress(progress);
  const markChapterAccessed = (chapterId: number, contentType: ReadingProgress['lastContent']) => 
    readingProgressService.markChapterAccessed(chapterId, contentType);
  const markContentCompleted = (chapterId: number, contentType: 'video' | 'musica' | 'exercicio' | 'encontros') =>
    readingProgressService.markContentCompleted(chapterId, contentType);
  const isContentCompleted = (chapterId: number, contentType: 'video' | 'musica' | 'exercicio' | 'encontros') =>
    readingProgressService.isContentCompleted(chapterId, contentType);
  const isChapterCompleted = (chapterId: number) => readingProgressService.isChapterCompleted(chapterId);
  const getLastLocation = () => readingProgressService.getLastLocation();
  const getProgressStats = () => readingProgressService.getProgressStats();

  return {
    getProgress,
    saveProgress,
    markChapterAccessed,
    markContentCompleted,
    isContentCompleted,
    isChapterCompleted,
    getLastLocation,
    getProgressStats
  };
};