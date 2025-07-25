import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { authService } from '../../services/auth.service';

// Mock do serviço de autenticação
jest.mock('../../services/auth.service');

describe('Admin Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should complete full admin login flow', async () => {
    // Mock successful login
    (authService.login as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Admin User',
      email: 'admin@clubedolivro.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue({
      id: '1',
      name: 'Admin User',
      email: 'admin@clubedolivro.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    (authService.isAdmin as jest.Mock).mockReturnValue(true);

    // Render app
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to login
    const loginLink = screen.getByText(/Entrar/i);
    fireEvent.click(loginLink);

    // Wait for login page to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/E-mail/i)).toBeInTheDocument();
    });

    // Fill login form
    const emailInput = screen.getByPlaceholderText(/E-mail/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'admin@clubedolivro.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);

    // Wait for redirect to admin dashboard
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'admin@clubedolivro.com',
        password: 'admin123'
      });
    });
  });

  it('should deny access to admin panel for non-admin users', async () => {
    // Mock non-admin user
    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue({
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'ALUNA',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    (authService.isAdmin as jest.Mock).mockReturnValue(false);

    render(
      <BrowserRouter initialEntries={['/admin']}>
        <App />
      </BrowserRouter>
    );

    // Should redirect or show access denied
    await waitFor(() => {
      expect(screen.queryByText(/Dashboard Administrativo/i)).not.toBeInTheDocument();
    });
  });

  it('should handle logout flow correctly', async () => {
    // Mock admin user logged in
    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue({
      id: '1',
      name: 'Admin User',
      email: 'admin@clubedolivro.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    (authService.isAdmin as jest.Mock).mockReturnValue(true);
    (authService.logout as jest.Mock).mockImplementation(() => {
      (authService.getAuthenticatedUser as jest.Mock).mockReturnValue(null);
      (authService.isAdmin as jest.Mock).mockReturnValue(false);
    });

    render(
      <BrowserRouter initialEntries={['/admin']}>
        <App />
      </BrowserRouter>
    );

    // Wait for admin dashboard to load
    await waitFor(() => {
      const logoutButton = screen.getByText(/Logout/i);
      expect(logoutButton).toBeInTheDocument();
    });

    // Click logout
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    // Should call logout service
    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  it('should persist login state across page reloads', async () => {
    const adminUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@clubedolivro.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate stored user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(adminUser));

    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue(adminUser);
    (authService.isAdmin as jest.Mock).mockReturnValue(true);

    render(
      <BrowserRouter initialEntries={['/admin']}>
        <App />
      </BrowserRouter>
    );

    // Should have access to admin panel without logging in
    await waitFor(() => {
      expect(screen.getByText(/Dashboard Administrativo/i)).toBeInTheDocument();
    });
  });
});