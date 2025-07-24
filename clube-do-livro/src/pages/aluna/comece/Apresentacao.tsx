import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Presentation {
  id: string;
  name: string;
  age?: number;
  city?: string;
  profession?: string;
  motivation: string;
  expectations: string;
  experience: string;
  shareContact: boolean;
  hobbies: string[];
  createdAt: Date;
}

const Apresentacao: React.FC = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [hasPresented, setHasPresented] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    city: '',
    profession: '',
    motivation: '',
    expectations: '',
    experience: '',
    shareContact: false,
    hobbies: [] as string[],
    hobbyInput: ''
  });

  const suggestedHobbies = [
    'Leitura', 'Escrita', 'Meditação', 'Yoga', 'Caminhada', 'Culinária',
    'Jardinagem', 'Fotografia', 'Música', 'Dança', 'Teatro', 'Pintura',
    'Artesanato', 'Viagem', 'Voluntariado', 'Estudos', 'Cinema', 'Podcasts'
  ];

  useEffect(() => {
    // Carregar apresentações do localStorage
    const saved = localStorage.getItem('presentations');
    if (saved) {
      const data = JSON.parse(saved);
      setPresentations(data.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
    }

    // Verificar se já se apresentou
    const userPresented = localStorage.getItem('user_presented');
    setHasPresented(userPresented === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      city: formData.city,
      profession: formData.profession,
      motivation: formData.motivation,
      expectations: formData.expectations,
      experience: formData.experience,
      shareContact: formData.shareContact,
      hobbies: formData.hobbies,
      createdAt: new Date()
    };

    const updatedPresentations = [newPresentation, ...presentations];
    setPresentations(updatedPresentations);
    localStorage.setItem('presentations', JSON.stringify(updatedPresentations));
    localStorage.setItem('user_presented', 'true');
    
    setHasPresented(true);
    setShowForm(false);
  };

  const addHobby = (hobby: string) => {
    if (hobby && !formData.hobbies.includes(hobby)) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobby],
        hobbyInput: ''
      }));
    }
  };

  const removeHobby = (hobby: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
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
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>👋</span>
          Apresentação
        </h1>
        <p className="text-gray-700">
          Conheça suas companheiras de jornada e compartilhe um pouco sobre você. 
          Este é o primeiro passo para criar conexões autênticas em nossa comunidade.
        </p>
      </div>

      {/* Presentation Form or Button */}
      {!hasPresented && !showForm && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="max-w-md mx-auto">
            <span className="text-6xl mb-4 block">🌟</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Que tal se apresentar para a comunidade?
            </h3>
            <p className="text-gray-600 mb-6">
              Compartilhe sua história, motivações e expectativas. Isso ajuda outras 
              mulheres a se conectarem com você e criar vínculos mais profundos.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-terracota text-white rounded-lg font-semibold hover:bg-marrom-escuro transition-colors"
            >
              ✨ Começar Apresentação
            </button>
          </div>
        </div>
      )}

      {/* Presentation Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span>📝</span>
            Conte sobre você
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (opcional)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  min="16"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade (opcional)
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Ex: São Paulo, SP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão (opcional)
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder="Ex: Psicóloga, Estudante, Empresária..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que te motivou a participar do clube? *
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                rows={3}
                placeholder="Compartilhe o que te trouxe até aqui..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quais são suas expectativas para esta jornada? *
              </label>
              <textarea
                value={formData.expectations}
                onChange={(e) => setFormData({...formData, expectations: e.target.value})}
                rows={3}
                placeholder="O que você espera aprender ou transformar..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Já leu "Mulheres que Correm com os Lobos" antes?
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                rows={2}
                placeholder="Conte sobre sua experiência anterior com o livro ou com temas relacionados..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
              />
            </div>

            {/* Hobbies Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interesses e hobbies (opcional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedHobbies.map((hobby) => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => addHobby(hobby)}
                    disabled={formData.hobbies.includes(hobby)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.hobbies.includes(hobby)
                        ? 'bg-terracota text-white border-terracota'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.hobbyInput}
                  onChange={(e) => setFormData({...formData, hobbyInput: e.target.value})}
                  placeholder="Outro interesse..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHobby(formData.hobbyInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addHobby(formData.hobbyInput)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Adicionar
                </button>
              </div>

              {formData.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="px-3 py-1 bg-terracota text-white rounded-full text-sm flex items-center gap-1"
                    >
                      {hobby}
                      <button
                        type="button"
                        onClick={() => removeHobby(hobby)}
                        className="text-white hover:text-gray-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shareContact}
                  onChange={(e) => setFormData({...formData, shareContact: e.target.checked})}
                  className="rounded text-terracota focus:ring-terracota"
                />
                <span className="text-sm text-gray-700">
                  Permitir que outras participantes entrem em contato comigo para conexões fora da plataforma
                </span>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
              >
                🌟 Publicar Apresentação
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Message */}
      {hasPresented && !showForm && (
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-800">Apresentação publicada!</h3>
              <p className="text-green-700 text-sm">
                Sua apresentação está agora visível para toda a comunidade.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Presentations Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span>🌸</span>
          Apresentações da Comunidade
        </h3>

        {presentations.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">👥</span>
            <p className="text-gray-500">
              Ainda não temos apresentações. Que tal ser a primeira a se apresentar?
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {presentations.map((presentation) => (
              <div key={presentation.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">
                      {presentation.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{presentation.name}</h4>
                      {presentation.age && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{presentation.age} anos</span>
                        </>
                      )}
                      {presentation.city && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{presentation.city}</span>
                        </>
                      )}
                    </div>
                    
                    {presentation.profession && (
                      <p className="text-sm text-gray-600 mb-3">{presentation.profession}</p>
                    )}
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Motivação:</h5>
                        <p className="text-gray-600 text-sm">{presentation.motivation}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Expectativas:</h5>
                        <p className="text-gray-600 text-sm">{presentation.expectations}</p>
                      </div>
                      
                      {presentation.experience && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Experiência anterior:</h5>
                          <p className="text-gray-600 text-sm">{presentation.experience}</p>
                        </div>
                      )}
                    </div>
                    
                    {presentation.hobbies.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Interesses:</h5>
                        <div className="flex flex-wrap gap-1">
                          {presentation.hobbies.map((hobby, index) => (
                            <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatTimeAgo(presentation.createdAt)}</span>
                      <div className="flex gap-4">
                        <button className="hover:text-green-600 transition-colors">
                          💚 Curtir
                        </button>
                        <button className="hover:text-green-600 transition-colors">
                          💬 Comentar
                        </button>
                        {presentation.shareContact && (
                          <button className="hover:text-green-600 transition-colors">
                            ✉️ Conectar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <span>🌺</span>
            Nossa Comunidade
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{presentations.length}</div>
              <div className="text-sm text-gray-600">Apresentações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {new Set(presentations.map(p => p.city).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-600">Cidades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {presentations.filter(p => p.shareContact).length}
              </div>
              <div className="text-sm text-gray-600">Abertas a contato</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {Array.from(new Set(presentations.flatMap(p => p.hobbies))).length}
              </div>
              <div className="text-sm text-gray-600">Interesses únicos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apresentacao;