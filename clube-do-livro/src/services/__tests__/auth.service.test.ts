import { authService } from '../auth.service';
import { storageService } from '../storage.service';
import { emailService } from '../email.service';
import { UserRole } from '../../types';

// Mock dependencies
jest.mock('../storage.service');
jest.mock('../email.service');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storageService.getItem as jest.Mock).mockReturnValue(null);
    (storageService.setItem as jest.Mock).mockImplementation(() => {});
    (storageService.removeItem as jest.Mock).mockImplementation(() => {});
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const credentials = { email: 'admin@teste.com', password: 'admin123' };
      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('admin@teste.com');
      expect(result.user?.role).toBe(UserRole.ADMIN);
      expect(storageService.setItem).toHaveBeenCalledWith('currentUser', expect.any(Object));
    });

    it('should fail login with invalid credentials', async () => {
      const credentials = { email: 'invalid@test.com', password: 'wrong' };
      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email ou senha inválidos');
      expect(result.user).toBeUndefined();
      expect(storageService.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'new@test.com',
        password: 'password123',
        whatsapp: '11999999999'
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('new@test.com');
      expect(result.user?.role).toBe(UserRole.ALUNA);
      expect(storageService.setItem).toHaveBeenCalledWith('users', expect.any(String));
    });

    it('should fail to register with existing email', async () => {
      // Setup existing user
      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([{ id: '1', email: 'existing@test.com' }])
      );

      const userData = {
        name: 'Test User',
        email: 'existing@test.com',
        password: 'password123',
        whatsapp: '11999999999'
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email já cadastrado');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', () => {
      authService.logout();

      expect(storageService.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('requestPasswordReset', () => {
    it('should send password reset email for existing user', async () => {
      // Setup existing user
      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([{ id: '1', email: 'user@test.com' }])
      );

      const result = await authService.requestPasswordReset('user@test.com');

      expect(result.success).toBe(true);
      expect(result.message).toContain('enviadas para');
      expect(emailService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'user@test.com',
        template: 'password_reset'
      }));
    });

    it('should fail for non-existing user', async () => {
      (storageService.getItem as jest.Mock).mockReturnValueOnce('[]');

      const result = await authService.requestPasswordReset('nonexistent@test.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email não encontrado');
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      // Setup reset token
      (storageService.getItem as jest.Mock)
        .mockReturnValueOnce(JSON.stringify({
          'valid-token': {
            userId: '1',
            expiresAt: new Date(Date.now() + 3600000).toISOString()
          }
        }))
        .mockReturnValueOnce(JSON.stringify([{ id: '1', email: 'user@test.com', password: 'old' }]));

      const result = await authService.resetPassword('valid-token', 'newpassword123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Senha alterada com sucesso');
      expect(storageService.setItem).toHaveBeenCalled();
    });

    it('should fail with invalid token', async () => {
      (storageService.getItem as jest.Mock).mockReturnValueOnce('{}');

      const result = await authService.resetPassword('invalid-token', 'newpassword123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token inválido ou expirado');
    });
  });
});