import { createApiResponse, createApiError, ApiResponse, API_CONFIG } from '../config';
import { tagService } from '../../services/tag.service';
import { studentService } from '../../services/student.service';

export const tagController = {
  // Listar todas as tags
  async getAll(params: any): Promise<ApiResponse> {
    try {
      const { 
        page = 1, 
        limit = API_CONFIG.pagination.defaultLimit,
        search,
        accessLevel,
        isActive,
        orderBy = 'name'
      } = params;
      
      const filters = {
        search,
        accessLevel,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        orderBy
      };
      
      const tags = tagService.getFilteredTags(filters);
      
      // Paginar
      const total = tags.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedTags = tags.slice(start, start + limit);
      
      return createApiResponse(paginatedTags, undefined, {
        page,
        limit,
        total,
        totalPages
      });
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar tags', 500);
    }
  },
  
  // Buscar tag por ID
  async getById(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const tag = tagService.getTagById(id);
      
      if (!tag) {
        return createApiError('NOT_FOUND', 'Tag não encontrada', 404);
      }
      
      return createApiResponse(tag);
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar tag', 500);
    }
  },
  
  // Criar nova tag
  async create(params: any, body: any): Promise<ApiResponse> {
    try {
      const tagData = body;
      
      // Validações
      const errors = tagService.validateTag(tagData);
      if (errors.length > 0) {
        return createApiError('VALIDATION_ERROR', errors.join(', '), 400);
      }
      
      // Criar tag
      const newTag = tagService.createTag(tagData);
      
      return createApiResponse(newTag, 'Tag criada com sucesso');
      
    } catch (error: any) {
      return createApiError('CREATE_ERROR', error.message || 'Erro ao criar tag', 500);
    }
  },
  
  // Atualizar tag
  async update(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      const updates = body;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const tag = tagService.getTagById(id);
      if (!tag) {
        return createApiError('NOT_FOUND', 'Tag não encontrada', 404);
      }
      
      // Validar atualizações
      const errors = tagService.validateTag({ ...tag, ...updates }, id);
      if (errors.length > 0) {
        return createApiError('VALIDATION_ERROR', errors.join(', '), 400);
      }
      
      // Não permitir alteração de ID
      delete updates.id;
      
      const updatedTag = tagService.updateTag(id, updates);
      
      return createApiResponse(updatedTag, 'Tag atualizada com sucesso');
      
    } catch (error: any) {
      return createApiError('UPDATE_ERROR', error.message || 'Erro ao atualizar tag', 500);
    }
  },
  
  // Excluir tag
  async delete(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const tag = tagService.getTagById(id);
      if (!tag) {
        return createApiError('NOT_FOUND', 'Tag não encontrada', 404);
      }
      
      // Verificar se tem alunas associadas
      const studentsWithTag = await studentService.getStudentsByFilter({ tags: [id] });
      if (studentsWithTag.length > 0) {
        return createApiError(
          'TAG_HAS_STUDENTS', 
          `Não é possível excluir tag com ${studentsWithTag.length} alunas associadas`, 
          400
        );
      }
      
      tagService.deleteTag(id);
      
      return createApiResponse({}, 'Tag excluída com sucesso');
      
    } catch (error: any) {
      return createApiError('DELETE_ERROR', error.message || 'Erro ao excluir tag', 500);
    }
  },
  
  // Alternar status da tag
  async toggleStatus(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const tag = tagService.getTagById(id);
      if (!tag) {
        return createApiError('NOT_FOUND', 'Tag não encontrada', 404);
      }
      
      const updatedTag = tagService.toggleTagStatus(id);
      
      if (!updatedTag) {
        return createApiError('UPDATE_ERROR', 'Erro ao alterar status da tag', 500);
      }
      
      const status = updatedTag.isActive ? 'ativada' : 'desativada';
      
      return createApiResponse(updatedTag, `Tag ${status} com sucesso`);
      
    } catch (error: any) {
      return createApiError('TOGGLE_ERROR', error.message || 'Erro ao alterar status', 500);
    }
  },
  
  // Estatísticas das tags
  async getStats(): Promise<ApiResponse> {
    try {
      const stats = tagService.getStatistics();
      return createApiResponse(stats);
      
    } catch (error: any) {
      return createApiError('STATS_ERROR', error.message || 'Erro ao buscar estatísticas', 500);
    }
  },
  
  // Cores disponíveis
  async getAvailableColors(): Promise<ApiResponse> {
    try {
      const colors = tagService.getAvailableColors();
      return createApiResponse(colors);
      
    } catch (error: any) {
      return createApiError('COLORS_ERROR', error.message || 'Erro ao buscar cores', 500);
    }
  }
};