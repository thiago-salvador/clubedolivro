import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Reflection {
  id: string;
  theme: 'amor-proprio' | 'familia' | 'parceiro' | 'amizade' | 'transformacao' | 'dificuldades';
  title: string;
  content: string;
  isAnonymous: boolean;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  supportCount: number;
  replies: Reply[];
  createdAt: Date;
  isHighlighted?: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    isFacilitator?: boolean;
  };
  likes: number;
  createdAt: Date;
  isHighlighted?: boolean;
}

const Relacionamento: React.FC = () => {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [newReflection, setNewReflection] = useState({
    theme: 'amor-proprio',
    title: '',
    content: '',
    isAnonymous: false
  });

  const relationshipThemes = [
    { value: 'amor-proprio', label: '💝 Amor Próprio', icon: '💝' },
    { value: 'familia', label: '👨‍👩‍👧‍👦 Família', icon: '👨‍👩‍👧‍👦' },
    { value: 'parceiro', label: '💑 Parceiro', icon: '💑' },
    { value: 'amizade', label: '👭 Amizade', icon: '👭' },
    { value: 'transformacao', label: '🔄 Transformação', icon: '🔄' },
    { value: 'dificuldades', label: '💔 Dificuldades', icon: '💔' }
  ];

  const reflections: Reflection[] = [
    {
      id: '1',
      theme: 'amor-proprio',
      title: 'Descobrindo minha força interior depois do divórcio',
      content: 'Estou reaprendendo a me amar depois de sair de um relacionamento abusivo. O livro tem me ajudado muito a entender que minha força sempre esteve aqui, só precisava ser despertada. Alguém mais passou por isso?',
      isAnonymous: true,
      author: { name: 'Anônima' },
      likes: 8,
      supportCount: 12,
      replies: [
        {
          id: '1-1',
          content: 'Você não está sozinha! Também passei por isso e hoje me sinto muito mais forte. A jornada vale a pena! 💪',
          author: { name: 'Carla M.' },
          likes: 5,
          createdAt: new Date('2024-03-20T14:30:00')
        }
      ],
      createdAt: new Date('2024-03-20T12:00:00')
    },
    {
      id: '2',
      theme: 'familia',
      title: 'Conversas difíceis com minha mãe sobre limites',
      content: 'Depois de ler o capítulo 3, percebi que preciso estabelecer limites saudáveis com minha mãe. Ela sempre teve muito controle sobre minha vida e agora, aos 35 anos, estou aprendendo a dizer não. Como vocês lidam com a culpa?',
      isAnonymous: false,
      author: { name: 'Ana Costa' },
      likes: 15,
      supportCount: 8,
      replies: [
        {
          id: '2-1',
          content: 'Lembre-se: sua jornada de autoconhecimento pode despertar desconforto em quem está ao seu redor. Isso é normal e faz parte do processo. Estabelecer limites é um ato de amor próprio.',
          author: { name: 'Manu Xavier', isFacilitator: true },
          likes: 45,
          createdAt: new Date('2024-03-20T10:15:00'),
          isHighlighted: true
        }
      ],
      createdAt: new Date('2024-03-20T09:00:00')
    },
    {
      id: '3',
      theme: 'parceiro',
      title: 'Aplicando os arquétipos na minha relação',
      content: 'Meu marido não entende minha transformação e às vezes sinto que estamos crescendo em direções diferentes. Como equilibrar meu crescimento pessoal sem prejudicar nossa relação? Alguém conseguiu incluir o parceiro nessa jornada?',
      isAnonymous: false,
      author: { name: 'Julia Santos' },
      likes: 23,
      supportCount: 18,
      replies: [],
      createdAt: new Date('2024-03-19T16:00:00')
    },
    {
      id: '4',
      theme: 'amizade',
      title: 'Amigas que não apoiam meu crescimento',
      content: 'É normal perder amigas durante a transformação? Sinto que algumas pessoas do meu círculo social não entendem ou até sabotam minha jornada de autoconhecimento. Isso dói muito, mas sei que preciso me priorizar.',
      isAnonymous: false,
      author: { name: 'Mariana' },
      likes: 31,
      supportCount: 25,
      replies: [],
      createdAt: new Date('2024-03-18T14:30:00')
    }
  ];

  const filteredReflections = selectedTheme === 'all' 
    ? reflections 
    : reflections.filter(reflection => reflection.theme === selectedTheme);

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova reflexão:', newReflection);
    setNewReflection({
      theme: 'amor-proprio',
      title: '',
      content: '',
      isAnonymous: false
    });
  };

  const handleSupport = (reflectionId: string) => {
    console.log('Enviando apoio para:', reflectionId);
  };

  const getThemeIcon = (theme: string) => {
    const themeConfig = relationshipThemes.find(t => t.value === theme);
    return themeConfig?.icon || '💭';
  };

  const getThemeLabel = (theme: string) => {
    const themeConfig = relationshipThemes.find(t => t.value === theme);
    return themeConfig?.label || 'Reflexão';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
    if (hours > 0) return `${hours}h atrás`;
    return 'há pouco';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Block */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 rounded-xl p-6 shadow-sm">
        <p className="text-lg flex items-start gap-3">
          <span className="text-2xl">💕</span>
          <span className="text-gray-800">
            <strong>Compartilhe e reflita sobre relacionamentos!</strong><br />
            Um espaço seguro para falar sobre vínculos, família, amor próprio e conexões 
            humanas em nossa jornada. Aqui, cada experiência é valiosa e toda vulnerabilidade é acolhida.
          </span>
        </p>
      </div>

      {/* New Reflection Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-terracota">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>✨</span>
          Nova Reflexão
        </h3>
        
        <form onSubmit={handleSubmitReflection} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {relationshipThemes.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setNewReflection({...newReflection, theme: theme.value as any})}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    newReflection.theme === theme.value
                      ? 'bg-terracota text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da sua reflexão
            </label>
            <input
              type="text"
              value={newReflection.title}
              onChange={(e) => setNewReflection({...newReflection, title: e.target.value})}
              placeholder="Ex: Descobrindo minha força interior..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compartilhe sua experiência
            </label>
            <textarea
              value={newReflection.content}
              onChange={(e) => setNewReflection({...newReflection, content: e.target.value})}
              rows={4}
              placeholder="Conte sua experiência, seus sentimentos, dúvidas ou descobertas sobre relacionamentos..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newReflection.isAnonymous}
                onChange={(e) => setNewReflection({...newReflection, isAnonymous: e.target.checked})}
                className="rounded text-terracota focus:ring-terracota"
              />
              <span className="text-sm text-gray-700">🔒 Publicar anonimamente</span>
            </label>
            
            <button
              type="submit"
              className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
            >
              💜 Publicar Reflexão
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTheme('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTheme === 'all'
                ? 'bg-terracota text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {relationshipThemes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setSelectedTheme(theme.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTheme === theme.value
                  ? 'bg-terracota text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reflections Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span>💭</span>
          Reflexões da Comunidade
        </h3>

        <div className="space-y-8">
          {filteredReflections.map((reflection) => (
            <div key={reflection.id} className="border-b border-gray-100 last:border-b-0 pb-8 last:pb-0">
              {/* Reflection Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                  {reflection.isAnonymous ? (
                    <span className="text-gray-500">👤</span>
                  ) : (
                    <span className="text-sm font-semibold text-terracota">
                      {reflection.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {reflection.isAnonymous ? 'Anônima' : reflection.author.name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                      {getThemeIcon(reflection.theme)} {getThemeLabel(reflection.theme).replace(/^[^\s]+ /, '')}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(reflection.createdAt)}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">
                    {reflection.title}
                  </h4>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {reflection.content}
                  </p>
                </div>
              </div>

              {/* Reflection Actions */}
              <div className="flex items-center gap-6 text-sm mb-4">
                <button className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors">
                  <span>❤️</span>
                  <span>{reflection.likes}</span>
                </button>
                
                <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors">
                  <span>💬</span>
                  <span>{reflection.replies.length} respostas</span>
                </button>

                <button
                  onClick={() => handleSupport(reflection.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-terracota transition-colors"
                >
                  <span>🤗</span>
                  <span>Apoiar ({reflection.supportCount})</span>
                </button>
              </div>

              {/* Replies */}
              {reflection.replies.length > 0 && (
                <div className="ml-8 space-y-4">
                  {reflection.replies.map((reply) => (
                    <div 
                      key={reply.id} 
                      className={`p-4 rounded-lg ${
                        reply.isHighlighted 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-terracota rounded-full flex items-center justify-center">
                          {reply.author.isFacilitator ? (
                            <span className="text-white text-xs">👩‍⚕️</span>
                          ) : (
                            <span className="text-white text-xs font-semibold">
                              {reply.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${
                              reply.author.isFacilitator ? 'text-terracota' : 'text-gray-900'
                            }`}>
                              {reply.author.name}
                              {reply.author.isFacilitator && (
                                <span className="text-xs bg-terracota text-white px-2 py-1 rounded-full ml-2">
                                  Facilitadora
                                </span>
                              )}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {reply.content}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-pink-600 transition-colors">
                              <span>❤️</span>
                              <span>{reply.likes}</span>
                            </button>
                            <button className="text-xs text-gray-600 hover:text-terracota transition-colors">
                              💬 Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Relacionamento;