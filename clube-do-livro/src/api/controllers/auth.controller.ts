import { createApiResponse, createApiError, ApiResponse } from '../config';
import { authService } from '../../services/auth.service';
import { emailService } from '../../services/email.service';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.utils';
import { hashPassword, comparePassword } from '../utils/crypto.utils';

export const authController = {
  // Login
  async login(params: any, body: any): Promise<ApiResponse> {
    try {
      const { email, password } = body;
      
      if (!email || !password) {
        return createApiError('VALIDATION_ERROR', 'Email e senha são obrigatórios', 400);
      }
      
      // Autenticar usuário
      let authResponse;
      try {
        authResponse = await authService.login({ email, password });
      } catch (error: any) {
        return createApiError('AUTH_ERROR', error.message || 'Email ou senha inválidos', 401);
      }
      
      if (!authResponse || !authResponse.user) {
        return createApiError('AUTH_ERROR', 'Falha na autenticação', 401);
      }
      
      const user = authResponse.user;
      
      // Usar tokens do authResponse ou gerar novos
      const accessToken = authResponse.accessToken || generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      const refreshToken = authResponse.refreshToken || generateRefreshToken({
        id: user.id
      });
      
      return createApiResponse({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }, 'Login realizado com sucesso');
      
    } catch (error: any) {
      return createApiError('LOGIN_ERROR', error.message || 'Erro ao fazer login', 500);
    }
  },
  
  // Registro
  async register(params: any, body: any): Promise<ApiResponse> {
    try {
      const { name, email, password, phoneNumber } = body;
      
      // Validações
      if (!name || !email || !password) {
        return createApiError('VALIDATION_ERROR', 'Nome, email e senha são obrigatórios', 400);
      }
      
      // Import password validation
      const { validatePasswordStrength } = await import('../utils/crypto.utils');
      
      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      
      if (!passwordValidation.valid) {
        return createApiError(
          'VALIDATION_ERROR', 
          `Senha fraca. ${passwordValidation.feedback.join('. ')}`,
          400
        );
      }
      
      // Additional password checks
      if (password.length < 8) {
        return createApiError('VALIDATION_ERROR', 'Senha deve ter pelo menos 8 caracteres', 400);
      }
      
      if (password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
        return createApiError('VALIDATION_ERROR', 'Senha não pode conter parte do email', 400);
      }
      
      if (password.toLowerCase().includes(name.toLowerCase().split(' ')[0])) {
        return createApiError('VALIDATION_ERROR', 'Senha não pode conter seu nome', 400);
      }
      
      // Verificar se email já existe
      const existingUser = localStorage.getItem(`user_${email}`);
      if (existingUser) {
        return createApiError('EMAIL_EXISTS', 'Email já cadastrado', 400);
      }
      
      // Hash da senha
      const hashedPassword = await hashPassword(password);
      
      // Criar usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role: 'aluna' as const,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Salvar usuário (simulado)
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      
      // Enviar email de boas-vindas (with error handling)
      try {
        await emailService.sendWelcomeEmail(email, name);
      } catch (emailError) {
        // Log but don't fail registration
        console.error('Failed to send welcome email:', {
          error: emailError,
          userId: newUser.id,
          timestamp: new Date().toISOString()
        });
      }
      
      // Gerar tokens
      const accessToken = generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      });
      
      const refreshToken = generateRefreshToken({
        id: newUser.id
      });
      
      return createApiResponse({
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        accessToken,
        refreshToken
      }, 'Cadastro realizado com sucesso');
      
    } catch (error: any) {
      return createApiError('REGISTER_ERROR', error.message || 'Erro ao cadastrar', 500);
    }
  },
  
  // Refresh token
  async refreshToken(params: any, body: any): Promise<ApiResponse> {
    try {
      const { refreshToken } = body;
      
      if (!refreshToken) {
        return createApiError('VALIDATION_ERROR', 'Refresh token é obrigatório', 400);
      }
      
      // Verificar refresh token
      const decoded = verifyToken(refreshToken, true) as any;
      if (!decoded) {
        return createApiError('INVALID_TOKEN', 'Refresh token inválido', 401);
      }
      
      // Buscar usuário por email
      const user = decoded.email ? authService.getUserByEmail(decoded.email) : null;
      if (!user) {
        return createApiError('USER_NOT_FOUND', 'Usuário não encontrado', 404);
      }
      
      // Gerar novo access token
      const accessToken = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      return createApiResponse({
        accessToken
      }, 'Token renovado com sucesso');
      
    } catch (error: any) {
      return createApiError('REFRESH_ERROR', error.message || 'Erro ao renovar token', 500);
    }
  },
  
  // Esqueceu a senha
  async forgotPassword(params: any, body: any): Promise<ApiResponse> {
    try {
      const { email } = body;
      
      if (!email) {
        return createApiError('VALIDATION_ERROR', 'Email é obrigatório', 400);
      }
      
      // Verificar se usuário existe (simulado)
      const userData = localStorage.getItem(`user_${email}`);
      if (!userData) {
        // Por segurança, não revelar se o email existe
        return createApiResponse({}, 'Se o email existir, você receberá instruções para redefinir sua senha');
      }
      
      const user = JSON.parse(userData);
      
      // Gerar token de reset
      const resetToken = generateToken({
        email,
        type: 'password_reset'
      }, '1h'); // Token válido por 1 hora
      
      // Salvar token (simulado)
      localStorage.setItem(`reset_token_${email}`, resetToken);
      
      // Enviar email
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
      await emailService.sendPasswordReset(email, user.name, resetUrl);
      
      return createApiResponse({}, 'Se o email existir, você receberá instruções para redefinir sua senha');
      
    } catch (error: any) {
      return createApiError('FORGOT_PASSWORD_ERROR', error.message || 'Erro ao processar solicitação', 500);
    }
  },
  
  // Resetar senha
  async resetPassword(params: any, body: any): Promise<ApiResponse> {
    try {
      const { token, newPassword } = body;
      
      if (!token || !newPassword) {
        return createApiError('VALIDATION_ERROR', 'Token e nova senha são obrigatórios', 400);
      }
      
      if (newPassword.length < 6) {
        return createApiError('VALIDATION_ERROR', 'Senha deve ter pelo menos 6 caracteres', 400);
      }
      
      // Verificar token
      const decoded = verifyToken(token) as any;
      if (!decoded || decoded.type !== 'password_reset') {
        return createApiError('INVALID_TOKEN', 'Token inválido ou expirado', 401);
      }
      
      // Verificar se token corresponde ao salvo
      const savedToken = localStorage.getItem(`reset_token_${decoded.email}`);
      if (savedToken !== token) {
        return createApiError('INVALID_TOKEN', 'Token inválido', 401);
      }
      
      // Buscar usuário
      const userData = localStorage.getItem(`user_${decoded.email}`);
      if (!userData) {
        return createApiError('USER_NOT_FOUND', 'Usuário não encontrado', 404);
      }
      
      const user = JSON.parse(userData);
      
      // Atualizar senha
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      user.updatedAt = new Date().toISOString();
      
      // Salvar usuário atualizado
      localStorage.setItem(`user_${decoded.email}`, JSON.stringify(user));
      
      // Remover token usado
      localStorage.removeItem(`reset_token_${decoded.email}`);
      
      // Enviar email de confirmação
      await emailService.sendEmail({
        to: decoded.email,
        template: 'notification',
        data: {
          title: 'Senha alterada com sucesso',
          message: `Olá ${user.name},

Sua senha foi alterada com sucesso. Se você não fez essa alteração, entre em contato conosco imediatamente.`
        }
      });
      
      return createApiResponse({}, 'Senha alterada com sucesso');
      
    } catch (error: any) {
      return createApiError('RESET_PASSWORD_ERROR', error.message || 'Erro ao resetar senha', 500);
    }
  },
  
  // Logout
  async logout(params: any, body: any): Promise<ApiResponse> {
    try {
      // Em uma API real, invalidaríamos o token no servidor
      // Por enquanto, apenas retornar sucesso
      // authService.logout(accessToken, refreshToken);
      
      return createApiResponse({}, 'Logout realizado com sucesso');
      
    } catch (error: any) {
      return createApiError('LOGOUT_ERROR', error.message || 'Erro ao fazer logout', 500);
    }
  },
  
  // Obter perfil do usuário atual
  async getProfile(params: any, body: any, headers: any): Promise<ApiResponse> {
    try {
      // Em produção, decodificar o token para obter o usuário
      // Por enquanto, retornar erro de não implementado
      return createApiError('NOT_IMPLEMENTED', 'Endpoint não implementado', 501);
      
    } catch (error: any) {
      return createApiError('PROFILE_ERROR', error.message || 'Erro ao buscar perfil', 500);
    }
  },
  
  // Atualizar perfil
  async updateProfile(params: any, body: any, headers: any): Promise<ApiResponse> {
    try {
      // Em produção, decodificar o token para obter o usuário
      // Por enquanto, retornar erro de não implementado
      return createApiError('NOT_IMPLEMENTED', 'Endpoint não implementado', 501);
      
    } catch (error: any) {
      return createApiError('UPDATE_PROFILE_ERROR', error.message || 'Erro ao atualizar perfil', 500);
    }
  }
};