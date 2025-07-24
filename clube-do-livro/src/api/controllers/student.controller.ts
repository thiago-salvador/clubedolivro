import { createApiResponse, createApiError, ApiResponse, API_CONFIG } from '../config';
import { studentService, StudentWithTags } from '../../services/student.service';
import { tagService } from '../../services/tag.service';
import { UserRole } from '../../types';

export const studentController = {
  // Listar todas as alunas
  async getAll(params: any, body: any, headers: any): Promise<ApiResponse> {
    try {
      const { page = 1, limit = API_CONFIG.pagination.defaultLimit, search, status, orderBy = 'name' } = params;
      
      // Buscar alunas
      let students = await studentService.getAllStudents();
      
      // Aplicar filtros
      if (search) {
        students = students.filter(student => 
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status !== undefined) {
        students = students.filter(student => 
          status === 'active' ? student.isActive : !student.isActive
        );
      }
      
      // Ordenar
      students.sort((a, b) => {
        switch (orderBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'email':
            return a.email.localeCompare(b.email);
          case 'createdAt':
          case 'joinedDate':
            return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
          default:
            return 0;
        }
      });
      
      // Paginar
      const total = students.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedStudents = students.slice(start, start + limit);
      
      return createApiResponse(paginatedStudents, undefined, {
        page,
        limit,
        total,
        totalPages
      });
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar alunas', 500);
    }
  },
  
  // Buscar aluna por ID
  async getById(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const student = await studentService.getStudentById(id);
      
      if (!student) {
        return createApiError('NOT_FOUND', 'Aluna não encontrada', 404);
      }
      
      return createApiResponse(student);
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar aluna', 500);
    }
  },
  
  // Criar nova aluna
  async create(params: any, body: any): Promise<ApiResponse> {
    try {
      const { name, email, phoneNumber, tags, notes } = body;
      
      // Validações
      if (!name || !email) {
        return createApiError('VALIDATION_ERROR', 'Nome e email são obrigatórios', 400);
      }
      
      // Verificar se email já existe
      const students = await studentService.getAllStudents();
      if (students.some(s => s.email === email)) {
        return createApiError('EMAIL_EXISTS', 'Email já cadastrado', 400);
      }
      
      // Criar aluna
      const newStudent: Omit<StudentWithTags, 'id' | 'lastActivity' | 'coursesEnrolled'> = {
        name,
        email,
        phoneNumber: phoneNumber || '',
        role: UserRole.ALUNA,
        joinedDate: new Date(),
        isActive: true,
        tags: tags || [],
        notes: notes || '',
        badges: []
      };
      
      const createdStudent = await studentService.createStudent(newStudent as any);
      
      return createApiResponse(createdStudent, 'Aluna criada com sucesso');
      
    } catch (error: any) {
      return createApiError('CREATE_ERROR', error.message || 'Erro ao criar aluna', 500);
    }
  },
  
  // Atualizar aluna
  async update(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      const updates = body;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const student = await studentService.getStudentById(id);
      if (!student) {
        return createApiError('NOT_FOUND', 'Aluna não encontrada', 404);
      }
      
      // Não permitir alteração de email
      delete updates.email;
      delete updates.id;
      
      const updatedStudent = await studentService.updateStudent(id, updates);
      
      return createApiResponse(updatedStudent, 'Aluna atualizada com sucesso');
      
    } catch (error: any) {
      return createApiError('UPDATE_ERROR', error.message || 'Erro ao atualizar aluna', 500);
    }
  },
  
  // Excluir aluna
  async delete(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const student = await studentService.getStudentById(id);
      if (!student) {
        return createApiError('NOT_FOUND', 'Aluna não encontrada', 404);
      }
      
      // Soft delete - apenas desativar
      await studentService.updateStudent(id, { isActive: false });
      
      return createApiResponse({}, 'Aluna desativada com sucesso');
      
    } catch (error: any) {
      return createApiError('DELETE_ERROR', error.message || 'Erro ao excluir aluna', 500);
    }
  },
  
  // Adicionar tag à aluna
  async addTag(params: any, body: any): Promise<ApiResponse> {
    try {
      const { id, tagId } = params;
      
      if (!id || !tagId) {
        return createApiError('VALIDATION_ERROR', 'ID da aluna e ID da tag são obrigatórios', 400);
      }
      
      const student = await studentService.getStudentById(id);
      if (!student) {
        return createApiError('NOT_FOUND', 'Aluna não encontrada', 404);
      }
      
      const tag = tagService.getTagById(tagId);
      if (!tag) {
        return createApiError('NOT_FOUND', 'Tag não encontrada', 404);
      }
      
      // Mock admin user for now
      const adminUser = {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        badges: [],
        joinedDate: new Date()
      };
      
      const success = await studentService.addTagToStudent(id, tag, adminUser);
      
      if (!success) {
        return createApiError('TAG_EXISTS', 'Tag já está associada à aluna', 400);
      }
      
      return createApiResponse({}, 'Tag adicionada com sucesso');
      
    } catch (error: any) {
      return createApiError('ADD_TAG_ERROR', error.message || 'Erro ao adicionar tag', 500);
    }
  },
  
  // Remover tag da aluna
  async removeTag(params: any): Promise<ApiResponse> {
    try {
      const { id, tagId } = params;
      
      if (!id || !tagId) {
        return createApiError('VALIDATION_ERROR', 'ID da aluna e ID da tag são obrigatórios', 400);
      }
      
      const student = await studentService.getStudentById(id);
      if (!student) {
        return createApiError('NOT_FOUND', 'Aluna não encontrada', 404);
      }
      
      await studentService.removeTagFromStudent(id, tagId);
      
      return createApiResponse({}, 'Tag removida com sucesso');
      
    } catch (error: any) {
      return createApiError('REMOVE_TAG_ERROR', error.message || 'Erro ao remover tag', 500);
    }
  },
  
  // Buscar alunas por tag
  async getByTag(params: any): Promise<ApiResponse> {
    try {
      const { tagId } = params;
      const { page = 1, limit = API_CONFIG.pagination.defaultLimit } = params;
      
      if (!tagId) {
        return createApiError('VALIDATION_ERROR', 'ID da tag é obrigatório', 400);
      }
      
      const students = await studentService.getStudentsByFilter({ tags: [tagId] });
      
      // Paginar
      const total = students.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedStudents = students.slice(start, start + limit);
      
      return createApiResponse(paginatedStudents, undefined, {
        page,
        limit,
        total,
        totalPages
      });
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar alunas por tag', 500);
    }
  },
  
  // Operações em lote
  async bulkOperation(params: any, body: any): Promise<ApiResponse> {
    try {
      const { operation, studentIds, data } = body;
      
      if (!operation || !studentIds || !Array.isArray(studentIds)) {
        return createApiError('VALIDATION_ERROR', 'Operação e IDs das alunas são obrigatórios', 400);
      }
      
      let successCount = 0;
      const errors: string[] = [];
      
      for (const studentId of studentIds) {
        try {
          switch (operation) {
            case 'activate':
              await studentService.updateStudent(studentId, { isActive: true });
              break;
            case 'deactivate':
              await studentService.updateStudent(studentId, { isActive: false });
              break;
            case 'addTag':
              if (data?.tagId) {
                const tag = tagService.getTagById(data.tagId);
                if (tag) {
                  const adminUser = {
                    id: 'admin-1',
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: UserRole.ADMIN,
                    badges: [],
                    joinedDate: new Date()
                  };
                  await studentService.addTagToStudent(studentId, tag, adminUser);
                }
              }
              break;
            case 'removeTag':
              if (data?.tagId) {
                await studentService.removeTagFromStudent(studentId, data.tagId);
              }
              break;
            default:
              throw new Error('Operação inválida');
          }
          successCount++;
        } catch (error: any) {
          errors.push(`Erro na aluna ${studentId}: ${error.message}`);
        }
      }
      
      return createApiResponse({
        total: studentIds.length,
        success: successCount,
        failed: studentIds.length - successCount,
        errors
      }, `Operação concluída: ${successCount}/${studentIds.length} alunas processadas`);
      
    } catch (error: any) {
      return createApiError('BULK_ERROR', error.message || 'Erro na operação em lote', 500);
    }
  }
};