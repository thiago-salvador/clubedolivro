import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookIcon, 
  UsersIcon, 
  ActivityIcon, 
  GiftIcon, 
  SettingsIcon,
  ShoppingBagIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  HomeIcon
} from '../../Icons';
import { useAuth } from '../../../contexts/AuthContext';

const AlunaLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState<string[]>(['comece', 'aulas', 'debates']);
  const [showNewUserIndicator, setShowNewUserIndicator] = useState(false);

  // Detectar se é nova aluna e controlar indicador
  useEffect(() => {
    const hasVisitedComece = localStorage.getItem('visited_comece_section');
    const isNewUser = !hasVisitedComece;
    setShowNewUserIndicator(isNewUser);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );

    // Se clicou na seção "Comece por Aqui", esconder o indicador
    if (section === 'comece' && showNewUserIndicator) {
      setShowNewUserIndicator(false);
      localStorage.setItem('visited_comece_section', 'true');
    }
  };

  type MenuLink = {
    type: 'link';
    path: string;
    label: string;
    icon: string;
  };

  type MenuSection = {
    type: 'section';
    id: string;
    label: string;
    icon: string;
    isExpanded: boolean;
    subItems: { path: string; label: string }[];
  };

  type MenuItem = MenuLink | MenuSection;

  const menuItems: MenuItem[] = [
    { 
      type: 'link',
      path: '/aluna', 
      label: 'Início', 
      icon: 'home' 
    },
    {
      type: 'section',
      id: 'comece',
      label: 'Comece por Aqui',
      icon: 'activity',
      isExpanded: expandedSections.includes('comece'),
      subItems: [
        { path: '/aluna/comece/boas-vindas', label: 'Boas-vindas' },
        { path: '/aluna/comece/acordos', label: 'Acordos do Grupo' },
        { path: '/aluna/comece/apresentacao', label: 'Apresentação' },
        { path: '/aluna/comece/agenda', label: 'Agenda Pessoal' },
      ]
    },
    {
      type: 'section',
      id: 'aulas',
      label: 'Aulas',
      icon: 'book',
      isExpanded: expandedSections.includes('aulas'),
      subItems: [
        { path: '/aluna/aulas/capitulo/1', label: 'Capítulo 1' },
        { path: '/aluna/aulas/capitulo/2', label: 'Capítulo 2' },
        { path: '/aluna/aulas/capitulo/3', label: 'Capítulo 3' },
        { path: '/aluna/aulas/capitulo/4', label: 'Capítulo 4' },
        { path: '/aluna/aulas/capitulo/5', label: 'Capítulo 5' },
      ]
    },
    {
      type: 'section',
      id: 'debates',
      label: 'Debates',
      icon: 'users',
      isExpanded: expandedSections.includes('debates'),
      subItems: [
        { path: '/aluna/debates/indicacoes', label: 'Indicações' },
        { path: '/aluna/debates/relacionamento', label: 'Relacionamento' },
        { path: '/aluna/debates/trabalho', label: 'Trabalho' },
        { path: '/aluna/debates/amizade', label: 'Amizade' },
      ]
    },
    { 
      type: 'link',
      path: '/aluna/avisos', 
      label: 'Avisos Importantes', 
      icon: 'activity' 
    },
    { 
      type: 'link',
      path: '/aluna/links', 
      label: 'Links Úteis', 
      icon: 'gift' 
    },
    { 
      type: 'link',
      path: '/aluna/shop', 
      label: 'Shop', 
      icon: 'shopping-bag' 
    },
    { 
      type: 'link',
      path: '/aluna/configuracoes', 
      label: 'Configurações', 
      icon: 'settings' 
    },
  ];

  const isActive = (path: string) => {
    if (path === '/aluna' && location.pathname === '/aluna') return true;
    if (path !== '/aluna' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isSidebarOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Clube do Livro</h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <SearchIcon className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent outline-none text-sm w-64"
                />
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-terracota flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Aluna'}</p>
                  <p className="text-xs text-gray-500">Aluna</p>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Sair"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg z-30 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64`}
      >
        <nav className="p-4 h-full overflow-y-auto pb-20">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              if (item.type === 'link') {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-terracota text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon === 'home' && <HomeIcon className={active ? "text-white" : "text-gray-700"} />}
                      {item.icon === 'book' && <BookIcon className={active ? "text-white" : "text-gray-700"} />}
                      {item.icon === 'users' && <UsersIcon className={active ? "text-white" : "text-gray-700"} />}
                      {item.icon === 'activity' && <ActivityIcon className={active ? "text-white" : "text-gray-700"} />}
                      {item.icon === 'gift' && <GiftIcon className={active ? "text-white" : "text-gray-700"} />}
                      {item.icon === 'shopping-bag' && <ShoppingBagIcon className={active ? "text-white" : "text-gray-700"} />}
                      {item.icon === 'settings' && <SettingsIcon className={active ? "text-white" : "text-gray-700"} />}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              } else if (item.type === 'section') {
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                        item.id === 'comece' && showNewUserIndicator
                          ? 'bg-gradient-to-r from-terracota/10 to-marrom-escuro/10 border-2 border-terracota/30 text-terracota'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`transition-transform ${item.isExpanded ? 'rotate-90' : ''}`}>
                        {item.icon === 'book' && <BookIcon className="text-gray-700" />}
                        {item.icon === 'users' && <UsersIcon className="text-gray-700" />}
                        {item.icon === 'activity' && <ActivityIcon className={item.id === 'comece' && showNewUserIndicator ? 'text-terracota' : 'text-gray-700'} />}
                      </div>
                      <span className={`font-medium ${item.id === 'comece' && showNewUserIndicator ? 'text-terracota' : ''}`}>
                        {item.label}
                      </span>
                      {/* Indicador pulsante para novas alunas */}
                      {item.id === 'comece' && showNewUserIndicator && (
                        <div className="absolute -right-1 -top-1">
                          <div className="relative">
                            <div className="w-3 h-3 bg-terracota rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-terracota rounded-full animate-ping opacity-75"></div>
                          </div>
                        </div>
                      )}
                    </button>
                    {item.isExpanded && (
                      <ul className="ml-12 mt-2 space-y-1">
                        {item.subItems.map((subItem) => {
                          const subActive = isActive(subItem.path);
                          return (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                onClick={() => {
                                  setIsSidebarOpen(false);
                                  // Se clicou em um sub-item do "Comece por Aqui", esconder indicador
                                  if (item.id === 'comece' && showNewUserIndicator) {
                                    setShowNewUserIndicator(false);
                                    localStorage.setItem('visited_comece_section', 'true');
                                  }
                                }}
                                className={`block px-4 py-2 rounded-lg transition-colors ${
                                  subActive
                                    ? 'bg-terracota/20 text-terracota'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              return null;
            })}
          </ul>

          {/* Badges Section */}
          {user && user.badges.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Selos de Conquista</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="group relative"
                  >
                    <span className="text-2xl cursor-pointer">{badge.icon}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {badge.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-64'
      }`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AlunaLayout;