import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { studentService } from '../../services/student.service';
import { authService } from '../../services/auth.service';
import { tagService } from '../../services/tag.service';
import { emailService } from '../../services/email.service';

// Mock services
jest.mock('../../services/student.service');
jest.mock('../../services/auth.service');
jest.mock('../../services/tag.service');
jest.mock('../../services/email.service');

describe('Student Management Integration', () => {
  const mockAdminUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@clubedolivro.com',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockStudents = [
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      role: 'ALUNA' as const,
      tags: [
        {
          tagId: 'tag1',
          assignedAt: new Date(),
          assignedBy: 'admin1'
        }
      ],
      lastActivity: new Date(),
      coursesEnrolled: ['course1'],
      isActive: true,
      phoneNumber: '11999999999',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockTags = [
    {
      id: 'tag1',
      name: 'Relacionamentos',
      slug: 'relacionamentos',
      color: '#B8654B',
      isActive: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup auth mock
    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue(mockAdminUser);
    (authService.isAdmin as jest.Mock).mockReturnValue(true);
    
    // Setup student service mock
    (studentService.getAllStudents as jest.Mock).mockResolvedValue(mockStudents);
    (studentService.getFilteredStudents as jest.Mock).mockResolvedValue(mockStudents);
    (studentService.getStatistics as jest.Mock).mockResolvedValue({
      total: 1,
      active: 1,
      inactive: 0,
      newThisMonth: 1
    });
    
    // Setup tag service mock
    (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);
  });

  it('should display student list with filters', async () => {
    render(
      <BrowserRouter initialEntries={['/admin/students']}>
        <App />
      </BrowserRouter>
    );

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Check student details are displayed
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    expect(screen.getByText('Relacionamentos')).toBeInTheDocument();

    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou email...');
    fireEvent.change(searchInput, { target: { value: 'Maria' } });

    await waitFor(() => {
      expect(studentService.getFilteredStudents).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Maria'
        })
      );
    });
  });

  it('should navigate to student detail page', async () => {
    (studentService.getStudentById as jest.Mock).mockResolvedValue(mockStudents[0]);

    render(
      <BrowserRouter initialEntries={['/admin/students']}>
        <App />
      </BrowserRouter>
    );

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Click on view button
    const viewButton = screen.getByLabelText('Ver detalhes');
    fireEvent.click(viewButton);

    // Should navigate to student detail page
    await waitFor(() => {
      expect(window.location.pathname).toContain('/admin/students/1');
    });
  });

  it('should add a new student', async () => {
    const newStudent = {
      id: '2',
      name: 'João Santos',
      email: 'joao@example.com',
      role: 'ALUNA' as const,
      tags: [],
      lastActivity: new Date(),
      coursesEnrolled: [],
      isActive: true,
      phoneNumber: '11888888888',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (studentService.createStudent as jest.Mock).mockResolvedValue(newStudent);

    render(
      <BrowserRouter initialEntries={['/admin/students']}>
        <App />
      </BrowserRouter>
    );

    // Click new student button
    const newStudentButton = await screen.findByText('Nova Aluna');
    fireEvent.click(newStudentButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Adicionar Nova Aluna')).toBeInTheDocument();
    });

    // Fill form
    const nameInput = screen.getByLabelText('Nome Completo');
    const emailInput = screen.getByLabelText('E-mail');
    const phoneInput = screen.getByLabelText('Telefone (opcional)');
    
    fireEvent.change(nameInput, { target: { value: 'João Santos' } });
    fireEvent.change(emailInput, { target: { value: 'joao@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '11888888888' } });

    // Submit form
    const createButton = screen.getByRole('button', { name: 'Adicionar Aluna' });
    fireEvent.click(createButton);

    // Should call create service
    await waitFor(() => {
      expect(studentService.createStudent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'João Santos',
          email: 'joao@example.com',
          phoneNumber: '11888888888'
        })
      );
    });
  });

  it('should reset student password', async () => {
    (studentService.getStudentById as jest.Mock).mockResolvedValue(mockStudents[0]);
    (studentService.resetPassword as jest.Mock).mockResolvedValue({
      resetToken: 'token123',
      resetUrl: 'http://example.com/reset?token=token123'
    });
    (emailService.sendEmail as jest.Mock).mockResolvedValue(true);

    render(
      <BrowserRouter initialEntries={['/admin/students/1']}>
        <App />
      </BrowserRouter>
    );

    // Wait for student details to load
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Navigate to settings tab
    const settingsTab = screen.getByText('Configurações');
    fireEvent.click(settingsTab);

    // Click reset password button
    const resetButton = await screen.findByText('Resetar Senha');
    fireEvent.click(resetButton);

    // Should show reset password modal
    await waitFor(() => {
      expect(screen.getByText('Resetar Senha da Aluna')).toBeInTheDocument();
    });

    // Add custom message
    const messageInput = screen.getByPlaceholderText(/Mensagem personalizada/i);
    fireEvent.change(messageInput, { target: { value: 'Sua senha foi resetada por segurança.' } });

    // Confirm reset
    const confirmButton = screen.getByRole('button', { name: 'Enviar Email de Reset' });
    fireEvent.click(confirmButton);

    // Should call reset service and send email
    await waitFor(() => {
      expect(studentService.resetPassword).toHaveBeenCalledWith('1');
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'maria@example.com',
          template: 'password_reset'
        })
      );
    });
  });

  it('should perform bulk operations on students', async () => {
    const multipleStudents = [
      ...mockStudents,
      {
        ...mockStudents[0],
        id: '2',
        name: 'Ana Costa',
        email: 'ana@example.com'
      },
      {
        ...mockStudents[0],
        id: '3',
        name: 'Carlos Lima',
        email: 'carlos@example.com',
        isActive: false
      }
    ];

    (studentService.getAllStudents as jest.Mock).mockResolvedValue(multipleStudents);
    (studentService.getFilteredStudents as jest.Mock).mockResolvedValue(multipleStudents);
    (studentService.bulkUpdateStudents as jest.Mock).mockResolvedValue(true);

    render(
      <BrowserRouter initialEntries={['/admin/students']}>
        <App />
      </BrowserRouter>
    );

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getByText('Ana Costa')).toBeInTheDocument();
      expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
    });

    // Select multiple students
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Maria
    fireEvent.click(checkboxes[2]); // Ana

    // Should show bulk actions
    expect(screen.getByText('2 selecionadas')).toBeInTheDocument();

    // Click activate button
    const activateButton = screen.getByText('Ativar');
    fireEvent.click(activateButton);

    // Should call bulk update service
    await waitFor(() => {
      expect(studentService.bulkUpdateStudents).toHaveBeenCalledWith(
        ['1', '2'],
        { isActive: true }
      );
    });
  });

  it('should export students to CSV', async () => {
    // Mock CSV download
    const mockLink = document.createElement('a');
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    jest.spyOn(mockLink, 'click').mockImplementation();

    render(
      <BrowserRouter initialEntries={['/admin/students']}>
        <App />
      </BrowserRouter>
    );

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    });

    // Click export button
    const exportButton = screen.getByText('Exportar CSV');
    fireEvent.click(exportButton);

    // Should create and click download link
    await waitFor(() => {
      expect(mockLink.download).toContain('.csv');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});