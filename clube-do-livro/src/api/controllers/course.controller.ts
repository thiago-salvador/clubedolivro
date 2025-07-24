import { createApiResponse, createApiError, ApiResponse, API_CONFIG } from '../config';
import { courseService } from '../../services/course.service';

export const courseController = {
  // Listar todos os cursos
  async getAll(params: any): Promise<ApiResponse> {
    try {
      const { 
        page = 1, 
        limit = API_CONFIG.pagination.defaultLimit, 
        search, 
        status,
        orderBy = 'name' 
      } = params;
      
      // Buscar cursos
      let courses = await courseService.getAllCourses();
      
      // Aplicar filtros
      if (search) {
        courses = await courseService.searchCourses(search);
      }
      
      if (status) {
        courses = courses.filter(c => c.status === status);
      }
      
      // Ordenar
      if (orderBy) {
        courses.sort((a, b) => {
          switch (orderBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'createdAt':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
              return 0;
          }
        });
      }
      
      // Paginar
      const total = courses.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedCourses = courses.slice(start, start + limit);
      
      return createApiResponse(paginatedCourses, undefined, {
        page,
        limit,
        total,
        totalPages
      });
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar cursos', 500);
    }
  },
  
  // Buscar curso por ID
  async getById(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const course = await courseService.getCourseById(id);
      
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      return createApiResponse(course);
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar curso', 500);
    }
  },
  
  // Criar novo curso
  async create(params: any, body: any): Promise<ApiResponse> {
    try {
      const courseData = body;
      
      // Validações básicas
      if (!courseData.name || courseData.name.trim().length < 3) {
        return createApiError('VALIDATION_ERROR', 'Nome do curso deve ter pelo menos 3 caracteres', 400);
      }
      
      if (!courseData.description || courseData.description.trim().length < 10) {
        return createApiError('VALIDATION_ERROR', 'Descrição deve ter pelo menos 10 caracteres', 400);
      }
      
      // Criar curso
      const newCourse = await courseService.createCourse(courseData);
      
      return createApiResponse(newCourse, 'Curso criado com sucesso');
      
    } catch (error: any) {
      return createApiError('CREATE_ERROR', error.message || 'Erro ao criar curso', 500);
    }
  },
  
  // Atualizar curso
  async update(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      const updates = body;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const course = await courseService.getCourseById(id);
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      // Não permitir alteração de ID
      delete updates.id;
      
      const updatedCourse = await courseService.updateCourse(id, updates);
      
      return createApiResponse(updatedCourse, 'Curso atualizado com sucesso');
      
    } catch (error: any) {
      return createApiError('UPDATE_ERROR', error.message || 'Erro ao atualizar curso', 500);
    }
  },
  
  // Excluir curso
  async delete(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const course = await courseService.getCourseById(id);
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      // Verificar se tem alunas inscritas
      if (course.currentStudentCount && course.currentStudentCount > 0) {
        return createApiError(
          'COURSE_HAS_STUDENTS', 
          'Não é possível excluir curso com alunas inscritas', 
          400
        );
      }
      
      await courseService.deleteCourse(id);
      
      return createApiResponse({}, 'Curso excluído com sucesso');
      
    } catch (error: any) {
      return createApiError('DELETE_ERROR', error.message || 'Erro ao excluir curso', 500);
    }
  },
  
  // Clonar curso
  async clone(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      const { name } = body;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const course = await courseService.getCourseById(id);
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      const clonedCourse = await courseService.cloneCourse(id, name);
      
      return createApiResponse(clonedCourse, 'Curso clonado com sucesso');
      
    } catch (error: any) {
      return createApiError('CLONE_ERROR', error.message || 'Erro ao clonar curso', 500);
    }
  },
  
  // Adicionar capítulo
  async addChapter(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      const chapterData = body;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID do curso é obrigatório', 400);
      }
      
      if (!chapterData.title || !chapterData.description) {
        return createApiError('VALIDATION_ERROR', 'Título e descrição do capítulo são obrigatórios', 400);
      }
      
      const course = await courseService.getCourseById(id);
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      const updatedCourse = await courseService.addChapterToCourse(id, chapterData);
      
      return createApiResponse(updatedCourse, 'Capítulo adicionado com sucesso');
      
    } catch (error: any) {
      return createApiError('ADD_CHAPTER_ERROR', error.message || 'Erro ao adicionar capítulo', 500);
    }
  },
  
  // Adicionar canal de debate
  async addDebateChannel(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      const channelData = body;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID do curso é obrigatório', 400);
      }
      
      if (!channelData.name || !channelData.description) {
        return createApiError('VALIDATION_ERROR', 'Nome e descrição do canal são obrigatórios', 400);
      }
      
      const course = await courseService.getCourseById(id);
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      const updatedCourse = await courseService.addDebateChannelToCourse(id, channelData);
      
      return createApiResponse(updatedCourse, 'Canal de debate adicionado com sucesso');
      
    } catch (error: any) {
      return createApiError('ADD_CHANNEL_ERROR', error.message || 'Erro ao adicionar canal', 500);
    }
  },
  
  // Estatísticas do curso
  async getStats(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const course = await courseService.getCourseById(id);
      if (!course) {
        return createApiError('NOT_FOUND', 'Curso não encontrado', 404);
      }
      
      // Simular estatísticas
      const stats = {
        courseId: id,
        courseName: course.name,
        totalStudents: course.currentStudentCount || 0,
        activeStudents: Math.floor((course.currentStudentCount || 0) * 0.8),
        completionRate: 65,
        averageProgress: 42,
        totalChapters: course.chapters?.length || 0,
        totalDebateChannels: course.debateChannels?.length || 0,
        lastActivity: new Date().toISOString()
      };
      
      return createApiResponse(stats);
      
    } catch (error: any) {
      return createApiError('STATS_ERROR', error.message || 'Erro ao buscar estatísticas', 500);
    }
  }
};