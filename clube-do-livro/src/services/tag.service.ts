import { ProductTag, CourseAccessLevel } from '../types/admin.types';

export interface TagWithStats extends ProductTag {
  studentsCount: number;
  coursesCount: number;
}

export interface TagFilters {
  search?: string;
  accessLevel?: CourseAccessLevel;
  isActive?: boolean;
  sortBy?: 'name' | 'studentsCount' | 'coursesCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class TagService {
  private static instance: TagService;
  private tags: ProductTag[] = [];

  private constructor() {
    this.loadTags();
  }

  static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  private loadTags(): void {
    const stored = localStorage.getItem('product_tags');
    if (stored) {
      try {
        const parsedTags = JSON.parse(stored);
        this.tags = parsedTags.map((tag: any) => ({
          ...tag,
          createdAt: new Date(tag.createdAt),
          updatedAt: new Date(tag.updatedAt)
        }));
      } catch (error) {
        console.error('Error loading tags:', error);
        this.initializeDefaultTags();
      }
    } else {
      this.initializeDefaultTags();
    }
  }

  private saveTags(): void {
    localStorage.setItem('product_tags', JSON.stringify(this.tags));
  }

  private initializeDefaultTags(): void {
    const defaultTags: ProductTag[] = [
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
        accessLevel: CourseAccessLevel.PREMIUM,
        color: '#4682B4',
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
        color: '#DAA520',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.tags = defaultTags;
    this.saveTags();
  }

  getAllTags(): ProductTag[] {
    return [...this.tags];
  }

  getTagsWithStats(): TagWithStats[] {
    // In a real app, this would query actual usage statistics
    return this.tags.map(tag => ({
      ...tag,
      studentsCount: Math.floor(Math.random() * 50) + 1, // Mock data
      coursesCount: Math.floor(Math.random() * 10) + 1   // Mock data
    }));
  }

  getTagById(id: string): ProductTag | null {
    return this.tags.find(tag => tag.id === id) || null;
  }

  getFilteredTags(filters: TagFilters = {}): TagWithStats[] {
    let filtered = this.getTagsWithStats();

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(search) ||
        tag.slug.toLowerCase().includes(search) ||
        (tag.hotmartProductId && tag.hotmartProductId.toLowerCase().includes(search))
      );
    }

    // Apply access level filter
    if (filters.accessLevel) {
      filtered = filtered.filter(tag => tag.accessLevel === filters.accessLevel);
    }

    // Apply active status filter
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(tag => tag.isActive === filters.isActive);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'studentsCount':
            aValue = a.studentsCount;
            bValue = b.studentsCount;
            break;
          case 'coursesCount':
            aValue = a.coursesCount;
            bValue = b.coursesCount;
            break;
          case 'createdAt':
            aValue = a.createdAt.getTime();
            bValue = b.createdAt.getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }

  createTag(tagData: Omit<ProductTag, 'id' | 'createdAt' | 'updatedAt'>): ProductTag {
    const newTag: ProductTag = {
      ...tagData,
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug: tagData.slug || this.generateSlug(tagData.name),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tags.push(newTag);
    this.saveTags();
    
    return newTag;
  }

  updateTag(id: string, updates: Partial<Omit<ProductTag, 'id' | 'createdAt'>>): ProductTag | null {
    const tagIndex = this.tags.findIndex(tag => tag.id === id);
    
    if (tagIndex === -1) return null;

    const updatedTag = {
      ...this.tags[tagIndex],
      ...updates,
      updatedAt: new Date()
    };

    // Auto-generate slug if name changed and no slug provided
    if (updates.name && !updates.slug) {
      updatedTag.slug = this.generateSlug(updates.name);
    }

    this.tags[tagIndex] = updatedTag;
    this.saveTags();
    
    return updatedTag;
  }

  deleteTag(id: string): boolean {
    const initialLength = this.tags.length;
    this.tags = this.tags.filter(tag => tag.id !== id);
    
    if (this.tags.length < initialLength) {
      this.saveTags();
      return true;
    }
    
    return false;
  }

  toggleTagStatus(id: string): ProductTag | null {
    const tag = this.tags.find(tag => tag.id === id);
    if (!tag) return null;

    return this.updateTag(id, { isActive: !tag.isActive });
  }

  getAvailableColors(): string[] {
    return [
      '#B8654B', // terracota
      '#7C9885', // verde-oliva
      '#6B8E23', // verde-floresta
      '#DAA520', // dourado
      '#4D381B', // marrom-escuro
      '#4682B4', // azul-aço
      '#8B4513', // marrom-sela
      '#2E8B57', // verde-mar
      '#CD853F', // marrom-claro
      '#9932CC', // roxo-escuro
      '#FF6347', // tomate
      '#4169E1'  // azul-real
    ];
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  validateTag(tagData: Partial<ProductTag>, excludeId?: string): string[] {
    const errors: string[] = [];

    if (!tagData.name?.trim()) {
      errors.push('Nome é obrigatório');
    } else if (tagData.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    } else if (tagData.name.trim().length > 50) {
      errors.push('Nome deve ter no máximo 50 caracteres');
    }

    // Check for duplicate name
    if (tagData.name) {
      const existing = this.tags.find(tag => 
        tag.name.toLowerCase() === tagData.name!.toLowerCase() && 
        tag.id !== excludeId
      );
      if (existing) {
        errors.push('Já existe uma tag com este nome');
      }
    }

    // Check for duplicate slug
    if (tagData.slug) {
      const existing = this.tags.find(tag => 
        tag.slug === tagData.slug && 
        tag.id !== excludeId
      );
      if (existing) {
        errors.push('Já existe uma tag com este slug');
      }
    }

    // Check for duplicate Hotmart product ID
    if (tagData.hotmartProductId) {
      const existing = this.tags.find(tag => 
        tag.hotmartProductId === tagData.hotmartProductId && 
        tag.id !== excludeId
      );
      if (existing) {
        errors.push('Já existe uma tag com este ID do produto Hotmart');
      }
    }

    if (!tagData.color) {
      errors.push('Cor é obrigatória');
    }

    return errors;
  }

  getStatistics() {
    const total = this.tags.length;
    const active = this.tags.filter(tag => tag.isActive).length;
    const inactive = total - active;
    const byAccessLevel = {
      [CourseAccessLevel.FREE]: this.tags.filter(tag => tag.accessLevel === CourseAccessLevel.FREE).length,
      [CourseAccessLevel.PREMIUM]: this.tags.filter(tag => tag.accessLevel === CourseAccessLevel.PREMIUM).length,
      [CourseAccessLevel.VIP]: this.tags.filter(tag => tag.accessLevel === CourseAccessLevel.VIP).length
    };

    return { total, active, inactive, byAccessLevel };
  }
}

export const tagService = TagService.getInstance();