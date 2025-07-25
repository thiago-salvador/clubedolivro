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
  // TEMPORÁRIO: Permitir acesso direto ao admin sem autenticação
  // TODO: Implementar autenticação apropriada para produção
  return <>{children}</>;
};

export default AdminProtectedRoute;