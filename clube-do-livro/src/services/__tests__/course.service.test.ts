import { courseService } from '../course.service';
import { storageService } from '../storage.service';
import { CourseStatus, CourseAccessLevel } from '../../types/admin.types';

jest.mock('../storage.service');

describe('CourseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storageService.getItem as jest.Mock).mockReturnValue(null);
    (storageService.setItem as jest.Mock).mockImplementation(() => {});
  });

  describe('createCourse', () => {
    it('should create a new course successfully', () => {
      const courseData = {
        name: 'Test Course',
        description: 'Test Description',
        status: CourseStatus.DRAFT,
        accessLevel: CourseAccessLevel.BASIC,
        startDate: new Date().toISOString(),
        instructorName: 'Test Instructor',
        tags: ['tag1'],
        coverImage: 'image.jpg',
        primaryColor: '#B8654B',
        maxStudents: 50
      };

      const course = courseService.createCourse(courseData);

      expect(course).toBeDefined();
      expect(course.name).toBe('Test Course');
      expect(course.status).toBe(CourseStatus.DRAFT);
      expect(course.chapters).toEqual([]);
      expect(course.debateChannels).toEqual([]);
      expect(storageService.setItem).toHaveBeenCalledWith('courses', expect.any(String));
    });

    it('should validate required fields', () => {
      const invalidData = {
        name: '',
        description: 'Test',
        status: CourseStatus.DRAFT,
        accessLevel: CourseAccessLevel.BASIC
      };

      expect(() => courseService.createCourse(invalidData as any)).toThrow();
    });
  });

  describe('cloneCourse', () => {
    it('should clone an existing course', () => {
      const originalCourse = {
        id: '1',
        name: 'Original Course',
        description: 'Original Description',
        status: CourseStatus.ACTIVE,
        chapters: [{ id: 'ch1', title: 'Chapter 1' }],
        debateChannels: [{ id: 'dc1', name: 'Channel 1' }]
      };

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([originalCourse])
      );

      const clonedCourse = courseService.cloneCourse('1', 'Cloned Course');

      expect(clonedCourse).toBeDefined();
      expect(clonedCourse?.name).toBe('Cloned Course');
      expect(clonedCourse?.id).not.toBe('1');
      expect(clonedCourse?.status).toBe(CourseStatus.DRAFT);
      expect(clonedCourse?.chapters).toHaveLength(1);
      expect(clonedCourse?.chapters[0].id).not.toBe('ch1');
    });

    it('should return null for non-existent course', () => {
      (storageService.getItem as jest.Mock).mockReturnValueOnce('[]');

      const result = courseService.cloneCourse('999', 'Clone');

      expect(result).toBeNull();
    });
  });

  describe('updateCourse', () => {
    it('should update course data', () => {
      const existingCourse = {
        id: '1',
        name: 'Original Name',
        description: 'Original Description',
        status: CourseStatus.DRAFT
      };

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify([existingCourse])
      );

      const updated = courseService.updateCourse('1', {
        name: 'Updated Name',
        status: CourseStatus.ACTIVE
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.status).toBe(CourseStatus.ACTIVE);
      expect(updated?.description).toBe('Original Description');
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', () => {
      const courses = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(courses)
      );

      const result = courseService.deleteCourse('1');

      expect(result).toBe(true);
      expect(storageService.setItem).toHaveBeenCalledWith(
        'courses',
        JSON.stringify([{ id: '2', name: 'Course 2' }])
      );
    });
  });

  describe('searchCourses', () => {
    it('should search courses by name and description', () => {
      const courses = [
        { id: '1', name: 'React Course', description: 'Learn React' },
        { id: '2', name: 'Vue Course', description: 'Learn Vue' },
        { id: '3', name: 'Angular', description: 'React vs Angular' }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(courses)
      );

      const results = courseService.searchCourses('React');

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('3');
    });
  });

  describe('getStatistics', () => {
    it('should calculate course statistics', () => {
      const courses = [
        { id: '1', status: CourseStatus.ACTIVE, currentStudentCount: 10 },
        { id: '2', status: CourseStatus.ACTIVE, currentStudentCount: 20 },
        { id: '3', status: CourseStatus.DRAFT, currentStudentCount: 0 },
        { id: '4', status: CourseStatus.ARCHIVED, currentStudentCount: 5 }
      ];

      (storageService.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(courses)
      );

      const stats = courseService.getStatistics();

      expect(stats.totalCourses).toBe(4);
      expect(stats.activeCourses).toBe(2);
      expect(stats.draftCourses).toBe(1);
      expect(stats.archivedCourses).toBe(1);
      expect(stats.totalStudents).toBe(35);
    });
  });
});