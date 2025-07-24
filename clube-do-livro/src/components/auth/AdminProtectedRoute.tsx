import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { UserRole } from '../../types';
import PageLoader from '../ui/PageLoader';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  minRole?: UserRole;
  fallbackPath?: string;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  minRole = UserRole.ADMIN,
  fallbackPath = '/login'
}) => {
  // Always call hooks first (React hooks rule)
  const { isAuthenticated, canAccess } = useAdminAuth();
  
  // DESENVOLVIMENTO: Permitir acesso direto ao admin para testes locais
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // Durante desenvolvimento, sempre permitir acesso
    return <>{children}</>;
  }
  
  // Mostrar loading enquanto verifica autenticação
  if (isAuthenticated === undefined) {
    return <PageLoader />;
  }
  
  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Se não tem permissão para acessar, redirecionar para área da aluna
  if (!canAccess(minRole)) {
    return <Navigate to="/aluna" replace />;
  }
  
  // Se tem permissão, renderizar o conteúdo
  return <>{children}</>;
};

export default AdminProtectedRoute;