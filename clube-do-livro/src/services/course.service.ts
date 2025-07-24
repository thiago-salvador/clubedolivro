import { Course, CourseStatus, CourseAccessLevel, CourseChapter, DebateChannel } from '../types/admin.types';
import { User } from '../types';

// Mock data para desenvolvimento
const STORAGE_KEY = 'courses';

export class CourseService {
  private static instance: CourseService;
  private courses: Course[] = [];

  private constructor() {
    this.loadCourses();
  }

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  // Carregar cursos do localStorage (mock)
  private loadCourses(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.courses = JSON.parse(stored).map((course: any) => ({
          ...course,
          startDate: new Date(course.startDate),
          endDate: course.endDate ? new Date(course.endDate) : undefined,
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      this.courses = [];
    }
  }

  // Salvar cursos no localStorage (mock)
  private saveCourses(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.courses));
    } catch (error) {
      console.error('Erro ao salvar cursos:', error);
    }
  }

  // Gerar ID único
  private generateId(): string {
    return `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Listar todos os cursos
  async getAllCourses(): Promise<Course[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.courses].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Buscar curso por ID
  async getCourseById(id: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.courses.find(course => course.id === id) || null;
  }

  // Criar novo curso
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newCourse: Course = {
      id: this.generateId(),
      name: courseData.name || '',
      description: courseData.description || '',
      status: courseData.status || CourseStatus.DRAFT,
      accessLevel: courseData.accessLevel || CourseAccessLevel.FREE,
      startDate: courseData.startDate || new Date(),
      endDate: courseData.endDate,
      maxStudents: courseData.maxStudents,
      currentStudentCount: 0,
      instructor: courseData.instructor!,
      tags: courseData.tags || [],
      coverImage: courseData.coverImage,
      backgroundColor: courseData.backgroundColor || '#B8654B',
      textColor: courseData.textColor || '#FFFFFF',
      chapters: courseData.chapters || [],
      debateChannels: courseData.debateChannels || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: courseData.createdBy!,
      lastModifiedBy: courseData.lastModifiedBy!
    };

    this.courses.push(newCourse);
    this.saveCourses();
    return newCourse;
  }

  // Atualizar curso
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      throw new Error('Curso não encontrado');
    }

    const updatedCourse = {
      ...this.courses[courseIndex],
      ...updates,
      id, // Garantir que o ID não seja alterado
      updatedAt: new Date()
    };

    this.courses[courseIndex] = updatedCourse;
    this.saveCourses();
    return updatedCourse;
  }

  // Deletar curso
  async deleteCourse(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      return false;
    }

    this.courses.splice(courseIndex, 1);
    this.saveCourses();
    return true;
  }

  // Deletar múltiplos cursos
  async deleteMultipleCourses(ids: string[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const initialLength = this.courses.length;
    this.courses = this.courses.filter(course => !ids.includes(course.id));
    
    if (this.courses.length < initialLength) {
      this.saveCourses();
      return true;
    }
    return false;
  }

  // Clonar curso
  async cloneCourse(id: string, newName?: string): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const originalCourse = this.courses.find(course => course.id === id);
    if (!originalCourse) {
      throw new Error('Curso original não encontrado');
    }

    const clonedCourse: Course = {
      ...originalCourse,
      id: this.generateId(),
      name: newName || `${originalCourse.name} (Cópia)`,
      status: CourseStatus.DRAFT,
      currentStudentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.courses.push(clonedCourse);
    this.saveCourses();
    return clonedCourse;
  }

  // Filtrar cursos por status
  async getCoursesByStatus(status: CourseStatus): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.courses.filter(course => course.status === status);
  }

  // Buscar cursos por texto
  async searchCourses(query: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      return this.getAllCourses();
    }

    return this.courses.filter(course => 
      course.name.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor.name.toLowerCase().includes(searchTerm)
    );
  }

  // Obter estatísticas dos cursos
  async getCourseStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalStudents: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const stats = {
      total: this.courses.length,
      published: this.courses.filter(c => c.status === CourseStatus.PUBLISHED).length,
      draft: this.courses.filter(c => c.status === CourseStatus.DRAFT).length,
      archived: this.courses.filter(c => c.status === CourseStatus.ARCHIVED).length,
      totalStudents: this.courses.reduce((sum, course) => sum + course.currentStudentCount, 0)
    };

    return stats;
  }

  // Publicar curso (alterar status para PUBLISHED)
  async publishCourse(id: string): Promise<Course> {
    return this.updateCourse(id, { status: CourseStatus.PUBLISHED });
  }

  // Arquivar curso
  async archiveCourse(id: string): Promise<Course> {
    return this.updateCourse(id, { status: CourseStatus.ARCHIVED });
  }

  // Adicionar capítulo ao curso
  async addChapterToCourse(courseId: string, chapter: Omit<CourseChapter, 'id'>): Promise<Course> {
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error('Curso não encontrado');
    }

    const newChapter: CourseChapter = {
      ...chapter,
      id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    const updatedChapters = [...course.chapters, newChapter];
    return this.updateCourse(courseId, { chapters: updatedChapters });
  }

  // Atualizar capítulo
  async updateChapter(courseId: string, chapterId: string, updates: Partial<CourseChapter>): Promise<Course> {
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error('Curso não encontrado');
    }

    const chapterIndex = course.chapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex === -1) {
      throw new Error('Capítulo não encontrado');
    }

    const updatedChapters = [...course.chapters];
    updatedChapters[chapterIndex] = { ...updatedChapters[chapterIndex], ...updates };

    return this.updateCourse(courseId, { chapters: updatedChapters });
  }

  // Remover capítulo
  async removeChapterFromCourse(courseId: string, chapterId: string): Promise<Course> {
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error('Curso não encontrado');
    }

    const updatedChapters = course.chapters.filter(ch => ch.id !== chapterId);
    return this.updateCourse(courseId, { chapters: updatedChapters });
  }

  // Adicionar canal de debate ao curso
  async addDebateChannelToCourse(courseId: string, channel: Omit<DebateChannel, 'id'>): Promise<Course> {
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error('Curso não encontrado');
    }

    const newChannel: DebateChannel = {
      ...channel,
      id: `channel_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    const updatedChannels = [...course.debateChannels, newChannel];
    return this.updateCourse(courseId, { debateChannels: updatedChannels });
  }

  // Limpar todos os dados (útil para desenvolvimento)
  clearAllData(): void {
    this.courses = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Instância singleton
export const courseService = CourseService.getInstance();

// Funções de conveniência
export const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  deleteMultipleCourses,
  cloneCourse,
  getCoursesByStatus,
  searchCourses,
  getCourseStats,
  publishCourse,
  archiveCourse,
  addChapterToCourse,
  updateChapter,
  removeChapterFromCourse,
  addDebateChannelToCourse
} = courseService;