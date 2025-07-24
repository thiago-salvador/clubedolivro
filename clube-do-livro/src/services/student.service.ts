import { User, UserRole } from '../types';
import { UserTag, ProductTag, CourseAccessLevel } from '../types/admin.types';

export interface StudentWithTags extends User {
  tags: UserTag[];
  lastActivity?: Date;
  coursesEnrolled?: number;
  isActive: boolean;
  phoneNumber?: string;
  notes?: string;
}

export interface StudentFilters {
  search?: string;
  tags?: string[];
  status?: 'active' | 'inactive' | 'all';
  role?: UserRole;
  sortBy?: 'name' | 'email' | 'joinedDate' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  byTag: Record<string, number>;
  newThisMonth: number;
}

class StudentService {
  private static instance: StudentService;
  private students: StudentWithTags[] = [];
  private readonly STORAGE_KEY = 'clube_do_livro_students';

  private constructor() {
    this.loadStudents();
  }

  static getInstance(): StudentService {
    if (!StudentService.instance) {
      StudentService.instance = new StudentService();
    }
    return StudentService.instance;
  }

  private loadStudents(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.students = parsed.map((s: any) => ({
        ...s,
        joinedDate: new Date(s.joinedDate),
        lastActivity: s.lastActivity ? new Date(s.lastActivity) : undefined,
        tags: s.tags?.map((t: any) => ({
          ...t,
          assignedAt: new Date(t.assignedAt),
          expiresAt: t.expiresAt ? new Date(t.expiresAt) : undefined
        })) || []
      }));
    } else {
      // Create mock data
      this.students = this.generateMockStudents();
      this.saveStudents();
    }
  }

  private saveStudents(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.students));
  }

  private generateMockStudents(): StudentWithTags[] {
    const mockTags: ProductTag[] = [
      { 
        id: 'tag-1', 
        name: 'Relacionamentos', 
        slug: 'relacionamentos',
        hotmartProductId: 'PROD123', 
        accessLevel: CourseAccessLevel.PREMIUM, 
        color: '#B8654B',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'tag-2', 
        name: 'Autoconhecimento', 
        slug: 'autoconhecimento',
        hotmartProductId: 'PROD124', 
        accessLevel: CourseAccessLevel.FREE, 
        color: '#7C9885',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'tag-3', 
        name: 'Ansiedade', 
        slug: 'ansiedade',
        hotmartProductId: 'PROD125', 
        accessLevel: CourseAccessLevel.PREMIUM, 
        color: '#6B8E23',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'tag-4', 
        name: 'Depressão', 
        slug: 'depressao',
        hotmartProductId: 'PROD126', 
        accessLevel: CourseAccessLevel.VIP, 
        color: '#DAA520',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'tag-5', 
        name: 'Carreira', 
        slug: 'carreira',
        hotmartProductId: 'PROD127', 
        accessLevel: CourseAccessLevel.FREE, 
        color: '#4D381B',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const names = [
      'Ana Silva', 'Maria Santos', 'Juliana Costa', 'Patricia Oliveira', 'Fernanda Lima',
      'Camila Rodrigues', 'Amanda Souza', 'Beatriz Alves', 'Larissa Pereira', 'Carolina Martins',
      'Gabriela Ferreira', 'Isabela Gomes', 'Natalia Ribeiro', 'Mariana Castro', 'Leticia Barbosa',
      'Rafaela Cardoso', 'Vanessa Correia', 'Bruna Dias', 'Jessica Rocha', 'Aline Nascimento'
    ];

    return names.map((name, index) => {
      const joinedDate = new Date();
      joinedDate.setDate(joinedDate.getDate() - Math.floor(Math.random() * 365));
      
      const lastActivity = new Date();
      lastActivity.setDate(lastActivity.getDate() - Math.floor(Math.random() * 30));

      // Assign random tags
      const numTags = Math.floor(Math.random() * 3) + 1;
      const assignedTags: UserTag[] = [];
      const selectedTagIndices = new Set<number>();
      
      while (selectedTagIndices.size < numTags) {
        selectedTagIndices.add(Math.floor(Math.random() * mockTags.length));
      }

      Array.from(selectedTagIndices).forEach(tagIndex => {
        const tag = mockTags[tagIndex];
        const assignedAt = new Date(joinedDate);
        assignedAt.setDate(assignedAt.getDate() + Math.floor(Math.random() * 30));
        
        assignedTags.push({
          id: `usertag-${index}-${tagIndex}`,
          userId: `student-${index + 1}`,
          tagId: tag.id,
          tag,
          assignedAt,
          assignedBy: {
            id: 'system',
            name: 'Sistema',
            email: 'system@clubedolivronodiva.com.br',
            role: UserRole.SUPER_ADMIN,
            badges: [],
            joinedDate: new Date()
          },
          isActive: true,
          source: Math.random() > 0.5 ? 'hotmart' : 'manual'
        });
      });

      return {
        id: `student-${index + 1}`,
        name,
        email: name.toLowerCase().replace(' ', '.') + '@email.com',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=B8654B&color=fff`,
        role: UserRole.ALUNA,
        badges: [],
        joinedDate,
        tags: assignedTags,
        lastActivity,
        coursesEnrolled: Math.floor(Math.random() * 5) + 1,
        isActive: Math.random() > 0.2,
        phoneNumber: `11 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        notes: index % 3 === 0 ? 'Aluna muito participativa nas discussões' : undefined
      };
    });
  }

  // CRUD Operations
  getAllStudents(): StudentWithTags[] {
    return [...this.students];
  }

  getStudentById(id: string): StudentWithTags | undefined {
    return this.students.find(s => s.id === id);
  }

  getStudentsByFilter(filters: StudentFilters): StudentWithTags[] {
    let filtered = [...this.students];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.phoneNumber?.includes(search)
      );
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(s => 
        filters.tags!.some(tagId => 
          s.tags.some(ut => ut.tag.id === tagId)
        )
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(s => 
        filters.status === 'active' ? s.isActive : !s.isActive
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(s => s.role === filters.role);
    }

    // Sorting
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';
    
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'joinedDate':
          aVal = a.joinedDate.getTime();
          bVal = b.joinedDate.getTime();
          break;
        case 'lastActivity':
          aVal = a.lastActivity?.getTime() || 0;
          bVal = b.lastActivity?.getTime() || 0;
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }

  createStudent(studentData: Omit<StudentWithTags, 'id'>): StudentWithTags {
    const newStudent: StudentWithTags = {
      ...studentData,
      id: `student-${Date.now()}`
    };
    
    this.students.push(newStudent);
    this.saveStudents();
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<StudentWithTags>): StudentWithTags | undefined {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    this.students[index] = {
      ...this.students[index],
      ...updates,
      id // Ensure ID doesn't change
    };
    
    this.saveStudents();
    return this.students[index];
  }

  deleteStudent(id: string): boolean {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.students.splice(index, 1);
    this.saveStudents();
    return true;
  }

  // Tag Management
  addTagToStudent(studentId: string, tag: ProductTag, assignedBy: User): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return false;

    const existingTag = student.tags.find(ut => ut.tag.id === tag.id);
    if (existingTag) return false;

    student.tags.push({
      id: `usertag-${studentId}-${tag.id}`,
      userId: studentId,
      tagId: tag.id,
      tag,
      assignedAt: new Date(),
      assignedBy,
      isActive: true,
      source: 'manual'
    });

    this.saveStudents();
    return true;
  }

  removeTagFromStudent(studentId: string, tagId: string): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return false;

    const initialLength = student.tags.length;
    student.tags = student.tags.filter(ut => ut.tag.id !== tagId);
    
    if (student.tags.length < initialLength) {
      this.saveStudents();
      return true;
    }
    return false;
  }

  // Bulk Operations
  bulkUpdateStatus(studentIds: string[], isActive: boolean): number {
    let updated = 0;
    
    studentIds.forEach(id => {
      const student = this.students.find(s => s.id === id);
      if (student) {
        student.isActive = isActive;
        updated++;
      }
    });
    
    if (updated > 0) {
      this.saveStudents();
    }
    return updated;
  }

  bulkAddTag(studentIds: string[], tag: ProductTag, assignedBy: User): number {
    let updated = 0;
    
    studentIds.forEach(id => {
      if (this.addTagToStudent(id, tag, assignedBy)) {
        updated++;
      }
    });
    
    return updated;
  }

  bulkDelete(studentIds: string[]): number {
    const initialCount = this.students.length;
    this.students = this.students.filter(s => !studentIds.includes(s.id));
    const deleted = initialCount - this.students.length;
    
    if (deleted > 0) {
      this.saveStudents();
    }
    return deleted;
  }

  // Statistics
  getStats(): StudentStats {
    const stats: StudentStats = {
      total: this.students.length,
      active: this.students.filter(s => s.isActive).length,
      inactive: this.students.filter(s => !s.isActive).length,
      byRole: {},
      byTag: {},
      newThisMonth: 0
    };

    // Count by role
    this.students.forEach(s => {
      stats.byRole[s.role] = (stats.byRole[s.role] || 0) + 1;
    });

    // Count by tag
    this.students.forEach(s => {
      s.tags.forEach(ut => {
        stats.byTag[ut.tag.name] = (stats.byTag[ut.tag.name] || 0) + 1;
      });
    });

    // Count new this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    stats.newThisMonth = this.students.filter(s => 
      s.joinedDate >= thisMonth
    ).length;

    return stats;
  }

  // Password Reset
  resetPassword(studentId: string): string {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');

    // In a real app, this would send an email
    const resetToken = Math.random().toString(36).substring(2, 15);
    console.log(`Password reset token for ${student.email}: ${resetToken}`);
    
    // Update last activity
    student.lastActivity = new Date();
    this.saveStudents();
    
    return resetToken;
  }
}

export const studentService = StudentService.getInstance();