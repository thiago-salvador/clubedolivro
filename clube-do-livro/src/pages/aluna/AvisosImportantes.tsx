import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cacheService, CACHE_KEYS } from '../../services/cache.service';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'urgent' | 'event' | 'update' | 'reminder' | 'general';
  date: Date;
  isRead: boolean;
  isPinned: boolean;
  author: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  relatedLinks?: {
    text: string;
    url: string;
  }[];
}

const AvisosImportantes: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readNotices, setReadNotices] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [expandedNotices, setExpandedNotices] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados simulados de avisos
  const initialNotices: Notice[] = [
    {
      id: '1',
      title: '🚨 URGENTE: Mudança no horário do encontro de hoje',
      content: 'Queridas, devido a um imprevisto, o encontro de hoje sobre o Capítulo 3 será adiado para às 20h (em vez de 19h). Pedimos desculpas pelo transtorno e esperamos vocês no novo horário!',
      category: 'urgent',
      date: new Date('2024-03-20T14:00:00'),
      isRead: false,
      isPinned: true,
      author: 'Manu Xavier',
      relatedLinks: [
        { text: 'Acessar sala do encontro', url: '/aluna/aulas/capitulo/3/encontros' }
      ]
    },
    {
      id: '2',
      title: '🎉 Novo capítulo disponível: Capítulo 5',
      content: 'Acabamos de liberar o conteúdo completo do Capítulo 5! Vocês já podem acessar os vídeos, músicas, exercícios e se inscrever para o encontro da próxima semana. Este capítulo explora a busca pelo tesouro interior e a recuperação da intuição.',
      category: 'update',
      date: new Date('2024-03-19T10:00:00'),
      isRead: false,
      isPinned: true,
      author: 'Equipe Clube do Livro',
      relatedLinks: [
        { text: 'Ir para o Capítulo 5', url: '/aluna/aulas/capitulo/5' }
      ]
    },
    {
      id: '3',
      title: '📅 Calendário de encontros de Abril',
      content: 'Já está disponível o calendário completo dos encontros ao vivo de abril! São 8 encontros programados, incluindo uma sessão especial de encerramento. Confiram as datas e já marquem na agenda!',
      category: 'event',
      date: new Date('2024-03-18T15:00:00'),
      isRead: true,
      isPinned: false,
      author: 'Carolina Luz',
      attachments: [
        { name: 'Calendario_Abril_2024.pdf', url: '/files/calendar.pdf', type: 'pdf' }
      ]
    },
    {
      id: '4',
      title: '💝 Novos descontos exclusivos disponíveis',
      content: 'Temos novidades na área de benefícios! A L\'Occitane e o Boticário acabaram de disponibilizar cupons exclusivos para as participantes do clube. Descontos de até 30% em produtos selecionados!',
      category: 'general',
      date: new Date('2024-03-17T11:00:00'),
      isRead: true,
      isPinned: false,
      author: 'Equipe Clube do Livro',
      relatedLinks: [
        { text: 'Ver benefícios', url: '/beneficios' }
      ]
    },
    {
      id: '5',
      title: '⏰ Lembrete: Prazo para enviar reflexões do Capítulo 2',
      content: 'Não esqueçam! O prazo para enviar suas reflexões sobre o Capítulo 2 termina amanhã às 23h59. Queremos muito conhecer suas experiências com La Loba!',
      category: 'reminder',
      date: new Date('2024-03-16T09:00:00'),
      isRead: false,
      isPinned: false,
      author: 'Manu Xavier',
      relatedLinks: [
        { text: 'Enviar reflexão', url: '/aluna/debates/indicacoes' }
      ]
    },
    {
      id: '6',
      title: '🛠️ Manutenção programada no site',
      content: 'Informamos que no domingo (24/03) das 6h às 8h o site passará por manutenção. Durante este período, o acesso pode ficar intermitente. Agradecemos a compreensão!',
      category: 'general',
      date: new Date('2024-03-15T16:00:00'),
      isRead: true,
      isPinned: false,
      author: 'Suporte Técnico'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load notices with cache (6 hours TTL)
        const cachedNotices = await cacheService.getOrFetch<Notice[]>(
          CACHE_KEYS.NOTICES,
          async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            return initialNotices;
          },
          6 * 60 * 60 * 1000 // 6 hours
        );

        // Carregar avisos e status de leitura do localStorage
        const savedReadNotices = localStorage.getItem('read_notices');
        if (savedReadNotices) {
          setReadNotices(new Set(JSON.parse(savedReadNotices)));
        }
        
        setNotices(cachedNotices);
      } catch (error) {
        console.error('Error loading notices:', error);
        // Fallback to initial data
        setNotices(initialNotices);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const categories = [
    { value: 'all', label: 'Todos', icon: '📋' },
    { value: 'urgent', label: 'Urgentes', icon: '🚨', color: 'text-red-600 bg-red-100' },
    { value: 'event', label: 'Eventos', icon: '📅', color: 'text-blue-600 bg-blue-100' },
    { value: 'update', label: 'Atualizações', icon: '🎉', color: 'text-green-600 bg-green-100' },
    { value: 'reminder', label: 'Lembretes', icon: '⏰', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'general', label: 'Gerais', icon: '📢', color: 'text-gray-600 bg-gray-100' }
  ];

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'text-gray-600 bg-gray-100';
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || '📋';
  };

  const markAsRead = (noticeId: string) => {
    const newReadNotices = new Set(readNotices);
    newReadNotices.add(noticeId);
    setReadNotices(newReadNotices);
    localStorage.setItem('read_notices', JSON.stringify(Array.from(newReadNotices)));
  };

  const toggleExpanded = (noticeId: string) => {
    const newExpanded = new Set(expandedNotices);
    if (newExpanded.has(noticeId)) {
      newExpanded.delete(noticeId);
    } else {
      newExpanded.add(noticeId);
      markAsRead(noticeId);
    }
    setExpandedNotices(newExpanded);
  };

  const markAllAsRead = () => {
    const allNoticeIds = notices.map(n => n.id);
    const newReadNotices = new Set(readNotices);
    allNoticeIds.forEach(id => newReadNotices.add(id));
    setReadNotices(newReadNotices);
    localStorage.setItem('read_notices', JSON.stringify(Array.from(newReadNotices)));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'há menos de 1 hora';
    if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Filtrar avisos
  let filteredNotices = [...notices];
  
  if (selectedCategory !== 'all') {
    filteredNotices = filteredNotices.filter(n => n.category === selectedCategory);
  }
  
  if (showOnlyUnread) {
    filteredNotices = filteredNotices.filter(n => !readNotices.has(n.id));
  }
  
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredNotices = filteredNotices.filter(n => 
      n.title.toLowerCase().includes(term) || 
      n.content.toLowerCase().includes(term) ||
      n.author.toLowerCase().includes(term)
    );
  }

  // Ordenar: fixados primeiro, depois por data
  filteredNotices.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.date.getTime() - a.date.getTime();
  });

  const unreadCount = notices.filter(n => !readNotices.has(n.id)).length;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando avisos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>📌</span>
              Avisos Importantes
            </h1>
            <p className="text-gray-700">
              Fique por dentro de todas as novidades, mudanças e comunicados do clube.
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
              {unreadCount} novo{unreadCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-terracota text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
                {cat.value === 'urgent' && notices.filter(n => n.category === 'urgent' && !readNotices.has(n.id)).length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {notices.filter(n => n.category === 'urgent' && !readNotices.has(n.id)).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar avisos..."
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-terracota focus:border-transparent"
              />
              <span className="absolute left-2.5 top-2.5 text-gray-400 text-sm">🔍</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyUnread}
                onChange={(e) => setShowOnlyUnread(e.target.checked)}
                className="rounded text-terracota focus:ring-terracota"
              />
              <span className="text-sm text-gray-700">Apenas não lidos</span>
            </label>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-terracota hover:text-marrom-escuro font-medium"
              >
                Marcar todos como lidos
              </button>
            )}
          </div>
        </div>
        
        {/* Search Results Info */}
        {(searchTerm || showOnlyUnread || selectedCategory !== 'all') && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="text-sm text-gray-600">
              {filteredNotices.length} {filteredNotices.length === 1 ? 'aviso encontrado' : 'avisos encontrados'}
              {searchTerm && (
                <span className="font-medium"> para "{searchTerm}"</span>
              )}
              {showOnlyUnread && (
                <span className="ml-1 text-orange-600">• Apenas não lidos</span>
              )}
              {selectedCategory !== 'all' && (
                <span className="ml-1 text-terracota">
                  • {categories.find(c => c.value === selectedCategory)?.label}
                </span>
              )}
            </div>
            
            {(searchTerm || showOnlyUnread || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowOnlyUnread(false);
                  setSelectedCategory('all');
                }}
                className="text-sm text-gray-500 hover:text-terracota"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => {
            const isRead = readNotices.has(notice.id);
            const isExpanded = expandedNotices.has(notice.id);

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                  !isRead ? 'ring-2 ring-terracota ring-opacity-30' : ''
                }`}
              >
                <button
                  onClick={() => toggleExpanded(notice.id)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Indicator */}
                    <div className="flex-shrink-0 mt-1">
                      {notice.isPinned && (
                        <div className="w-2 h-2 bg-terracota rounded-full mb-2" title="Fixado" />
                      )}
                      {!isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Não lido" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`text-lg font-semibold ${isRead ? 'text-gray-900' : 'text-gray-900'}`}>
                          {notice.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryStyle(notice.category)}`}>
                          {getCategoryIcon(notice.category)} {categories.find(c => c.value === notice.category)?.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{notice.author}</span>
                        <span>•</span>
                        <span>{formatDate(notice.date)}</span>
                      </div>

                      {!isExpanded && (
                        <p className="text-gray-700 line-clamp-2">
                          {notice.content}
                        </p>
                      )}
                    </div>

                    {/* Expand Icon */}
                    <span className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-700 mt-4 whitespace-pre-line">
                      {notice.content}
                    </p>

                    {/* Attachments */}
                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">📎 Anexos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {notice.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.url}
                              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-700 transition-colors"
                              download
                            >
                              📄 {attachment.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Links */}
                    {notice.relatedLinks && notice.relatedLinks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">🔗 Links relacionados:</h4>
                        <div className="flex flex-wrap gap-2">
                          {notice.relatedLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              className="text-terracota hover:text-marrom-escuro underline text-sm"
                            >
                              {link.text} →
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500">
              {showOnlyUnread 
                ? 'Você não tem avisos não lidos no momento! 🎉' 
                : 'Nenhum aviso encontrado para os filtros selecionados.'}
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          Dicas sobre os avisos:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Avisos urgentes aparecem sempre no topo e com destaque especial</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Os avisos não lidos têm um indicador azul pulsante</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Clique em um aviso para expandir e ver todos os detalhes</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Seus avisos lidos são salvos e sincronizados entre sessões</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AvisosImportantes;