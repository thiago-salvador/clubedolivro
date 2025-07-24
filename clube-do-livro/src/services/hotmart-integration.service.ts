import { ProductTag, CourseAccessLevel } from '../types/admin.types';
import { tagService } from './tag.service';

export interface HotmartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  accessLevel: CourseAccessLevel;
}

export interface TagProductAssociation {
  id: string;
  tagId: string;
  hotmartProductId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSyncAt?: Date;
  syncError?: string;
}

export interface HotmartSyncResult {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  errors: string[];
  newAssociations: TagProductAssociation[];
}

class HotmartIntegrationService {
  private static instance: HotmartIntegrationService;
  private associations: TagProductAssociation[] = [];
  private mockProducts: HotmartProduct[] = [];

  private constructor() {
    this.loadAssociations();
    this.initializeMockProducts();
  }

  static getInstance(): HotmartIntegrationService {
    if (!HotmartIntegrationService.instance) {
      HotmartIntegrationService.instance = new HotmartIntegrationService();
    }
    return HotmartIntegrationService.instance;
  }

  private loadAssociations(): void {
    const stored = localStorage.getItem('hotmart_tag_associations');
    if (stored) {
      try {
        const parsedAssociations = JSON.parse(stored);
        this.associations = parsedAssociations.map((assoc: any) => ({
          ...assoc,
          createdAt: new Date(assoc.createdAt),
          updatedAt: new Date(assoc.updatedAt),
          lastSyncAt: assoc.lastSyncAt ? new Date(assoc.lastSyncAt) : undefined
        }));
      } catch (error) {
        console.error('Error loading Hotmart associations:', error);
        this.associations = [];
      }
    }
  }

  private saveAssociations(): void {
    localStorage.setItem('hotmart_tag_associations', JSON.stringify(this.associations));
  }

  private initializeMockProducts(): void {
    const stored = localStorage.getItem('hotmart_mock_products');
    if (stored) {
      try {
        const parsedProducts = JSON.parse(stored);
        this.mockProducts = parsedProducts.map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt)
        }));
      } catch (error) {
        console.error('Error loading mock products:', error);
        this.initializeDefaultProducts();
      }
    } else {
      this.initializeDefaultProducts();
    }
  }

  private initializeDefaultProducts(): void {
    this.mockProducts = [
      {
        id: 'PROD123',
        name: 'Curso de Relacionamentos Saudáveis',
        slug: 'relacionamentos-saudaveis',
        price: 297.00,
        currency: 'BRL',
        status: 'active',
        accessLevel: CourseAccessLevel.PREMIUM,
        description: 'Aprenda a construir relacionamentos mais saudáveis e duradouros',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'PROD124',
        name: 'Jornada do Autoconhecimento',
        slug: 'jornada-autoconhecimento',
        price: 197.00,
        currency: 'BRL',
        status: 'active',
        accessLevel: CourseAccessLevel.FREE,
        description: 'Descubra quem você realmente é através de exercícios práticos',
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'PROD125',
        name: 'Superando a Ansiedade',
        slug: 'superando-ansiedade',
        price: 397.00,
        currency: 'BRL',
        status: 'active',
        accessLevel: CourseAccessLevel.PREMIUM,
        description: 'Técnicas comprovadas para lidar com ansiedade e estresse',
        createdAt: new Date('2024-02-15')
      },
      {
        id: 'PROD126',
        name: 'Saindo da Depressão',
        slug: 'saindo-depressao',
        price: 497.00,
        currency: 'BRL',
        status: 'active',
        accessLevel: CourseAccessLevel.PREMIUM,
        description: 'Um caminho de volta à alegria e motivação',
        createdAt: new Date('2024-03-01')
      },
      {
        id: 'PROD127',
        name: 'Carreira e Propósito',
        slug: 'carreira-proposito',
        price: 247.00,
        currency: 'BRL',
        status: 'active',
        accessLevel: CourseAccessLevel.FREE,
        description: 'Encontre sua vocação e construa uma carreira de sucesso',
        createdAt: new Date('2024-03-15')
      },
      {
        id: 'PROD128',
        name: 'Mindfulness e Meditação',
        slug: 'mindfulness-meditacao',
        price: 167.00,
        currency: 'BRL',
        status: 'active',
        accessLevel: CourseAccessLevel.VIP,
        description: 'Práticas de atenção plena para o dia a dia',
        createdAt: new Date('2024-04-01')
      }
    ];
    
    localStorage.setItem('hotmart_mock_products', JSON.stringify(this.mockProducts));
  }

  // Get all available Hotmart products
  getHotmartProducts(): HotmartProduct[] {
    return [...this.mockProducts];
  }

  // Get product by Hotmart ID
  getProductById(hotmartProductId: string): HotmartProduct | null {
    return this.mockProducts.find(product => product.id === hotmartProductId) || null;
  }

  // Get all tag-product associations
  getAllAssociations(): TagProductAssociation[] {
    return [...this.associations];
  }

  // Get associations for a specific tag
  getAssociationsByTag(tagId: string): TagProductAssociation[] {
    return this.associations.filter(assoc => assoc.tagId === tagId);
  }

  // Get associations for a specific Hotmart product
  getAssociationsByProduct(hotmartProductId: string): TagProductAssociation[] {
    return this.associations.filter(assoc => assoc.hotmartProductId === hotmartProductId);
  }

  // Create new tag-product association
  createAssociation(tagId: string, hotmartProductId: string): TagProductAssociation | null {
    // Validate that tag exists
    const tag = tagService.getTagById(tagId);
    if (!tag) {
      throw new Error('Tag não encontrada');
    }

    // Validate that product exists
    const product = this.getProductById(hotmartProductId);
    if (!product) {
      throw new Error('Produto Hotmart não encontrado');
    }

    // Check if association already exists
    const existingAssociation = this.associations.find(
      assoc => assoc.tagId === tagId && assoc.hotmartProductId === hotmartProductId
    );
    if (existingAssociation) {
      throw new Error('Associação já existe entre esta tag e produto');
    }

    const newAssociation: TagProductAssociation = {
      id: `assoc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tagId,
      hotmartProductId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'synced',
      lastSyncAt: new Date()
    };

    this.associations.push(newAssociation);
    this.saveAssociations();

    // Update tag with Hotmart product ID if not already set
    if (!tag.hotmartProductId) {
      tagService.updateTag(tagId, { hotmartProductId });
    }

    return newAssociation;
  }

  // Remove tag-product association
  removeAssociation(associationId: string): boolean {
    const initialLength = this.associations.length;
    this.associations = this.associations.filter(assoc => assoc.id !== associationId);
    
    if (this.associations.length < initialLength) {
      this.saveAssociations();
      return true;
    }
    
    return false;
  }

  // Toggle association status
  toggleAssociation(associationId: string): TagProductAssociation | null {
    const association = this.associations.find(assoc => assoc.id === associationId);
    if (!association) return null;

    association.isActive = !association.isActive;
    association.updatedAt = new Date();
    this.saveAssociations();
    
    return association;
  }

  // Sync all tags with Hotmart products (automatic association based on matching IDs)
  async syncTagsWithHotmart(): Promise<HotmartSyncResult> {
    const result: HotmartSyncResult = {
      success: true,
      syncedCount: 0,
      errorCount: 0,
      errors: [],
      newAssociations: []
    };

    try {
      const allTags = tagService.getAllTags();
      
      for (const tag of allTags) {
        if (tag.hotmartProductId) {
          try {
            // Check if association already exists
            const existingAssociation = this.associations.find(
              assoc => assoc.tagId === tag.id && assoc.hotmartProductId === tag.hotmartProductId
            );

            if (!existingAssociation) {
              // Check if product exists in Hotmart
              const product = this.getProductById(tag.hotmartProductId);
              if (product) {
                const newAssociation = this.createAssociation(tag.id, tag.hotmartProductId);
                if (newAssociation) {
                  result.newAssociations.push(newAssociation);
                  result.syncedCount++;
                }
              } else {
                result.errors.push(`Produto Hotmart ${tag.hotmartProductId} não encontrado para tag ${tag.name}`);
                result.errorCount++;
              }
            } else {
              // Update existing association sync status
              existingAssociation.syncStatus = 'synced';
              existingAssociation.lastSyncAt = new Date();
              result.syncedCount++;
            }
          } catch (error) {
            result.errors.push(`Erro ao sincronizar tag ${tag.name}: ${error}`);
            result.errorCount++;
          }
        }
      }

      if (result.errorCount > 0) {
        result.success = false;
      }

      this.saveAssociations();
    } catch (error) {
      result.success = false;
      result.errors.push(`Erro geral na sincronização: ${error}`);
      result.errorCount++;
    }

    return result;
  }

  // Get association statistics
  getAssociationStatistics() {
    const total = this.associations.length;
    const active = this.associations.filter(assoc => assoc.isActive).length;
    const inactive = total - active;
    const synced = this.associations.filter(assoc => assoc.syncStatus === 'synced').length;
    const pending = this.associations.filter(assoc => assoc.syncStatus === 'pending').length;
    const errors = this.associations.filter(assoc => assoc.syncStatus === 'error').length;

    const byAccessLevel = {
      [CourseAccessLevel.FREE]: 0,
      [CourseAccessLevel.PREMIUM]: 0,
      [CourseAccessLevel.VIP]: 0
    };

    this.associations.forEach(assoc => {
      const product = this.getProductById(assoc.hotmartProductId);
      if (product) {
        byAccessLevel[product.accessLevel]++;
      }
    });

    return {
      total,
      active,
      inactive,
      synced,
      pending,
      errors,
      byAccessLevel
    };
  }

  // Validate tag-product compatibility
  validateTagProductCompatibility(tagId: string, hotmartProductId: string): string[] {
    const errors: string[] = [];

    const tag = tagService.getTagById(tagId);
    const product = this.getProductById(hotmartProductId);

    if (!tag) {
      errors.push('Tag não encontrada');
      return errors;
    }

    if (!product) {
      errors.push('Produto Hotmart não encontrado');
      return errors;
    }

    // Check access level compatibility
    if (tag.accessLevel !== product.accessLevel) {
      errors.push(`Nível de acesso incompatível: Tag é ${tag.accessLevel}, Produto é ${product.accessLevel}`);
    }

    // Check if tag already has a different Hotmart product associated
    if (tag.hotmartProductId && tag.hotmartProductId !== hotmartProductId) {
      errors.push(`Tag já está associada ao produto ${tag.hotmartProductId}`);
    }

    return errors;
  }

  // Get products not yet associated with any tag
  getUnassociatedProducts(): HotmartProduct[] {
    const associatedProductIds = this.associations.map(assoc => assoc.hotmartProductId);
    return this.mockProducts.filter(product => !associatedProductIds.includes(product.id));
  }

  // Get tags not yet associated with any product
  getUnassociatedTags(): ProductTag[] {
    const associatedTagIds = this.associations.map(assoc => assoc.tagId);
    const allTags = tagService.getAllTags();
    return allTags.filter(tag => !associatedTagIds.includes(tag.id));
  }
}

export const hotmartIntegrationService = HotmartIntegrationService.getInstance();