import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const useAdminAuth = () => {
  const { user, isAuthenticated } = useAuth();

  const isAdmin = () => {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  };

  const isSuperAdmin = () => {
    return user?.role === UserRole.SUPER_ADMIN;
  };

  const hasRole = (requiredRole: UserRole) => {
    if (!user) return false;
    
    // Super admin tem acesso a tudo
    if (user.role === UserRole.SUPER_ADMIN) return true;
    
    // Admin pode acessar funções de admin e aluna
    if (user.role === UserRole.ADMIN && (requiredRole === UserRole.ADMIN || requiredRole === UserRole.ALUNA)) {
      return true;
    }
    
    // Aluna só pode acessar funções de aluna
    return user.role === requiredRole;
  };

  const canAccess = (minRole: UserRole = UserRole.ALUNA) => {
    if (!isAuthenticated || !user) return false;
    
    return hasRole(minRole);
  };

  return {
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    hasRole,
    canAccess,
    userRole: user?.role
  };
};