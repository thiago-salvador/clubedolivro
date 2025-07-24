import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [], showHome = true }) => {
  const location = useLocation();
  
  // Generate breadcrumbs from current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items.length > 0) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Define path labels
    const pathLabels: Record<string, string> = {
      admin: 'Administração',
      courses: 'Cursos',
      students: 'Alunas',
      channels: 'Canais',
      tags: 'Tags',
      analytics: 'Métricas',
      settings: 'Configurações',
      create: 'Criar',
      edit: 'Editar',
      add: 'Adicionar',
      hotmart: 'Hotmart',
      admins: 'Administradores',
      notifications: 'Notificações',
      templates: 'Templates'
    };
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath // Don't link the current page
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = generateBreadcrumbs();
  
  if (breadcrumbItems.length === 0 && !showHome) {
    return null;
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {showHome && (
        <>
          <Link 
            to="/admin" 
            className="flex items-center text-gray-500 hover:text-terracota transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbItems.length > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </>
      )}
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.path ? (
            <Link 
              to={item.path}
              className="text-gray-500 hover:text-terracota transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;