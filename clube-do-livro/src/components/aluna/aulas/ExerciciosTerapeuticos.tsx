import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Exercise {
  id: string;
  question: string;
  type: 'text' | 'multiple' | 'reflection' | 'creative';
  placeholder?: string;
  options?: string[];
  hint?: string;
}

interface UserResponse {
  exerciseId: string;
  response: string | string[];
  savedAt: Date;
}

interface ChapterExercises {
  chapterId: string;
  title: string;
  introduction: string;
  exercises: Exercise[];
}

const ExerciciosTerapeuticos: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [savedResponses, setSavedResponses] = useState<UserResponse[]>([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);

  // Dados dos exercícios por capítulo
  const chaptersData: Record<string, ChapterExercises> = {
    '1': {
      chapterId: '1',
      title: 'A Porta de Entrada - Conhecendo a Mulher Selvagem',
      introduction: 'Estes exercícios foram criados para ajudá-la a reconectar com sua essência selvagem e intuitiva. Reserve um momento tranquilo e permita-se mergulhar profundamente em cada reflexão.',
      exercises: [
        {
          id: '1-1',
          question: 'Quando foi a última vez que você sentiu sua intuição falar mais alto que sua razão? Descreva essa experiência e como você se sentiu.',
          type: 'text',
          placeholder: 'Compartilhe sua experiência com detalhes...',
          hint: 'Pense em momentos onde você "simplesmente sabia" algo, sem explicação lógica.'
        },
        {
          id: '1-2',
          question: 'Quais aspectos da "mulher selvagem" descritos no capítulo mais ressoaram com você?',
          type: 'multiple',
          options: [
            'A intuição como guia principal',
            'A conexão com a natureza e os ciclos',
            'A criatividade sem amarras',
            'A força interior e resiliência',
            'A sabedoria ancestral feminina',
            'A liberdade de ser autêntica'
          ]
        },
        {
          id: '1-3',
          question: 'Escreva uma carta para sua mulher selvagem interior. O que você gostaria de dizer a ela?',
          type: 'creative',
          placeholder: 'Querida mulher selvagem...',
          hint: 'Seja honesta e vulnerável. Esta carta é só para você.'
        },
        {
          id: '1-4',
          question: 'Identifique três situações em sua vida atual onde você sente que está "domesticada demais". Como poderia trazer mais selvageria saudável para essas áreas?',
          type: 'reflection',
          placeholder: 'Reflita sobre as áreas onde você se sente limitada...'
        }
      ]
    },
    '2': {
      chapterId: '2',
      title: 'Cantando Sobre os Ossos - La Loba',
      introduction: 'O arquétipo de La Loba nos ensina sobre o poder de coletar e preservar o que é essencial. Estes exercícios ajudarão você a identificar os "ossos" de sua própria vida.',
      exercises: [
        {
          id: '2-1',
          question: 'Quais são os "ossos" (aspectos essenciais) da sua vida que precisam ser coletados e preservados?',
          type: 'text',
          placeholder: 'Liste os elementos fundamentais da sua essência...'
        },
        {
          id: '2-2',
          question: 'Se você pudesse "cantar sobre os ossos" de um aspecto seu que foi abandonado, qual seria?',
          type: 'reflection',
          placeholder: 'Descreva algo em você que precisa ser revivido...',
          hint: 'Pense em talentos, sonhos ou características que você deixou de lado.'
        },
        {
          id: '2-3',
          question: 'Crie um pequeno ritual pessoal para honrar La Loba em você. Descreva como seria.',
          type: 'creative',
          placeholder: 'Meu ritual incluiria...'
        },
        {
          id: '2-4',
          question: 'Que partes da sua história pessoal você tem dificuldade de integrar? Como La Loba as acolheria?',
          type: 'reflection',
          placeholder: 'Reflita com compaixão sobre sua jornada...'
        }
      ]
    },
    '3': {
      chapterId: '3',
      title: 'O Uivo - Ressurreição da Mulher Selvagem',
      introduction: 'O uivo é o chamado da alma selvagem. Estes exercícios exploram sua voz autêntica e o poder de se expressar plenamente.',
      exercises: [
        {
          id: '3-1',
          question: 'Se você pudesse uivar agora, o que sua alma gritaria?',
          type: 'text',
          placeholder: 'Deixe sua alma falar livremente...'
        },
        {
          id: '3-2',
          question: 'Em quais situações você "engole" seu uivo? Marque todas que se aplicam:',
          type: 'multiple',
          options: [
            'No trabalho, quando discordo',
            'Em relacionamentos, para manter a paz',
            'Com a família, para não decepcionar',
            'Em público, por medo de julgamento',
            'Comigo mesma, por autocrítica',
            'Em situações de injustiça'
          ]
        },
        {
          id: '3-3',
          question: 'Escreva seu próprio "uivo" - um texto, poema ou manifestação da sua voz selvagem.',
          type: 'creative',
          placeholder: 'Deixe as palavras fluírem sem censura...'
        },
        {
          id: '3-4',
          question: 'Como você pode criar mais espaço em sua vida para expressar sua voz autêntica?',
          type: 'reflection',
          placeholder: 'Pense em mudanças práticas e simbólicas...'
        }
      ]
    },
    '4': {
      chapterId: '4',
      title: 'O Homem Negro dos Sonhos - Enfrentando o Predador',
      introduction: 'Este capítulo nos convida a reconhecer e enfrentar as forças que tentam silenciar nossa natureza selvagem. Seja gentil consigo mesma ao explorar estes temas.',
      exercises: [
        {
          id: '4-1',
          question: 'Identifique os "predadores internos" que sabotam sua mulher selvagem. Que vozes críticas você carrega?',
          type: 'text',
          placeholder: 'Descreva as vozes que te limitam...',
          hint: 'Seja específica sobre o que essas vozes dizem.'
        },
        {
          id: '4-2',
          question: 'Como você tem "alimentado" inadvertidamente esses predadores internos?',
          type: 'reflection',
          placeholder: 'Reflita sobre seus padrões...'
        },
        {
          id: '4-3',
          question: 'Crie uma estratégia de proteção para sua mulher selvagem. Como você pode defendê-la?',
          type: 'creative',
          placeholder: 'Minha estratégia incluiria...'
        },
        {
          id: '4-4',
          question: 'Que sinais seu corpo te dá quando você está na presença de um "predador" (interno ou externo)?',
          type: 'text',
          placeholder: 'Descreva as sensações físicas...'
        }
      ]
    },
    '5': {
      chapterId: '5',
      title: 'A Procura do Tesouro - Recuperando a Intuição',
      introduction: 'A intuição é nosso maior tesouro. Estes exercícios ajudarão você a fortalecer sua conexão com este saber profundo.',
      exercises: [
        {
          id: '5-1',
          question: 'Descreva um momento em que ignorar sua intuição teve consequências. O que você aprendeu?',
          type: 'text',
          placeholder: 'Compartilhe sua experiência e aprendizados...'
        },
        {
          id: '5-2',
          question: 'Como sua intuição se comunica com você? Através de:',
          type: 'multiple',
          options: [
            'Sensações físicas no corpo',
            'Sonhos e símbolos',
            'Sentimentos súbitos',
            'Conhecimento instantâneo',
            'Sincronicidades',
            'Voz interior',
            'Imagens mentais'
          ]
        },
        {
          id: '5-3',
          question: 'Crie um "diário de intuição" por uma semana. Anote aqui suas primeiras observações.',
          type: 'creative',
          placeholder: 'Minhas observações intuitivas...'
        },
        {
          id: '5-4',
          question: 'Que práticas você pode adotar para fortalecer sua conexão intuitiva?',
          type: 'reflection',
          placeholder: 'Liste práticas concretas...',
          hint: 'Considere meditação, tempo na natureza, journaling, etc.'
        }
      ]
    }
  };

  const currentChapter = chaptersData[chapterId || '1'] || chaptersData['1'];

  // Carregar respostas salvas do localStorage
  useEffect(() => {
    const savedKey = `exercises_chapter_${chapterId}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedResponses(parsed);
        const responsesMap: Record<string, string | string[]> = {};
        parsed.forEach((item: UserResponse) => {
          responsesMap[item.exerciseId] = item.response;
        });
        setResponses(responsesMap);
      } catch (error) {
        console.error('Erro ao carregar respostas:', error);
      }
    }
  }, [chapterId]);

  const handleResponseChange = (exerciseId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: value
    }));
  };

  const handleMultipleChange = (exerciseId: string, option: string) => {
    const current = responses[exerciseId] as string[] || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    
    handleResponseChange(exerciseId, updated);
  };

  const saveProgress = () => {
    const userResponses: UserResponse[] = Object.entries(responses).map(([exerciseId, response]) => ({
      exerciseId,
      response,
      savedAt: new Date()
    }));

    const savedKey = `exercises_chapter_${chapterId}`;
    localStorage.setItem(savedKey, JSON.stringify(userResponses));
    setSavedResponses(userResponses);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const getCompletionPercentage = () => {
    const totalExercises = currentChapter.exercises.length;
    const completedExercises = Object.keys(responses).filter(
      key => responses[key] && (Array.isArray(responses[key]) ? responses[key].length > 0 : responses[key])
    ).length;
    return Math.round((completedExercises / totalExercises) * 100);
  };

  const downloadPDF = () => {
    // Simulação de download - em produção, geraria um PDF real
    const content = `
CLUBE DO LIVRO - MULHERES QUE CORREM COM OS LOBOS
${currentChapter.title}

${currentChapter.introduction}

SEUS EXERCÍCIOS E RESPOSTAS:
${currentChapter.exercises.map(ex => `
${ex.question}
Sua resposta: ${responses[ex.id] || '(não respondido)'}
`).join('\n')}

Data: ${new Date().toLocaleDateString('pt-BR')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exercicios_capitulo_${chapterId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ✍️ Exercícios Terapêuticos
        </h1>
        <h2 className="text-lg text-gray-700 mb-4">{currentChapter.title}</h2>
        <p className="text-gray-600 leading-relaxed">
          {currentChapter.introduction}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso do Capítulo</span>
          <span className="text-sm font-semibold text-terracota">{getCompletionPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-terracota to-dourado rounded-full h-2 transition-all duration-500"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4 mb-6">
        {currentChapter.exercises.map((exercise, index) => {
          const isExpanded = expandedExercises.includes(exercise.id) || !savedResponses.length;
          const hasResponse = !!responses[exercise.id] && (
            Array.isArray(responses[exercise.id]) 
              ? (responses[exercise.id] as string[]).length > 0 
              : responses[exercise.id]
          );

          return (
            <div key={exercise.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleExercise(exercise.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex-shrink-0 w-8 h-8 bg-terracota/20 rounded-full flex items-center justify-center text-sm font-semibold text-terracota">
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-gray-900 flex-1">
                        {exercise.question}
                      </h3>
                    </div>
                    {hasResponse && !isExpanded && (
                      <p className="text-sm text-green-600 ml-11">✓ Respondido</p>
                    )}
                  </div>
                  <span className={`ml-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  {exercise.hint && (
                    <p className="text-sm text-gray-600 italic mt-4 mb-3">
                      💡 {exercise.hint}
                    </p>
                  )}

                  {exercise.type === 'text' || exercise.type === 'reflection' || exercise.type === 'creative' ? (
                    <textarea
                      value={(responses[exercise.id] as string) || ''}
                      onChange={(e) => handleResponseChange(exercise.id, e.target.value)}
                      placeholder={exercise.placeholder}
                      rows={exercise.type === 'creative' ? 8 : 4}
                      className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
                    />
                  ) : exercise.type === 'multiple' && exercise.options ? (
                    <div className="mt-4 space-y-2">
                      {exercise.options.map((option) => (
                        <label key={option} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(responses[exercise.id] as string[] || []).includes(option)}
                            onChange={() => handleMultipleChange(exercise.id, option)}
                            className="mt-1 rounded text-terracota focus:ring-terracota"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={saveProgress}
            className="flex-1 px-6 py-3 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
          >
            💾 Salvar Progresso
          </button>
          <button
            onClick={downloadPDF}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            📄 Baixar Exercícios (PDF)
          </button>
        </div>
        
        {showSaveMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            ✅ Progresso salvo com sucesso!
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-yellow-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💫</span>
          Dicas para aproveitar melhor os exercícios:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Reserve um momento tranquilo, sem pressa, para responder</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Seja honesta e gentil consigo mesma</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Você pode voltar e editar suas respostas a qualquer momento</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Considere compartilhar suas reflexões nos debates da comunidade</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExerciciosTerapeuticos;