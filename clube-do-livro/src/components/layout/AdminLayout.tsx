import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Tag,
  Mail,
  Home,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Breadcrumbs from '../ui/Breadcrumbs';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['courses', 'students']);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isSuperAdmin } = useAdminAuth();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/admin'
    },
    {
      id: 'courses',
      label: 'Cursos',
      icon: <BookOpen className="w-5 h-5" />,
      children: [
        { id: 'courses-list', label: 'Todos os Cursos', icon: null, path: '/admin/courses' },
        { id: 'courses-create', label: 'Criar Curso', icon: null, path: '/admin/courses/create' },
        { id: 'courses-templates', label: 'Templates', icon: null, path: '/admin/courses/templates' }
      ]
    },
    {
      id: 'students',
      label: 'Alunas',
      icon: <Users className="w-5 h-5" />,
      children: [
        { id: 'students-list', label: 'Todas as Alunas', icon: null, path: '/admin/students' },
        { id: 'students-add', label: 'Adicionar Aluna', icon: null, path: '/admin/students/add' },
        { id: 'students-tags', label: 'Gerenciar Tags', icon: null, path: '/admin/tags' }
      ]
    },
    {
      id: 'channels',
      label: 'Canais de Debate',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/admin/channels'
    },
    {
      id: 'tags',
      label: 'Tags de Produtos',
      icon: <Tag className="w-5 h-5" />,
      path: '/admin/tags'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: <Mail className="w-5 h-5" />,
      path: '/admin/notifications'
    },
    {
      id: 'analytics',
      label: 'Métricas',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/admin/analytics'
    }
  ];

  // Adicionar item de configurações apenas para super admin
  if (isSuperAdmin) {
    menuItems.push({
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
      children: [
        { id: 'settings-hotmart', label: 'Integração Hotmart', icon: null, path: '/admin/hotmart' },
        { id: 'settings-admins', label: 'Administradores', icon: null, path: '/admin/settings/admins' },
        { id: 'settings-notifications', label: 'Notificações', icon: null, path: '/admin/settings/notifications' }
      ]
    });
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.path ? isActiveRoute(item.path) : false;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 text-left rounded-lg
              transition-colors duration-200
              ${isActive 
                ? 'bg-terracota text-white' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }
              ${level > 0 ? 'ml-4' : ''}
            `}
          >
            <div className="flex items-center">
              {item.icon}
              <span className={`ml-3 font-medium ${!sidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
            </div>
            {sidebarOpen && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && sidebarOpen && item.children && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path!}
        className={`
          flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 mb-1
          ${isActive 
            ? 'bg-terracota text-white' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }
          ${level > 0 ? 'ml-8' : ''}
        `}
      >
        {item.icon && (
          <span className={level > 0 ? 'w-3 h-3' : 'w-5 h-5'}>
            {item.icon}
          </span>
        )}
        <span className={`ml-3 font-medium ${!sidebarOpen && 'hidden'} ${level > 0 ? 'text-sm' : ''}`}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`
        bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-terracota rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CL</span>
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Clube do Livro
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? 
                <X className="w-4 h-4 text-gray-500" /> : 
                <Menu className="w-4 h-4 text-gray-500" />
              }
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-3 text-sm font-medium">Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Painel Administrativo
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gerencie cursos, alunas e conteúdo do Clube do Livro
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Bem-vinda, {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;