import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';

const mockUser = {
  id: '1',
  name: 'Admin Test',
  email: 'admin@test.com',
  role: 'ADMIN' as const,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
  isAuthenticated: true
};

const mockThemeContext = {
  isDark: false,
  toggleTheme: jest.fn()
};

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={mockAuthContext}>
        <ThemeContext.Provider value={mockThemeContext}>
          {ui}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('AdminLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the layout with children', () => {
    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays user information in header', () => {
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    expect(screen.getByText('Admin Test')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('toggles sidebar when menu button is clicked', () => {
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    const sidebar = screen.getByRole('navigation');
    
    // Initially sidebar should be visible on desktop
    expect(sidebar).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass('w-16');
    
    // Click to expand
    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass('w-64');
  });

  it('renders all menu categories', () => {
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Alunas')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('expands/collapses menu categories', () => {
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    const cursosCategory = screen.getByText('Cursos').closest('button');
    
    // Initially expanded
    expect(screen.getByText('Todos os Cursos')).toBeVisible();
    
    // Click to collapse
    fireEvent.click(cursosCategory!);
    expect(screen.queryByText('Todos os Cursos')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(cursosCategory!);
    expect(screen.getByText('Todos os Cursos')).toBeVisible();
  });

  it('highlights active menu item based on current route', () => {
    renderWithProviders(
      <AdminLayout><div>Test</div></AdminLayout>,
      { route: '/admin/courses' }
    );
    
    const activeItem = screen.getByText('Todos os Cursos').closest('a');
    expect(activeItem).toHaveClass('bg-terracota/10');
  });

  it('calls logout when logout button is clicked', async () => {
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockAuthContext.logout).toHaveBeenCalled();
    });
  });

  it('toggles theme when theme button is clicked', () => {
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    const themeButton = screen.getByLabelText('Toggle theme');
    fireEvent.click(themeButton);
    
    expect(mockThemeContext.toggleTheme).toHaveBeenCalled();
  });

  it('shows super admin menu items for super admin users', () => {
    const superAdminContext = {
      ...mockAuthContext,
      user: { ...mockUser, role: 'SUPER_ADMIN' as const }
    };
    
    render(
      <MemoryRouter>
        <AuthContext.Provider value={superAdminContext}>
          <ThemeContext.Provider value={mockThemeContext}>
            <AdminLayout><div>Test</div></AdminLayout>
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    
    expect(screen.getByText('SUPER_ADMIN')).toBeInTheDocument();
  });

  it('handles mobile menu correctly', () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    
    renderWithProviders(<AdminLayout><div>Test</div></AdminLayout>);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    const sidebar = screen.getByRole('navigation');
    
    // Sidebar should be hidden on mobile by default
    expect(sidebar).toHaveClass('-translate-x-full');
    
    // Click to show
    fireEvent.click(menuButton);
    expect(sidebar).not.toHaveClass('-translate-x-full');
  });
});