import { studentService } from '../student.service';
import { storageService } from '../storage.service';
import { UserRole } from '../../types';

jest.mock('../storage.service');

describe('StudentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storageService.getItem as jest.Mock).mockReturnValue(null);
    (storageService.setItem as jest.Mock).mockImplementation(() => {});
  });

  describe('createStudent', () => {
    it('should create a new student', () => {
      const studentData = {
        name: 'Test Student',
        email: 'student@test.com',
        phoneNumber: '11999999999',
        isActive: true,
        notes: 'Test notes'
      };

      const student = studentService.createStudent(studentData, {
        id: 'admin1',
        name: 'Admin',
        email: 'admin@test.com',
        role: UserRole.ADMIN
      });

      expect(student).toBeDefined();
      expect(student.name).toBe('Test Student');
      expect(student.email).toBe('student@test.com');
      expect(student.role).toBe(UserRole.ALUNA);
      expect(student.tags).toEqual([]);
      expect(storageService.setItem).toHaveBeenCalledWith('students', expect.any(String));
    });
  });

  describe('updateStudent', () => {
    it('should update student data', () => {
      const existingStudent = {
        id: '1',
        name: 'Original Name',
        email: 'student@test.com',
        isActive: true
      };

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([existingStudent])
      );

      const updated = studentService.updateStudent('1', {
        name: 'Updated Name',
        isActive: false
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.isActive).toBe(false);
      expect(updated?.email).toBe('student@test.com');
    });
  });

  describe('addTagToStudent', () => {
    it('should add tag to student', () => {
      const student = {
        id: '1',
        name: 'Test Student',
        tags: []
      };

      const tag = {
        id: 'tag1',
        name: 'Test Tag',
        slug: 'test-tag',
        color: '#B8654B',
        accessLevel: 'basic' as const,
        isActive: true
      };

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([student])
      );

      const updated = studentService.addTagToStudent('1', tag, {
        id: 'admin1',
        name: 'Admin',
        email: 'admin@test.com',
        role: UserRole.ADMIN
      });

      expect(updated).toBeDefined();
      expect(updated?.tags).toHaveLength(1);
      expect(updated?.tags[0].productTag.id).toBe('tag1');
      expect(updated?.tags[0].source).toBe('manual');
    });

    it('should not add duplicate tag', () => {
      const tag = {
        id: 'tag1',
        name: 'Test Tag',
        slug: 'test-tag',
        color: '#B8654B',
        accessLevel: 'basic' as const,
        isActive: true
      };

      const student = {
        id: '1',
        name: 'Test Student',
        tags: [{
          productTag: tag,
          appliedAt: new Date().toISOString(),
          source: 'manual' as const
        }]
      };

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([student])
      );

      const updated = studentService.addTagToStudent('1', tag, {
        id: 'admin1',
        name: 'Admin',
        email: 'admin@test.com',
        role: UserRole.ADMIN
      });

      expect(updated?.tags).toHaveLength(1);
    });
  });

  describe('removeTagFromStudent', () => {
    it('should remove tag from student', () => {
      const student = {
        id: '1',
        name: 'Test Student',
        tags: [{
          productTag: { id: 'tag1', name: 'Tag 1' },
          appliedAt: new Date().toISOString(),
          source: 'manual'
        }]
      };

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([student])
      );

      const updated = studentService.removeTagFromStudent('1', 'tag1');

      expect(updated).toBeDefined();
      expect(updated?.tags).toHaveLength(0);
    });
  });

  describe('getFilteredStudents', () => {
    it('should filter students by search term', () => {
      const students = [
        { id: '1', name: 'John Doe', email: 'john@test.com', isActive: true },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com', isActive: true },
        { id: '3', name: 'Bob Johnson', email: 'bob@test.com', isActive: false }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(students)
      );

      const results = studentService.getFilteredStudents({
        search: 'john'
      });

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('3');
    });

    it('should filter students by active status', () => {
      const students = [
        { id: '1', name: 'John', isActive: true },
        { id: '2', name: 'Jane', isActive: true },
        { id: '3', name: 'Bob', isActive: false }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(students)
      );

      const results = studentService.getFilteredStudents({
        isActive: true
      });

      expect(results).toHaveLength(2);
      expect(results.every(s => s.isActive)).toBe(true);
    });

    it('should filter students by tags', () => {
      const students = [
        { 
          id: '1', 
          name: 'John',
          tags: [{ productTag: { id: 'tag1' } }]
        },
        { 
          id: '2', 
          name: 'Jane',
          tags: [{ productTag: { id: 'tag2' } }]
        },
        { 
          id: '3', 
          name: 'Bob',
          tags: [{ productTag: { id: 'tag1' } }, { productTag: { id: 'tag2' } }]
        }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(students)
      );

      const results = studentService.getFilteredStudents({
        tags: ['tag1']
      });

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('3');
    });
  });

  describe('getStatistics', () => {
    it('should calculate student statistics', () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const students = [
        { id: '1', isActive: true, createdAt: now.toISOString() },
        { id: '2', isActive: true, createdAt: lastMonth.toISOString() },
        { id: '3', isActive: false, createdAt: lastMonth.toISOString() },
        { id: '4', isActive: true, createdAt: now.toISOString() }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(students)
      );

      const stats = studentService.getStatistics();

      expect(stats.totalStudents).toBe(4);
      expect(stats.activeStudents).toBe(3);
      expect(stats.inactiveStudents).toBe(1);
      expect(stats.newThisMonth).toBe(2);
    });
  });
});