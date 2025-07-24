import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const BoasVindas: React.FC = () => {
  const { user } = useAuth();
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(
    localStorage.getItem('welcome_completed') === 'true'
  );

  const handleCompleteWelcome = () => {
    localStorage.setItem('welcome_completed', 'true');
    setHasCompletedWelcome(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <span className="text-4xl">🌟</span>
          Bem-vinda ao Clube do Livro, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-lg text-gray-700">
          Que alegria ter você aqui conosco nesta jornada de autoconhecimento e crescimento!
        </p>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="prose max-w-none">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🎉</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Você tomou uma decisão transformadora!
            </h2>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Ao se juntar ao nosso clube, você deu o primeiro passo para reconectar-se com sua 
              essência mais profunda e autêntica. "Mulheres que Correm com os Lobos" não é apenas 
              um livro - é um portal para a redescoberta do seu eu selvagem e intuitivo.
            </p>

            <div className="bg-pink-50 border-l-4 border-pink-400 p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-3">📖 Sobre nossa jornada:</h3>
              <p>
                Juntas, vamos explorar os mitos, contos e arquétipos que Clarissa Pinkola Estés 
                nos apresenta. Cada capítulo é uma oportunidade de despertar aspectos adormecidos 
                da nossa natureza feminina - nossa criatividade, intuição, força e sabedoria ancestral.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-3">🤝 Nossa comunidade:</h3>
              <p>
                Você faz parte de uma comunidade de mulheres corajosas que escolheram 
                olhar para dentro, questionar padrões e buscar uma vida mais autêntica. 
                Aqui, cada história importa, cada reflexão é valiosa e cada passo é celebrado.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-3">🌱 O que te espera:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Vídeos exclusivos com análises profundas de cada capítulo</li>
                <li>Exercícios terapêuticos para aplicar os ensinamentos no seu dia a dia</li>
                <li>Encontros ao vivo para debater e compartilhar experiências</li>
                <li>Uma comunidade acolhedora para suas dúvidas e descobertas</li>
                <li>Recursos extras como músicas, meditações e links úteis</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-terracota/10 to-marrom-escuro/10 rounded-xl">
            <div className="text-center">
              <span className="text-4xl mb-4 block">🌙</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                "O lobo selvagem e a mulher selvagem são dotados de uma resistência 
                e força extraordinárias."
              </h3>
              <p className="text-gray-600 italic">- Clarissa Pinkola Estés</p>
            </div>
          </div>
        </div>

        {!hasCompletedWelcome && (
          <div className="mt-8 text-center">
            <button
              onClick={handleCompleteWelcome}
              className="px-8 py-3 bg-terracota text-white rounded-lg font-semibold hover:bg-marrom-escuro transition-colors shadow-md"
            >
              🌟 Estou pronta para começar!
            </button>
          </div>
        )}

        {hasCompletedWelcome && (
          <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
            <span className="text-green-700 font-medium">
              ✅ Bem-vindas concluído! Continue explorando as próximas seções.
            </span>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🗺️</span>
          Próximos Passos
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <span className="text-2xl mb-2 block">📋</span>
            <h4 className="font-semibold text-gray-900 mb-2">1. Acordos do Grupo</h4>
            <p className="text-sm text-gray-600">
              Conheça nossas diretrizes para uma convivência harmoniosa
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <span className="text-2xl mb-2 block">👋</span>
            <h4 className="font-semibold text-gray-900 mb-2">2. Apresentação</h4>
            <p className="text-sm text-gray-600">
              Compartilhe um pouco sobre você com a comunidade
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <span className="text-2xl mb-2 block">📅</span>
            <h4 className="font-semibold text-gray-900 mb-2">3. Agenda Pessoal</h4>
            <p className="text-sm text-gray-600">
              Organize seu tempo de estudo e participação
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💌 Precisa de ajuda?
          </h3>
          <p className="text-gray-700 mb-4">
            Nossa equipe está sempre disponível para te apoiar nesta jornada.
          </p>
          <div className="flex justify-center gap-4">
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm text-gray-600">
              📧 Suporte: contato@clubedolivro.com
            </span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm text-gray-600">
              💬 WhatsApp: (11) 9999-9999
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoasVindas;