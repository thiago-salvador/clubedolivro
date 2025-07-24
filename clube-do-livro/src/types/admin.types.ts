import { User, UserRole } from './index';

// Course-related enums
export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum ContentType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  EXERCISE = 'exercise',
  MEETING = 'meeting'
}

export enum CourseAccessLevel {
  FREE = 'free',
  PREMIUM = 'premium',
  VIP = 'vip'
}

// Course interface
export interface Course {
  id: string;
  name: string;
  description: string;
  status: CourseStatus;
  accessLevel: CourseAccessLevel;
  startDate: Date;
  endDate?: Date;
  maxStudents?: number;
  currentStudentCount: number;
  instructor: User;
  tags: ProductTag[];
  coverImage?: string;
  backgroundColor?: string;
  textColor?: string;
  chapters: CourseChapter[];
  debateChannels: DebateChannel[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  lastModifiedBy: User;
}

// Course content structure
export interface CourseChapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  weekNumber: number;
  orderIndex: number;
  isLocked: boolean;
  unlockDate?: Date;
  content: CourseContent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseContent {
  id: string;
  chapterId: string;
  type: ContentType;
  title: string;
  description?: string;
  orderIndex: number;
  
  // Content URLs
  videoUrl?: string;
  audioUrl?: string;
  playlistUrl?: string;
  meditationUrl?: string;
  
  // Text content
  textContent?: string;
  readingMaterial?: string;
  
  // Exercise content
  exerciseInstructions?: string;
  exerciseQuestions?: ExerciseQuestion[];
  
  // Meeting content
  meetingType?: 'live' | 'recorded';
  meetingUrl?: string;
  scheduledDate?: Date;
  duration?: number; // in minutes
  
  // Metadata
  isRequired: boolean;
  estimatedDuration?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple_choice' | 'scale' | 'reflection';
  options?: string[]; // for multiple choice
  scaleMin?: number; // for scale questions
  scaleMax?: number; // for scale questions
  isRequired: boolean;
  orderIndex: number;
}

// Product and User tagging
export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  hotmartProductId?: string; // Integration with Hotmart
  accessLevel: CourseAccessLevel;
  validityDays?: number; // How many days access lasts
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTag {
  id: string;
  userId: string;
  tagId: string;
  tag: ProductTag;
  assignedAt: Date;
  expiresAt?: Date;
  assignedBy: User;
  isActive: boolean;
  source: 'manual' | 'hotmart' | 'promotion' | 'migration';
  sourceReference?: string; // Transaction ID, promotion code, etc.
}

// Debate channels
export interface DebateChannel {
  id: string;
  courseId?: string; // Optional - some channels might be global
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  orderIndex: number;
  
  // Access control
  requiredTags: ProductTag[];
  minimumRole: UserRole;
  isActive: boolean;
  
  // Moderation settings
  rules?: string;
  bannedWords?: string[];
  requireModeration: boolean;
  allowFiles: boolean;
  allowImages: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  lastModifiedBy: User;
}

// Admin dashboard data
export interface AdminDashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  activeCourses: number;
  totalPosts: number;
  postsThisWeek: number;
  recentRegistrations: User[];
  topCourses: CourseStats[];
}

export interface CourseStats {
  course: Course;
  studentCount: number;
  completionRate: number;
  engagementScore: number;
  lastActivity: Date;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Form types for admin operations
export interface CreateCourseRequest {
  name: string;
  description: string;
  accessLevel: CourseAccessLevel;
  startDate: Date;
  endDate?: Date;
  maxStudents?: number;
  tagIds: string[];
  coverImage?: File;
  backgroundColor?: string;
  textColor?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string;
  status?: CourseStatus;
}

export interface CreateUserTagRequest {
  userId: string;
  tagId: string;
  expiresAt?: Date;
  source: UserTag['source'];
  sourceReference?: string;
}

export interface CreateDebateChannelRequest {
  courseId?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredTagIds: string[];
  minimumRole: UserRole;
  rules?: string;
  bannedWords?: string[];
  requireModeration: boolean;
  allowFiles: boolean;
  allowImages: boolean;
}

// Filter and search types
export interface StudentFilters {
  search?: string;
  tagIds?: string[];
  roles?: UserRole[];
  isActive?: boolean;
  registeredAfter?: Date;
  registeredBefore?: Date;
}

export interface CourseFilters {
  search?: string;
  status?: CourseStatus[];
  accessLevel?: CourseAccessLevel[];
  instructorId?: string;
  tagIds?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}