import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { courseService } from '../../services/course.service';
import { authService } from '../../services/auth.service';
import { tagService } from '../../services/tag.service';
import { CourseStatus, CourseAccessLevel } from '../../types/admin.types';

// Mock services
jest.mock('../../services/course.service');
jest.mock('../../services/auth.service');
jest.mock('../../services/tag.service');

describe('Course Management Integration', () => {
  const mockAdminUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@clubedolivro.com',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCourses = [
    {
      id: '1',
      name: 'Mulheres que Correm com os Lobos',
      description: 'Curso sobre o livro clássico',
      status: CourseStatus.ACTIVE,
      accessLevel: CourseAccessLevel.PREMIUM,
      instructor: { id: '1', name: 'Instructor 1' },
      currentStudentCount: 25,
      maxStudents: 50,
      tags: ['autoconhecimento'],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      chapters: [],
      debateChannels: []
    }
  ];

  const mockTags = [
    {
      id: 'tag1',
      name: 'Autoconhecimento',
      slug: 'autoconhecimento',
      color: '#B8654B',
      accessLevel: CourseAccessLevel.BASIC,
      isActive: true,
      studentCount: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup auth mock
    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue(mockAdminUser);
    (authService.isAdmin as jest.Mock).mockReturnValue(true);
    
    // Setup course service mock
    (courseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);
    (courseService.getFilteredCourses as jest.Mock).mockResolvedValue(mockCourses);
    (courseService.getStatistics as jest.Mock).mockResolvedValue({
      total: 1,
      active: 1,
      draft: 0,
      archived: 0
    });
    
    // Setup tag service mock
    (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);
  });

  it('should display course list and navigate to course editor', async () => {
    render(
      <BrowserRouter initialEntries={['/admin/courses']}>
        <App />
      </BrowserRouter>
    );

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText('Mulheres que Correm com os Lobos')).toBeInTheDocument();
    });

    // Check course details are displayed
    expect(screen.getByText('25 / 50 alunas')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();

    // Click edit button
    const editButton = screen.getByLabelText('Editar curso');
    fireEvent.click(editButton);

    // Should navigate to course editor
    await waitFor(() => {
      expect(window.location.pathname).toContain('/admin/courses/1');
    });
  });

  it('should create a new course', async () => {
    const newCourse = {
      id: '2',
      name: 'Novo Curso',
      description: 'Descrição do novo curso',
      status: CourseStatus.DRAFT,
      accessLevel: CourseAccessLevel.BASIC,
      currentStudentCount: 0,
      maxStudents: 30,
      tags: ['autoconhecimento'],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      chapters: [],
      debateChannels: []
    };

    (courseService.createCourse as jest.Mock).mockResolvedValue(newCourse);

    render(
      <BrowserRouter initialEntries={['/admin/courses']}>
        <App />
      </BrowserRouter>
    );

    // Click new course button
    const newCourseButton = await screen.findByText('Novo Curso');
    fireEvent.click(newCourseButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Criar Novo Curso')).toBeInTheDocument();
    });

    // Fill form
    const nameInput = screen.getByLabelText('Nome do Curso');
    const descriptionInput = screen.getByLabelText('Descrição');
    
    fireEvent.change(nameInput, { target: { value: 'Novo Curso' } });
    fireEvent.change(descriptionInput, { target: { value: 'Descrição do novo curso' } });

    // Submit form
    const createButton = screen.getByRole('button', { name: 'Criar Curso' });
    fireEvent.click(createButton);

    // Should call create service
    await waitFor(() => {
      expect(courseService.createCourse).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Novo Curso',
          description: 'Descrição do novo curso'
        })
      );
    });
  });

  it('should filter courses by status', async () => {
    const activeCourses = [mockCourses[0]];
    const draftCourses = [
      {
        ...mockCourses[0],
        id: '2',
        name: 'Curso em Rascunho',
        status: CourseStatus.DRAFT
      }
    ];

    (courseService.getFilteredCourses as jest.Mock)
      .mockImplementation(({ status }) => {
        if (status === CourseStatus.ACTIVE) return Promise.resolve(activeCourses);
        if (status === CourseStatus.DRAFT) return Promise.resolve(draftCourses);
        return Promise.resolve([...activeCourses, ...draftCourses]);
      });

    render(
      <BrowserRouter initialEntries={['/admin/courses']}>
        <App />
      </BrowserRouter>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Filtros')).toBeInTheDocument();
    });

    // Open filters
    const filterButton = screen.getByText('Filtros');
    fireEvent.click(filterButton);

    // Select draft status
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: CourseStatus.DRAFT } });

    // Should filter courses
    await waitFor(() => {
      expect(courseService.getFilteredCourses).toHaveBeenCalledWith(
        expect.objectContaining({
          status: CourseStatus.DRAFT
        })
      );
    });
  });

  it('should delete a course with confirmation', async () => {
    (courseService.deleteCourse as jest.Mock).mockResolvedValue(true);
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(
      <BrowserRouter initialEntries={['/admin/courses']}>
        <App />
      </BrowserRouter>
    );

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText('Mulheres que Correm com os Lobos')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByLabelText('Excluir curso');
    fireEvent.click(deleteButton);

    // Should show confirmation
    expect(window.confirm).toHaveBeenCalledWith(
      'Tem certeza que deseja excluir o curso "Mulheres que Correm com os Lobos"?'
    );

    // Should call delete service
    await waitFor(() => {
      expect(courseService.deleteCourse).toHaveBeenCalledWith('1');
    });
  });

  it('should clone a course', async () => {
    const clonedCourse = {
      ...mockCourses[0],
      id: '3',
      name: 'Mulheres que Correm com os Lobos (Cópia)',
      status: CourseStatus.DRAFT
    };

    (courseService.cloneCourse as jest.Mock).mockResolvedValue(clonedCourse);

    render(
      <BrowserRouter initialEntries={['/admin/courses']}>
        <App />
      </BrowserRouter>
    );

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText('Mulheres que Correm com os Lobos')).toBeInTheDocument();
    });

    // Click clone button
    const cloneButton = screen.getByLabelText('Clonar curso');
    fireEvent.click(cloneButton);

    // Should call clone service
    await waitFor(() => {
      expect(courseService.cloneCourse).toHaveBeenCalledWith('1');
    });
  });
});