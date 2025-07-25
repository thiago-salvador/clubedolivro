import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminProtectedRoute } from '../auth/AdminProtectedRoute';
import { AuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AdminProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;
  const renderWithAuth = (user: any) => {
    return render(
      <AuthContext.Provider value={{ user, login: jest.fn(), logout: jest.fn() }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AdminProtectedRoute>
                <TestComponent />
              </AdminProtectedRoute>
            } />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render protected content for admin user', () => {
    const adminUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: UserRole.ADMIN
    };

    renderWithAuth(adminUser);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render protected content for super admin user', () => {
    const superAdminUser = {
      id: '1',
      name: 'Super Admin',
      email: 'super@test.com',
      role: UserRole.SUPER_ADMIN
    };

    renderWithAuth(superAdminUser);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect non-admin users to login', () => {
    const regularUser = {
      id: '1',
      name: 'Student',
      email: 'student@test.com',
      role: UserRole.ALUNA
    };

    renderWithAuth(regularUser);

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should redirect when no user is logged in', () => {
    renderWithAuth(null);

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should respect minRole prop', () => {
    const adminUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: UserRole.ADMIN
    };

    const { rerender } = render(
      <AuthContext.Provider value={{ user: adminUser, login: jest.fn(), logout: jest.fn() }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AdminProtectedRoute minRole={UserRole.SUPER_ADMIN}>
                <TestComponent />
              </AdminProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should use custom fallback path', () => {
    renderWithAuth(null);

    render(
      <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn() }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AdminProtectedRoute fallbackPath="/unauthorized">
                <TestComponent />
              </AdminProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
  });
});