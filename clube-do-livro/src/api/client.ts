// Cliente API para uso no frontend
import { api, ApiResponse } from './index';

// Armazenar token de autenticação
let authToken: string | null = localStorage.getItem('authToken');
let refreshToken: string | null = localStorage.getItem('refreshToken');

// Configurar headers padrão
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
});

// Cliente API com métodos convenientes
export const apiClient = {
  // Configurar tokens
  setTokens(access: string, refresh: string) {
    authToken = access;
    refreshToken = refresh;
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  
  clearTokens() {
    authToken = null;
    refreshToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },
  
  // Auth endpoints
  auth: {
    async login(email: string, password: string): Promise<ApiResponse> {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success && response.data) {
        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      }
      
      return response;
    },
    
    async register(data: {
      name: string;
      email: string;
      password: string;
      phoneNumber?: string;
    }): Promise<ApiResponse> {
      const response = await api.post('/auth/register', data);
      
      if (response.success && response.data) {
        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      }
      
      return response;
    },
    
    async logout(): Promise<ApiResponse> {
      const response = await api.post('/auth/logout', {}, {
        headers: getDefaultHeaders()
      });
      
      apiClient.clearTokens();
      
      return response;
    },
    
    async refreshToken(): Promise<ApiResponse> {
      if (!refreshToken) {
        return {
          success: false,
          error: 'NO_REFRESH_TOKEN',
          message: 'Token de atualização não encontrado'
        };
      }
      
      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.success && response.data) {
        authToken = response.data.accessToken;
        localStorage.setItem('authToken', response.data.accessToken);
      }
      
      return response;
    },
    
    async forgotPassword(email: string): Promise<ApiResponse> {
      return api.post('/auth/forgot-password', { email });
    },
    
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
      return api.post('/auth/reset-password', { token, newPassword });
    }
  },
  
  // Students endpoints
  students: {
    async getAll(params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      orderBy?: string;
    }): Promise<ApiResponse> {
      return api.get('/students', {
        params,
        headers: getDefaultHeaders()
      });
    },
    
    async getById(id: string): Promise<ApiResponse> {
      return api.get(`/students/${id}`, {
        headers: getDefaultHeaders()
      });
    },
    
    async create(data: any): Promise<ApiResponse> {
      return api.post('/students', data, {
        headers: getDefaultHeaders()
      });
    },
    
    async update(id: string, data: any): Promise<ApiResponse> {
      return api.put(`/students/${id}`, data, {
        headers: getDefaultHeaders()
      });
    },
    
    async delete(id: string): Promise<ApiResponse> {
      return api.delete(`/students/${id}`, {
        headers: getDefaultHeaders()
      });
    },
    
    async addTag(studentId: string, tagId: string): Promise<ApiResponse> {
      return api.post(`/students/${studentId}/tags`, { tagId }, {
        headers: getDefaultHeaders()
      });
    },
    
    async removeTag(studentId: string, tagId: string): Promise<ApiResponse> {
      return api.delete(`/students/${studentId}/tags/${tagId}`, {
        headers: getDefaultHeaders()
      });
    }
  },
  
  // Courses endpoints
  courses: {
    async getAll(params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      orderBy?: string;
    }): Promise<ApiResponse> {
      return api.get('/courses', {
        params,
        headers: getDefaultHeaders()
      });
    },
    
    async getById(id: string): Promise<ApiResponse> {
      return api.get(`/courses/${id}`, {
        headers: getDefaultHeaders()
      });
    },
    
    async create(data: any): Promise<ApiResponse> {
      return api.post('/courses', data, {
        headers: getDefaultHeaders()
      });
    },
    
    async update(id: string, data: any): Promise<ApiResponse> {
      return api.put(`/courses/${id}`, data, {
        headers: getDefaultHeaders()
      });
    },
    
    async delete(id: string): Promise<ApiResponse> {
      return api.delete(`/courses/${id}`, {
        headers: getDefaultHeaders()
      });
    },
    
    async clone(id: string, name?: string): Promise<ApiResponse> {
      return api.post(`/courses/${id}/clone`, { name }, {
        headers: getDefaultHeaders()
      });
    }
  },
  
  // Tags endpoints
  tags: {
    async getAll(params?: {
      page?: number;
      limit?: number;
      search?: string;
      accessLevel?: string;
      isActive?: boolean;
      orderBy?: string;
    }): Promise<ApiResponse> {
      return api.get('/tags', {
        params,
        headers: getDefaultHeaders()
      });
    },
    
    async getById(id: string): Promise<ApiResponse> {
      return api.get(`/tags/${id}`, {
        headers: getDefaultHeaders()
      });
    },
    
    async create(data: any): Promise<ApiResponse> {
      return api.post('/tags', data, {
        headers: getDefaultHeaders()
      });
    },
    
    async update(id: string, data: any): Promise<ApiResponse> {
      return api.put(`/tags/${id}`, data, {
        headers: getDefaultHeaders()
      });
    },
    
    async delete(id: string): Promise<ApiResponse> {
      return api.delete(`/tags/${id}`, {
        headers: getDefaultHeaders()
      });
    }
  },
  
  // Notifications endpoints
  notifications: {
    async getAll(params?: {
      page?: number;
      limit?: number;
      type?: string;
      sent?: boolean;
    }): Promise<ApiResponse> {
      return api.get('/notifications', {
        params,
        headers: getDefaultHeaders()
      });
    },
    
    async send(data: {
      subject: string;
      body: string;
      recipientType: string;
      recipientIds?: string[];
      selectedTags?: string[];
      customEmails?: string;
      channel?: 'email' | 'whatsapp' | 'both';
    }): Promise<ApiResponse> {
      return api.post('/notifications/send', data, {
        headers: getDefaultHeaders()
      });
    },
    
    async schedule(data: {
      type: string;
      scheduledFor: Date | string;
      title: string;
      message: string;
      data?: any;
    }): Promise<ApiResponse> {
      return api.post('/notifications/schedule', data, {
        headers: getDefaultHeaders()
      });
    },
    
    async cancel(id: string): Promise<ApiResponse> {
      return api.delete(`/notifications/${id}`, {
        headers: getDefaultHeaders()
      });
    }
  },
  
  // Webhook endpoints
  webhooks: {
    async hotmart(data: any): Promise<ApiResponse> {
      return api.post('/webhooks/hotmart', data);
    }
  }
};

// Interceptor para renovar token automaticamente
let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

// Wrapper para requests com retry automático
export async function apiRequest<T = any>(
  request: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  try {
    const response = await request();
    
    // Se o token expirou, tentar renovar
    if (!response.success && response.error === 'UNAUTHORIZED' && refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        const refreshResponse = await apiClient.auth.refreshToken();
        
        if (refreshResponse.success) {
          // Processar fila de requests pendentes
          refreshQueue.forEach(callback => callback());
          refreshQueue = [];
          
          // Tentar request original novamente
          return request();
        } else {
          // Falha ao renovar token - fazer logout
          apiClient.clearTokens();
          window.location.href = '/login';
        }
        
        isRefreshing = false;
      } else {
        // Aguardar refresh em andamento
        return new Promise((resolve) => {
          refreshQueue.push(() => {
            resolve(request());
          });
        });
      }
    }
    
    return response;
    
  } catch (error: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: error.message || 'Erro de rede'
    };
  }
}

// Exportar cliente como padrão
export default apiClient;