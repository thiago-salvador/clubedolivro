export enum PostCategory {
  REFLEXAO = 'reflexao',
  DUVIDA = 'duvida',
  INSIGHT = 'insight',
  EXERCICIO = 'exercicio',
  DESAFIO = 'desafio',
  GERAL = 'geral',
  CITACAO = 'citacao',
  CELEBRACAO = 'celebracao'
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  ALUNA = 'aluna'
}

export interface CategoryConfig {
  id: PostCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  badges: Badge[];
  joinedDate: Date;
  previousParticipations?: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: Date;
  importedFrom?: string;
}

export interface Post {
  id: string;
  author: User;
  category: PostCategory;
  weekNumber: number;
  content: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isPinned: boolean;
  createdAt: Date;
  reactions?: {
    [emoji: string]: string[]; // emoji -> array of user IDs
  };
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface Module {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  videoUrl?: string;
  readingMaterial?: string;
  playlistUrl?: string;
  meditationUrl?: string;
  exercise?: string;
}

export interface CommunityAccess {
  startDate: Date;
  endDate: Date;
  status: 'active' | 'readonly';
  canComment: boolean;
  canPost: boolean;
}