import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentTagEditor from '../admin/StudentTagEditor';
import { studentService } from '../../services/student.service';
import { tagService } from '../../services/tag.service';

// Mock services
jest.mock('../../services/student.service');
jest.mock('../../services/tag.service');

const mockStudent = {
  id: '1',
  name: 'Test Student',
  email: 'student@test.com',
  role: 'ALUNA' as const,
  tags: [
    { tagId: 'tag1', assignedAt: new Date(), assignedBy: 'admin1' }
  ],
  lastActivity: new Date(),
  coursesEnrolled: [],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockTags = [
  {
    id: 'tag1',
    name: 'Relacionamentos',
    slug: 'relacionamentos',
    accessLevel: 'BASIC' as const,
    color: '#B8654B',
    isActive: true,
    studentCount: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tag2',
    name: 'Autoconhecimento',
    slug: 'autoconhecimento',
    accessLevel: 'PREMIUM' as const,
    color: '#7C9885',
    isActive: true,
    studentCount: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockUser = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'ADMIN' as const
};

describe('StudentTagEditor', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    student: mockStudent,
    currentUser: mockUser,
    onTagsUpdated: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);
    (studentService.addTagToStudent as jest.Mock).mockResolvedValue(true);
    (studentService.removeTagFromStudent as jest.Mock).mockResolvedValue(true);
  });

  it('renders the modal with student name', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Editar Tags de Test Student')).toBeInTheDocument();
    });
  });

  it('loads and displays available tags', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Relacionamentos')).toBeInTheDocument();
      expect(screen.getByText('Autoconhecimento')).toBeInTheDocument();
    });
  });

  it('shows current tags as selected', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      const relacionamentosTag = screen.getByText('Relacionamentos').closest('button');
      expect(relacionamentosTag).toHaveClass('ring-2', 'ring-green-500');
    });
  });

  it('handles tag selection toggle', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      const autoconhecimentoTag = screen.getByText('Autoconhecimento').closest('button');
      fireEvent.click(autoconhecimentoTag!);
    });

    const autoconhecimentoTag = screen.getByText('Autoconhecimento').closest('button');
    expect(autoconhecimentoTag).toHaveClass('ring-2', 'ring-green-500');
  });

  it('handles tag deselection toggle', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      const relacionamentosTag = screen.getByText('Relacionamentos').closest('button');
      fireEvent.click(relacionamentosTag!);
    });

    const relacionamentosTag = screen.getByText('Relacionamentos').closest('button');
    expect(relacionamentosTag).toHaveClass('ring-2', 'ring-red-500');
  });

  it('saves changes correctly', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByText('Autoconhecimento')).toBeInTheDocument();
    });

    // Select a new tag
    const autoconhecimentoTag = screen.getByText('Autoconhecimento').closest('button');
    fireEvent.click(autoconhecimentoTag!);

    // Click save
    const saveButton = screen.getByText('Salvar Alterações');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(studentService.addTagToStudent).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          tagId: 'tag2',
          assignedBy: 'admin1'
        })
      );
      expect(defaultProps.onTagsUpdated).toHaveBeenCalled();
    });
  });

  it('removes tags correctly', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      const relacionamentosTag = screen.getByText('Relacionamentos').closest('button');
      fireEvent.click(relacionamentosTag!);
    });

    const saveButton = screen.getByText('Salvar Alterações');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(studentService.removeTagFromStudent).toHaveBeenCalledWith('1', 'tag1');
    });
  });

  it('closes modal when cancel is clicked', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('displays preview of changes', async () => {
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      // Add a tag
      const autoconhecimentoTag = screen.getByText('Autoconhecimento').closest('button');
      fireEvent.click(autoconhecimentoTag!);
      
      // Remove a tag
      const relacionamentosTag = screen.getByText('Relacionamentos').closest('button');
      fireEvent.click(relacionamentosTag!);
    });

    expect(screen.getByText('Autoconhecimento').closest('.bg-green-50')).toBeInTheDocument();
    expect(screen.getByText('Relacionamentos').closest('.bg-red-50')).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    (studentService.addTagToStudent as jest.Mock).mockRejectedValue(new Error('Failed to add tag'));
    
    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      const autoconhecimentoTag = screen.getByText('Autoconhecimento').closest('button');
      fireEvent.click(autoconhecimentoTag!);
    });

    const saveButton = screen.getByText('Salvar Alterações');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar tags')).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching tags', () => {
    (tagService.getAllTags as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockTags), 100))
    );

    render(<StudentTagEditor {...defaultProps} />);

    expect(screen.getByText('Carregando tags disponíveis...')).toBeInTheDocument();
  });

  it('displays empty state when no tags available', async () => {
    (tagService.getAllTags as jest.Mock).mockResolvedValue([]);

    render(<StudentTagEditor {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma tag disponível')).toBeInTheDocument();
    });
  });
});